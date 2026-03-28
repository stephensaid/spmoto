// Runs in the page's own JS context (MAIN world) before any page scripts.
// Intercepts document.cookie reads to always return consent as accepted,
// preventing the cookie banner from ever showing.
(function () {
  try {
    const CONSENT_COOKIE = "cookie-consent-settings=necessary%3Dtrue%26statistics%3Dtrue%26marketing%3Dtrue%26personalization%3Dtrue";

    const desc = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
    Object.defineProperty(document, "cookie", {
      get: function () {
        const real = desc.get.call(document);
        if (real.indexOf("cookie-consent-settings=") === -1) {
          return real ? real + "; " + CONSENT_COOKIE : CONSENT_COOKIE;
        }
        return real;
      },
      set: function (val) {
        desc.set.call(document, val);
      },
      configurable: true,
    });

    // Also write the real cookie so it persists across reloads
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    desc.set.call(document, "cookie-consent-settings=necessary%3Dtrue%26statistics%3Dtrue%26marketing%3Dtrue%26personalization%3Dtrue; expires=" + expires + "; path=/;");
  } catch (e) { /* blocked — safe to ignore */ }
})();
