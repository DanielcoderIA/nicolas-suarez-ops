const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimizeImage(input, output, width) {
  try {
    await sharp(input)
      .resize({ width })
      .webp({ quality: 60 })
      .toFile(output);
    const stats = fs.statSync(output);
    console.log(`Successfully converted ${output} - Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (err) {
    console.error(`Error converting ${input}:`, err);
  }
}

async function main() {
  const basePath = "C:\\Users\\DanielAdmin\\.gemini\\antigravity\\brain\\c12d0052-b0df-4035-b38b-a57344839f5f";
  const targetDir = path.join(__dirname, 'apps', 'la-carreta', 'public', 'images');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  await optimizeImage(
    path.join(basePath, 'hero_bg_lacarreta_1778037148089.png'),
    path.join(targetDir, 'hero-bg.webp'),
    1920
  );
  
  await optimizeImage(
    path.join(basePath, 'history_img_lacarreta_1778037195651.png'),
    path.join(targetDir, 'history-img.webp'),
    800
  );
  
  await optimizeImage(
    path.join(basePath, 'menu_bg_lacarreta_1778037216282.png'),
    path.join(targetDir, 'menu-bg.webp'),
    1600
  );
}

main();
