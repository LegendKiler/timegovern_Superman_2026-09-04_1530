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
        intro: 'JSON (JavaScript Object Notation) is the standard data interchange format for modern web applications — nearly every API returns it, every configuration file uses it, and every major programming language can parse it natively. But JSON has a well-known human problem: minified JSON (the format APIs typically return) is a single line of thousands of characters with no indentation, making it essentially unreadable. A JSON formatter takes that minified string and re-emits it with proper indentation (typically 2 or 4 spaces) and line breaks, so you can actually see the structure of nested objects and arrays. It also serves a second critical purpose: validation. JSON has strict syntax rules — strings must use double quotes, trailing commas are forbidden, and comments are not allowed. A single missing comma or stray character breaks the entire document, and a formatter will pinpoint exactly where the parser failed.',
    howToUse: [
      'Paste your JSON string into the input box — either minified or already formatted.',
      'Click Run Tool to validate and reformat it with proper indentation.',
      'If your JSON is invalid, the error message will point to the exact position of the problem.',
      'Click Copy to place the formatted result on your clipboard.',
    ],
    useCases: [
      'Debugging API responses by reformatting minified JSON into a readable structure.',
      'Validating configuration files (package.json, tsconfig.json, etc.) before committing.',
      'Preparing JSON payloads for documentation or code review with readable indentation.',
      'Finding a missing comma or unclosed bracket in a large nested data structure.',
    ],
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
        intro: 'Text case conversion is a deceptively useful utility — what looks like a trivial transformation hides a set of real use cases in programming, publishing, and data cleanup. Developers need to convert between naming conventions: camelCase for JavaScript variables, snake_case for Python and database columns, kebab-case for CSS classes and URLs, PascalCase for class names and components, and CONSTANT_CASE for environment variables. Content editors and publishers need sentence case (Only the first letter of each sentence is capitalized), Title Case (Every Major Word Capitalized, per AP/Chicago style rules), and lowercase/uppercase toggling for headings and accessibility labels. This tool handles all of them in one click, with proper word-boundary detection so that camelCase and snake_case inputs both convert correctly regardless of which format you start in.',
    howToUse: [
      'Paste or type the text you want to convert into the input box.',
      'Choose the target case from the tab row — camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, Title Case, Sentence case, or UPPER/lower.',
      'Click Run Tool to see the converted output.',
      'Click Copy to place it on your clipboard.',
    ],
    useCases: [
      'Converting variable names when porting code between languages with different naming conventions.',
      'Generating CSS class names or URL slugs from human-readable labels.',
      'Normalizing database column names from camelCase to snake_case during schema migration.',
      'Fixing inconsistent capitalization in content before publication (title case, sentence case).',
    ],
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
        intro: 'Character counting matters wherever text meets a hard limit — social media posts (Twitter/X allows 280 characters, Threads 500, LinkedIn 3,000, Instagram 2,200 captions), SMS messages (160 characters per segment before splitting), meta descriptions for SEO (Google truncates around 155-160), title tags (60), and database columns. The subtlety is that \'character\' means different things in different contexts: JavaScript\'s String.length counts UTF-16 code units, which means an emoji like 😀 counts as 2, and CJK characters sometimes count as 1 but display as 2 in fixed-width fonts. A good character counter shows the raw count, the count excluding whitespace, the word count, and often the byte count (UTF-8). This tool shows all of them at once so you know exactly how much of a limit you are using.',
    howToUse: [
      'Paste or type your text into the input box.',
      'The counters update as you type — characters (with and without spaces), words, sentences, paragraphs, and UTF-8 bytes.',
      'Use the character count to stay under social media limits, meta description limits, or database column caps.',
      'Use the word count for essay or article length targets.',
    ],
    useCases: [
      'Checking that a tweet, post, or caption fits within the platform\'s character limit.',
      'Verifying a meta description fits within Google\'s 155-160 character display cutoff.',
      'Confirming a title tag stays under 60 characters so it does not truncate in search results.',
      'Validating SMS text message length against the 160-character segment boundary.',
    ],
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
        intro: 'A URL slug is the human-readable, hyphenated identifier at the end of a URL — the \'what-is-a-slug\' in \'example.com/blog/what-is-a-slug\'. Good slugs matter for two reasons. First, SEO: Google reads the slug as a keyword signal, so \'how-to-calculate-mortgage-payments\' ranks better for those terms than \'page-12345\'. Second, usability: users can guess or share URLs by reading them, and slugs increase trust in shared links. Generating a slug correctly is surprisingly tricky: you need to lowercase everything, strip diacritics (é to e, ñ to n), replace whitespace and most punctuation with hyphens, collapse repeated hyphens, strip leading and trailing hyphens, and encode anything remaining. Non-Latin scripts (Chinese, Arabic, Cyrillic) either transliterate to ASCII or use percent-encoding, depending on the platform.',
    howToUse: [
      'Paste your page title or article heading into the input box.',
      'Click Run Tool to generate a URL-safe slug.',
      'The output is lowercase, hyphen-separated, and stripped of punctuation and diacritics.',
      'Click Copy to use the slug in your CMS, blog URL, or router.',
    ],
    useCases: [
      'Generating SEO-friendly URL slugs from article titles in a blog or CMS.',
      'Creating readable anchor links for documentation headings.',
      'Producing filenames from descriptive titles without forbidden characters.',
      'Normalizing existing URLs that contain spaces, uppercase letters, or special characters.',
    ],
    faqs: [
      { q: 'What is a slug?', a: 'The part of a URL that identifies a page in human-readable form. my-website.com/how-to-bake-bread has slug "how-to-bake-bread".' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'How to Bake Bread in 10 Minutes!' }],
    transform: (f) => f.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    outputType: 'text' },

  { slug: 'reverse-text', name: 'Text Reverser', category: 'text',
    description: 'Reverse any text — characters, words, or lines.',
        intro: 'Reversing text is one of those \'why would anyone need this\' utilities that turns out to have genuine applications across education, debugging, and cryptography puzzles. The technical challenge is that naive reversal breaks UTF-16 surrogate pairs — the emoji 😀 is stored as two code units, and reversing character-by-character produces garbage. A correct implementation reverses by grapheme cluster so that emoji, accented letters, and combining characters remain intact. On top of that, the useful variants matter: \'reverse the whole string\' (used for palindrome tests), \'reverse each word but keep word order\' (used in some word games and test datasets), \'reverse word order but keep each word intact\' (used for sentence-level manipulation), and \'reverse each line separately\' (useful for diffing reversed log files). This tool gives you all four plus grapheme-safe handling.',
    howToUse: [
      'Paste or type the text you want to reverse into the input box.',
      'Choose the reversal mode: whole string, each word, word order, or line-by-line.',
      'Click Run Tool to see the result.',
      'Click Copy to place the output on your clipboard.',
    ],
    useCases: [
      'Testing whether a string is a palindrome (compare original to reversed).',
      'Fixing reversed or mirrored text pasted from apps with display bugs.',
      'Generating word puzzles and children\'s educational exercises.',
      'Debugging sort or string-slicing logic by reversing intermediate values.',
    ],
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
        intro: 'A Unix timestamp (also called Unix time, POSIX time, or epoch time) is the number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970 — the \'Unix epoch\'. It is the universal internal time format for nearly every operating system, database, and programming language, because it is just an integer that can be compared and sorted with no timezone ambiguity. When you see 1735689600 in a log file or database row, that is January 1, 2025 at midnight UTC. The subtlety that trips up developers is the units: JavaScript uses milliseconds for Date.now(), while most servers use seconds — so a timestamp in the wrong unit becomes a date in 1970 (if you forgot to multiply) or 50000+ (if you forgot to divide). This converter handles both units and shows the corresponding ISO 8601 and human-readable forms.',
    howToUse: [
      'Paste a Unix timestamp (seconds or milliseconds) into the input box to convert it to a human-readable date.',
      'Or click Run Tool to get the current time as a Unix timestamp.',
      'The output shows the corresponding ISO 8601 format, UTC time, and your local time.',
      'Click Copy to place the converted value on your clipboard.',
    ],
    useCases: [
      'Debugging log files and database rows where dates are stored as Unix timestamps.',
      'Converting between seconds and milliseconds to fix \'wrong year\' bugs in JavaScript.',
      'Generating future timestamps for testing scheduled jobs, token expiry, or cache TTLs.',
      'Verifying that a system clock is set correctly by comparing current time to expected value.',
    ],
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
        intro: 'Number base conversion translates numbers between the representations used in different contexts: binary (base 2, used by every digital circuit), octal (base 8, historically used in Unix file permissions), decimal (base 10, the human default), hexadecimal (base 16, ubiquitous in programming for memory addresses, color codes, and byte representations), and occasionally bases 32 and 36 for compact encoding. In programming, understanding base conversion means understanding the difference between a value and its representation: the number 255 is the same value whether you write it as 255, 0xFF, or 0b11111111 — but the different representations have different uses. Hex is preferred for bytes because each hex digit maps to exactly 4 bits, so a byte is always two hex digits. Binary makes bit-level operations easy to visualize. This tool converts any number between bases 2 through 36, with proper digit validation.',
    howToUse: [
      'Enter the number you want to convert into the input box.',
      'Select the source base (the format your input is currently in).',
      'Select the target base — binary, octal, decimal, hex, or any base from 2 to 36.',
      'Click Run Tool to see the converted result.',
    ],
    useCases: [
      'Converting between hex color codes (FF5733) and decimal RGB values (255, 87, 51).',
      'Understanding Unix file permissions by converting between octal (755) and binary (111 101 101).',
      'Debugging memory addresses and byte-level operations by reading hex representations.',
      'Learning how number bases work by comparing the same value across formats.',
    ],
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
        intro: 'Roman numerals — I, V, X, L, C, D, M — are the number system used throughout the Roman Empire and, remarkably, still used today in contexts where tradition outweighs practicality: book chapters, movie sequel titles, Super Bowl numbers, papal encyclicals, clock faces, and outlines. The system is additive and subtractive: a smaller numeral before a larger one subtracts (IV = 4, IX = 9), and after it adds (VI = 6, XI = 11). Only seven characters are needed for numbers 1 through 3,999, with subtractions limited to specific patterns (IV, IX, XL, XC, CD, CM) — a rule that many people find counterintuitive. Above 3,999, standard Roman numerals no longer have a representation (medieval variants used overlines and other markings that are not in modern usage). This converter handles both directions and validates against standard construction rules.',
    howToUse: [
      'Enter a number (1-3999) or a Roman numeral into the input box.',
      'Choose the conversion direction — number to Roman, or Roman to number.',
      'Click Run Tool to see the result.',
      'Click Copy to place the output on your clipboard.',
    ],
    useCases: [
      'Converting chapter or section numbers for a document that uses Roman numerals.',
      'Reading old book copyright dates or movie copyright years written in Roman numerals.',
      'Teaching the Roman numeral system or checking homework answers.',
      'Generating stylized numeric text for titles, wedding invitations, or tattoos.',
    ],
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
        intro: 'Binary is the native language of every digital computer — all data in memory and on disk is ultimately a sequence of 0s and 1s. Text-to-binary conversion replaces each character with its numeric code point in a chosen encoding, then renders that code point in base-2. This tool uses UTF-8 by default, which is what the entire modern web uses: ASCII characters (A-Z, a-z, 0-9, punctuation) each take 8 bits (one byte), so \'Hi\' becomes 01001000 01001001. Non-ASCII characters expand — accented letters take 16 bits, CJK characters take 24, and emoji take 32. That is why UTF-8 is called variable-width encoding. Binary output is useful for teaching how computers store text, for debugging low-level protocols where you need to see exact byte patterns, and for verifying that data has been transmitted without corruption. It is not practical for humans to read binary text at scale — hex is the standard intermediate representation for that.',
    howToUse: [
      'Paste the text you want to convert into the input box.',
      'Select Binary as the output format (or use Text mode to convert binary back to text).',
      'Click Run Tool — each character appears as an 8-bit (or more for UTF-8) binary sequence.',
      'Click Copy to place the binary string on your clipboard.',
    ],
    useCases: [
      'Teaching how computers encode text by showing the binary behind each letter.',
      'Verifying bit patterns in low-level network protocol debugging.',
      'Learning UTF-8 encoding rules by observing how multi-byte characters expand.',
      'Preparing data for puzzles, escape rooms, or educational demonstrations.',
    ],
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
        intro: 'Hex encoding is the standard binary-to-text format for displaying raw bytes as human-readable strings. Each byte (8 bits) becomes exactly two hex digits (00-FF), making hex the most compact way to represent binary data in a text file while keeping the mapping unambiguous and bijective. Unlike Base64, which packs bits more efficiently but obscures byte boundaries, hex preserves the exact byte structure — if you know the byte layout of a file format, hex lets you read it directly. This is why hex is the default hex-dump format in every hex editor, memory debugger, and packet analyzer. Text-to-hex conversion encodes each character\'s UTF-8 bytes into two-digit hex pairs, typically space-separated for readability. It is essential for verifying hash outputs, inspecting binary file headers (magic numbers), debugging encoding issues, and constructing byte-level payloads for network protocols.',
    howToUse: [
      'Paste the text you want to convert into the input box.',
      'Select Hex as the output format.',
      'Click Run Tool — each character\'s UTF-8 bytes appear as hex pairs.',
      'Click Copy to place the hex string on your clipboard.',
    ],
    useCases: [
      'Inspecting the exact byte values behind a text string when debugging encoding issues.',
      'Verifying hash or checksum outputs at the byte level.',
      'Building payloads for binary protocols that expect hex-encoded data.',
      'Confirming that text you copied contains ASCII characters and not Unicode look-alikes.',
    ],
    faqs: [
      { q: 'What is hex encoding?', a: 'Each character is converted to its byte value and displayed in base-16 (00-FF). Used in debugging, cryptography, and low-level programming.' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'Hello' }],
    transform: (f) => bytesToHex(f.text),
    outputType: 'textarea' },

  { slug: 'hex-to-text', name: 'Hex to Text', category: 'convert',
    description: 'Convert hexadecimal bytes back to readable text.',
        intro: 'The reverse of text-to-hex: converting hex-encoded strings back to readable text. Hex input can be formatted with or without spaces (48656c6c6f vs 48 65 6c 6c 6f), with or without the 0x prefix on each byte, and sometimes with newlines every 16 or 32 bytes for legacy hex dumps. This tool accepts all common formats and decodes the hex pairs back into their byte values, then interprets those bytes as UTF-8 text. That decoding step is where problems happen: if the hex represents bytes that are not valid UTF-8 (for example, the raw bytes of a PNG file or encrypted data), the text output will contain replacement characters (U+FFFD) where UTF-8 decoding fails. If you need to preserve arbitrary binary data, use Base64 instead of hex-text conversion. Hex-to-text is the right tool for recovering human-readable strings that were encoded to hex, not for decoding binary files.',
    howToUse: [
      'Paste the hex string into the input box (spaces and 0x prefixes are ignored).',
      'Click Run Tool to decode the hex bytes as UTF-8 text.',
      'The output shows the readable text form.',
      'Click Copy to place the result on your clipboard.',
    ],
    useCases: [
      'Recovering readable strings from hex-encoded configuration values or log entries.',
      'Decoding hex output from network captures or memory dumps to see what text was transmitted.',
      'Inspecting hex-encoded strings in URLs, cookies, or headers.',
      'Debugging applications that return hex-encoded error messages.',
    ],
    faqs: [
      { q: 'Does it handle spaces?', a: 'Yes. Both "48 65 6c 6c 6f" and "48656c6c6f" formats are accepted.' },
    ],
    fields: [{ id: 'text', label: 'Hex bytes', type: 'textarea', placeholder: '48 65 6c 6c 6f' }],
    transform: (f) => hexToBytes(f.text),
    outputType: 'textarea' },

  { slug: 'color-converter', name: 'Color Converter', category: 'convert',
    description: 'Convert between HEX, RGB, and HSL color formats.',
        intro: 'Colors are represented differently across design and development tools, and conversion between those formats is a daily need for anyone working across the boundary. Hex codes (#FF5733) dominate CSS and design tools, but they only support RGB and are unintuitive to adjust for brightness or hue. RGB (255, 87, 51) is the raw channel form underlying hex and is what most graphics APIs consume. HSL (hue, saturation, lightness) is much easier to reason about — \'make this 10% darker\' is a single HSL lightness adjustment — which is why CSS preprocessors use it for theming. Modern CSS also supports OKLCH, which is perceptually uniform and generates better color ramps than HSL. This converter takes any of these formats and produces all the others, including the CSS variable syntax (rgb(), hsl(), oklch()) ready to paste into stylesheets.',
    howToUse: [
      'Enter a color in any supported format — hex, RGB, HSL, or CSS function notation.',
      'Click Run Tool to see the color in all other formats.',
      'Each output is ready to paste into CSS, JavaScript, or design tool inputs.',
      'Click Copy next to any format to copy that specific representation.',
    ],
    useCases: [
      'Converting a designer\'s hex color into CSS hsl() syntax for theme generation.',
      'Adjusting a color\'s lightness or saturation by converting between hex and HSL.',
      'Extracting RGB channel values to feed into a graphics library or canvas API.',
      'Generating ready-to-paste CSS variable declarations from a single color.',
    ],
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
        intro: 'The Caesar cipher is one of the oldest encryption methods in recorded history — Julius Caesar reportedly used a shift of 3 to protect military messages. The scheme is trivially simple: every letter in the plaintext is shifted a fixed number of positions in the alphabet. \'Hello\' with a shift of 3 becomes \'Khoor\'. Because the shift is fixed and there are only 25 possible non-zero shifts, breaking a Caesar cipher takes a computer microseconds — you just try all 25 shifts and pick the one that produces readable text. That is why it is useless for real security and why it appears in two legitimate contexts today: as the first encryption scheme taught in every cryptography course (it introduces the substitution cipher family), and as a very weak obfuscation layer in puzzle games, CTF challenges, and hide-the-spoiler tricks. This tool handles both encryption and decryption with any shift value, and preserves case and punctuation correctly.',
    howToUse: [
      'Enter the text to encrypt or decrypt into the input box.',
      'Enter the shift amount (a number from 1 to 25).',
      'Select Encrypt to apply the shift forward, or Decrypt to reverse it.',
      'Click Run Tool to see the result, then Copy to use it.',
    ],
    useCases: [
      'Teaching cryptography fundamentals with a substitution cipher learners can break by hand.',
      'Solving puzzle hunts and escape room challenges that use Caesar shifts.',
      'Obfuscating spoilers in forums or chat rooms where casual readers should not see the answer.',
      'Learning how frequency analysis breaks weak ciphers by experimenting with shifts.',
    ],
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
        intro: 'ROT13 is a special case of the Caesar cipher with a fixed shift of 13. Its defining property is that encryption and decryption are the same operation — applying ROT13 twice returns the original text unchanged, because 13 + 13 = 26 = full rotation. That self-inverse property is why ROT13 is not really used for security at all; it is used for casual obfuscation that you can undo just as easily as apply. Common use cases include hiding spoilers, puzzle answers, or movie endings in online forums (traditional Usenet and many modern forums have built-in ROT13 toggles for exactly this reason), encoding jokes so they do not spoil the punchline in chat previews, and lightly obfuscating content that is not sensitive but that you want a human to actively choose to reveal. Never use ROT13 for anything requiring actual security — the shift of 13 is public knowledge and the entire scheme is fully reversible.',
    howToUse: [
      'Paste the text you want to encode or decode into the input box.',
      'Click Run Tool — the same button does both, since ROT13 is self-inverse.',
      'Click Copy to place the result on your clipboard.',
      'The same operation undoes itself: run the output through again to recover the original.',
    ],
    useCases: [
      'Hiding spoilers for movies, books, or games in discussion forums.',
      'Encoding puzzle answers so they do not spoil for other solvers.',
      'Obfuscating jokes or punchlines in chat contexts with preview snippets.',
      'Teaching rotation ciphers and demonstrating a self-inverse encryption scheme.',
    ],
    faqs: [
      { q: 'What is ROT13?', a: 'A special case of the Caesar cipher with shift 13. Since 13 is half of 26, applying it twice returns the original text. Used in forums to hide spoilers.' },
    ],
    fields: [{ id: 'text', label: 'Text', type: 'textarea', placeholder: 'Hello World' }],
    transform: (f) => f.text.replace(/[a-z]/gi, c => String.fromCharCode((c.charCodeAt(0) - (c >= 'a' ? 97 : 65) + 13) % 26 + (c >= 'a' ? 97 : 65))),
    outputType: 'textarea' },

  { slug: 'text-to-morse', name: 'Text to Morse Code', category: 'convert',
    description: 'Convert text to Morse code (and back).',
        intro: 'Morse code is a character encoding scheme that represents each letter and digit as a sequence of short signals (dots) and long signals (dashes), separated by gaps. Invented by Samuel Morse and Alfred Vail in the 1830s for telegraphy, it was the first practical way to transmit text over long distances via electrical wires, and it remains in active use in aviation (VOR navigation beacons identify themselves with 2-3 letter Morse IDs), amateur radio, and emergency signaling. The design is deliberately variable-length: the most common English letters got the shortest codes (E is one dot, T is one dash) to minimize transmission time — an early form of data compression. International Morse Code uses a standard mapping for A-Z, 0-9, punctuation, and a handful of procedural signals (SOS, AR, SK). This tool converts to and from standard International Morse Code.',
    howToUse: [
      'Paste the text you want to convert into the input box.',
      'Select Text→Morse to encode or Morse→Text to decode.',
      'Click Run Tool — each character appears as dots and dashes separated by spaces.',
      'Click Copy to place the Morse string on your clipboard.',
    ],
    useCases: [
      'Learning Morse code by listening to or reading encoded messages.',
      'Decoding aviation VOR identifiers or other Morse-based navigation signals.',
      'Preparing Morse code for ham radio practice, emergency signaling drills, or puzzles.',
      'Translating SOS and other distress signals for education or storytelling.',
    ],
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
        intro: 'HTTP status codes are the three-digit numbers that a web server returns with every response to signal what happened to the request. They are grouped into five classes by their first digit: 1xx (informational — the request is being processed), 2xx (success — the request completed), 3xx (redirect — the resource moved, follow the Location header), 4xx (client error — you sent something wrong), and 5xx (server error — the server failed, your request was fine). Each code has a defined semantic meaning standardized by IETF RFCs — 200 OK, 404 Not Found, 500 Internal Server Error are the ones most people know, but there are around 60 defined codes in common use and another 40+ that are registered but rarely seen. Understanding what a status code means — and what the server is trying to tell you — is foundational for API development, debugging, SEO work (redirect codes affect how search engines treat moved pages), and web performance monitoring.',
    howToUse: [
      'Browse the reference list grouped by class (1xx, 2xx, 3xx, 4xx, 5xx).',
      'Each entry shows the code, its canonical name, and what it means.',
      'Use your browser\'s developer tools to inspect response headers and see which codes your own site returns.',
      'Bookmark this page for quick reference during API debugging.',
    ],
    useCases: [
      'Debugging API integrations by looking up what a specific status code means.',
      'Auditing your own site\'s redirect behavior (301 vs 302 vs 307 vs 308 have distinct SEO implications).',
      'Choosing the correct status code when building a new API endpoint.',
      'Understanding cache behavior by distinguishing 200, 304, and 404 responses.',
    ],
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
        intro: 'A URL is a strictly defined string format (RFC 3986), but the visual structure hides a lot of complexity — a URL like https://user:pass@api.example.com:8443/v1/users?id=42&sort=desc#section contains up to six components with special rules for each. The scheme (https) identifies the protocol; the authority (user:pass@host:port) contains credentials and the host:port pair; the path (/v1/users) identifies a resource on the server; the query string (?id=42&sort=desc) is a set of key-value pairs; and the fragment (#section) is client-side-only and never sent to the server (a common source of bugs when developers expect it server-side). Each component has its own encoding rules — query values must percent-encode special characters, but path segments have a slightly different allowed character set. Parsing URLs by hand with regular expressions almost always introduces bugs; the correct approach is to use a proper parser like this one.',
    howToUse: [
      'Paste a full URL into the input box.',
      'Click Run Tool to see the URL broken into its components.',
      'Inspect the scheme, authority, path, query parameters, and fragment.',
      'Click Copy next to any component to extract it for use in code.',
    ],
    useCases: [
      'Extracting a specific query parameter from a URL for programmatic use.',
      'Debugging why a redirect URI does not match a pre-registered OAuth callback URL.',
      'Confirming which part of a URL is the fragment (client-only) versus the query string (sent to server).',
      'Understanding how the browser parses a complex URL with credentials, port numbers, and encoded characters.',
    ],
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
        intro: 'A text diff tool compares two versions of a document and highlights exactly what changed — additions, deletions, and modifications — in the same way that Git, code review tools, and Wikipedia\'s edit history do. The underlying algorithm (typically Myers\' diff or a variant) finds the longest common subsequence between the two texts and marks everything outside that subsequence as a change. Diff is essential for any workflow where content is edited over time: catching accidental changes when copy-editing, verifying that a translation matches the source structure, comparing configuration files between environments, or auditing what an AI tool changed in your draft. This tool shows the diff at the character, word, or line level, so you can dial in the granularity that matters for your use case.',
    howToUse: [
      'Paste the original text into the first box and the modified text into the second box.',
      'Choose the comparison mode: character, word, or line level.',
      'Click Run Tool to see the differences highlighted — additions in green, deletions in red.',
      'Click Copy to save the diff output for documentation or further analysis.',
    ],
    useCases: [
      'Comparing two versions of a contract, policy, or article before publishing.',
      'Auditing what an AI writing tool changed in your draft.',
      'Verifying that configuration files differ only in the intended fields.',
      'Learning what a translation changed from the source sentence structure.',
    ],
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