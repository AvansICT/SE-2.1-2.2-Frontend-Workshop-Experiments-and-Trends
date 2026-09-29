// Genereert eenvoudige PNG-iconen zonder externe dependencies.
// Oranje vlak met een witte cirkel; de cirkel valt binnen de "safe zone" voor maskable icons.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function icon(size) {
  const bg = [0xff, 0x3e, 0x00];
  const fg = [0xff, 0xff, 0xff];
  const center = size / 2;
  const radius = size * 0.28;
  const rows = [];

  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3); // eerste byte = filter type 0
    for (let x = 0; x < size; x++) {
      const dist = Math.hypot(x + 0.5 - center, y + 0.5 - center);
      const t = Math.min(Math.max(radius - dist + 0.5, 0), 1); // anti-aliasing
      for (let i = 0; i < 3; i++) row[1 + x * 3 + i] = Math.round(bg[i] + (fg[i] - bg[i]) * t);
    }
    rows.push(row);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // color type: RGB

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [['icon-192', 192], ['icon-512', 512], ['apple-touch-icon', 180]]) {
  writeFileSync(new URL(`../public/icons/${name}.png`, import.meta.url), icon(size));
  console.log(`public/icons/${name}.png (${size}x${size})`);
}
