const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WIDTHS = [750, 1500];
const QUALITY = 80;

const SOURCES = [
  'assets/images/lettuce-cropped-web.jpeg',
  ...fs.readdirSync('assets/images/home-slides')
    .filter(f => /\.(jpe?g|png)$/i.test(f))
    .map(f => `assets/images/home-slides/${f}`),
  ...(fs.existsSync('assets/images/posts')
    ? fs.readdirSync('assets/images/posts')
        .filter(f => /\.(jpe?g|png)$/i.test(f))
        .map(f => `assets/images/posts/${f}`)
    : []),
];

async function processImage(inputPath) {
  for (const width of WIDTHS) {
    const ext = path.extname(inputPath);
    const base = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);
    const outPath = path.join(dir, `${base}-${width}.webp`);

    if (fs.existsSync(outPath)) {
      const srcMtime = fs.statSync(inputPath).mtimeMs;
      const outMtime = fs.statSync(outPath).mtimeMs;
      if (outMtime > srcMtime) {
        console.log(`up to date: ${outPath}`);
        continue;
      }
    }

    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    console.log(`generated: ${outPath}`);
  }
}

Promise.all(SOURCES.map(processImage)).catch(err => {
  console.error(err);
  process.exit(1);
});
