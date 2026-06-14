const fs = require('fs');
const path = require('path');
const https = require('https');

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');

const fontsToDownload = [
  {
    name: 'Atkinson-Hyperlegible-Regular.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/atkinson-hyperlegible@latest/latin-400-normal.woff2',
  },
  {
    name: 'Atkinson-Hyperlegible-Bold.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/atkinson-hyperlegible@latest/latin-700-normal.woff2',
  },
  {
    name: 'Atkinson-Hyperlegible-Italic.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/atkinson-hyperlegible@latest/latin-400-italic.woff2',
  },
  {
    name: 'OpenDyslexic-Regular.woff',
    url: 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff',
  },
  {
    name: 'OpenDyslexic-Bold.woff',
    url: 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Bold.woff',
  },
  {
    name: 'OpenDyslexic-Italic.woff',
    url: 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Italic.woff',
  },
  {
    name: 'Inter-Regular.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2',
  },
  {
    name: 'Inter-Bold.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2',
  },
  {
    name: 'Outfit-Regular.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-400-normal.woff2',
  },
  {
    name: 'Outfit-Bold.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-700-normal.woff2',
  },
  {
    name: 'Hanken-Grotesk-Regular.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/hanken-grotesk@latest/latin-400-normal.woff2',
  },
  {
    name: 'Hanken-Grotesk-Bold.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/hanken-grotesk@latest/latin-700-normal.woff2',
  },
  {
    name: 'Lora-Regular.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-400-normal.woff2',
  },
  {
    name: 'Lora-Bold.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/lora@latest/latin-700-normal.woff2',
  },
  {
    name: 'JetBrains-Mono-Regular.woff2',
    url: 'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff2',
  }
];

// Ensure fonts directory exists
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    // Follow potential redirects
    function get(reqUrl) {
      https.get(reqUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          get(response.headers.location);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: status ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }
    
    get(url);
  });
}

async function run() {
  console.log('Downloading fonts...');
  for (const font of fontsToDownload) {
    const destPath = path.join(FONTS_DIR, font.name);
    console.log(`Downloading ${font.name} from ${font.url}...`);
    try {
      await downloadFile(font.url, destPath);
      console.log(`Successfully downloaded ${font.name}`);
    } catch (err) {
      console.error(`Error downloading ${font.name}:`, err.message);
    }
  }
  console.log('Done!');
}

run();
