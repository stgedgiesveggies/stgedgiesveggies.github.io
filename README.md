# Edgie's Veggies — Developer Guide

Marketing site for a small-scale market garden in St. Paul, MN. Built with Jekyll and deployed automatically to GitHub Pages.

## Stack

| Layer | Technology |
|---|---|
| Site generator | Jekyll 4.3.2 |
| Runtime | Ruby 3.2.2 |
| CSS framework | UIKit 3 |
| Templating | Liquid |
| Newsletter | Campaign Monitor (CreateSend) |
| Hosting | GitHub Pages (`edgiesveggies.github.io`) |
| Large assets | Git LFS |

## Prerequisites

- Ruby 3.2.2 (see `.ruby-version` — use RVM or rbenv)
- Bundler (`gem install bundler`)
- Git LFS (`brew install git-lfs && git lfs install`)

No Node.js or npm required.

## Local Setup

```bash
git clone git@github.com:edgiesveggies/edgiesveggies.github.io.git
cd edgiesveggies.github.io
bundle install
```

## Development

```bash
# Start dev server at http://localhost:4000
bundle exec jekyll serve

# If you're working from the jasunde fork with a /demos/ base URL:
bundle exec jekyll serve --config _config_jasunde.yml
```

Jekyll watches for file changes and rebuilds automatically. Config changes (`_config.yml`) require a server restart.

## Build

```bash
bundle exec jekyll build
# Output goes to _site/ (gitignored)
```

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
  images/
    home-slides/  # Slideshow images (auto-discovered by home.liquid)
  js/             # UIKit JS (minified + unminified copies)
```

## Key Patterns

**Slideshow images** — drop any image into `assets/images/home-slides/` and it will appear in the homepage carousel automatically. The `home.liquid` template discovers them via `site.static_files` at build time.

**Custom styles** — `assets/css/main.scss` is the right place for site-specific overrides. UIKit component overrides go in `_sass/theme/` to mirror the upstream `_sass/components/` structure.

**Color palette** defined in `main.scss`:
- Pink (primary): `#cf0089`
- Yellow (text shadow): `#ffde59`
- Teal (secondary): `#00af95`
- Background: `#fffbeb`

## Deployment

Push to `main`. GitHub Pages runs the Jekyll build and publishes automatically — no CI configuration needed. The `_site/` directory is never committed.

## Alternate Config

`_config_jasunde.yml` sets `baseurl: /demos/edgies-veggies` and `github_username: jasunde`. Use it when serving the site from a subdirectory (e.g. a personal demos server).
