# Edgie's Veggies — Claude Guide

Marketing site for a small-scale market garden in St. Paul, MN. Built with Jekyll + UIKit, deployed to GitHub Pages (both production and staging).

## Stack

| Layer | Technology |
|---|---|
| Site generator | Jekyll 4.3.2, Ruby 3.2.2 |
| CSS framework | UIKit 3 (via npm) |
| Templating | Liquid |
| Media hosting & processing | Cloudinary (on-the-fly `f_auto,q_auto,w_*` transforms) |
| CSS purging | PurgeCSS |
| CMS | Sveltia CMS (`/admin/`) |
| Newsletter | Campaign Monitor (CreateSend) |

## Local Development

```bash
bundle exec jekyll serve           # http://localhost:4000
```

Use the local server to verify UI changes before reporting them complete. Config changes (`_config.yml`) require a server restart; template and asset changes hot-reload automatically.

## Build Pipeline

The full production build runs these steps in order:

```bash
npm install                  # install UIKit, purgecss
npm run copy-assets          # copy UIKit JS from node_modules to assets/js/
bundle exec jekyll build     # compile site to _site/
npm run purgecss             # strip unused CSS from built output
```

There is no longer a local image-processing step — all photographic media is served from Cloudinary, which handles resizing/format negotiation via URL transforms. The full pipeline runs on CI (GitHub Actions).

## Deployment

Production and staging are **separate repos owned by separate GitHub accounts**, each deploying its own branch as an independent GitHub Pages site.

| Environment | Account / Repo | Trigger | URL |
|---|---|---|---|
| Production | `edgiesveggies/edgiesveggies.github.io` | Push to `main` → GitHub Actions | edgiesveggies.com |
| Staging | `stgedgiesveggies/stgedgiesveggies.github.io` | Push to `staging` → GitHub Actions | stgedgiesveggies.github.io |

Each repo's workflow builds the site and publishes to that repo's `gh-pages` branch root via `peaceiris/actions-gh-pages` (`deploy.yml` for production, `deploy-staging.yml` for staging). Both workflow files live in the shared codebase; they trigger on different branches, so each repo only ever runs the workflow for its branch.

Staging builds with `_config_staging.yml` layered on top of `_config.yml` (`JEKYLL_ENV=production`), which overrides `url`/`baseurl` and sets the CMS branch. Production deploys with `cname: edgiesveggies.com`.

Local git remotes: `origin` → production repo, `staging` → staging repo.

**Required repo setting (each repo):** GitHub Pages must be configured to deploy from the `gh-pages` branch (repo Settings → Pages → Source → Deploy from a branch → `gh-pages` / root).

## Styling

- **Entry point**: `assets/css/main.scss` — site-specific overrides and utility classes
- **UIKit overrides**: `_sass/theme/` mirrors the structure of `_sass/components/`
- **UIKit source scss** is loaded from `node_modules/uikit/src/scss` via the sass `load_paths` config
- Don't edit files under `_sass/components/` (UIKit upstream); put overrides in `_sass/theme/`

**Color palette:**
- Pink (primary/links): `#cf0089`
- Yellow (text shadow): `#ffde59`
- Teal (secondary): `#00af95`
- Background: `#fffbeb`

## Key Patterns

**Media on Cloudinary** — all photographic content (veggie/recipe/post images, the homepage hero) lives in Cloudinary under the `edgies-veggies/` folder, not in the repo. Sveltia CMS is configured with the Cloudinary media library (`admin/config.yml`), so client uploads go straight to Cloudinary and the **full delivery URL** is stored in frontmatter (e.g. `cover_image: https://res.cloudinary.com/dlcjjf2wj/image/upload/f_auto,q_auto/edgies-veggies/...`). Jekyll's `relative_url`/`absolute_url` filters pass absolute URLs through untouched, so layouts render these directly. Resize/format is done with URL transforms (`w_750`, `f_auto`, `q_auto`) — no build step. One-time migration scripts live in `scripts/upload-to-cloudinary.js` and `scripts/migrate-frontmatter.js`.

**Homepage hero** — uses the featured veggie's `cover_image`; the fallback is a Cloudinary-served `radishes` image (`_layouts/home.html`). There is no longer an auto-discovered carousel.

**Blog posts** — managed by the client via Sveltia CMS at `/admin/`. Posts live in `_posts/` as Markdown with frontmatter fields: `title`, `date`, `cover_image` (optional, Cloudinary URL), `layout: post`. Post authoring is the client's responsibility, not the developer's.

## Project Layout

```
_layouts/
  default.html      # Base HTML wrapper
  home.liquid       # Homepage (does not extend default)
  page.html         # Generic content page
  post.html         # Blog post

_includes/
  head.html         # <head>: fonts, meta, CSS/JS references
  newsletter-form.html

assets/
  css/main.scss     # Style entry point
  js/               # UIKit JS (copied from node_modules at build time)
                    # (photographic images are on Cloudinary, not in the repo)

admin/
  config.yml        # Sveltia CMS configuration (Cloudinary media library)
  index.html        # CMS entry point

scripts/
  upload-to-cloudinary.js  # One-time: push local images to Cloudinary
  migrate-frontmatter.js   # One-time: rewrite image paths to Cloudinary URLs
  generate-qrcodes.js      # QR code generation
```

