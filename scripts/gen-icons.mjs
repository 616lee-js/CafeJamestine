// Generates placeholder PWA icons (solid coffee-brown with a cream circle).
// Run: node scripts/gen-icons.mjs  → writes PNGs into ./public
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const BROWN = [0x6f, 0x4e, 0x37];
const CREAM = [0xef, 0xe6, 0xdd];

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size, { maskable }) {
  const cx = size / 2;
  const cy = size / 2;
  // Maskable needs the art inside the safe zone (~80%); plain icons can fill more.
  const r = size * (maskable ? 0.28 : 0.34);

  const raw = Buffer.alloc(size * (size * 4 + 1));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const inCircle = dx * dx + dy * dy <= r * r;
      const [rr, gg, bb] = inCircle ? CREAM : BROWN;
      raw[p++] = rr;
      raw[p++] = gg;
      raw[p++] = bb;
      raw[p++] = 0xff;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync("public", { recursive: true });
writeFileSync("public/icon-192.png", makePng(192, { maskable: false }));
writeFileSync("public/icon-512.png", makePng(512, { maskable: false }));
writeFileSync("public/icon-512-maskable.png", makePng(512, { maskable: true }));
console.log("Wrote public/icon-192.png, icon-512.png, icon-512-maskable.png");
