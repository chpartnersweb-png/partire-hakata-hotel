import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';

const rooms = ['101', '102', '201', '202', '301', '401'];
// Selected from the contact sheets: room views first, then dining, kitchen and washroom.
const selection = {
  '101':[18,21,17,3,5,6,9,10,14,15],
  '102':[11,7,5,16,13,26,27,20,23,18,24],
  '201':[1,4,7,8,9,14,11,12,17,19,15],
  '202':[2,4,6,24,9,11,13,14,17,19,23,15],
  '301':[11,12,9,15,6,7,18,19,4,5,3],
  '401':[20,21,22,19,17,16,10,13,8,1,24],
};
const manifest = {};
await fs.mkdir('src/data', { recursive: true });
await fs.mkdir('.preview', { recursive: true });
for (const room of rooms) {
  const entries = (await fs.readdir(`src/assets/${room}`)).sort((a,b) => a.localeCompare(b, 'en', { numeric:true }));
  const accepted = [];
  const tiles = [];
  await fs.mkdir(`public/images/rooms/${room}`, { recursive:true });
  for (const file of entries) {
    try {
      let input = `src/assets/${room}/${file}`;
      const header = await fs.readFile(input);
      if (header.subarray(4,12).toString('ascii').includes('ftypheic')) {
        const converted = `.preview/${room}-${file.replace(/[^a-z0-9]/gi,'_')}.jpg`;
        try { await fs.access(converted); } catch {
          execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',input,'-frames:v','1','-update','1',converted],{stdio:'pipe',windowsHide:true});
        }
        input = converted;
      }
      const meta = await sharp(input).metadata();
      const index = accepted.length + 1;
      const name = `${String(index).padStart(2,'0')}.webp`;
      await sharp(input).rotate().resize({ width:1600, height:1200, fit:'inside', withoutEnlargement:true }).webp({ quality:82 }).toFile(`public/images/rooms/${room}/${name}`);
      await sharp(input).rotate().resize(240,160,{fit:'cover'}).webp({quality:75}).toFile(`public/images/rooms/${room}/thumb-${name}`);
      const thumb = await sharp(input).rotate().resize(220,145,{fit:'cover'}).extend({bottom:25,background:'#f5f2ec'}).composite([{input:Buffer.from(`<svg width="220" height="25"><text x="8" y="18" font-family="sans-serif" font-size="14">${index} : ${file.replaceAll('&','&amp;')}</text></svg>`),left:0,top:145}]).jpeg().toBuffer();
      tiles.push({ input:thumb, left:((index-1)%4)*220, top:Math.floor((index-1)/4)*170 });
      accepted.push({ src:`/images/rooms/${room}/${name}`, thumb:`/images/rooms/${room}/thumb-${name}`, original:file, width:meta.width,height:meta.height });
    } catch (error) { console.log(`SKIP ${room}/${file}: ${String(error.message).split('\n')[0]}`); }
  }
  if (tiles.length) await sharp({create:{width:880,height:Math.ceil(tiles.length/4)*170,channels:3,background:'#f5f2ec'}}).composite(tiles).jpeg({quality:85}).toFile(`.preview/room-${room}.jpg`);
  manifest[room] = selection[room].map(index=>accepted[index-1]).filter(Boolean);
  console.log(`${room}: ${accepted.length} images prepared`);
}
await fs.mkdir('public/images/hero', {recursive:true});
for (const [name, input] of Object.entries({ exterior:'partire-hakata-exterior-hero-v2.png', balconies:'partire-hakata-hero-balconies.png', entrance:'partire-hakata-hero-entrance.png' })) {
  await sharp(`src/assets/hero/${input}`).resize({width:1920,withoutEnlargement:true}).webp({quality:88}).toFile(`public/images/hero/${name}.webp`);
}
await sharp('src/assets/810880137.jpg').rotate().resize({width:1000,withoutEnlargement:true}).webp({quality:85}).toFile('public/images/exterior.webp');
await fs.mkdir('public/images/og', { recursive:true });
await sharp('public/images/rooms/201/01.webp').resize(1200,630,{fit:'cover',position:'centre'}).jpeg({quality:88,mozjpeg:true}).toFile('public/images/og/partire-hakata-hotel.jpg');
await fs.writeFile('src/data/room-images.json', JSON.stringify(manifest,null,2)+'\n');
