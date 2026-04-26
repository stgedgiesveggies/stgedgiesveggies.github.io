module.exports = {
  content: ['_site/**/*.html'],
  css: ['_site/assets/css/main.css'],
  output: '_site/assets/css/',
  safelist: {
    // UIKit adds these classes dynamically via JS (slideshow state, transitions)
    patterns: [
      /^uk-(active|open|close|hidden|animation|transition|flex|drop|visible|toggle)/,
      /^uk-navbar/,
      /^uk-logo/,
    ],
  },
};
