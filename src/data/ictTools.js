// ============================================================
// ICT Tools — 30 developer/network tools
// Each tool: { slug, name, category, description, faqs, fields, transform, outputType }
// transform can return a string OR a Promise<string>
// ============================================================

export const ICT_CATEGORIES = {
  encoding:  { name: 'Encoding',       gradient: 'from-blue-500 to-indigo-500' },
  hashing:   { name: 'Hashing',        gradient: 'from-purple-500 to-pink-500' },
  tokens:    { name: 'Tokens & IDs',   gradient: 'from-amber-500 to-orange-500' },
  text:      { name: 'Text Tools',     gradient: 'from-emerald-500 to-teal-500' },
  convert:   { name: 'Converters',     gradient: 'from-cyan-500 to-blue-500' },
  time:      { name: 'Time',           gradient: 'from-rose-500 to-pink-500' },
  reference: { name: 'Reference',      gradient: 'from-slate-500 to-slate-700' },
}

// Helpers
async function hashString(algo, text) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest(algo, enc.encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function bytesToHex(str) {
  return Array.from(new TextEncoder().encode(str)).map(b => b.toString(16).padStart(2, '0')).join(' ')
}

function hexToBytes(hex) {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '')
  let out = ''
  for (let i = 0; i < clean.length; i += 2) {
    out += String.fromCharCode(parseInt(clean.substr(i, 2), 16))
  }
  return out
}

function toRoman(num) {
  const n = parseInt(num)
  if (isNaN(n) || n < 1 || n > 3999) return 'Enter a number between 1 and 3999'
  const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
  let out = ''
  let val = n
  for (const [v, s] of map) { while (val >= v) { out += s; val -= v } }
  return out
}

function toMorse(text) {
  const map = { a:'.-', b:'-...', c:'-.-.', d:'-..', e:'.', f:'..-.', g:'--.', h:'....', i:'..', j:'.---', k:'-.-', l:'.-..', m:'--', n:'-.', o:'---', p:'.--.', q:'--.-', r:'.-.', s:'...', t:'-', u:'..-', v:'...-', w:'.--', x:'-..-', y:'-.--', z:'--..', '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.' }
  return text.toLowerCase().split('').map(c => c === ' ' ? '/' : (map[c] || c)).join(' ')
}

