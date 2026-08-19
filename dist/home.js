/* Fashioni homepage — live Selldone catalog with an editorial fashion shell. */

import {
  loadCatalog, loadReviews, loadTaggedProductIds,
  money, img, swatchStyle, swatchLabel,
} from "./shop-data.js";
import { cardHTML, esc, saleBadgeHTML } from "./app.js";

const CATEGORY_ART = {
  108637: "activewear.png",
  108631: "bags-accessories.png",
  108622: "dresses-one-pieces.png",
  108633: "footwear.png",
  108624: "jackets-layers.png",
  108620: "shorts.png",
  108627: "sunglasses.png",
  108619: "tops-t-shirts.png",
};

const CAMPAIGNS = [
  {
    image: "assets/categories/activewear.png",
    alt: "Coordinated Fashioni activewear capsule",
    kicker: "Active essentials",
    title: "Move in your own rhythm.",
    titleLines: ["Move in your", "own rhythm."],
    lede: "Explore performance-minded layers, coordinated colors, and everyday comfort.",
    label: "Shop activewear",
    href: "shop.html?cat=activewear",
  },
  {
    image: "assets/categories/dresses-one-pieces.png",
    alt: "Fashioni dresses and one-piece styles",
    kicker: "One-step dressing",
    title: "Easy shapes, fresh color.",
    titleLines: ["Easy shapes,", "fresh color."],
    lede: "Discover dresses and one-pieces for everyday plans and dressed-up moments.",
    label: "Shop dresses",
    href: "shop.html?cat=dresses-one-pieces",
  },
  {
    image: "assets/categories/sunglasses.png",
    alt: "Fashioni sunglasses in varied frame shapes",
    kicker: "Sun-ready style",
    title: "Frame the look your way.",
    titleLines: ["Frame the look", "your way."],
    lede: "Browse classic and playful sunglasses for adults and kids.",
    label: "Shop sunglasses",
    href: "shop.html?cat=sunglasses",
  },
];

function initCampaigns() {
  const image = document.querySelector("[data-hero-img]");
  const kicker = document.querySelector("[data-campaign-kicker]");
  const title = document.querySelector("[data-campaign-title]");
  const lede = document.querySelector("[data-campaign-lede]");
  const link = document.querySelector("[data-hero-link]");
  const dots = document.querySelector("[data-campaign-dots]");
  if (!image || !dots) return;

  let active = 0;
  let timer;
  const paint = (index, restart = true) => {
    active = (index + CAMPAIGNS.length) % CAMPAIGNS.length;
    const item = CAMPAIGNS[active];
    image.src = item.image;
    image.alt = item.alt;
    kicker.textContent = item.kicker;
    title.innerHTML = item.titleLines.map((line) => `<span>${esc(line)}</span>`).join("");
    lede.textContent = item.lede;
    link.textContent = item.label;
    link.href = item.href;
    dots.querySelectorAll("button").forEach((button, i) => {
      button.setAttribute("aria-current", i === active ? "true" : "false");
    });
    if (restart) {
      clearInterval(timer);
      timer = setInterval(() => paint(active + 1, false), 6500);
    }
  };

  dots.innerHTML = CAMPAIGNS.map((item, i) =>
    `<button type="button" aria-label="Show ${esc(item.kicker)} campaign" aria-current="${i === 0}"></button>`,
  ).join("");
  dots.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) paint([...dots.children].indexOf(button));
  });
  paint(0);
}

function taggedProducts(catalog, ids) {
  const byId = new Map(catalog.products.map((product) => [Number(product.id), product]));
  return ids.map((id) => byId.get(Number(id))).filter(Boolean);
}

