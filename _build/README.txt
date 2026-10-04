The public site uses assets/site.css, compiled from HTML classes and styles.css.
No Tailwind script runs in visitors' browsers.

After editing HTML classes, script.js classes, or styles.css:
  npm install --prefix _build
  npm run build --prefix _build

Commit the updated HTML, styles.css source, and assets/site.css together.
Do not commit node_modules. The _build directory is source tooling, not a runtime dependency.

Fonts are local WOFF2 files with font-display: optional. Their OFL licences are in assets/fonts.
Icons are inline SVG from Lucide 0.469.0; its licence is in assets/lucide-LICENSE.txt.
Original JPEGs remain for existing links and social metadata; img tags use WebP variants.
