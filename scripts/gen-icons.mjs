// Generates the PWA icons: the reversed mark (white cup, lavender steam) centred on an
// indigo-600 field. Run: node scripts/gen-icons.mjs  → writes PNGs into ./public
//
// Source of truth is public/logo-reversed.svg — regenerate after any change to the mark.
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const INDIGO_600 = { r: 0x3b, g: 0x3f, b: 0x8f, alpha: 1 };
const svg = readFileSync("public/logo-reversed.svg");

// Fraction of the canvas the mark's height occupies. Maskable icons get cropped to a
// circle of ~80% diameter by the launcher, so the art sits smaller inside the safe zone.
const FILL = 0.66;
const FILL_MASKABLE = 0.5;

async function makeIcon(size, fill, outPath) {
  const mark = await sharp(svg, { density: 900 })
    .resize({ height: Math.round(size * fill) })
    .png()
    .toBuffer();
  const { width, height } = await sharp(mark).metadata();

  const png = await sharp({
    create: { width: size, height: size, channels: 4, background: INDIGO_600 },
  })
    .composite([
      {
        input: mark,
        left: Math.round((size - width) / 2),
        top: Math.round((size - height) / 2),
      },
    ])
    .png()
    .toBuffer();

  writeFileSync(outPath, png);
  return outPath;
}

const written = await Promise.all([
  makeIcon(192, FILL, "public/icon-192.png"),
  makeIcon(512, FILL, "public/icon-512.png"),
  makeIcon(512, FILL_MASKABLE, "public/icon-512-maskable.png"),
  // iOS home-screen icon: 180×180, solid (non-transparent) so standalone launch looks right.
  makeIcon(180, FILL, "public/apple-touch-icon.png"),
]);

console.log(`Wrote ${written.join(", ")}`);
