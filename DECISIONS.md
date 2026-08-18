# Fashioni design and implementation decisions

## Store identity

- Selldone shop: `Fashioni`, id `15552`, handle `fashioni`
- Primary currency: USD
- Store language: English
- Live Selldone domain: `fashioni.myselldone.com`
- Repository and Worker: `selldone-fashioni`
- Preferred custom domain: `fashioni.selldone.shop`

## Catalog architecture

On 18 August 2026 the original 22 flat folders were consolidated into eight customer-facing collections. All 165 products were moved before 14 empty source folders were deleted. The final structure is Activewear, Bags & Accessories, Dresses & One-Pieces, Footwear, Jackets & Layers, Shorts, Sunglasses, and Tops & T-Shirts.

The structure is deliberately product-type-led. It is easier to scan than duplicated audience folders, while the storefront search and brand/availability filters still support narrower discovery.

## Fashion references reviewed

Reviewed on 18 August 2026:

1. Zara — large campaign imagery, terse copy, high garment scale, and restrained navigation.
2. Uniqlo — accessible product hierarchy, audience-aware navigation, clear category language, strong utility details, and compact retail density.
3. SSENSE — editorial rhythm, generous whitespace, minimal chrome, and a clear separation between commerce and stories.

Fashioni uses Uniqlo as the closest primary reference because the live catalog has accessible prices, broad ages, and practical everyday categories. SSENSE informs editorial spacing and article presentation; Zara informs campaign scale. No third-party source code, logo, product image, proprietary icon, or copy is reused.

## Visual system

- Clean off-white canvas with dark ink typography and compact metadata.
- Product-first cards with four columns on desktop and two on mobile.
- Eight original transparent category cutouts share the same studio direction.
- Category media occupies 69% of each card and uses `object-fit: contain` without cropping.
- Five persistent color themes remain available as a preference, but all keep the same fashion layout and accessible contrast.
- One shared header and footer is generated across home, shop, product, checkout, account, information, blog, and article routes.

## Product options and media

Selldone contains 411 variant rows. Many apparel rows repeat one color across several size values, stored in `volume`. The interface groups colors separately from sizes and maps variant ids deterministically to gallery images. Real Selldone variant-image links take precedence; otherwise unique color groups receive stable gallery images, while size rows of the same color share the same image.

## Accuracy boundaries

Live prices, discounts, stock, product titles, categories, variant values, and images come from Selldone. Fashioni has not supplied verified contact details, delivery promises, return windows, fabric composition, care instructions, or fit claims for every product. The storefront therefore avoids inventing those facts and directs customers to checkout or merchant-supplied policy content where applicable.

## Authentication and deployment

Browser sign-in uses the public `Fashioni Storefront` OAuth client with Authorization Code + PKCE. Its client id is public configuration; no client secret exists or is shipped. Static assets are built into `dist/` and deployed to Cloudflare Workers under `selldone-fashioni`.
