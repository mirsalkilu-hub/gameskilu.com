import sharp from 'sharp';
import { join } from 'node:path';

const source = 'public/favicon.png';
const resourceRoot = 'android/app/src/main/res';
const densities = {
  mdpi: [48, 108],
  hdpi: [72, 162],
  xhdpi: [96, 216],
  xxhdpi: [144, 324],
  xxxhdpi: [192, 432],
};

await Promise.all(Object.entries(densities).flatMap(([density, [iconSize, foregroundSize]]) => {
  const directory = join(resourceRoot, `mipmap-${density}`);
  const launcherIcons = ['ic_launcher.png', 'ic_launcher_round.png'].map((filename) => (
    sharp(source)
      .resize(iconSize, iconSize, { fit: 'contain' })
      .png()
      .toFile(join(directory, filename))
  ));
  const foregroundIcon = sharp(source)
    .resize(Math.round(foregroundSize * 0.72), Math.round(foregroundSize * 0.72), { fit: 'contain' })
    .png()
    .toBuffer()
    .then((buffer) => sharp({
      create: {
        width: foregroundSize,
        height: foregroundSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: buffer, gravity: 'centre' }])
      .png()
      .toFile(join(directory, 'ic_launcher_foreground.png')));

  return [...launcherIcons, foregroundIcon];
}));

console.log('Generated Gameskilu launcher icons for five Android densities.');