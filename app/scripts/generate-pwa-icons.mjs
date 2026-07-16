import sharp from "sharp";
import { mkdirSync, rmSync } from "fs";

const LOGO = "src/assets/logo.png";
const OUT_DIR = "public/pwa";
mkdirSync(OUT_DIR, { recursive: true });

const NAVY = "#0057B3";
const NAVY_DARK = "#00335e";

async function extractArrowGlyph() {
  // The orange arrow accent overlaps the wordmark's ascenders, so crop a region
  // around it and strip any non-orange pixels before trimming to a tight box.
  const region = { left: 630, top: 90, width: 420, height: 150 };
  const { data, info } = await sharp(LOGO).extract(region).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const b = data[i + 2];
    const isOrange = r > 180 && b < 120 && r - b > 80;
    if (!isOrange) data[i + 3] = 0;
  }

  return sharp(data, { raw: info }).png().trim({ threshold: 10 }).toBuffer();
}

async function makeIcon(glyph, size, { maskable = false } = {}) {
  const glyphMeta = await sharp(glyph).metadata();

  // Maskable icons need extra safe-area padding (~28%) since OSes crop to a shape.
  const pad = maskable ? Math.round(size * 0.3) : Math.round(size * 0.18);
  const targetSize = size - pad * 2;

  const aspect = glyphMeta.width / glyphMeta.height;
  let glyphW = targetSize;
  let glyphH = Math.round(targetSize / aspect);
  if (glyphH > targetSize) {
    glyphH = targetSize;
    glyphW = Math.round(targetSize * aspect);
  }

  const resizedGlyph = await sharp(glyph).resize(glyphW, glyphH, { fit: "contain" }).toBuffer();

  const background = Buffer.from(
    `<svg width="${size}" height="${size}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${NAVY}" />
          <stop offset="1" stop-color="${NAVY_DARK}" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${maskable ? 0 : Math.round(size * 0.22)}" fill="url(#bg)" />
    </svg>`
  );

  const left = Math.round((size - glyphW) / 2);
  const top = Math.round((size - glyphH) / 2);

  return sharp(background)
    .composite([{ input: resizedGlyph, left, top }])
    .png()
    .toBuffer();
}

async function main() {
  const glyph = await extractArrowGlyph();

  const jobs = [
    { file: "icon-192.png", size: 192 },
    { file: "icon-512.png", size: 512 },
    { file: "icon-512-maskable.png", size: 512, maskable: true },
    { file: "apple-touch-icon.png", size: 180 },
  ];

  for (const job of jobs) {
    const buf = await makeIcon(glyph, job.size, { maskable: job.maskable });
    await sharp(buf).toFile(`${OUT_DIR}/${job.file}`);
    console.log(`Wrote ${OUT_DIR}/${job.file}`);
  }

  // Favicon: small multi-purpose PNG (32px) for browser tabs.
  const faviconBuf = await makeIcon(glyph, 64);
  await sharp(faviconBuf).toFile(`${OUT_DIR}/favicon.png`);
  console.log(`Wrote ${OUT_DIR}/favicon.png`);
}

main()
  .then(() => {
    rmSync("scripts/_test_extract.png", { force: true });
    rmSync("scripts/_test_extract2.png", { force: true });
    rmSync("scripts/_test_extract3.png", { force: true });
    rmSync("scripts/_test_extract4.png", { force: true });
    rmSync("scripts/_test_extract5.png", { force: true });
    rmSync("scripts/_test_masked.png", { force: true });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
