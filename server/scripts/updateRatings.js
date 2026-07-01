import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the seed file
const seedFilePath = path.join(__dirname, 'seedSuppliers.js');
let content = fs.readFileSync(seedFilePath, 'utf8');

// Generate random rating between 3.5 and 4.9
const getRandomRating = () => {
    return (Math.random() * (4.9 - 3.5) + 3.5).toFixed(1);
};

// Replace all rating: 4.0 with random ratings
let count = 0;
content = content.replace(/rating: 4\.0/g, () => {
    count++;
    return `rating: ${getRandomRating()}`;
});

// Also update the first 3 that already have ratings
content = content.replace(/rating: 4\.2/, `rating: ${getRandomRating()}`);
content = content.replace(/rating: 4\.5/, `rating: ${getRandomRating()}`);
content = content.replace(/rating: 3\.8/, `rating: ${getRandomRating()}`);

// Write back
fs.writeFileSync(seedFilePath, content, 'utf8');

console.log(`✅ Updated ${count + 3} supplier ratings with random values between 3.5 and 4.9`);
