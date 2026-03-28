// SP Motor Kiosk — Cookie Banner Suppressor
// Hides cookie consent overlays so partner sites are usable in the kiosk iframe.

const COOKIE_SELECTORS = [
  // bootstrap-cookie-consent-settings (Omnia Racing)
  "#bootstrapCookieConsentSettingsModal",
  ".modal-backdrop",
  // OneTrust
  "#onetrust-consent-sdk",
  "#onetrust-banner-sdk",
  // Cookiebot
  "#CybotCookiebotDialog",
  "#CybotCookiebotDialogBodyUnderlay",
  // CookieScript
  "#cookiescript_injected",
  "#cookiescript_injected_wrapper",
  // Cookie Control (Civic)
  "#ccc",
  "#ccc-overlay",
  // CookieLaw / GDPR Cookie Consent (WP plugin)
  "#cookie-law-info-bar",
  "#cookie-law-info-again",
  // Cookie Notice (WP plugin)
  "#cookie-notice",
  // Cookieconsent (osano)
  ".cc-window",
  ".cc-banner",
  // Privacy popup generic
  ".cookie-banner",
  ".cookie-notice",
  ".cookie-consent",
  ".cookie-overlay",
  ".cookie-popup",
  ".gdpr-banner",
  ".gdpr-popup",
  ".gdpr-overlay",
  ".consent-banner",
  ".consent-overlay",
  ".consent-popup",
  // Body scroll lock sometimes added alongside
].join(",");

let dismissed = false;

function hideBanners() {
  if (dismissed) return;

  const els = document.querySelectorAll(COOKIE_SELECTORS);
  if (els.length === 0) return;

  // Hide the banners without clicking — clicking triggers page reloads
  dismissed = true;
  observer.disconnect();

  els.forEach((el) => el.style.setProperty("display", "none", "important"));

  // Remove Bootstrap modal body lock
  if (document.body) {
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
  }
  if (document.documentElement) {
    document.documentElement.style.removeProperty("overflow");
  }
}

// Run once DOM is ready, then observe for dynamically injected banners
const observer = new MutationObserver(hideBanners);
observer.observe(document.documentElement, { childList: true, subtree: true });
hideBanners();
