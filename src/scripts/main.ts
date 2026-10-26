import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const $ = <T extends Element = HTMLElement>(selector:string) => document.querySelector<T>(selector)!;
const $$ = <T extends Element = HTMLElement>(selector:string) => [...document.querySelectorAll<T>(selector)];
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)');
let lenis:Lenis|undefined;
const tick = (time:number) => lenis?.raf(time*1000);
function setupScroll(){
  if(lenis){ lenis.destroy(); lenis=undefined; gsap.ticker.remove(tick); }
  if(!motion.matches && desktop.matches){
    lenis=new Lenis({autoRaf:false,duration:1.05,anchors:{offset:-95}});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }
}
setupScroll(); desktop.addEventListener('change',setupScroll);

// Native dialogs retain focus and work with Escape. Background scroll is restored on close.
const menu=$<HTMLDialogElement>('#site-menu');
const lightbox=$<HTMLDialogElement>('#lightbox');
const bookingPanel=$<HTMLDialogElement>('#booking-panel');
const lock = () => {document.documentElement.style.overflow='hidden';lenis?.stop();};
const unlock = () => {if([menu,lightbox,bookingPanel].some(dialog=>dialog.open))return;document.documentElement.style.overflow='';lenis?.start();};
$('#menu-open').addEventListener('click',()=>{menu.showModal();lock();});
$('#menu-close').addEventListener('click',()=>menu.close());
for(const dialog of [menu,lightbox,bookingPanel]) dialog.addEventListener('close',unlock);
let bookingReturnFocus:HTMLElement|null=null;
$$<HTMLAnchorElement>('[data-booking-open]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  bookingReturnFocus=menu.contains(link)?$('#menu-open'):link;
  if(menu.open)menu.close();
  if(!bookingPanel.open)bookingPanel.showModal();
  lock();
}));
$('#booking-close').addEventListener('click',()=>bookingPanel.close());
bookingPanel.addEventListener('close',()=>bookingReturnFocus?.focus({preventScroll:true}));
bookingPanel.addEventListener('click',event=>{
  if(event.target!==bookingPanel)return;
  const bounds=bookingPanel.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)bookingPanel.close();
});
menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  if(link.hasAttribute('data-booking-open'))return;
  event.preventDefault();menu.close();const target=document.querySelector(link.hash);if(!target)return;
  requestAnimationFrame(()=>{if(lenis)lenis.scrollTo(target as HTMLElement,{offset:-95});else target.scrollIntoView({behavior:motion.matches?'instant':'smooth'});history.replaceState(null,'',link.hash);});
}));