function bestSellerCardHTML(product, index) {
  const saleBadge = saleBadgeHTML(product, "best");
  const colors = [...new Set(product.colors || [])].slice(0, 5).map((color) => {
    const variants = (product.variants || []).filter((variant) =>
      String(variant.color).toUpperCase() === String(color).toUpperCase());
    const imageVariant = variants.find((variant) => variant.image) || variants[0];
    return {
      color,
      variantId: imageVariant?.id || "",
      image: imageVariant?.image ? img(imageVariant.image) : product.image,
    };
  });
  const rank = String(index + 1).padStart(2, "0");
  return `<article class="bscard${saleBadge ? " has-timed-sale" : ""}" data-card-product="${product.id}">
    <a class="bscard__link pcard__link" href="product.html?id=${product.id}">
      <span class="bscard__visual">
        <span class="bscard__label">Best seller</span>
        <span class="bscard__rank" aria-hidden="true">${rank}</span>
        ${saleBadge}
        <img src="${product.image}" alt="${esc(product.name)}" loading="lazy" width="600" height="600" data-card-image>
      </span>
      <span class="bscard__copy">
        <span class="bscard__meta"><span>${esc(product.brand || product.catName || "Fashioni")}</span><span>No. ${rank}</span></span>
        <strong>${esc(product.name)}</strong>
        <span class="bscard__price">${product.was ? `<s>${money(product.was)}</s>` : ""}<b>${product.range?.varies ? `From ${money(product.range.from)}` : money(product.price)}</b></span>
      </span>
    </a>
    ${colors.length ? `<span class="pcard__swatches bscard__swatches" role="radiogroup" aria-label="Choose a color for ${esc(product.name)}">${colors.map((option, colorIndex) => `<button class="pcard__swatch${colorIndex ? "" : " is-on"}" type="button" role="radio" aria-checked="${colorIndex ? "false" : "true"}" aria-label="${esc(swatchLabel(option.color))}" data-card-color="${esc(String(option.color))}" data-card-variant="${option.variantId}" data-card-image-src="${esc(option.image)}"><span aria-hidden="true" style="${swatchStyle(option.color)}"></span></button>`).join("")}</span>` : ""}
  </article>`;
}

function fillHome(catalog, { trendingIds = [], bestSellerIds = [] } = {}) {
  const ids = new Map((catalog.cfg.categories || []).map((item) => [item.slug, item.id]));
  const grid = document.getElementById("catgrid");
  const categorySection = grid?.closest("section");
  if (categorySection) categorySection.hidden = catalog.cats.length === 0;
  if (grid) {
    const featuredCategories = catalog.cats.slice(0, 8);
    grid.dataset.n = String(featuredCategories.length);
    grid.innerHTML = featuredCategories.map((category) => {
      const art = CATEGORY_ART[ids.get(category.slug)];
      return `<a class="cat fashioni-cat" href="shop.html?cat=${encodeURIComponent(category.slug)}">
        <span class="fashioni-cat__art"><img src="${art ? `assets/categories/${art}` : category.image}" alt="${esc(category.name)}" loading="lazy" width="500" height="500"></span>
        <span class="fashioni-cat__copy"><b>${esc(category.name)}</b><small>${category.count} products</small></span>
      </a>`;
    }).join("");
  }

  document.querySelectorAll("[data-all-refs]").forEach((link) => {
    link.textContent = `All ${catalog.products.length} products →`;
  });

  const arrivals = document.getElementById("arrivals");
  if (arrivals) {
    const trending = taggedProducts(catalog, trendingIds);
    arrivals.closest("section").hidden = trending.length === 0;
    arrivals.innerHTML = trending.map(cardHTML).join("");
    const countLink = arrivals.closest("section")?.querySelector("[data-trending-count]");
    if (countLink) countLink.textContent = `All ${trending.length} trending products →`;
    initDragScroller(arrivals);
  }

  const bestSellerTrack = document.getElementById("best-sellers");
  if (bestSellerTrack) {
    const bestSellers = taggedProducts(catalog, bestSellerIds);
    const section = bestSellerTrack.closest("section");
    section.hidden = bestSellers.length === 0;
    bestSellerTrack.innerHTML = bestSellers.map(bestSellerCardHTML).join("");
    const count = section.querySelector("[data-best-seller-count]");
    if (count) count.textContent = `${bestSellers.length} tagged favorites`;
    initDragScroller(bestSellerTrack);
  }

  const categories = catalog.cats.length;
  document.querySelectorAll("[data-category-count]").forEach((el) => { el.textContent = categories; });

  renderHomeReviews(catalog.products);
}

