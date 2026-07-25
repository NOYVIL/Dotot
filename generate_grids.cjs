const fs = require('fs');

function createDotGrid(spacing, radius) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" patternUnits="userSpaceOnUse" viewBox="0 0 800 800">`;
  svg += `<defs><pattern id="dot" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">`;
  svg += `<circle cx="${spacing/2}" cy="${spacing/2}" r="${radius}" fill="#999999" /></pattern></defs>`;
  svg += `<rect width="100%" height="100%" fill="url(#dot)" />`;
  svg += `</svg>`;
  return svg;
}

function createLineGrid(spacing, color) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" patternUnits="userSpaceOnUse" viewBox="0 0 800 800">`;
  svg += `<defs><pattern id="grid" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">`;
  svg += `<rect width="${spacing}" height="${spacing}" fill="none" />`;
  svg += `<path d="M ${spacing} 0 L 0 0 0 ${spacing}" fill="none" stroke="${color}" stroke-width="1" /></pattern></defs>`;
  svg += `<rect width="100%" height="100%" fill="url(#grid)" />`;
  svg += `</svg>`;
  return svg;
}

function createIsoGrid(spacing, radius) {
  let w = spacing * Math.sqrt(3);
  let h = spacing;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" patternUnits="userSpaceOnUse" viewBox="0 0 800 800">`;
  svg += `<defs><pattern id="iso" x="0" y="0" width="${w}" height="${h}" patternUnits="userSpaceOnUse">`;
  svg += `<circle cx="${w/2}" cy="0" r="${radius}" fill="#999999" />`;
  svg += `<circle cx="${w/2}" cy="${h}" r="${radius}" fill="#999999" />`;
  svg += `<circle cx="0" cy="${h/2}" r="${radius}" fill="#999999" />`;
  svg += `<circle cx="${w}" cy="${h/2}" r="${radius}" fill="#999999" />`;
  svg += `</pattern></defs>`;
  svg += `<rect width="100%" height="100%" fill="url(#iso)" />`;
  svg += `</svg>`;
  return svg;
}

fs.writeFileSync('public/grids/grid1.svg', createDotGrid(40, 2));
fs.writeFileSync('public/grids/grid2.svg', createDotGrid(20, 1.5));
fs.writeFileSync('public/grids/grid3.svg', createLineGrid(40, '#dddddd'));
fs.writeFileSync('public/grids/grid4.svg', createLineGrid(20, '#dddddd'));
fs.writeFileSync('public/grids/grid5.svg', createIsoGrid(40, 2));
fs.writeFileSync('public/grids/grid6.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="none" /></svg>`); // Blank

console.log("Grids generated.");
