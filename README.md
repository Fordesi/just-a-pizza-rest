# Pizza Clone

Static demo of a pizza-ordering home page with a Thai / English / 日本語 language switcher.
Not affiliated with any real brand; the logo and product images are placeholders.

## Run locally

```
node serve.js        # http://127.0.0.1:8080  (or: node serve.js 3000)
node test-i18n.js    # checks all languages define the same keys
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo's `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/pages.yml`, which runs the i18n test and publishes
   `index.html`, `style.css`, `app.js`, `i18n.js` to `https://<user>.github.io/<repo>/`.

All asset paths are relative, so the site works under the `/<repo>/` sub-path.
