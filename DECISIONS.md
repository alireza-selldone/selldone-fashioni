# Fashioni design and implementation decisions

## Store identity

- Selldone shop: `Fashioni`, id `15552`, handle `fashioni`
- Primary currency: USD
- Store language: English
- Live Selldone domain: `fashioni.myselldone.com`
- Repository and Worker: `selldone-fashioni`
- Preferred custom domain: `fashioni.selldone.shop`

## Catalog architecture

On 18 August 2026 the original 22 flat folders were consolidated into eight customer-facing product-type collections. The store now has 195 products. The final type structure is Activewear, Bags & Accessories, Dresses & One-Pieces, Footwear, Jackets & Layers, Shorts, Sunglasses, and Tops & T-Shirts.

Discovery is deliberately dual-axis. Every applicable product keeps its product-type category and also receives one or more audience shortcuts: Women, Men, Girls, Boys, or Baby. Baby further divides into Baby Girls and Baby Boys. This avoids duplicate products while supporting both “what is it?” and “who is it for?” navigation.

The eight product-type collections are roots, and the five audience entries are root shortcuts. Baby Girls and Baby Boys are the only audience children and live beneath Baby. `All Products`, `Shop by category`, and the retired `Shop by Product` label are presentation copy only; none is a Selldone category or hierarchy wrapper. Taxonomy writes must be checked for self-parenting and cycles before mutation, then verified from the live hierarchy afterward.

## Header navigation

The primary desktop navigation is centered as one compact group. `All Products` is the first item, followed by Girls, Boys, Baby, Women, Men, and Brands. The former `Shop by Product` top-level item was removed because it duplicated the product listing and could be mistaken for a catalogue category. Product-type links remain available under the presentation heading `Shop by category` and in listing filters; mobile keeps the same information order in its drawer.

Brands is a real discovery route rather than an alias for All Products. Hover/focus opens a compact menu generated from the brands with the highest live product counts and representative catalogue imagery. Clicking Brands opens a reusable A–Z directory with search, live counts, and popular-brand cards; selecting any brand lands on a listing titled for that brand and prefiltered to its products. No editorial brand category or separate image set is required.

## Fashion references reviewed

Reviewed on 18 August 2026:

1. Zara — large campaign imagery, terse copy, high garment scale, and restrained navigation.
2. Uniqlo — accessible product hierarchy, audience-aware navigation, clear category language, strong utility details, and compact retail density.
3. SSENSE — editorial rhythm, generous whitespace, minimal chrome, and a clear separation between commerce and stories.

Fashioni initially used Uniqlo as the closest reference because the live catalog has accessible prices, broad ages, and practical everyday categories. After a full desktop/tablet/mobile review on 18 August 2026, Next became the primary information-design reference: a two-tier audience header, broad mega menu, horizontal listing filters, dense responsive product grids, image-led homepage blocks, and a compact sticky product purchase column. SSENSE still informs editorial spacing and Zara informs campaign scale. No third-party source code, logo, product image, proprietary icon, or copy is reused.

## Visual system

- Clean off-white canvas with dark ink typography and compact metadata.
- Product-first cards with four columns on desktop and two on mobile.
- Eight original transparent category cutouts share the same studio direction.
- Category media occupies 69% of each card and uses `object-fit: contain` without cropping.
- Five persistent color themes remain available as a preference, but all keep the same fashion layout and accessible contrast.
- One shared header and footer is generated across home, shop, product, checkout, account, information, blog, and article routes.
- The homepage campaign uses three user-approved editorial scenes derived from real catalogue products: evening sunglasses, coordinated womenswear/menswear, and children at play. Subjects remain on the right with copy-safe space on the left; the first-paint HTML and hydrated slider use the same asset and copy.

## Product options and media

Apparel and footwear use complete color-by-size matrices. Newly created apparel has three colors and five sizes per color; new kids' footwear has three colors and eight sizes per color. Existing size-applicable products were expanded to the relevant adult, baby, kids, or footwear scale. The interface groups colors separately from sizes and maps variant ids deterministically to gallery images. Every newly added color has at least three positive-stock sizes; in practice it has five or eight.

## Accuracy boundaries

Live prices, discounts, stock, product titles, categories, variant values, and images come from Selldone. Fashioni has not supplied verified contact details, delivery promises, return windows, fabric composition, care instructions, or fit claims for every product. The storefront therefore avoids inventing those facts and directs customers to checkout or merchant-supplied policy content where applicable.

## Authentication and deployment

Browser sign-in uses the public `Fashioni Storefront` OAuth client with Authorization Code + PKCE. Its client id is public configuration; no client secret exists or is shipped. Static assets are built into `dist/` and deployed to Cloudflare Workers under `selldone-fashioni`.
