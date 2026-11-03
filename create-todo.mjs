import fs from 'fs';
const todo = `# TimeGovern - Post Launch Checklist

## Phase 2 (1 Month After Launch)
- [ ] Integrate Rotating Residential Proxies (Decodo / Bright Data) for the Python flight bridge.
- [ ] Setup Resend API for proxy rotation email alerts.
- [ ] Implement Cloudflare WAF rules to protect the React frontend.
- [ ] Move Python bridge (fast-flights) from localhost to a dedicated VPS or Render/Railway.
`;
fs.writeFileSync('POST_LAUNCH_TODO.md', todo, 'utf8');
console.log('✅ Created POST_LAUNCH_TODO.md');
