import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve(process.cwd(), 'public');
const iconSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'));
const maskableSvg = fs.readFileSync(path.join(publicDir, 'icon-maskable.svg'));

async function generate() {
  console.log('Generating PWA icons...');

  // 1. pwa-192x192.png
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✓ pwa-192x192.png generated');

  // 2. pwa-512x512.png
  await sharp(iconSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✓ pwa-512x512.png generated');

  // 3. pwa-maskable-512x512.png
  await sharp(maskableSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ pwa-maskable-512x512.png generated');

  // 4. apple-touch-icon.png (180x180)
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png generated');

  // 5. favicon.ico / favicon-32x32.png
  await sharp(iconSvg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✓ favicon.ico generated');

  console.log('All PWA assets successfully generated!');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
