const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  {
    url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon.png',
    filename: 'marker-icon.png'
  },
  {
    url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
    filename: 'marker-shadow.png'
  }
];

const publicDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Download each icon
icons.forEach(icon => {
  const file = fs.createWriteStream(path.join(publicDir, icon.filename));
  
  https.get(icon.url, response => {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${icon.filename}`);
    });
  }).on('error', err => {
    fs.unlink(path.join(publicDir, icon.filename));
    console.error(`Error downloading ${icon.filename}:`, err.message);
  });
}); 