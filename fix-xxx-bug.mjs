import fs from 'fs';

const file = 'src/pages/FlightsPage.jsx';
let s = fs.readFileSync(file, 'utf8');

// The validation block to inject
const validationBlock = `
    // STRICT VALIDATION: Block fake/invalid IATA codes
    const validIATA = /^[A-Z]{3}$/;
    if (!validIATA.test(origin.toUpperCase()) || origin.toUpperCase() === 'XXX') {
      return setError('Invalid origin airport code. Please select a valid city from the dropdown.');
    }
    if (!validIATA.test(destination.toUpperCase()) || destination.toUpperCase() === 'XXX') {
      return setError('Invalid destination airport code. Please select a valid city from the dropdown.');
    }
    if (origin.toUpperCase() === destination.toUpperCase()) {
      return setError('Origin and destination cannot be the same.');
    }
`;

// Find the start of handleSearch and the first if-statement
const searchStart = s.indexOf('const handleSearch = async () => {');
const firstIf = s.indexOf("if (!origin || !destination || !date)", searchStart);

if (searchStart === -1 || firstIf === -1) {
  console.log('❌ Could not find handleSearch or the initial validation. The file structure may have changed.');
  process.exit(1);
}

// Inject the validation right BEFORE the existing if-statement
s = s.slice(0, firstIf) + validationBlock + '\n    ' + s.slice(firstIf);

fs.writeFileSync(file, s, 'utf8');
console.log('✅ FlightsPage.jsx patched: Strict IATA validation added to handleSearch.');
