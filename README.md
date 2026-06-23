# Edgie's Veggies — Developer Guide

Marketing site for a small-scale market garden in St. Paul, MN. Built with Jekyll, deployed to GitHub Pages (production) and Netlify (staging).

## Stack

| Layer | Technology |
|---|---|
| Site generator | Jekyll 4.3.2 |
| Runtime | Ruby 3.2.2 |
| CSS framework | UIKit 3 (via npm) |
| Templating | Liquid |
| Media hosting & processing | Cloudinary (on-the-fly transforms) |
| CSS purging | PurgeCSS |
| CMS | Sveltia CMS (`/admin/`) |
| Newsletter | Campaign Monitor (CreateSend) |
| Hosting | GitHub Pages + Netlify (staging) |

## Prerequisites

- Ruby 3.2.2 (see `.ruby-version` — use RVM or rbenv)
- Bundler (`gem install bundler`)
- Node.js 20+ and npm

## Local Setup

```bash
git clone git@github.com:edgiesveggies/edgiesveggies.github.io.git
cd edgiesveggies.github.io
npm install
bundle install
```

## Development

```bash
# Start dev server at http://localhost:4000
bundle exec jekyll serve

```

Jekyll watches for file changes and rebuilds automatically. Config changes (`_config.yml`) require a server restart. The dev server skips PurgeCSS — use the full build to verify that step.

## Build

The full build pipeline (matches CI and Netlify):

```bash
npm run copy-assets      # copy UIKit JS from node_modules to assets/js/
bundle exec jekyll build # compile site to _site/
npm run purgecss         # strip unused CSS
# Output goes to _site/ (gitignored)
```

Photographic media is served from Cloudinary (URL transforms handle resizing/format), so there is no local image-processing step.

## Project Layout

```
_layouts/         # Page templates
  default.html    # Base HTML wrapper
  home.liquid     # Homepage (custom — does not extend default)
  page.html       # Generic content page
  post.html       # Blog post

_includes/
  head.html       # <head> with fonts, meta, CSS/JS references

_sass/
  components/     # UIKit component styles (unmodified)
  theme/          # UIKit component overrides for this site
  variables.scss / variables-theme.scss   # UIKit variable files
  mixins.scss / mixins-theme.scss         # UIKit mixin files

assets/
  css/main.scss   # Entry point — custom colors, fonts, utility classes
  js/             # UIKit JS (minified + unminified copies)
                  # (photographic images are on Cloudinary, not in the repo)
```

## Key Patterns

**Media on Cloudinary** — all photographic content lives in Cloudinary (`edgies-veggies/` folder), not the repo. Sveltia CMS uploads go straight to Cloudinary and store the full delivery URL in frontmatter; layouts render those URLs directly. Resize/format via URL transforms (`w_750`, `f_auto`, `q_auto`).

**Custom styles** — `assets/css/main.scss` is the right place for site-specific overrides. UIKit component overrides go in `_sass/theme/` to mirror the upstream `_sass/components/` structure.

**Color palette** defined in `main.scss`:
- Pink (primary): `#cf0089`
- Yellow (text shadow): `#ffde59`
- Teal (secondary): `#00af95`
- Background: `#fffbeb`

## Deployment

| Environment | Trigger |
|---|---|
| Production | Push to `main` → GitHub Actions → GitHub Pages |
| Staging | Push to `staging` → Netlify |

The `_site/` directory is never committed. Netlify uses `netlify.toml` and runs the full build pipeline including image processing and PurgeCSS.