function initDragScroller(scroller) {
  if (!scroller || scroller.dataset.dragWired) return;
  scroller.dataset.dragWired = "true";
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let dragged = false;

  scroller.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = scroller.scrollLeft;
    dragged = false;
  });
  scroller.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const delta = event.clientX - startX;
    if (!dragged && Math.abs(delta) > 5) {
      dragged = true;
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture(pointerId);
    }
    if (dragged) scroller.scrollLeft = startScroll - delta;
  });
  const release = (event) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    scroller.classList.remove("is-dragging");
  };
  scroller.addEventListener("pointerup", release);
  scroller.addEventListener("pointercancel", release);
  scroller.addEventListener("click", (event) => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    dragged = false;
  }, true);
}

function renderHomeReviews(products) {
  const summary = loadReviews(products);
  const average = document.querySelector("[data-home-review-average]");
  const count = document.querySelector("[data-home-review-count]");
  const mode = document.querySelector("[data-home-review-mode]");
  const breakdown = document.querySelector("[data-home-review-breakdown]");
  const grid = document.querySelector("[data-home-reviews]");
  const disclosure = document.querySelector("[data-home-review-disclosure]");
  if (!grid || !breakdown) return;

  if (average) average.textContent = summary.average.toFixed(1);
  if (count) count.textContent = `${summary.total} ${summary.sample ? "sample reviews" : "live ratings"}`;
  if (mode) mode.textContent = summary.sample ? "Sample customer notes" : "Live customer ratings";
  if (disclosure) {
    disclosure.textContent = summary.sample
      ? "Sample review content is clearly labeled and is not included in product ratings."
      : "Score and distribution are calculated from live product ratings.";
  }

  breakdown.innerHTML = summary.counts.map(({ star, count: starCount, pct }) => `
    <div class="home-rating-row">
      <span>${star} star</span>
      <i aria-hidden="true"><b style="width:${pct}%"></b></i>
      <em>${starCount}</em>
    </div>`).join("");

  grid.innerHTML = summary.reviews.slice(0, 3).map((review) => {
    const rating = Math.max(1, Math.min(5, Math.round(review.rating || 0)));
    const label = `${rating} out of 5 stars`;
    const initials = String(review.name || "Fashioni customer")
      .split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    const body = review.body || `Customer rating for ${review.name || "a Fashioni product"}.`;
    const meta = [summary.sample ? "Sample review" : "Live product rating", review.city].filter(Boolean).join(" · ");
    return `<article class="home-review-card">
      <div class="home-review-card__top"><span class="home-review-quote" aria-hidden="true">“</span><span class="review-stars" role="img" aria-label="${label}">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span></div>
      <p>${esc(body)}</p>
      <footer><span class="home-review-avatar" aria-hidden="true">${esc(initials || "DC")}</span><span><b>${esc(review.name || "Fashioni customer")}</b><small>${esc(meta)}</small></span></footer>
    </article>`;
  }).join("");
}

initCampaigns();

Promise.all([
  loadCatalog(),
  loadTaggedProductIds("trending"),
  loadTaggedProductIds("best-seller"),
])
  .then(([catalog, trendingIds, bestSellerIds]) => fillHome(catalog, { trendingIds, bestSellerIds }))
  .catch((error) => {
    console.error(error);
    const message = document.querySelector("[data-catalog-error]");
    if (message) {
      message.hidden = false;
      message.textContent = "The live catalog could not be loaded. Please try again shortly.";
    }
  });
