/* Verify the responsive Fashioni campaign hero against its current design rules. */
import { chromium } from "playwright";

const BASE = (process.argv[2] || "http://localhost:8788").replace(/\/+$/, "");
const browser = await chromium.launch();
let failures = 0;
const fail = (message) => { failures++; console.log(`  FAIL  ${message}`); };
const pass = (message) => console.log(`  ok    ${message}`);

for (const [width, height] of [[1440, 900], [1024, 900], [820, 1000], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const image = document.querySelector("[data-hero-img]");
    return image?.complete && image.naturalWidth > 0;
  });
  await page.waitForTimeout(300);

  const state = await page.evaluate(() => {
    const hero = document.querySelector(".campaign-hero");
    const image = document.querySelector("[data-hero-img]");
    const copy = document.querySelector(".campaign-hero__copy");
    const heading = copy.querySelector("h1");
    const hr = hero.getBoundingClientRect();
    const ir = image.getBoundingClientRect();
    const cr = copy.getBoundingClientRect();
    const tr = heading.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      hero: { top: hr.top, bottom: hr.bottom, width: hr.width },
      image: { top: ir.top, bottom: ir.bottom, width: ir.width, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight },
      copy: { top: cr.top, bottom: cr.bottom, width: cr.width },
      heading: { top: tr.top, bottom: tr.bottom, text: heading.textContent.trim() },
      fit: getComputedStyle(image).objectFit,
      position: getComputedStyle(image).objectPosition,
    };
  });

  console.log(`\n  ${width}px`);
  state.overflow === 0 ? pass("no horizontal overflow") : fail(`${state.overflow}px horizontal overflow`);
  state.fit === "cover" ? pass("campaign photography fills the hero") : fail(`unexpected object-fit: ${state.fit}`);
  state.position === "50% 0%" ? pass("campaign photography preserves heads and crops from the bottom") : fail(`unexpected object-position: ${state.position}`);
  state.image.naturalWidth * state.image.naturalHeight > 1_300_000 && Math.min(state.image.naturalWidth, state.image.naturalHeight) >= 850
    ? pass("high-resolution campaign artwork loaded")
    : fail("campaign artwork resolution is too small");
  const slideStates = [];
  const dots = page.locator("[data-campaign-dots] button");
  for (let index = 0; index < await dots.count(); index++) {
    await dots.nth(index).click();
    await page.waitForFunction(() => {
      const image = document.querySelector("[data-hero-img]");
      return image?.complete && image.naturalWidth * image.naturalHeight > 1_300_000 &&
        Math.min(image.naturalWidth, image.naturalHeight) >= 850;
    });
    slideStates.push(await page.evaluate(() => ({
      src: document.querySelector("[data-hero-img]")?.getAttribute("src"),
      current: [...document.querySelectorAll("[data-campaign-dots] button")]
        .findIndex((button) => button.getAttribute("aria-current") === "true"),
    })));
  }
  const uniqueSlides = new Set(slideStates.map(({ src }) => src)).size;
  uniqueSlides === 3 && slideStates.every(({ current }, index) => current === index)
    ? pass("all three campaign slides load and select correctly")
    : fail("campaign slides did not load or select correctly");
  const copyVisible = state.heading.top >= state.hero.top && state.heading.bottom <= state.hero.bottom && state.heading.text.length > 10;
  copyVisible ? pass("campaign heading is fully visible") : fail("campaign heading is clipped or empty");
  if (width <= 820) {
    Math.round(state.image.bottom - state.image.top) === 250 ? pass("mobile image zone is 250px") : fail("mobile image zone changed");
    state.copy.top >= state.image.bottom ? pass("mobile copy follows the image without overlap") : fail("mobile copy overlaps the image");
  } else {
    state.copy.width < state.hero.width * .55 ? pass("desktop copy leaves the product scene visible") : fail("desktop copy obscures too much artwork");
  }
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nHero checks passed.\n");
process.exit(failures ? 1 : 0);
