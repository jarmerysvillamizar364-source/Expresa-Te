import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const publicDir = path.resolve(process.cwd(), 'public');
const sourceLogo = path.join(publicDir, 'assets/aistudio/Gemini_Generated_Image__3edb7f03.png');

async function generateFavicons() {
  console.log('Generating Expresa Te favicons from official emblem...');

  // 1. Extract emblem bounding box from source image
  // Bounding box of green symbol: minX: 563, maxX: 857, minY: 121, maxY: 440 (width: 294, height: 319)
  const rawCrop = await sharp(sourceLogo)
    .extract({ left: 563, top: 121, width: 294, height: 319 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = rawCrop;
  const { width, height } = info;
  const cleanEmblemBuffer = Buffer.alloc(width * height * 4);

  // Convert white background to transparent alpha with edge un-premultiplication
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const diffR = 255 - r;
    const diffG = 255 - g;
    const diffB = 255 - b;
    const delta = Math.hypot(diffR, diffG, diffB);

    if (delta <= 3) {
      cleanEmblemBuffer[i] = 0;
      cleanEmblemBuffer[i + 1] = 0;
      cleanEmblemBuffer[i + 2] = 0;
      cleanEmblemBuffer[i + 3] = 0;
    } else {
      const alpha = Math.min(255, Math.max(0, (delta - 2) * (255 / 160)));
      if (alpha < 4) {
        cleanEmblemBuffer[i] = 0;
        cleanEmblemBuffer[i + 1] = 0;
        cleanEmblemBuffer[i + 2] = 0;
        cleanEmblemBuffer[i + 3] = 0;
      } else {
        const aNorm = alpha / 255;
        const cr = Math.max(0, Math.min(255, Math.round(255 - (255 - r) / Math.max(aNorm, 0.2))));
        const cg = Math.max(0, Math.min(255, Math.round(255 - (255 - g) / Math.max(aNorm, 0.2))));
        const cb = Math.max(0, Math.min(255, Math.round(255 - (255 - b) / Math.max(aNorm, 0.2))));

        cleanEmblemBuffer[i] = cr;
        cleanEmblemBuffer[i + 1] = cg;
        cleanEmblemBuffer[i + 2] = cb;
        cleanEmblemBuffer[i + 3] = Math.round(alpha);
      }
    }
  }

  // 2. Create Master 512x512 Transparent Emblem (centered with 86% fill)
  const targetH = 440;
  const targetW = Math.round(width * (targetH / height)); // ~406px
  const resizedTight = await sharp(cleanEmblemBuffer, { raw: { width, height, channels: 4 } })
    .resize(targetW, targetH, { fit: 'contain' })
    .png()
    .toBuffer();

  const master512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{
    input: resizedTight,
    left: Math.round((512 - targetW) / 2),
    top: Math.round((512 - targetH) / 2)
  }])
  .png()
  .toBuffer();

  // 3. Generate PNG sizes for browser tabs and mobile
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 }
  ];

  for (const { name, size } of sizes) {
    await sharp(master512)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`✓ ${name} generated (${size}x${size})`);
  }

  // 4. Generate Multi-size ICO file (16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(master512)
      .resize(s, s, { fit: 'contain' })
      .png()
      .toBuffer();
    pngBuffers.push({ size: s, buf });
  }

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(pngBuffers.length, 4); // Number of images

  let currentOffset = 6 + pngBuffers.length * 16;
  const icoEntries = [];
  for (const { size, buf } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Image size
    entry.writeUInt32LE(currentOffset, 12); // Offset
    currentOffset += buf.length;
    icoEntries.push(entry);
  }

  const icoFullBuffer = Buffer.concat([icoHeader, ...icoEntries, ...pngBuffers.map(p => p.buf)]);
  await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoFullBuffer);
  console.log('✓ favicon.ico generated (multi-size 16x16, 32x32, 48x48)');

  // 5. Generate Apple Touch Icon (180x180) on pristine white background
  // Apple iOS displays black behind transparent icons; a crisp white background preserves identity perfectly
  const appleEmblemSize = 144;
  const appleEmblemResized = await sharp(master512)
    .resize(appleEmblemSize, appleEmblemSize, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: '#ffffff'
    }
  })
  .composite([{
    input: appleEmblemResized,
    left: Math.round((180 - appleEmblemSize) / 2),
    top: Math.round((180 - appleEmblemSize) / 2)
  }])
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png generated (180x180)');

  // 6. Generate PWA Maskable Icon (512x512 with safe area on white background)
  const maskableEmblemSize = 380;
  const maskableEmblemResized = await sharp(master512)
    .resize(maskableEmblemSize, maskableEmblemSize, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: '#ffffff'
    }
  })
  .composite([{
    input: maskableEmblemResized,
    left: Math.round((512 - maskableEmblemSize) / 2),
    top: Math.round((512 - maskableEmblemSize) / 2)
  }])
  .png()
  .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ pwa-maskable-512x512.png generated (512x512)');

  // 7. Generate vector-wrapped SVG (icon.svg and icon-maskable.svg)
  const base64Emblem = master512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image width="512" height="512" href="data:image/png;base64,${base64Emblem}"/>
</svg>`;
  await fs.writeFile(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
  console.log('✓ icon.svg generated');

  const maskableSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#ffffff"/>
  <g transform="translate(64, 64) scale(0.75)">
    <image width="512" height="512" href="data:image/png;base64,${base64Emblem}"/>
  </g>
</svg>`;
  await fs.writeFile(path.join(publicDir, 'icon-maskable.svg'), maskableSvgContent, 'utf-8');
  console.log('✓ icon-maskable.svg generated');

  console.log('\nAll Expresa Te favicon and PWA assets successfully created!');
}

generateFavicons().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
