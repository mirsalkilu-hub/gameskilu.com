const sharp = require('sharp');

(async () => {
  try {
    await sharp('public/og-default.svg').png().toFile('public/og-default.png');
    console.log('Created public/og-default.png');
  } catch (error) {
    console.error('Failed to generate og-default.png', error);
    process.exit(1);
  }
})();
