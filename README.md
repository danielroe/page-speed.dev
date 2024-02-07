# page-speed.dev

> See and share Core Web Vitals and Page Speed Insights results simply and easily.

<p align="center">
  <a href="https://page-speed.dev/" target="_blank">
    <img width="1090" alt="Screenshot of page-speed.dev showing performance metrics for https://roe.dev" src="https://github.com/danielroe/page-speed.dev/assets/28706372/3cc993b9-ea04-40a6-b98e-d7aa62cc1958">
  </a>
</p>

- [👉 &nbsp;Check it out](https://page-speed.dev/)

## Features

- Built on [Nuxt](https://nuxt.com/)
- [Nitro server API routes](https://nuxt.com/docs/guide/concepts/server-engine#server-engine)
- [CrUX API](https://developer.chrome.com/docs/crux/api#example_queries) and [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
- [UnoCSS](https://unocss.dev/)
- [nuxt-og-image](https://github.com/harlan-zw/nuxt-og-image), powered by [Satori](https://github.com/vercel/satori)
- Deployed on [Azure Static Web Apps](https://azure.microsoft.com/en-gb/products/app-service/static/)
- Using [unjs/unstorage](https://unstorage.unjs.io/) for caching on [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs/)
- Using [route rules](https://nitro.unjs.io/guide/cache#route-rules) to persist images, HTML and API requests

## Try it out locally

You will need to generate a new Google API token [here](https://console.cloud.google.com/apis/credentials) with permissions to access `PageSpeed Insights API` and `Chrome UX Report API`, and add the token to your `.env` file:

```env
NUXT_GOOGLE_API_TOKEN=<your api token>
```

### Setup

```bash
# install dependencies
corepack enable
pnpm install

# serve in dev mode, with hot reload at localhost:3000
pnpm dev

# build for production
pnpm build

# preview in production mode
pnpm preview
```

## License

Made with ❤️

Published under [MIT License](./LICENCE).