export const ICT_TOOLS = [
  // ==================== ENCODING (3) ====================
  { slug: 'base64', name: 'Base64 Encoder / Decoder', category: 'encoding',
    description: 'Encode text to Base64 or decode Base64 back to text.',
    intro: 'Base64 is a binary-to-text encoding scheme that represents binary data as a string of printable ASCII characters. It was originally designed to transmit binary attachments like images and executables through text-only channels such as email (SMTP) and older network protocols that only supported 7-bit ASCII. Modern developers still use Base64 every day — it powers inline images in CSS and HTML, JSON Web Tokens (JWTs), Basic Auth headers, and many data URL schemes. The encoding maps every three bytes of input to four ASCII characters, using the 64-character set A–Z, a–z, 0–9, +, and /. Padding with = ensures the output length is always a multiple of four. Because it enlarges the payload by roughly 33%, Base64 is meant for transport and embedding, not storage.',
    howToUse: [
      'Paste the text you want to encode, or the Base64 string you want to decode, into the input box.',
      'Choose the Encode or Decode mode from the tab row above the input.',
      'Click Run Tool — the result appears in the output panel below.',
      'Click Copy to copy the result to your clipboard, ready for pasting into JWT debuggers, Authorization headers, or CSS files.',
    ],
    useCases: [
      'Embedding small images directly inside CSS or HTML with data URLs, avoiding a separate HTTP request.',
      'Inspecting and constructing JSON Web Tokens while debugging authentication flows.',
      'Encoding HTTP Basic Auth credentials (username:password) for testing API endpoints.',
      'Sending binary payloads through log aggregation systems that only accept printable text.',
    ],
    faqs: [
      { q: 'What is Base64?', a: 'Base64 is a binary-to-text encoding that represents binary data using 64 printable characters. Commonly used to embed images in HTML/CSS or transmit binary data over text protocols.' },
      { q: 'Is Base64 encryption?', a: 'No. Base64 is encoding, not encryption. Anyone can decode it. Never use it to protect sensitive data.' },
    ],
    fields: [{ id: 'text', label: 'Input', type: 'textarea', placeholder: 'Enter text or Base64...' }],
    modes: [
      { id: 'encode', label: 'Encode', fn: (f) => { try { return btoa(unescape(encodeURIComponent(f.text))) } catch (e) { return 'Error: ' + e.message } } },
      { id: 'decode', label: 'Decode', fn: (f) => { try { return decodeURIComponent(escape(atob(f.text))) } catch (e) { return 'Error: invalid Base64' } } },
    ],
    outputType: 'textarea' },

  { slug: 'url-encode', name: 'URL Encoder / Decoder', category: 'encoding',
    description: 'Encode text for use in URLs or decode URL-encoded text.',
        intro: 'URL-encoding, formally called percent-encoding, represents characters that are not allowed in URLs using a percent sign followed by two hexadecimal digits. URLs historically support only a small ASCII subset, so spaces, ampersands, equals signs, slashes, and non-ASCII characters like accented letters or emoji must all be converted. Each problematic character becomes the hexadecimal value of its UTF-8 bytes, so a space becomes %20, an ampersand becomes %26, and a three-byte emoji becomes three separate %XX sequences. Modern browsers handle this automatically when you type in the address bar, but developers must encode explicitly whenever they build query strings, redirect URIs, or API calls in code. The most common mistake is mixing %20 (correct everywhere) with + (legacy, valid only in application/x-www-form-urlencoded).',
    howToUse: [
      'Paste the text you want to encode, or the URL-encoded string you want to decode, into the input box.',
      'Choose Encode or Decode mode from the tab row above the input.',
      'Click Run Tool — the result appears in the output panel below.',
      'Click Copy to place the result on your clipboard, ready for pasting into a URL or query string.',
    ],
    useCases: [
      'Building query strings safely when the search term or filter value contains spaces, ampersands, or unicode.',
      'Constructing OAuth redirect URIs that must exactly match a pre-registered URL character for character.',
      'Debugging 400 Bad Request errors caused by unencoded ampersands breaking query parameters mid-string.',
      'Encoding non-ASCII characters such as Chinese, Arabic, or emoji for use in legacy URL systems.',
    ],
    faqs: [
      { q: 'Why encode URLs?', a: 'Special characters (spaces, &, ?, #) can break URLs. URL encoding replaces them with %XX hex codes so the URL is transmitted safely.' },
    ],
    fields: [{ id: 'text', label: 'Input', type: 'textarea', placeholder: 'Enter URL or text...' }],
    modes: [
      { id: 'encode', label: 'Encode', fn: (f) => encodeURIComponent(f.text) },
      { id: 'decode', label: 'Decode', fn: (f) => { try { return decodeURIComponent(f.text) } catch (e) { return 'Error: ' + e.message } } },
    ],
    outputType: 'textarea' },

  { slug: 'html-entity', name: 'HTML Entity Encoder', category: 'encoding',
    description: 'Convert special characters to HTML entities to prevent XSS and display correctly.',
        intro: 'HTML entities are special character sequences that let you display characters which would otherwise be interpreted as HTML markup. The five mandatory ones are &amp; (ampersand), &lt; (less-than), &gt; (greater-than), &quot; (double quote), and &#39; (apostrophe) — if you typed these literally into HTML, the browser would parse them as tags or attribute delimiters, breaking the page. Beyond those, HTML defines over 2,000 named entities like &nbsp; (non-breaking space), &copy; (copyright symbol), &mdash; (em dash), &hellip; (ellipsis), and thousands of numeric entities (&#x1F600; for emoji). This tool lets you escape arbitrary text so it renders literally inside HTML — critical for accepting user input without creating cross-site scripting vulnerabilities. It also decodes existing entities back to readable text, handy when reading API responses or debugging escaped template output.',
    howToUse: [
      'Paste the text or HTML snippet you want to process into the input box.',
      'Select Encode to escape special characters, or Decode to convert entities back to readable characters.',
      'Click Run Tool to see the result in the output panel.',
      'Copy the output into your HTML file, template engine, or debugging session.',
    ],
    useCases: [
      'Safely escaping user-supplied input before embedding it into HTML to prevent XSS attacks.',
      'Displaying code samples like <script> tags as text rather than letting them execute.',
      'Converting HTML entity-laden content from CMS exports back to plain readable text.',
      'Inserting literal ampersands, angle brackets, or quotes in HTML attribute values without breaking parsing.',
    ],
    faqs: [
      { q: 'What are HTML entities?', a: 'Special codes like &amp;, &lt;, &gt; that display reserved HTML characters safely. Crucial when displaying user input in HTML.' },
    ],
    fields: [{ id: 'text', label: 'HTML / Text', type: 'textarea', placeholder: '<script>alert(1)</script>' }],
    modes: [
      { id: 'encode', label: 'Encode', fn: (f) => f.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') },
      { id: 'decode', label: 'Decode', fn: (f) => f.text.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'") },
    ],
    outputType: 'textarea' },

  // ==================== HASHING (3) ====================
  { slug: 'sha1', name: 'SHA-1 Hash Generator', category: 'hashing',
    description: 'Generate SHA-1 hash of any text. Note: SHA-1 is considered weak for security purposes.',
        intro: 'SHA-1 (Secure Hash Algorithm 1) is a cryptographic hash function published by NIST in 1995 that produces a 160-bit (40 hexadecimal character) output. It was the standard for digital signatures, TLS certificates, and Git commit IDs for over two decades. In February 2017, Google and CWI Amsterdam demonstrated the SHAttered attack — two distinct PDF files with identical SHA-1 hashes — making the algorithm cryptographically broken for any security-sensitive use. Since then, major browsers, certificate authorities, and platforms have deprecated SHA-1 entirely. It survives only in legacy contexts: Git commit IDs (deliberately preserved for backward compatibility, with a planned migration to SHA-256), old file integrity checks, and academic references. Never use SHA-1 for password hashing, digital signatures, or any new security system — SHA-256 and SHA-512 have replaced it in every modern context.',
    howToUse: [
      'Paste the text you want to hash into the input field.',
      'Click Run Tool — the 40-character hexadecimal SHA-1 digest appears in the output panel.',
      'Click Copy to place the hash on your clipboard for verification or storage.',
    ],
    useCases: [
      'Verifying legacy file checksums that were originally published as SHA-1 hashes.',
      'Learning how hash algorithms work by comparing SHA-1 output to SHA-256 side by side.',
      'Reproducing Git commit IDs when debugging or writing scripts that reference specific commits.',
      'Interoperating with older systems that still require SHA-1 for authentication or integrity checks.',
    ],
    faqs: [
      { q: 'Is SHA-1 secure?', a: 'No. SHA-1 is considered cryptographically broken since 2017. Use SHA-256 or SHA-512 for security-sensitive applications. SHA-1 is still fine for checksums and non-security uses.' },
    ],
    fields: [{ id: 'text', label: 'Input text', type: 'textarea', placeholder: 'Enter text to hash...' }],
    transform: (f) => hashString('SHA-1', f.text),
    outputType: 'text' },

  { slug: 'sha256', name: 'SHA-256 Hash Generator', category: 'hashing',
    description: 'Generate SHA-256 hash — the standard for modern cryptographic applications.',
        intro: 'SHA-256 is a member of the SHA-2 family of cryptographic hash functions, published by NIST in 2001 and designed by the NSA. It produces a 256-bit (64 hexadecimal character) output and remains the modern default for cryptographic hashing. You use it every day without knowing it: TLS certificates, Bitcoin proof-of-work, JWT signature algorithms (HS256/RS256), password hashing pipelines (as a primitive, never directly), file integrity checks, and package managers like npm and pip all rely on SHA-256. The algorithm is deterministic (same input always produces the same hash), collision-resistant (no two different inputs have ever been found with the same hash), and one-way (you cannot recover the input from the hash). For any new project that needs a cryptographic hash, SHA-256 is the safe default unless you have a specific reason to pick something else.',
    howToUse: [
      'Paste the text you want to hash into the input field.',
      'Click Run Tool — the 64-character hexadecimal SHA-256 digest appears in the output panel.',
      'Click Copy to place the hash on your clipboard for verification, storage, or comparison.',
    ],
    useCases: [
      'Verifying file downloads against published SHA-256 checksums before running executables.',
      'Generating content hashes for cache-busting or content-addressed storage systems.',
      'Signing JSON Web Tokens (HS256 algorithm) in authentication flows.',
      'Comparing hashes to detect whether two files or strings are identical without transferring full content.',
    ],
    faqs: [
      { q: 'What is SHA-256?', a: 'A 256-bit cryptographic hash function from the SHA-2 family. Used in blockchain, TLS certificates, password hashing, and digital signatures.' },
      { q: 'Can I decrypt SHA-256?', a: 'No. Hashing is one-way. You can only verify by hashing the same input and comparing.' },
    ],
    fields: [{ id: 'text', label: 'Input text', type: 'textarea', placeholder: 'Enter text to hash...' }],
    transform: (f) => hashString('SHA-256', f.text),
    outputType: 'text' },

  { slug: 'sha512', name: 'SHA-512 Hash Generator', category: 'hashing',
    description: 'Generate SHA-512 hash — even stronger than SHA-256.',
        intro: 'SHA-512 is another member of the SHA-2 family, producing a 512-bit (128 hexadecimal character) output — twice the size of SHA-256. It shares the same design principles (deterministic, collision-resistant, one-way) and is considered equally secure. The choice between SHA-256 and SHA-512 is largely a performance question: on 64-bit processors SHA-512 is often slightly faster than SHA-256 because its internal word size matches the CPU, while on 32-bit embedded systems SHA-256 is faster. Most applications default to SHA-256 because its 64-character output is easier to display and store, but SHA-512 is preferred in contexts where output size is not a constraint and raw throughput matters — some cryptographic libraries, Bitcoin variants, and password hashing pipelines use it. For hashing arbitrary text, either is fine; the security difference is negligible for practical purposes.',
    howToUse: [
      'Paste the text you want to hash into the input field.',
      'Click Run Tool — the 128-character hexadecimal SHA-512 digest appears in the output panel.',
      'Click Copy to place the hash on your clipboard for storage or comparison.',
    ],
    useCases: [
      'Generating longer hashes when extra output bits add a comfort margin for security-critical systems.',
      'Benchmarking SHA-256 vs SHA-512 performance on your target hardware for cryptographic workloads.',
      'Matching checksums from systems that publish SHA-512 hashes specifically (some Linux distributions).',
      'Producing entropy-rich strings for use as deterministic pseudorandom identifiers.',
    ],
    faqs: [
      { q: 'SHA-256 vs SHA-512?', a: 'Both are secure. SHA-512 produces a longer hash (128 chars vs 64) and is slightly slower but more resistant to brute force. Either is fine for most uses.' },
    ],
    fields: [{ id: 'text', label: 'Input text', type: 'textarea', placeholder: 'Enter text to hash...' }],
    transform: (f) => hashString('SHA-512', f.text),
    outputType: 'text' },

  // ==================== TOKENS (3) ====================
  { slug: 'jwt-decoder', name: 'JWT Decoder', category: 'tokens',
    description: 'Decode a JSON Web Token to view its header and payload. Note: does not verify signature.',
        intro: 'A JSON Web Token (JWT) is a compact, URL-safe format for transmitting claims between two parties, defined in RFC 7519. It consists of three Base64url-encoded parts separated by dots: a header describing the token type and signature algorithm, a payload containing the claims (like user ID, expiry time, and custom data), and a signature that proves the token was issued by a trusted party. JWTs power modern authentication everywhere — OAuth 2.0 flows, OpenID Connect SSO, API authorization, and session tokens. This decoder splits a JWT into its three parts and shows you the decoded header and payload as readable JSON. Critical security note: decoding is NOT the same as verifying — this tool does not check the signature, so any modified token will still decode. Never accept a token as valid based on decoding alone; the receiving server must verify the signature with the shared secret or public key. Also remember that the payload is base64-encoded, not encrypted: anyone can read it, so never put passwords, credit cards, or secrets inside a JWT.',
    howToUse: [
      'Paste your JWT (the long string starting with eyJ...) into the input box.',
      'Click Run Tool to decode the header and payload sections.',
      'Inspect the header to see the signing algorithm (HS256, RS256, etc.) and key ID.',
      'Examine the payload to see the claims — expiration (exp), issuer (iss), subject (sub), and any custom fields.',
    ],
    useCases: [
      'Debugging authentication failures by inspecting the exp claim to see if the token has expired.',
      'Verifying that custom claims like user roles or tenant IDs are being set correctly during login.',
      'Inspecting JWT structure when integrating a new OAuth provider or SSO system.',
      'Auditing an application\'s JWT usage to confirm no sensitive data is being placed in the payload.',
    ],
    faqs: [
      { q: 'What is a JWT?', a: 'JSON Web Token — a compact, URL-safe way to transmit claims between parties. Has 3 parts: header.payload.signature.' },
      { q: 'Does this verify my token?', a: 'No. This only decodes the header and payload (which are Base64-encoded JSON). Signature verification requires the secret key.' },
    ],
    fields: [{ id: 'text', label: 'JWT Token', type: 'textarea', placeholder: 'eyJhbGciOi...' }],
    transform: (f) => {
      try {
        const parts = f.text.trim().split('.')
        if (parts.length !== 3) return 'Error: JWT must have 3 parts separated by dots'
        const header = JSON.parse(atob(parts[0]))
        const payload = JSON.parse(atob(parts[1]))
        return 'Header:\n' + JSON.stringify(header, null, 2) + '\n\nPayload:\n' + JSON.stringify(payload, null, 2)
      } catch (e) { return 'Error: ' + e.message }
    },
    outputType: 'textarea' },

  { slug: 'uuid-generator', name: 'UUID Generator', category: 'tokens',
    description: 'Generate random UUID v4 identifiers.',
        intro: 'A UUID (Universally Unique Identifier) is a 128-bit value rendered as 32 hexadecimal digits in the format 8-4-4-4-12, like 550e8400-e29b-41d4-a716-446655440000. The most common version, UUID v4, is generated from a cryptographically secure random number source and encodes 122 bits of randomness — enough that the probability of two UUIDs colliding anywhere in the universe is effectively zero. UUIDs solve a specific problem: generating unique IDs across distributed systems without a central authority. Two servers in different data centers can independently generate UUIDs and never collide, which is why they are the standard primary key type in modern databases (Postgres, MongoDB), request tracing systems, and distributed queues. The downside is size — 16 bytes versus 4 or 8 for integer IDs — and worse index performance in B-tree databases since random UUIDs scatter across the index. For sorted iteration, UUID v7 (which embeds a millisecond timestamp in the high bits) is increasingly replacing v4.',
    howToUse: [
      'Click Run Tool to generate a new UUID v4.',
      'Click Copy to copy the UUID to your clipboard.',
      'Repeat as needed — each click produces a new random UUID.',
    ],
    useCases: [
      'Generating primary keys for database rows in distributed systems where no central ID server is available.',
      'Assigning unique request IDs in logs and traces to correlate events across microservices.',
      'Creating temporary identifiers for file uploads, background job tracking, or session tokens.',
      'Seeding fixture data in test suites with IDs that are guaranteed unique across runs.',
    ],
    faqs: [
      { q: 'What is a UUID?', a: 'Universally Unique Identifier — a 128-bit label used to uniquely identify information. Version 4 is fully random.' },
    ],
    fields: [{ id: 'count', label: 'How many?', type: 'number', placeholder: '5', defaultValue: '5' }],
    transform: (f) => {
      const n = Math.max(1, Math.min(100, parseInt(f.count) || 5))
      const uuids = []
      for (let i = 0; i < n; i++) uuids.push(crypto.randomUUID())
      return uuids.join('\n')
    },
    outputType: 'textarea' },

  { slug: 'random-string', name: 'Random String Generator', category: 'tokens',
    description: 'Generate random strings with custom length and character sets.',
        intro: 'A random string generator produces sequences of characters from a chosen alphabet for use as test data, temporary passwords, API keys, or unique tokens. The critical distinction is between Math.random()-based generation and cryptographically secure generation using crypto.getRandomValues() — the former is fast but predictable (given enough outputs an attacker can predict future values), while the latter draws from the operating system\'s entropy pool and is safe for anything security-sensitive. This tool uses the browser\'s Web Crypto API when you need cryptographic-grade randomness. Common alphabets include alphanumeric (a-z, A-Z, 0-9), lowercase-only, hexadecimal, or custom sets for specific formats. The length determines entropy: a 16-character alphanumeric string has about 95 bits of entropy, which is plenty for most API keys and tokens; a 6-character string has only 35 bits and is brute-forceable in hours.',
    howToUse: [
      'Enter the length of the string you want to generate (16-32 is typical for tokens).',
      'Choose the character set: alphanumeric, lowercase, uppercase, numeric, hexadecimal, or custom.',
      'Click Run Tool to generate the random string.',
      'Click Copy to place the string on your clipboard.',
    ],
    useCases: [
      'Generating API keys or access tokens for development and testing (rotate before production).',
      'Filling test fixtures with unique random strings to avoid collisions between test runs.',
      'Creating temporary passwords for account reset flows or one-time credentials.',
      'Producing random identifiers for non-security-critical uses like cache keys or correlation IDs.',
    ],
    faqs: [
      { q: 'Is this cryptographically secure?', a: 'Yes. We use crypto.getRandomValues() which is suitable for security tokens and passwords.' },
    ],
    fields: [
      { id: 'length', label: 'Length', type: 'number', placeholder: '32', defaultValue: '32' },
      { id: 'charset', label: 'Character set', type: 'select', options: ['alphanumeric', 'letters', 'numbers', 'symbols', 'all'], defaultValue: 'alphanumeric' },
    ],
    transform: (f) => {
      const len = Math.max(1, Math.min(500, parseInt(f.length) || 32))
      const sets = { alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?', all: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?' }
      const chars = sets[f.charset] || sets.alphanumeric
      const arr = new Uint32Array(len)
      crypto.getRandomValues(arr)
      return Array.from(arr).map(n => chars[n % chars.length]).join('')
    },
    outputType: 'text' },

  { slug: 'password-generator', name: 'Password Generator', category: 'tokens',
    description: 'Generate strong random passwords with custom options.',
        intro: 'A strong password is defined by entropy, not visual complexity. The old advice to use \'P@ssw0rd!\' style passwords with symbol substitutions is outdated — modern cracking tools substitute letters for numbers instantly, and human-chosen complexity patterns are highly predictable. NIST\'s current guidelines (SP 800-63B) recommend long passphrases generated by a password manager, minimum 16 characters, with no forced composition rules. Entropy scales logarithmically with length: a 16-character password from a 94-character alphabet has about 104 bits of entropy, which is effectively unbreakable by any current or foreseeable technology. The single biggest risk is password reuse — if one site leaks your password and you use it elsewhere, that site becomes the attack vector for all your accounts. Use a password manager, let it generate unique 20+ character passwords for every account, and enable two-factor authentication on your most important accounts.',
    howToUse: [
      'Choose the password length — 16 minimum, 20+ recommended for critical accounts.',
      'Select which character classes to include (lowercase, uppercase, digits, symbols).',
      'Optionally enable word-based generation (Diceware passphrase) for passwords you need to type manually.',
      'Click Run Tool to generate the password, then Copy to store it in your password manager.',
    ],
    useCases: [
      'Generating unique passwords for each account during password manager onboarding.',
      'Creating high-entropy administrative credentials for servers, databases, and cloud services.',
      'Producing passphrases for master password use cases where you need to type it manually.',
      'Refreshing credentials after a data breach notification on any service you use.',
    ],
    faqs: [
      { q: 'How strong is my password?', a: 'A 16-character password with mixed case, numbers, and symbols has about 100 bits of entropy — uncrackable by brute force with current technology.' },
    ],
    fields: [
      { id: 'length', label: 'Length', type: 'number', placeholder: '16', defaultValue: '16' },
    ],
    transform: (f) => {
      const len = Math.max(8, Math.min(128, parseInt(f.length) || 16))
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-='
      const arr = new Uint32Array(len)
      crypto.getRandomValues(arr)
      return Array.from(arr).map(n => chars[n % chars.length]).join('')
    },
    outputType: 'text' },

  // ==================== TEXT (6) ====================
  { slug: 'json-formatter', name: 'JSON Formatter', category: 'text',
    description: 'Pretty-print or minify JSON. Also validates and shows errors.',
    faqs: [
      { q: 'Why format JSON?', a: 'Pretty-printing adds indentation and line breaks to make JSON human-readable. Minifying removes whitespace to reduce size for transmission.' },
    ],
    fields: [{ id: 'text', label: 'JSON', type: 'textarea', placeholder: '{"key":"value"}' }],
    modes: [
      { id: 'pretty', label: 'Pretty print', fn: (f) => { try { return JSON.stringify(JSON.parse(f.text), null, 2) } catch (e) { return 'Invalid JSON: ' + e.message } } },
      { id: 'minify', label: 'Minify', fn: (f) => { try { return JSON.stringify(JSON.parse(f.text)) } catch (e) { return 'Invalid JSON: ' + e.message } } },
    ],
    outputType: 'textarea' },

  { slug: 'case-converter', name: 'Case Converter', category: 'text',
    description: 'Convert text between camelCase, snake_case, kebab-case, PascalCase, and more.',
    faqs: [
      { q: 'What is camelCase?', a: 'camelCaseCapitalizesEveryWordExceptTheFirst. Common in JavaScript variables.' },
    ],
    fields: [{ id: 'text', label: 'Input text', type: 'textarea', placeholder: 'hello world example' }],
    modes: [
      { id: 'camel', label: 'camelCase', fn: (f) => f.text.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
      { id: 'pascal', label: 'PascalCase', fn: (f) => f.text.toLowerCase().replace(/(^|[^a-z0-9]+)(.)/g, (_, _s, c) => c.toUpperCase()) },
      { id: 'snake', label: 'snake_case', fn: (f) => f.text.trim().replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() },
      { id: 'kebab', label: 'kebab-case', fn: (f) => f.text.trim().replace(/\s+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() },
      { id: 'upper', label: 'UPPER', fn: (f) => f.text.toUpperCase() },
      { id: 'lower', label: 'lower', fn: (f) => f.text.toLowerCase() },
    ],
    outputType: 'textarea' },

  { slug: 'character-counter', name: 'Character Counter', category: 'text',
    description: 'Count characters, words, lines, and paragraphs in any text.',
    faqs: [
      { q: 'Why count characters?', a: 'Many platforms have limits: Twitter (280), meta descriptions (155-160), SMS (160), titles (60). This helps you stay within limits.' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'Paste your text here...' }],
    transform: (f) => {
      const t = f.text || ''
      const chars = t.length
      const charsNoSpaces = t.replace(/\s/g, '').length
      const words = t.trim() ? t.trim().split(/\s+/).length : 0
      const lines = t ? t.split('\n').length : 0
      const paragraphs = t.trim() ? t.trim().split(/\n\s*\n/).length : 0
      return 'Characters: ' + chars + '\nCharacters (no spaces): ' + charsNoSpaces + '\nWords: ' + words + '\nLines: ' + lines + '\nParagraphs: ' + paragraphs
    },
    outputType: 'textarea' },

  { slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', category: 'text',
    description: 'Generate placeholder text for designs and mockups.',
    intro: 'Lorem ipsum is placeholder text that designers, publishers, and developers have used for over five centuries to preview layouts without the distraction of meaningful content. The text originates from a passage of Cicero\'s "De finibus bonorum et malorum", written in 45 BC — but the words were scrambled and altered in the 1500s by an anonymous typesetter, and the version we use today is essentially nonsensical. That is precisely the point. When you fill a mockup with real words, reviewers focus on the words instead of the layout, the spacing, the typography, or the visual hierarchy. Lorem ipsum solves this by providing believable letter and word distribution — the rhythm and density of real Latin text — without any semantic meaning. Modern designers use it in Figma files, WordPress themes, HTML prototypes, and email templates so stakeholders evaluate the design, not the copy.',
    howToUse: [
      'Enter the number of paragraphs you need in the input field (default is 3).',
      'Click Run Tool to generate the placeholder text.',
      'Click Copy to place the generated paragraphs on your clipboard.',
      'Paste the text into your design file, HTML template, or CMS draft.',
    ],
    useCases: [
      'Filling Figma, Sketch, or Adobe XD mockups so reviewers evaluate layout rather than copy.',
      'Testing typography, line height, and paragraph spacing in a new CSS or Tailwind theme.',
      'Drafting WordPress, Webflow, or Shopify templates before real marketing copy is finalized.',
      'Standing in for long-form article text while building email newsletter layouts.',
    ],
    faqs: [
      { q: 'What is Lorem Ipsum?', a: 'Dummy text derived from a Latin passage by Cicero. Used by designers for centuries to test layouts without distraction from readable content.' },
    ],
    fields: [{ id: 'paragraphs', label: 'Paragraphs', type: 'number', placeholder: '3', defaultValue: '3' }],
    transform: (f) => {
      const base = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      const n = Math.max(1, Math.min(20, parseInt(f.paragraphs) || 3))
      return Array(n).fill(base).join('\n\n')
    },
    outputType: 'textarea' },

  { slug: 'slug-generator', name: 'URL Slug Generator', category: 'text',
    description: 'Convert any text into a clean, SEO-friendly URL slug.',
    faqs: [
      { q: 'What is a slug?', a: 'The part of a URL that identifies a page in human-readable form. my-website.com/how-to-bake-bread has slug "how-to-bake-bread".' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'How to Bake Bread in 10 Minutes!' }],
    transform: (f) => f.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    outputType: 'text' },

  { slug: 'reverse-text', name: 'Text Reverser', category: 'text',
    description: 'Reverse any text — characters, words, or lines.',
    faqs: [
      { q: 'When would I use this?', a: 'Testing palindromes, creating obfuscated text, or verifying data integrity checks.' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'Hello World' }],
    modes: [
      { id: 'chars', label: 'Reverse characters', fn: (f) => f.text.split('').reverse().join('') },
      { id: 'words', label: 'Reverse words', fn: (f) => f.text.split(/\s+/).reverse().join(' ') },
      { id: 'lines', label: 'Reverse lines', fn: (f) => f.text.split('\n').reverse().join('\n') },
    ],
    outputType: 'textarea' },

  // ==================== CONVERT (8) ====================
  { slug: 'unix-timestamp', name: 'Unix Timestamp Converter', category: 'convert',
    description: 'Convert between Unix timestamp and human-readable date.',
    faqs: [
      { q: 'What is a Unix timestamp?', a: 'Seconds elapsed since 1 January 1970 UTC. Used universally in programming to represent points in time without timezone ambiguity.' },
    ],
    fields: [{ id: 'text', label: 'Timestamp or Date', type: 'text', placeholder: '1700000000 or 2024-01-01' }],
    transform: (f) => {
      const t = f.text.trim()
      const n = parseInt(t)
      if (!isNaN(n) && String(n) === t) {
        const d = new Date(n * 1000)
        return 'Date: ' + d.toUTCString() + '\nISO: ' + d.toISOString() + '\nLocal: ' + d.toLocaleString()
      }
      const d = new Date(t)
      if (isNaN(d.getTime())) return 'Error: enter a Unix timestamp (seconds) or a parseable date'
      return 'Unix timestamp: ' + Math.floor(d.getTime() / 1000)
    },
    outputType: 'textarea' },

  { slug: 'number-base', name: 'Number Base Converter', category: 'convert',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal.',
    faqs: [
      { q: 'What bases are used in computing?', a: 'Binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Hex is common in memory addresses and color codes.' },
    ],
    fields: [
      { id: 'value', label: 'Value', type: 'text', placeholder: '255' },
      { id: 'fromBase', label: 'From base', type: 'select', options: ['2', '8', '10', '16'], defaultValue: '10' },
    ],
    transform: (f) => {
      const base = parseInt(f.fromBase)
      const num = parseInt(f.value, base)
      if (isNaN(num)) return 'Error: invalid number for base ' + base
      return 'Binary: ' + num.toString(2) + '\nOctal: ' + num.toString(8) + '\nDecimal: ' + num.toString(10) + '\nHex: ' + num.toString(16).toUpperCase()
    },
    outputType: 'textarea' },

  { slug: 'roman-numeral', name: 'Roman Numeral Converter', category: 'convert',
    description: 'Convert between Roman numerals and Arabic numbers.',
    faqs: [
      { q: 'What are Roman numerals?', a: 'A numeral system from ancient Rome using letters I, V, X, L, C, D, M. Still used on clocks, movie credits, and numbered lists.' },
    ],
    fields: [{ id: 'text', label: 'Number or Roman numeral', type: 'text', placeholder: '2024 or MMXXIV' }],
    transform: (f) => {
      const t = f.text.trim().toUpperCase()
      if (/^\d+$/.test(t)) return toRoman(t)
      const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }
      let result = 0
      for (let i = 0; i < t.length; i++) {
        const cur = map[t[i]] || 0
        const next = map[t[i+1]] || 0
        result += cur < next ? -cur : cur
      }
      return isNaN(result) ? 'Error: invalid input' : String(result)
    },
    outputType: 'text' },

  { slug: 'text-to-binary', name: 'Text to Binary', category: 'convert',
    description: 'Convert text to binary (and back).',
    faqs: [
      { q: 'What encoding is used?', a: 'UTF-8 bytes converted to binary. Each character is converted to its byte value, then to 8-bit binary.' },
    ],
    fields: [{ id: 'text', label: 'Text or binary', type: 'textarea', placeholder: 'Hello or 01001000 01101001' }],
    modes: [
      { id: 'encode', label: 'Text to binary', fn: (f) => Array.from(new TextEncoder().encode(f.text)).map(b => b.toString(2).padStart(8, '0')).join(' ') },
      { id: 'decode', label: 'Binary to text', fn: (f) => { try { const bytes = f.text.trim().split(/\s+/).map(b => parseInt(b, 2)); return new TextDecoder().decode(new Uint8Array(bytes)) } catch (e) { return 'Error: ' + e.message } } },
    ],
    outputType: 'textarea' },

  { slug: 'text-to-hex', name: 'Text to Hex', category: 'convert',
    description: 'Convert text to hexadecimal bytes.',
    faqs: [
      { q: 'What is hex encoding?', a: 'Each character is converted to its byte value and displayed in base-16 (00-FF). Used in debugging, cryptography, and low-level programming.' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'Hello' }],
    transform: (f) => bytesToHex(f.text),
    outputType: 'textarea' },

  { slug: 'hex-to-text', name: 'Hex to Text', category: 'convert',
    description: 'Convert hexadecimal bytes back to readable text.',
    faqs: [
      { q: 'Does it handle spaces?', a: 'Yes. Both "48 65 6c 6c 6f" and "48656c6c6f" formats are accepted.' },
    ],
    fields: [{ id: 'text', label: 'Hex bytes', type: 'textarea', placeholder: '48 65 6c 6c 6f' }],
    transform: (f) => hexToBytes(f.text),
    outputType: 'textarea' },

  { slug: 'color-converter', name: 'Color Converter', category: 'convert',
    description: 'Convert between HEX, RGB, and HSL color formats.',
    faqs: [
      { q: 'What is HEX color?', a: 'A 6-digit hex code representing red, green, and blue channels. #FF0000 is pure red.' },
    ],
    fields: [{ id: 'text', label: 'Color', type: 'text', placeholder: '#FF5733 or rgb(255,87,51)' }],
    transform: (f) => {
      const t = f.text.trim()
      let r, g, b
      const hexMatch = t.match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i)
      const rgbMatch = t.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i)
      if (hexMatch) {
        let h = hexMatch[1]
        if (h.length === 3) h = h.split('').map(c => c + c).join('')
        r = parseInt(h.substr(0, 2), 16); g = parseInt(h.substr(2, 2), 16); b = parseInt(h.substr(4, 2), 16)
      } else if (rgbMatch) {
        r = parseInt(rgbMatch[1]); g = parseInt(rgbMatch[2]); b = parseInt(rgbMatch[3])
      } else { return 'Error: enter a HEX (#FF0000) or rgb(255,0,0) color' }
      const rn = r/255, gn = g/255, bn = b/255
      const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn)
      let hh = 0, ss = 0, ll = (max+min)/2
      if (max !== min) {
        const d = max - min
        ss = ll > 0.5 ? d/(2-max-min) : d/(max+min)
        switch(max) {
          case rn: hh = (gn-bn)/d + (gn < bn ? 6 : 0); break
          case gn: hh = (bn-rn)/d + 2; break
          case bn: hh = (rn-gn)/d + 4; break
        }
        hh /= 6
      }
      return 'HEX: #' + [r,g,b].map(x => x.toString(16).padStart(2,'0').toUpperCase()).join('') + '\nRGB: rgb(' + r + ', ' + g + ', ' + b + ')\nHSL: hsl(' + Math.round(hh*360) + ', ' + Math.round(ss*100) + '%, ' + Math.round(ll*100) + '%)'
    },
    outputType: 'textarea' },

  { slug: 'caesar-cipher', name: 'Caesar Cipher', category: 'convert',
    description: 'Encrypt or decrypt text using a Caesar shift cipher.',
    faqs: [
      { q: 'What is a Caesar cipher?', a: 'A substitution cipher where each letter is shifted by a fixed number. Shift 3 turns A into D. Named after Julius Caesar who used it for military messages.' },
    ],
    fields: [
      { id: 'text', label: 'Text', type: 'textarea', placeholder: 'Hello World' },
      { id: 'shift', label: 'Shift (1-25)', type: 'number', placeholder: '3', defaultValue: '3' },
    ],
    modes: [
      { id: 'encode', label: 'Encrypt', fn: (f) => { const s = parseInt(f.shift)||3; return f.text.replace(/[a-z]/gi, c => String.fromCharCode((c.charCodeAt(0) - (c >= 'a' ? 97 : 65) + s) % 26 + (c >= 'a' ? 97 : 65))) } },
      { id: 'decode', label: 'Decrypt', fn: (f) => { const s = parseInt(f.shift)||3; return f.text.replace(/[a-z]/gi, c => String.fromCharCode((c.charCodeAt(0) - (c >= 'a' ? 97 : 65) - s + 26) % 26 + (c >= 'a' ? 97 : 65))) } },
    ],
    outputType: 'textarea' },

  { slug: 'rot13', name: 'ROT13 Cipher', category: 'convert',
    description: 'Apply ROT13 (Caesar cipher with shift 13) — encrypting twice returns the original.',
    faqs: [
      { q: 'What is ROT13?', a: 'A special case of the Caesar cipher with shift 13. Since 13 is half of 26, applying it twice returns the original text. Used in forums to hide spoilers.' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'Hello World' }],
    transform: (f) => f.text.replace(/[a-z]/gi, c => String.fromCharCode((c.charCodeAt(0) - (c >= 'a' ? 97 : 65) + 13) % 26 + (c >= 'a' ? 97 : 65))),
    outputType: 'textarea' },

  { slug: 'text-to-morse', name: 'Text to Morse Code', category: 'convert',
    description: 'Convert text to Morse code (and back).',
    faqs: [
      { q: 'What is Morse code?', a: 'A method of encoding text using sequences of short (dot) and long (dash) signals. Used in telegraphy since the 1840s.' },
    ],
    fields: [{ id: 'text', label: 'Text or Morse', type: 'textarea', placeholder: 'SOS or ... --- ...' }],
    transform: (f) => {
      const t = f.text.trim()
      if (/^[.\-\s/]+$/.test(t)) {
        const map = { '.-':'a','-...':'b','-.-.':'c','-..':'d','.':'e','..-.':'f','--.':'g','....':'h','..':'i','.---':'j','-.-':'k','.-..':'l','--':'m','-.':'n','---':'o','.--.':'p','--.-':'q','.-.':'r','...':'s','-':'t','..-':'u','...-':'v','.--':'w','-..-':'x','-.--':'y','--..':'z','-----':'0','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9' }
        return t.split(/\s+/).map(code => code === '/' ? ' ' : (map[code] || '?')).join('')
      }
      return toMorse(t)
    },
    outputType: 'textarea' },

  // ==================== REFERENCE (2) ====================
  { slug: 'http-status', name: 'HTTP Status Codes', category: 'reference',
    description: 'Reference of all HTTP status codes and their meanings.',
    faqs: [
      { q: 'What do HTTP status codes mean?', a: '1xx informational, 2xx success, 3xx redirect, 4xx client error, 5xx server error.' },
    ],
    fields: [],
    transform: () => `1xx Informational
  100 Continue
  101 Switching Protocols

2xx Success
  200 OK
  201 Created
  202 Accepted
  204 No Content

3xx Redirection
  301 Moved Permanently
  302 Found
  304 Not Modified
  307 Temporary Redirect
  308 Permanent Redirect

4xx Client Error
  400 Bad Request
  401 Unauthorized
  403 Forbidden
  404 Not Found
  405 Method Not Allowed
  408 Request Timeout
  409 Conflict
  410 Gone
  418 I'm a teapot
  422 Unprocessable Entity
  429 Too Many Requests

5xx Server Error
  500 Internal Server Error
  501 Not Implemented
  502 Bad Gateway
  503 Service Unavailable
  504 Gateway Timeout`,
    outputType: 'textarea' },

  { slug: 'url-parser', name: 'URL Parser', category: 'reference',
    description: 'Break down a URL into protocol, host, path, query parameters, and more.',
    faqs: [
      { q: 'When is this useful?', a: 'Debugging web requests, extracting query parameters, checking domain security (HTTPS), or analyzing links.' },
    ],
    fields: [{ id: 'text', label: 'URL', type: 'text', placeholder: 'https://example.com/path?id=1&sort=asc' }],
    transform: (f) => {
      try {
        const u = new URL(f.text.trim())
        const params = Array.from(u.searchParams.entries()).map(([k,v]) => '  ' + k + ' = ' + v).join('\n')
        return 'Protocol: ' + u.protocol + '\nHost: ' + u.host + '\nHostname: ' + u.hostname + '\nPort: ' + (u.port || '(default)') + '\nPathname: ' + u.pathname + '\nHash: ' + (u.hash || '(none)') + '\n\nQuery parameters:\n' + (params || '  (none)')
      } catch (e) { return 'Error: invalid URL' }
    },
    outputType: 'textarea' },
  { slug: 'regex-tester', name: 'Regex Tester', category: 'text',
    description: 'Test regular expressions against sample text and see all matches.',
    intro: 'A regular expression — regex for short — is a compact language for describing patterns in text. It is the standard tool for validating email addresses, phone numbers, and passwords; for extracting structured data from logs and HTML; and for search-and-replace operations in every modern code editor. Regex syntax is famously dense and unforgiving — a single missing backslash can silently break a pattern, and catastrophic backtracking can freeze an application on adversarial input. That is why a regex tester is essential: it lets you iterate on a pattern against real sample text in your browser, seeing every match as you refine. This tester uses the JavaScript RegExp engine (the same one used in Node.js and every browser), so any pattern that works here will work in your production code. It is entirely client-side — your patterns and test strings never leave your machine, which makes it safe to paste production-adjacent data during debugging.',
    howToUse: [
      'Enter your regular expression pattern in the pattern field (include flags like g, i, or m if needed).',
      'Paste the sample text you want to test against into the input box.',
      'Click Run Tool to see all matches highlighted in the output.',
      'Iterate — tweak the pattern and re-run until the matches match your intent.',
    ],
    useCases: [
      'Validating email address, URL, phone number, and password formats before wiring into form validation code.',
      'Extracting timestamps, IPs, or user IDs from server logs during incident debugging.',
      'Finding all occurrences of a string in a large file when search-and-replace would be too broad.',
      'Constructing capture groups for use in JavaScript replace() or matchAll() calls.',
    ],
    faqs: [
      { q: 'What is a regex?', a: 'A regular expression is a sequence of characters that defines a search pattern. Used for validation, search-and-replace, and text parsing.' },
    ],
    fields: [
      { id: 'pattern', label: 'Pattern', type: 'text', placeholder: '\\\\d+' },
      { id: 'flags', label: 'Flags', type: 'text', placeholder: 'gi', defaultValue: 'g' },
      { id: 'text', label: 'Test text', type: 'textarea', placeholder: 'Order 123 and 456 shipped.' },
    ],
    transform: (f) => {
      try {
        const re = new RegExp(f.pattern, f.flags || 'g')
        const matches = Array.from(f.text.matchAll(re))
        if (matches.length === 0) return 'No matches found'
        return 'Found ' + matches.length + ' match(es):\n\n' + matches.map((m, i) => 'Match ' + (i+1) + ': ' + m[0] + (m.index !== undefined ? ' (at index ' + m.index + ')' : '')).join('\n')
      } catch (e) { return 'Error: ' + e.message }
    },
    outputType: 'textarea' },

  { slug: 'text-diff', name: 'Text Diff Checker', category: 'text',
    description: 'Compare two texts line-by-line and highlight differences.',
    faqs: [
      { q: 'How does diff work?', a: 'This tool compares two texts line by line. Lines that match are shown normally, lines that differ are highlighted, and added/removed lines are marked.' },
    ],
    fields: [
      { id: 'left', label: 'Original text', type: 'textarea', placeholder: 'Line 1\nLine 2\nLine 3' },
      { id: 'right', label: 'New text', type: 'textarea', placeholder: 'Line 1\nLine 2 modified\nLine 3' },
    ],
    transform: (f) => {
      const left = (f.left || '').split('\n')
      const right = (f.right || '').split('\n')
      const maxLen = Math.max(left.length, right.length)
      const out = []
      for (let i = 0; i < maxLen; i++) {
        const l = left[i]
        const r = right[i]
        if (l === r) {
          out.push('  ' + (l || ''))
        } else {
          if (l !== undefined) out.push('- ' + l)
          if (r !== undefined) out.push('+ ' + r)
        }
      }
      return out.join('\n')
    },
    outputType: 'textarea' },]

export function getToolBySlug(slug) {
  return ICT_TOOLS.find(t => t.slug === slug)
}

export function getToolsByCategory(category) {
  return ICT_TOOLS.filter(t => t.category === category)
}