# Justin Dray - Personal Website

This repository contains the source code and infrastructure for [www.dray.id.au](https://www.dray.id.au).

## Architecture

The project is built as a static website and deployed to AWS using the **AWS Cloud Development Kit (CDK)**.

- **Frontend:** Modernized in 2026 using **Bootstrap 5.3**, Vanilla JavaScript, and a professional neutral dark mode theme.
- **Infrastructure:** AWS CDK (TypeScript) managing an S3 bucket configured for static website hosting.
- **CI/CD:** Automatically deployed via **GitHub Actions** on every push to the `main` branch.

## Project Structure

- `dist/`: The static website source files.
  - `index.html`: The main page, featuring a scroll-driven "About", "Experience", and "Contact" sections.
  - `scss/`: Custom styles built on the Grayscale theme.
  - `gulpfile.js`: Build pipeline for compiling SCSS and managing vendor dependencies.
- `lib/`: AWS CDK stack definition (`www-stack.ts`).
- `bin/`: CDK app entry point.

## Deployment

### Automatic Deployment
Pushing changes to the `main` branch triggers a GitHub Action workflow (`.github/workflows/main.yml`) that:
1. Builds the static assets using Gulp.
2. Runs `cdk deploy` to synchronize the assets with the S3 bucket.

### Manual Deployment
If you need to deploy manually from your local environment:

```bash
# Install dependencies
yarn install

# Build static assets
cd dist && npm install && npm run build && cd ..

# Deploy via CDK
yarn cdk deploy
```

## Maintenance

The website content is primarily managed in `dist/index.html`. The professional history is synchronized with Justin's LinkedIn profile, focusing on his career at AWS in Senior Security Engineering and AI Strategy.
