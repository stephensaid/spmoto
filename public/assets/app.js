/* ============================================================
   SP MOTOR KIOSK — Application Logic
   ============================================================ */

// ============================================================
// CONFIG — toggle these to change behaviour
// ============================================================
const CONFIG = {
  // Set to true to randomise the gallery order on every page load
  shuffleGallery: true,
};

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  renderPartners();
  renderGallery();
});

// ============================================================
// QR Modal
// ============================================================
const qrModal = document.getElementById("qr-modal");

function openQRModal() {
  qrModal.classList.add("is-open");
}

function closeQRModal() {
  qrModal.classList.remove("is-open");
}

// ============================================================
// Partner / iFrame View
// ============================================================
const mainView = document.getElementById("main-view");
const iframeView = document.getElementById("iframe-view");
const partnerIframe = document.getElementById("partner-iframe");
const header = document.getElementById("dynamic-header");
const footerHint = document.getElementById("footer-hint");
const headerBackBtn = document.getElementById("header-back-btn");

function openPartner(url) {
  mainView.style.opacity = "0";

  setTimeout(() => {
    mainView.style.display = "none";
    iframeView.style.opacity = "0";
    iframeView.style.display = "flex";
    footerHint.textContent = "Tap to return to menu";
    header.classList.add("is-bar");

    setTimeout(() => {
      iframeView.style.opacity = "1";
      headerBackBtn.classList.add("is-visible");
      partnerIframe.src = url;
    }, 500);
  }, 300);
}

function closePartner() {
  if (iframeView.style.display !== "flex") return;

  iframeView.style.opacity = "0";
  headerBackBtn.classList.remove("is-visible");

  setTimeout(() => {
    iframeView.style.display = "none";
    partnerIframe.src = "";
    footerHint.textContent = "Visit us online";
    header.classList.remove("is-bar");
    mainView.style.display = "";
    mainView.style.opacity = "0";

    setTimeout(() => {
      mainView.style.opacity = "1";
    }, 500);
  }, 300);
}

// ============================================================
// Gallery
// ============================================================
const GRAY_SHADES = [
  { bg: "#e5e7eb", dark: false },
  { bg: "#d1d5db", dark: false },
  { bg: "#9ca3af", dark: false },
  { bg: "#6b7280", dark: true },
  { bg: "#4b5563", dark: true },
  { bg: "#374151", dark: true },
  { bg: "#1f2937", dark: true },
  { bg: "#94a3b8", dark: true },
];

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&\s]+)/,
  );
  return match ? match[1] : null;
}

function renderPartners() {
  const container = document.getElementById("partners-list");
  if (!container || typeof partners === "undefined") return;

  partners.forEach((partner) => {
    const btn = document.createElement("button");
    btn.className = "partner-btn";
    btn.setAttribute("aria-label", `Open ${partner.name}`);
    btn.setAttribute("onclick", `openPartner('${partner.url}')`);
    btn.innerHTML = `
      <img src="${partner.logo}" alt="${partner.name}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <span class="partner-btn__fallback">${partner.name}</span>
    `;
    container.appendChild(btn);
  });
}

