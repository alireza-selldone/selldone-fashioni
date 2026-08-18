# Fashioni Storefront

Fashioni is a responsive fashion storefront backed by Selldone and deployed on Cloudflare Workers.

## Store

- Selldone shop: `fashioni` (shop `15552`)
- Public catalogue: 165 physical products
- Taxonomy: 8 focused fashion categories
- Customer login: OAuth Authorization Code with PKCE; no client secret is shipped
- Checkout: selected products, quantities, colors, and sizes are synchronised to the authenticated Selldone basket, then payment continues in Selldone’s secure checkout
- Editorial: 6 original Style Notes published in Selldone

## Local development

```bash
npm ci
npm run dev
```

Open the local URL printed by the development server. Public configuration is in `shop.config.json`; it contains no secret.

## Quality checks

```bash
npm run build
npm run check
```

The checks cover configuration leaks, public-route auditing, images, generated pages, interactive controls, hero data, and development-port behavior.

## Deployment

```bash
npm run deploy
```

The Worker name is `selldone-fashioni`. The production hostname is `fashioni.selldone.shop`.

## Design system

The visual direction combines Uniqlo-like category clarity, SSENSE-inspired editorial spacing, and Zara-scale campaign imagery. Five persistent themes are available: Atelier, Plum, Forest, Sand, and Rose. Product and category grids use four columns on desktop and two on mobile.

## Data accuracy

Prices, stock, variants, categories, product imagery, and articles load from the connected Selldone shop. Material, fit, care, delivery, returns, and merchant contact details are shown only when supplied by the product or merchant. Sample review content is explicitly labelled when real product reviews are unavailable.

## Screenshots

Fresh desktop, tablet, and mobile screenshots are generated in `docs/screenshots/` after the production deployment is verified.
