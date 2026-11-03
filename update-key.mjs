const fs = require('fs');
const file = 'src/components/CarBooking.jsx';
let s = fs.readFileSync(file, 'utf8');

const YOUR_KEY = 'aw_live_3131a083e0ffe8afaf3c48685ff354c7';

// Replace the placeholder (handles both single and double quotes)
s = s.replace(/const AGENTWEB_API_KEY = ['"]PASTE_YOUR_AGENTWEB_API_KEY_HERE['"];/, `const AGENTWEB_API_KEY = '${YOUR_KEY}';`);

// Verify the replacement happened
if (s.includes(YOUR_KEY)) {
  fs.writeFileSync(file, s, 'utf8');
  console.log('✅ AgentWeb API key updated successfully!');
} else {
  console.error('❌ Could not find the placeholder. Check if the previous patch was applied.');
}
