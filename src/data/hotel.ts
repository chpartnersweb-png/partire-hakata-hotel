export const hotel = {
  name: 'パルティーレ博多ホテル', phone: '080-3430-9237', tel: 'tel:08034309237',
  postal: '〒810-0003', address: '福岡市中央区春吉2丁目7番2号', building: 'パルティーレ博多',
  checkIn: '15:00', checkOut: '10:00', extraGuest: 3000, cleaning: 5000, capacity: 4, parking: 1000, serviceHourly: 1000,
};
export const priceGroups = [{rooms:['101','102','401'],weekday:13000,weekend:20000},{rooms:['201','202','301'],weekday:14000,weekend:21000}];
export const roomNumbers = ['101','102','201','202','301','401'] as const;
export const yen = (value:number) => value.toLocaleString('ja-JP');
export const roomPrice = (room:string) => priceGroups.find(group=>group.rooms.includes(room))!;
export const mapQuery = `${hotel.address} ${hotel.building}`;
export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&hl=ja&z=16`;