// A full-viewport image sequence. Keep the current image visible until the next has decoded.
const hero=$('#top');
const slides=$$<HTMLElement>('[data-hero-slide]');
const dots=$$<HTMLButtonElement>('[data-slide-to]');
const pause=$<HTMLButtonElement>('#hero-pause');
let slideIndex=0, userPaused=false, hoverPaused=false, focusPaused=false, heroVisible=true, busy=false;
let timer:gsap.core.Tween|undefined;
let crossfade:gsap.core.Tween|undefined;
const zooms = new Map<number,gsap.core.Tween>();
const loading = new Map<number,Promise<boolean>>();
const failed=new Set<number>();
function loadSlide(index:number):Promise<boolean>{
  if(!loading.has(index)) loading.set(index,(async()=>{
    const img=slides[index].querySelector('img')!;
    if(!img.getAttribute('src')) img.src=img.dataset.src!;
    try{await img.decode();return true;}catch{failed.add(index);return false;}
  })());
  return loading.get(index)!;
}
function canPlay(){return !userPaused&&!hoverPaused&&!focusPaused&&heroVisible&&!document.hidden&&!motion.matches&&!menu.open&&!lightbox.open&&!bookingPanel.open;}
function schedule(){timer?.kill();if(canPlay())timer=gsap.delayedCall(6,()=>{const next=[1,2,3].map(n=>(slideIndex+n)%slides.length).find(n=>n!==slideIndex&&!failed.has(n));if(next!==undefined)void showSlide(next);});}
function syncPlayback(){timer?.kill();for(const zoom of zooms.values())zoom.paused(!canPlay());crossfade?.paused(document.hidden||!heroVisible||menu.open||lightbox.open||bookingPanel.open);schedule();}
async function showSlide(next:number){
  if(busy||next===slideIndex)return;
  busy=true;
  if(!await loadSlide(next)){busy=false;schedule();return;}
  const previous=slideIndex;
  const incoming=slides[next],outgoing=slides[previous];
  gsap.set(outgoing,{zIndex:1});gsap.set(incoming,{zIndex:2,opacity:0});
  slideIndex=next;
  slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',String(i!==next)));
  dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===next);dot.setAttribute('aria-pressed',String(i===next));});
  zooms.get(next)?.kill();
  const img=incoming.querySelector('img')!;
  if(!motion.matches)zooms.set(next,gsap.fromTo(img,{scale:1.025},{scale:1,duration:7.6,ease:'none',paused:!canPlay()}));
  else gsap.set(img,{clearProps:'transform'});
  crossfade=gsap.to(incoming,{opacity:1,duration:motion.matches?0:1.6,ease:'sine.inOut',onComplete:()=>{
    gsap.set(outgoing,{opacity:0,zIndex:0});gsap.set(incoming,{zIndex:1});
    outgoing.classList.remove('is-active');incoming.classList.add('is-active');zooms.get(previous)?.kill();busy=false;
  }});
  schedule();
}
dots.forEach((dot,i)=>dot.addEventListener('click',()=>void showSlide(i)));
pause.addEventListener('click',()=>{userPaused=!userPaused;pause.classList.toggle('is-paused',userPaused);pause.setAttribute('aria-pressed',String(userPaused));pause.setAttribute('aria-label',userPaused?'スライドショーを再生':'スライドショーを一時停止');syncPlayback();});
const controls=$('.hero-controls');
controls.addEventListener('pointerenter',event=>{if((event as PointerEvent).pointerType==='mouse'){hoverPaused=true;syncPlayback();}});
controls.addEventListener('pointerleave',()=>{hoverPaused=false;syncPlayback();});
controls.addEventListener('focusin',()=>{focusPaused=true;syncPlayback();});
controls.addEventListener('focusout',()=>requestAnimationFrame(()=>{focusPaused=controls.contains(document.activeElement);syncPlayback();}));
document.addEventListener('visibilitychange',syncPlayback);
for(const dialog of [menu,lightbox,bookingPanel])new MutationObserver(syncPlayback).observe(dialog,{attributes:true,attributeFilter:['open']});
new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;syncPlayback();},{threshold:0}).observe(hero);
void loadSlide(0).then(()=>{void loadSlide(1);void loadSlide(2);if(!motion.matches)zooms.set(0,gsap.fromTo(slides[0].querySelector('img'),{scale:1.025},{scale:1,duration:7.6,ease:'none',paused:!canPlay()}));schedule();});

const header=$('#site-header');const mobile=$<HTMLElement>('.mobile-actions');
new IntersectionObserver(([entry])=>{const after=entry.boundingClientRect.bottom<=0;header.classList.toggle('is-scrolled',after);mobile.classList.toggle('is-visible',after);mobile.inert=!after;},{threshold:0}).observe(hero);

