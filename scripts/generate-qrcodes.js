const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const matter = require('gray-matter');

const BASE_URL = 'https://edgiesveggies.com';
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'qrcodes');

const QR_OPTS = {
  type: 'svg',
  margin: 2,
  errorCorrectionLevel: 'M',
  color: { dark: '#000000', light: '#ffffff' },
};

async function generateSVG(url, outPath) {
  const svg = await QRCode.toString(url, QR_OPTS);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, svg, 'utf8');
}

async function main() {
  // Subscribe page
  await generateSVG(
    `${BASE_URL}/subscribe/`,
    path.join(OUT_DIR, 'subscribe.svg')
  );
  console.log('subscribe');

  // Veggie pages — slug is the filename without extension
  const veggiesDir = path.join(ROOT, '_veggies');
  const veggieFiles = fs.readdirSync(veggiesDir).filter(f => f.endsWith('.md'));
  for (const file of veggieFiles) {
    const slug = path.basename(file, '.md');
    await generateSVG(
      `${BASE_URL}/veggies/${slug}/`,
      path.join(OUT_DIR, 'veggies', `${slug}.svg`)
    );
    console.log(`veggies/${slug}`);
  }

  // Recipe anchor links — need to know which veggie the recipe belongs to
  const recipesDir = path.join(ROOT, '_recipes');
  const recipeFiles = fs.readdirSync(recipesDir).filter(f => f.endsWith('.md'));
  for (const file of recipeFiles) {
    const slug = path.basename(file, '.md');
    const { data } = matter(fs.readFileSync(path.join(recipesDir, file), 'utf8'));
    if (!data.veggies || data.veggies.length === 0) {
      console.warn(`skipping ${slug}: no veggies field`);
      continue;
    }
    const veggieSlug = data.veggies[0];
    await generateSVG(
      `${BASE_URL}/veggies/${veggieSlug}/#recipe-${slug}`,
      path.join(OUT_DIR, 'recipes', `${slug}.svg`)
    );
    console.log(`recipes/${slug}`);
  }

  console.log(`\nDone — ${1 + veggieFiles.length + recipeFiles.length} QR codes written to assets/qrcodes/`);
}

main().catch(err => { console.error(err); process.exit(1); });
