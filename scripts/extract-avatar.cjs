const fs = require('fs');

const heroContent = fs.readFileSync('assets/hero.svg', 'utf8');
const match = heroContent.match(/href="(data:image\/[^"]+)"/);

if (match) {
  fs.writeFileSync('scripts/avatar-uri.tmp', match[1], 'utf8');
  console.log('Successfully saved avatar URI. Length:', match[1].length);
} else {
  console.error('Avatar URI not found in hero.svg');
}
