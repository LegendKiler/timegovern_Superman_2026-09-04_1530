import fs from 'fs';

const appPath = 'src/App.jsx';
let app = fs.readFileSync(appPath, 'utf8');

// Add import
if (!app.includes('FlightRoutePage')) {
  app = app.replace(
    "import FlightsPage from './pages/FlightsPage'",
    "import FlightsPage from './pages/FlightsPage'\nimport FlightRoutePage from './pages/FlightRoutePage'"
  );
}

// Add route (adjust the <Route> placement to match your existing structure)
if (!app.includes('path="/flights/:origin/:destination"')) {
  // Insert before the catch-all or after the main flights route
  app = app.replace(
    /(<Route path="\/flights" element=\{<FlightsPage \/>\} \/>)/,
    `$1\n        <Route path="/flights/:origin/:destination" element={<FlightRoutePage />} />`
  );
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('✅ Route /flights/:origin/:destination added to App.jsx');
