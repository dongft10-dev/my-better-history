# Extension Icons

This directory contains the icon files for the My Better History Chrome Extension.

## Required Icons

The following icon files are needed for the Chrome extension:

- `icon-16.png` (16x16 pixels) - Used in Chrome extension management UI
- `icon-48.png` (48x48 pixels) - Used in Chrome extension management UI  
- `icon-128.png` (128x128 pixels) - Used for the Chrome Web Store

## How to Create These Icons

### Option 1: Online Icon Generators
- [Favicon.io](https://favicon.io/favicon-generator/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Convertio](https://convertio.co/png-converter/)

### Option 2: Graphic Design Software
- Adobe Photoshop
- GIMP (free alternative)
- Canva
- Figma

### Option 3: Using Node.js with Sharp Library

If you have Node.js installed, you can create simple icons programmatically:

1. Install sharp: `npm install sharp`
2. Create a script like this:

```javascript
const sharp = require('sharp');

// Create a simple design with Vue.js colors
async function createIcons() {
  const vueColors = {
    blue: [66, 184, 131], // Vue green
    green: [51, 51, 51],   // Dark gray
    background: [248, 248, 248] // Light gray background
  };

  const sizes = [16, 48, 128];
  
  for (const size of sizes) {
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 3,
        background: { r: vueColors.background[0], g: vueColors.background[1], b: vueColors.background[2] }
      }
    })
    .composite([{
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path fill="#42b883" d="M12 2.035L1 12h3.035L12 4.07 19.965 12H23l-11-9.965zM12 21.965L23 12h-3.035L12 19.93 4.035 12H1l11 9.965z"/></svg>`
      ),
      gravity: 'center'
    }])
    .png()
    .toFile(`icon-${size}.png`);
  }
}

createIcons().catch(console.error);
```

## Design Guidelines

- Use simple, recognizable designs that remain clear at small sizes
- Consider using Vue.js brand colors (#42b883 green and #35495e dark blue)
- Include a history-related element (clock, timeline, etc.) combined with Vue elements
- Ensure good contrast and visibility
- Test your icons at actual size to ensure readability
