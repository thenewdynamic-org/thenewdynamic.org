# Hugo Asset Pipline

This set up utilizes Parcel for Javascript and open source font processing, Hugo Pipes + PostCSS for CSS processing, and Maid as a task runner to run Parcel and Hugo in parallel.

This asset pipeline is a shift for us from using Webpack to process JS/Fonts/CSS. Parcel is a bundler like Webpack, yet as a tradeoff for slightly less flexibility it has a smaller configuration and file footprint and builds faster; in fact, there is no Parcel configuration file. The shift to using Hugo to build CSS allows Hugo sites to be developed outside of an external build process. There are drawbacks to this approach, as outlined below.

Note that this configuration is built around the assumption that JS/Fonts are processed in development, not production, though it would take minimal effort to do so.

## JS

- Uses Parcel Bundler.
- Parcel outputs to `assets/output/index.js`.
- Hugo is used to fingerprint and make a secure hash for Subresource Integrity.
  - If `fileExists "./assets/output/index.js` Hugo creates a hash of that file from `layouts/_head/scripts.html`.
- Hugo outputs the processed JS file to `public/output/index.min.[hash].js`.

## CSS

- Uses Hugo Pipes, utlizing PostCSS.
- Hugo processes `assets/css/styles.css` with `assets/css/postcss.config.js`, utilizing Imports, TailwindCSS, Autoprefixer, and PurgeCSS.
- If `NODE_ENV=development` is present in the build command, Hugo/PostCSS will NOT process the file through PurgeCSS.
- Hugo outputs the processed CSS file to `public/css/styles.min.[hash].css`.

## Fonts

- Open source fonts via [Typefaces](https://github.com/KyleAMathews/typefaces) uses Parcel Bundler.
- Parcel outputs CSS to `assets/output/index.css` and also puts the font files, hashed, in the same directory.
- Hugo Pipes processes files into public directory and create Prefetch links.
  - If `fileExists "./assets/output/index.css` Hugo creates the prefetch links from `layouts/_head/stylesheets.html`. 
- Hugo outputs the processed fonts and CSS file to `public/output/index.min.[hash].css` and `public/output/font-name.[hash].woff[2]`.

## Images

- Assets stored in an S3 bucket or local to the repo, transformed via Imgix.


### TODO

- See if we can avoid Maid by creating a Parcel plugin to run Hugo as a subprocess, or something else.
- Account for resources in _header for caching and preload (is Scratch viable).
- Make sure our package.json commands are set up nicely.
- Determine workflow for managing fontst that are not called with the typogpraphy package (i.e. commercial fonts).

### Pros and cons of using Hugo to process PostCSS

#### Pros

- Do not have to run JS to change CSS, eliminating mismatch in timing while building CSS.
- Updates are faster in development.

#### cons

- Must Install Node modules just to run Hugo.
- Must run PostCSS (with Node modules) to build in production on the server, building CSS with every change.
- Creates a separate CSS file for main styles apart from any CSS files generated for fonts.

### How to Switch to running JS-based PostCSS

- Put PostCSS in site root (not tested if current file works).
- Add the main CSS file to `assets/index.js`.
- Change Tailwind imports to call tailwind directly (instead of using imports).
- Change initial CSS file `layouts/_head/stylesheets.html` to not use PostCSS.
- Change initial CSS file `layouts/_head/stylesheets.html` to look for index.css (can accomplish this by moving the css file out of the fonts section and into the main).
- Make sure the fonts are still being called.