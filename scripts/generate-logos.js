import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// List of delivery companies
const companies = [
  { id: 'maystro', name: 'Maystro Delivery' },
  { id: 'zr', name: 'Zr Express' },
  { id: 'yalidine', name: 'Yalidine Express' },
  { id: 'noest', name: 'Nord et ouest (Noest)' },
  { id: 'dhd', name: 'Dhd Livraison Express' },
  { id: 'guepex', name: 'Guepex Express' },
  { id: 'yalitec', name: 'Yalitec' },
  { id: '48h', name: '48h Courrier Express' },
  { id: 'anderson', name: 'Anderson National Express' },
  { id: 'world', name: 'World Express' },
  { id: 'ecom', name: 'E-com Delivery' }
];

// Generate a simple SVG logo for each company
companies.forEach(company => {
  const svgContent = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#f8f9fa" />
    <text x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#333">${company.name}</text>
    <text x="100" y="130" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#666">Delivery Service</text>
  </svg>`;

  fs.writeFileSync(path.join(imagesDir, `${company.id}.svg`), svgContent);
  console.log(`Created logo for ${company.name}`);
});

console.log('All logos generated successfully!');
