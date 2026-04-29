module.exports = {
  content: ['_site/**/*.html'],
  css: ['_site/assets/css/main.css'],
  output: '_site/assets/css/',
  // UIKit uses @ for responsive suffixes (e.g. uk-child-width-1-2@s). The default
  // extractor splits on @, so we override it to keep the full token intact.
  defaultExtractor: content => content.match(/[\w-:/@]+/g) || [],
  safelist: {
    // UIKit adds these classes dynamically via JS (slideshow state, transitions)
    patterns: [
      /^uk-(active|open|close|hidden|animation|transition|flex|drop|visible|toggle)/,
    ],
  },
};