// Room tabs and a manual photo gallery share one authoritative room/price state.
type RoomImage={src:string;thumb:string;original:string};
const data=JSON.parse($('#room-data').textContent!) as {images:Record<string,RoomImage[]>;prices:Record<string,{weekday:number;weekend:number}>;bookings:Record<string,string>};
const tabs=$$<HTMLButtonElement>('[data-room]');
const photo=$<HTMLImageElement>('#room-photo');
const thumbs=$('#gallery-thumbs');
let room='101',photoIndex=0,photoRequest=0;
let swipeStart:number|undefined,swipeY=0,suppressClickUntil=0;
function syncLightbox(){const entry=data.images[room][photoIndex];$('#lightbox-label').textContent=`ROOM ${room}`;const img=$<HTMLImageElement>('#lightbox-photo');img.src=entry.src;img.alt=`${room}号室の客室写真 ${photoIndex+1}`;$('#lightbox-count').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(data.images[room].length).padStart(2,'0')}`;}
function updateThumbs(){thumbs.replaceChildren(...data.images[room].map((entry,i)=>{const button=document.createElement('button');button.dataset.photo=String(i);button.setAttribute('aria-label',`${room}号室の写真 ${i+1}を表示`);button.setAttribute('aria-pressed',String(i===photoIndex));const img=document.createElement('img');img.src=entry.thumb;img.alt='';img.width=240;img.height=160;img.loading='lazy';button.append(img);return button;}));thumbs.scrollLeft=0;}
async function selectPhoto(index:number,nextRoom=room){
  const list=data.images[nextRoom];if(!list?.length)return;
  const next=(index+list.length)%list.length;
  const request=++photoRequest;
  const preload=new Image();preload.src=list[next].src;
  try{await preload.decode();}catch{if(request===photoRequest)$('#room-announcement').textContent='写真を読み込めませんでした。別の写真をお選びください。';return;}
  if(request!==photoRequest)return;
  const roomChanged=nextRoom!==room;
  room=nextRoom;photoIndex=next;photo.src=preload.src;photo.alt=`${room}号室の客室写真 ${next+1}`;
  if(!motion.matches)gsap.fromTo(photo,{opacity:.5},{opacity:1,duration:.35,overwrite:true});
  $('#room-number').textContent=room;$('#room-weekday').textContent=data.prices[room].weekday.toLocaleString('ja-JP');$('#room-weekend').textContent=data.prices[room].weekend.toLocaleString('ja-JP');
  const booking=$<HTMLAnchorElement>('#room-booking');
  booking.href=data.bookings[room];
  booking.setAttribute('aria-label',`${room}号室をAirbnbで予約する（新しいタブで開きます）`);
  $('#photo-current').textContent=String(next+1).padStart(2,'0');$('#photo-total').textContent=String(list.length).padStart(2,'0');
  $('#room-panel').setAttribute('aria-labelledby',`tab-${room}`);$('#gallery-expand').setAttribute('aria-label',`${room}号室の写真を拡大`);
  tabs.forEach(tab=>{const active=tab.dataset.room===room;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
  if(roomChanged)updateThumbs();
  $$<HTMLButtonElement>('[data-photo]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.photo)===next)));
  const selected=thumbs.querySelector<HTMLElement>(`[data-photo="${next}"]`);if(selected){const left=selected.offsetLeft-thumbs.offsetLeft;if(left<thumbs.scrollLeft||left+selected.clientWidth>thumbs.scrollLeft+thumbs.clientWidth)thumbs.scrollTo({left:left-thumbs.clientWidth/2+selected.clientWidth/2,behavior:motion.matches?'instant':'smooth'});}
  $('#room-announcement').textContent=`${room}号室、写真${next+1} / ${list.length}`;
  if(lightbox.open)syncLightbox();
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>void selectPhoto(0,tab.dataset.room!));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();void selectPhoto(0,tabs[next].dataset.room!);});});
thumbs.addEventListener('click',event=>{const target=(event.target as Element).closest<HTMLButtonElement>('[data-photo]');if(target)void selectPhoto(Number(target.dataset.photo));});
for(const id of ['#photo-prev','#lightbox-prev'])$(id).addEventListener('click',()=>void selectPhoto(photoIndex-1));
for(const id of ['#photo-next','#lightbox-next'])$(id).addEventListener('click',()=>void selectPhoto(photoIndex+1));
$('#gallery-expand').addEventListener('click',()=>{if(Date.now()<suppressClickUntil)return;syncLightbox();lightbox.showModal();lock();});
$('#lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();void selectPhoto(photoIndex-1);}if(event.key==='ArrowRight'){event.preventDefault();void selectPhoto(photoIndex+1);}});
const stage=$('#gallery-stage');stage.style.touchAction='pan-y';
stage.addEventListener('pointerdown',event=>{swipeStart=event.clientX;swipeY=event.clientY;});
stage.addEventListener('pointerup',event=>{if(swipeStart===undefined)return;const dx=event.clientX-swipeStart;const dy=event.clientY-swipeY;swipeStart=undefined;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClickUntil=Date.now()+500;void selectPhoto(photoIndex+(dx<0?1:-1));}});
stage.addEventListener('pointercancel',()=>{swipeStart=undefined;});

const mm=gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.from('.hero-copy h1 span',{y:16,opacity:0,duration:1,stagger:.16,delay:.15,ease:'power2.out'});
  $$('[data-reveal]').forEach(element=>gsap.from(element,{y:22,opacity:0,duration:.85,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 92%',once:true}}));
});
motion.addEventListener('change',()=>{setupScroll();if(motion.matches){zooms.forEach(t=>t.kill());slides.forEach(slide=>gsap.set(slide.querySelector('img'),{clearProps:'transform'}));userPaused=true;pause.classList.add('is-paused');pause.setAttribute('aria-pressed','true');pause.setAttribute('aria-label','スライドショーを再生');}syncPlayback();});
window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
