# My Better History

Modern Chrome extension for managing browsing history with Vue 3 and Chrome Extension Manifest V3.

## Features

- Browse and search browsing history
- Modern UI with dark/light mode
- Date filtering options
- History statistics and analytics
- Context menu integration for quick searches
- Responsive design for popup and full-page views
- Internationalization support (English, French, Chinese)

## Tech Stack

- Vue 3 with Composition API
- Vite build tool
- Tailwind CSS for styling
- Chrome Extension Manifest V3
- Service Workers for background operations
- IndexedDB for efficient data storage

## Project Structure

```
my-better-history/
├── public/                 # Static assets
│   ├── icons/              # Extension icons
│   ├── locales/            # Internationalization files
│   ├── index.html          # Main HTML file
│   ├── popup.html          # Popup HTML file
│   ├── manifest.json       # Chrome extension manifest
│   └── background.js       # Service worker
├── src/                    # Source code
│   ├── assets/             # Assets (images, styles)
│   ├── components/         # Vue components
│   │   ├── DatePicker.vue     # Date range picker component
│   │   └── HistoryStats.vue   # Statistics visualization component
│   ├── views/              # Page-level components
│   │   ├── HistoryView.vue    # Main history view component
│   │   └── PopupView.vue      # Popup view component
│   ├── composables/        # Vue composables
│   ├── utils/              # Utility functions
│   │   ├── api.js             # Chrome API interaction utilities
│   │   └── helpers.js         # General helper functions
│   ├── locales/            # Vue i18n files
│   ├── router/             # Vue Router configuration
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── scripts/                # Build and utility scripts
│   └── build-extension.mjs   # Custom build script for Chrome extension
├── docs/                   # Documentation
│   └── design.md           # Design documentation
├── dist/                   # Build output (created after build)
├── .gitignore             # Git ignore rules
├── LICENSE                # Project license
├── README.md              # Project documentation
├── build.bat              # Windows build script
├── clean.bat              # Windows clean script
├── package.json           # Node.js dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite build configuration
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

## Building

To build the extension for production:

```bash
npm run build-extension
```

This command will:
1. Build the Vue application using Vite
2. Process and optimize assets
3. Copy all necessary files to the `dist/` directory
4. Include the manifest.json and background.js files
5. Copy icons and localization files
6. Prepare the extension for Chrome Web Store deployment

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

## Chrome Extension Permissions

This extension requires the following permissions:
- `history` - To access browsing history
- `tabs` - To interact with browser tabs
- `contextMenus` - To add context menu items for history search

## License

BSD 3-Clause License