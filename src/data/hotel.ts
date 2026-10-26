export const hotel = {
  name: 'パルティーレ博多ホテル', phone: '080-3430-9237', tel: 'tel:08034309237',
  postal: '〒810-0003', address: '福岡市中央区春吉2丁目7番2号', building: 'パルティーレ博多',
  checkIn: '15:00', checkOut: '10:00', extraGuest: 3000, cleaning: 5000, capacity: 4, parking: 1000, serviceHourly: 1000,
};
export const priceGroups = [{rooms:['101','102','401'],weekday:13000,weekend:20000},{rooms:['201','202','301'],weekday:14000,weekend:21000}];
export const roomNumbers = ['101','102','201','202','301','401'] as const;
export const bookingUrls: Record<(typeof roomNumbers)[number], string> = {
  '101': 'https://zh.airbnb.com/rooms/42766374?unique_share_id=e0acdf2d-5a68-4638-8306-3e87ec793f3e&viralityEntryPoint=1&s=76',
  '102': 'https://zh.airbnb.com/rooms/32884131?unique_share_id=05bbc999-55bc-4c5b-9e62-7f8522c20708&viralityEntryPoint=1&s=76',
  '201': 'https://zh.airbnb.com/rooms/39712982?unique_share_id=dc513bf8-cb68-44c2-92e8-3ab920bea6c4&viralityEntryPoint=1&s=76',
  '202': 'https://zh.airbnb.com/rooms/39712120?unique_share_id=23345ad6-9574-4626-94e5-18630fff2381&viralityEntryPoint=1&s=76',
  '301': 'https://zh.airbnb.com/rooms/1580938431949976442?unique_share_id=38b4cc40-18d4-4dce-bb10-9eb208b8aa85&viralityEntryPoint=1&s=76',
  '401': 'https://zh.airbnb.com/rooms/1667997308307869394?unique_share_id=e1e1f44e-8b1d-4aca-9763-f48952710576&viralityEntryPoint=1&s=76',
};
export const yen = (value:number) => value.toLocaleString('ja-JP');
export const roomPrice = (room:string) => priceGroups.find(group=>group.rooms.includes(room))!;
export const mapQuery = `${hotel.address} ${hotel.building}`;
export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&hl=ja&z=16`;
