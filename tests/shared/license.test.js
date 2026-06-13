const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { loadSourceFiles, resetStorage, setStorageData, getStorageData } = require('../setup');

// Helper to create a mock JWT token
function createMockJWT(payload, expiresInSeconds = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  // Note: signature is fake, but we don't verify it client-side
  return `${encode(header)}.${encode(fullPayload)}.fake-signature`;
}

describe('License', () => {
  let context;
  let fetchCalls;
  let fetchResponse;

  beforeEach(() => {
    resetStorage();
    fetchCalls = [];
    fetchResponse = { ok: true, status: 200, json: async () => ({}) };

    // Load config first, then license
    context = loadSourceFiles(['shared/config.js', 'shared/license.js'], {
      fetch: async (url, options) => {
        fetchCalls.push({ url, options });
        return fetchResponse;
      },
      Auth: {
        signOut: async () => {
          resetStorage();
        },
      },
      recordEvent: () => {}, // Mock analytics
    });
  });

  describe('_decodeToken', () => {
    it('should decode a valid JWT payload', () => {
      const token = createMockJWT({ email: 'test@example.com', premium: true });
      const decoded = context.License._decodeToken(token);

      assert.strictEqual(decoded.email, 'test@example.com');
      assert.strictEqual(decoded.premium, true);
      assert.ok(decoded.exp > 0);
    });

    it('should return null for invalid token', () => {
      assert.strictEqual(context.License._decodeToken('invalid'), null);
      assert.strictEqual(context.License._decodeToken(''), null);
      assert.strictEqual(context.License._decodeToken(null), null);
      assert.strictEqual(context.License._decodeToken(undefined), null);
    });

    it('should handle base64url encoding', () => {
      // Create token with characters that differ between base64 and base64url
      const token = createMockJWT({ email: 'test+special@example.com', data: '>>>' });
      const decoded = context.License._decodeToken(token);
      assert.strictEqual(decoded.email, 'test+special@example.com');
    });
  });

  // Fork modification (RYS Libre): the paywall is removed, so premium status is
  // unconditional. These tests assert the new free-fork contract — every user is
  // premium regardless of token, sign-in, or expiry — rather than the upstream
  // paid-gating behavior they replaced.
  describe('isPremium (paywall removed)', () => {
    it('should return true when no license token exists', async () => {
      const result = await context.License.isPremium();
      assert.strictEqual(result, true);
    });

    it('should return true for valid premium token', async () => {
      const token = createMockJWT({ email: 'test@example.com', premium: true });
      setStorageData({ license_token: token });

      const result = await context.License.isPremium();
      assert.strictEqual(result, true);
    });

    it('should return true even for a non-premium token', async () => {
      const token = createMockJWT({ email: 'test@example.com', premium: false });
      setStorageData({ license_token: token });

      const result = await context.License.isPremium();
      assert.strictEqual(result, true);
    });

    it('should return true even for an expired token', async () => {
      const token = createMockJWT({ email: 'test@example.com', premium: true }, -3600); // expired 1hr ago
      setStorageData({ license_token: token });

      const result = await context.License.isPremium();
      assert.strictEqual(result, true);
    });

    it('isPremiumSync should return true for any input', () => {
      assert.strictEqual(context.License.isPremiumSync(null), true);
      assert.strictEqual(context.License.isPremiumSync('garbage'), true);
    });

    it('getTierSync should always be the premium tier', () => {
      assert.strictEqual(context.License.getTierSync(null, null), context.TIER.PREMIUM);
    });
  });

  // Fork modification (RYS Libre): checkLicense is short-circuited to always
  // report premium and never touch the network, so the upstream caching / fetch
  // / 401-signout / offline-fallback paths no longer apply.
  describe('checkLicense (paywall removed)', () => {
    it('should report premium without any network call when not signed in', async () => {
      const result = await context.License.checkLicense();

      assert.strictEqual(result.isPremium, true);
      assert.strictEqual(result.source, null);
      assert.strictEqual(fetchCalls.length, 0); // Never contacts the server
    });

    it('should report premium even with no stored tokens', async () => {
      resetStorage();
      const result = await context.License.checkLicense();

      assert.strictEqual(result.isPremium, true);
      assert.strictEqual(fetchCalls.length, 0);
    });

    it('should never contact the server, even with forceRefresh', async () => {
      setStorageData({
        session_token: 'session-token',
        license_token: createMockJWT({ email: 'test@example.com', premium: false }, -3600),
      });

      const result = await context.License.checkLicense(true);

      assert.strictEqual(result.isPremium, true);
      assert.strictEqual(fetchCalls.length, 0); // No fetch even when forced
    });
  });
});
