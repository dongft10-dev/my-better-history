# Vue Better History

Modern Chrome extension for managing browsing history with Vue 3 and Chrome Extension Manifest V3.

## Features

- Browse and search browsing history
- Modern UI with dark/light mode
- Date filtering options
- History statistics
- Responsive design for popup and full-page views

## Tech Stack

- Vue 3 with Composition API
- Vite build tool
- Tailwind CSS for styling
- Chrome Extension Manifest V3
- Service Workers

## Project Structure

```
my-better-history/
├── public/                 # Static assets
│   ├── icons/              # Extension icons (instructions provided)
│   ├── locales/            # Internationalization files
│   ├── manifest.json       # Chrome extension manifest
│   ├── background.js       # Service worker
│   └── index.html          # Main HTML file
├── src/                    # Source code
│   ├── assets/             # Assets (images, styles)
│   ├── components/         # Vue components
│   ├── views/              # Page-level components
│   ├── composables/        # Vue composables
│   ├── utils/              # Utility functions
│   ├── locales/            # Vue i18n files
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── router/             # Vue Router configuration
├── docs/                   # Documentation
├── scripts/                # Build and utility scripts
└── dist/                   # Build output
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Load the extension in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder after building

## Creating Extension Icons

The extension requires three icon files in the `public/icons/` directory:

- `icon-16.png` (16x16 pixels) - Used in Chrome extension management UI
- `icon-48.png` (48x48 pixels) - Used in Chrome extension management UI  
- `icon-128.png` (128x128 pixels) - Used for the Chrome Web Store

Detailed instructions for creating these icons are provided in `public/icons/` directory.

## Building

To build the extension for production:

```bash
npm run build-extension
```

This command will:
1. Build the Vue application using Vite
2. Copy all necessary files to the `dist/` directory
3. Include the manifest.json and background.js files
4. Copy icons and localization files

## Windows Batch Scripts

Two convenience batch scripts are provided for Windows users:

### clean.bat
Removes the `dist` directory to clean up previous builds.

### pack.bat
Automates the complete build process:
1. Checks if npm is available
2. Installs dependencies if needed
3. Runs the build process
4. Provides the extension in the `dist` folder ready for Chrome

## License

MIT