function renderGallery() {
  const container = document.getElementById("gallery-grid");
  container.innerHTML = "";

  if (typeof featuredItems === "undefined") {
    container.innerHTML =
      '<p style="color:red;text-align:center;padding:2.5rem;font-weight:700">Error: Could not load data.js — ensure the file is in the same folder.</p>';
    return;
  }

  featuredItems.forEach((item, index) => {
    const shade = GRAY_SHADES[index % GRAY_SHADES.length];
    const videoId = getYouTubeId(item.video);
    const thumbUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
    const display = item.image || thumbUrl;
    const isDark = display ? true : shade.dark;
    const titleCls = isDark
      ? "gallery-item__title--dark"
      : "gallery-item__title--light";

    let onclick, hoverText, badgeClass, badgeLabel, iconName;

    if (videoId) {
      onclick = `openLightbox(${index})`;
      hoverText = "Play Video";
      iconName = "play-circle";
      badgeClass = item.type === "product" ? "badge--product" : "badge--video";
      badgeLabel = item.type === "product" ? "Product" : "Video";
    } else if (item.type === "product") {
      onclick = `openPartner('${item.link}')`;
      hoverText = "View in Portal";
      iconName = "external-link";
      badgeClass = "badge--product";
      badgeLabel = "Product";
    } else {
      onclick = `openLightbox(${index})`;
      hoverText = "Enlarge Image";
      iconName = "zoom-in";
      badgeClass = "badge--gallery";
      badgeLabel = "Gallery";
    }

    const item_el = document.createElement("div");
    item_el.className =
      "gallery-item" + (display ? "" : " gallery-item--no-image");
    if (!display) item_el.style.setProperty("--item-bg", shade.bg);
    item_el.setAttribute("onclick", onclick);

    const iconColor = isDark ? "white" : "#1f2937";

    item_el.innerHTML = display
      ? `
      <span class="badge ${badgeClass}">${badgeLabel}</span>
      <img src="${display}" alt="${item.title}" class="gallery-item__img">
      <div class="gallery-item__overlay"></div>
      ${
        videoId
          ? `
        <div class="gallery-item__play">
          <div class="gallery-item__play-circle">
            <i data-lucide="play" style="width:1.75rem;height:1.75rem;color:white;margin-left:3px"></i>
          </div>
        </div>`
          : ""
      }
      <div class="gallery-item__info">
        <h3 class="gallery-item__title ${titleCls}">${item.title}</h3>
        <p class="gallery-item__action">${hoverText}</p>
      </div>
    `
      : `
      <span class="badge ${badgeClass}">${badgeLabel}</span>
      <i data-lucide="${iconName}" class="gallery-item__icon" style="width:2.5rem;height:2.5rem;color:${iconColor}"></i>
      <div class="gallery-item__info">
        <h3 class="gallery-item__title ${titleCls}">${item.title}</h3>
        <p class="gallery-item__action">${hoverText}</p>
      </div>
    `;

    container.appendChild(item_el);
  });

  lucide.createIcons();
}

// ============================================================
// Lightbox
// ============================================================
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxTotal = document.getElementById("lightbox-total");
const lightboxActionBtn = document.getElementById("lightbox-action-btn");

let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxView();
  lightboxModal.classList.add("is-open");
}

function closeLightbox() {
  lightboxModal.classList.remove("is-open");
  const iframe = document.getElementById("lightbox-video-iframe");
  iframe.src = "";
  iframe.style.display = "none";
}

function nextImage(event) {
  event.stopPropagation();
  if (!featuredItems?.length) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % featuredItems.length;
  updateLightboxView();
}

function prevImage(event) {
  event.stopPropagation();
  if (!featuredItems?.length) return;
  currentLightboxIndex =
    (currentLightboxIndex - 1 + featuredItems.length) % featuredItems.length;
  updateLightboxView();
}

function updateLightboxView() {
  if (!featuredItems?.length) return;

  const item = featuredItems[currentLightboxIndex];
  const realImage = document.getElementById("lightbox-real-image");
  const iframe = document.getElementById("lightbox-video-iframe");
  const placeholder = document.getElementById("lightbox-placeholder-icon");
  const videoId = getYouTubeId(item.video);

  lightboxCaption.textContent = item.title;
  lightboxCounter.textContent = currentLightboxIndex + 1;
  lightboxTotal.textContent = featuredItems.length;

  // Reset
  realImage.src = "";
  realImage.style.display = "none";
  iframe.src = "";
  iframe.style.display = "none";
  placeholder.style.display = "block";

  if (videoId) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.style.display = "block";
    placeholder.style.display = "none";
  } else if (item.image) {
    realImage.src = item.image;
    realImage.style.display = "block";
    placeholder.style.display = "none";
  }

  if (item.type === "product" && item.link && item.link !== "#") {
    lightboxActionBtn.style.display = "flex";
    lightboxActionBtn.onclick = (e) => {
      e.stopPropagation();
      closeLightbox();
      openPartner(item.link);
    };
  } else {
    lightboxActionBtn.style.display = "none";
    lightboxActionBtn.onclick = null;
  }
}
