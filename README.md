# DOT

GitHub Pages-ready Vite/React drawing app.

## Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Because this project is configured for GitHub project pages, the local path includes `/Dotot/`.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys `dist` to GitHub Pages.

In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
