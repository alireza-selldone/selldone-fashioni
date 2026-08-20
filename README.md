# Fashioni Storefront

Fashioni is a responsive fashion storefront backed by Selldone and deployed on Cloudflare Workers.

- Live storefront: [fashioni.selldone.shop](https://fashioni.selldone.shop/)
- Workers preview: [selldone-fashioni.ee-shirdel.workers.dev](https://selldone-fashioni.ee-shirdel.workers.dev/)

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

## Reuse as the Fashioni v2 starter

The reusable Codex skill is tracked at [`skills/setup-selldone-fashion-store`](skills/setup-selldone-fashion-store). It clones the latest tracked `main`, verifies `starter.manifest.json`, excludes local/untracked files, and records the exact source commit before a new shop is configured.

From the installed or downloaded skill directory:

```bash
python scripts/bootstrap_fashioni_starter.py <empty-project-directory>
```

Then run `npm install` and `npm run setup -- --shop-id <id> --handle <handle> --name <name> --domain <domain>`. Setup rewrites the visible Fashioni identity and clears the previous shop's domain, OAuth client, and audience mappings before the new storefront is built.

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

`wrangler.toml` performs a normal static-assets deployment. `wrangler.proxy.toml` reproduces the
commit-pinned, Cloudflare-cached proxy deployment used when a local Wrangler OAuth session is not
available.

## Design system

The visual direction combines Uniqlo-like category clarity, SSENSE-inspired editorial spacing, and Zara-scale campaign imagery. Five persistent themes are available: Atelier, Plum, Forest, Sand, and Rose. Product and category grids use four columns on desktop and two on mobile.

## Data accuracy

Prices, stock, variants, categories, product imagery, and articles load from the connected Selldone shop. Material, fit, care, delivery, returns, and merchant contact details are shown only when supplied by the product or merchant. Sample review content is explicitly labelled when real product reviews are unavailable.

## Screenshots

- [Homepage — desktop](docs/screenshots/fashioni-home-1440.png)
- [Shop — desktop](docs/screenshots/fashioni-shop-1440.png)
- [Product — desktop](docs/screenshots/fashioni-product-1440.png)
- [Style Notes — desktop](docs/screenshots/fashioni-blog-1440.png)
- [Homepage — mobile](docs/screenshots/fashioni-home-390.png)
