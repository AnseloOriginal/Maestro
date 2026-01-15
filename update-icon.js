const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const androidRes = path.join(__dirname, 'android/app/src/main/res');
const iconPath = path.join(__dirname, 'icon.png'); // your new icon

// Sizes for Android mipmaps
const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const files = ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png'];

for (const [folder, size] of Object.entries(sizes)) {
  files.forEach(fileName => {
    const dest = path.join(androidRes, folder, fileName);
    sharp(iconPath)
      .resize(size, size)
      .toFile(dest)
      .then(() => console.log(`Replaced ${dest}`))
      .catch(err => console.error(err));
  });
}