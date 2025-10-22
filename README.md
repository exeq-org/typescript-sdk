# Exeq TypeScript SDK

Official TypeScript/JavaScript SDK for the Exeq browser automation platform. Create and manage remote browser sessions with a simple, clean API.

## Installation

```bash
npm install @exeq/sdk
```

## Quick Start

```typescript
import { ExeqClient } from '@exeq/sdk';

const client = new ExeqClient({
  apiKey: 'your-api-key'
});

// Create a browser session
const session = await client.createSession({
  sessionRecordingEnabled: true
});

console.log('Session created:', session.id);
console.log('Connect via CDP:', session.cdpUrl);
console.log('Connect via VNC:', session.vncUrl);

// Stop the session when done
await client.stopSession(session.id);
```

## Authentication

Get your API key from the [Exeq Dashboard](https://app.exeq.dev) and initialize the client:

```typescript
const client = new ExeqClient({
  apiKey: 'exeq_your_api_key_here',
  baseUrl: 'https://api.exeq.dev' // optional, this is the default
});
```

## Session Management

### Create Session

Create a new browser session with optional configuration:

```typescript
const session = await client.createSession({
  duration: '1h',                    // Session duration (e.g., '30m', '2h')
  sessionRecordingEnabled: true,     // Record the session for playback
  profileId: 'profile-123',          // Use a specific browser profile
  residentialProxyEnabled: true,     // Use residential proxy
  residentialProxyCountry: 'US',     // Proxy country code
  residentialProxyState: 'CA',       // Proxy state (US only)
  residentialProxyCity: 'Los Angeles' // Proxy city
});
```

### Get Session

Retrieve details about an existing session:

```typescript
const session = await client.getSession('session-id');
console.log('Status:', session.status);
console.log('CDP URL:', session.cdpUrl);
```

### List Sessions

Get all your sessions with optional pagination:

```typescript
const sessions = await client.listSessions({
  limit: 10,    // Number of sessions to return
  offset: 0     // Offset for pagination
});
```

### Stop Session

Stop and delete a session:

```typescript
await client.stopSession('session-id');
```

### Extend Session

Extend the duration of an active session:

```typescript
const updatedSession = await client.extendSession('session-id', '30m');
```

## Profile Management

### List Profiles

Get all available browser profiles:

```typescript
const profiles = await client.listProfiles();
profiles.forEach(profile => {
  console.log(`${profile.name} (${profile.id})`);
});
```

### Get Profile

Get details about a specific profile:

```typescript
const profile = await client.getProfile('profile-id');
```

## Connecting to Sessions

Once you create a session, you can connect to it using:

### Chrome DevTools Protocol (CDP)

```typescript
import { chromium } from 'playwright';

const session = await client.createSession();
const browser = await chromium.connectOverCDP(session.cdpUrl);

const page = await browser.newPage();
await page.goto('https://example.com');
```

### VNC (Visual Access)

```typescript
// Use any VNC client with the provided credentials
console.log('VNC URL:', session.vncUrl);
console.log('VNC Password:', session.vncPassword);
```

## TypeScript Types

The SDK includes full TypeScript support with these main types:

```typescript
interface Session {
  id: string;
  status: 'creating' | 'queued' | 'active' | 'stopping' | 'stopped' | 'failed';
  cdpUrl: string;
  vncUrl: string;
  vncPassword: string;
  expiresAt: string | null;
  createdAt: string;
  sessionRecordingEnabled?: boolean;
  sessionRecordingUrl?: string | null;
  residentialProxyEnabled?: boolean;
}

interface CreateSessionOptions {
  duration?: string;
  sessionRecordingEnabled?: boolean;
  profileId?: string;
  residentialProxyEnabled?: boolean;
  residentialProxyCountry?: string;
  residentialProxyState?: string;
  residentialProxyCity?: string;
}

interface Profile {
  id: string;
  name: string;
  createdAt: string;
}
```

## Error Handling

The SDK throws standard JavaScript errors. Wrap calls in try-catch blocks:

```typescript
try {
  const session = await client.createSession();
  // Use session...
} catch (error) {
  console.error('Failed to create session:', error.message);
}
```

## Examples

### Session Recording

```typescript
import * as fs from 'fs';
import * as https from 'https';

const session = await client.createSession({
  sessionRecordingEnabled: true,
  duration: '10m'
});

// After your automation...
const updatedSession = await client.getSession(session.id);
if (updatedSession.sessionRecordingUrl) {
  console.log('Recording available:', updatedSession.sessionRecordingUrl);
  
  // Download the recording
  const file = fs.createWriteStream('session-recording.json');
  https.get(updatedSession.sessionRecordingUrl, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Recording downloaded to session-recording.json');
    });
  });
}
```

## Support

- Documentation: [docs.exeq.dev](https://docs.exeq.dev)
- Dashboard: [app.exeq.dev](https://app.exeq.dev)
- Support: [support@exeq.dev](mailto:support@exeq.dev)

## License

MIT
