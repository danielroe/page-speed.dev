# page-speed.dev

> See and share Core Web Vitals and PageSpeed Insights results simply and easily.

[👉 &nbsp;Check it out](https://page-speed.dev/)

<table>
<tbody>
<tr>
<td>
<a href="https://page-speed.dev">
<img width="1090" alt="Screenshot of page-speed.dev showing performance metrics for https://roe.dev" src="https://github.com/danielroe/page-speed.dev/assets/28706372/104e52a5-828d-4510-a6ba-3f94a9af650a">
</a>
</td>
<td>
<a href="https://page-speed.dev">
<img width="1090" alt="Screenshot of performance metrics being shared on Twitter" src="https://github.com/danielroe/page-speed.dev/assets/28706372/ffa4805b-eabf-4b60-b91f-4eaa6f59005c">
</a>
</td>
</tr>
</tbody>
</table>

## 👉 Vision

The aim of [page-speed.dev](https://page-speed.dev) is to make it easy and straightforward to share web performance results. Currently, PageSpeed Insights and Core Web Vitals results are difficult to share, and and often shared via screenshot rather than via a link back to the source.

So:

* Results are **cached for a day plus next request** making subsequent requests fast and easy to share.
* **Mobile results** are displayed. (Desktop results are too easy to get good results for and don't adequately reflect a site's performance.)
* **Core Web Vitals are prioritised** where available as these are a better measure of performance than Lighthouse/PageSpeed Insights results.
* **Metrics in OpenGraph images** to provide an easy way to share data.
* **SVG badges** to display Core Web Vitals metrics in GitHub READMEs or documentation.

## Features

- Built on [Nuxt](https://nuxt.com/)
- [Nitro server API routes](https://nuxt.com/docs/guide/concepts/server-engine#server-engine)
- [CrUX API](https://developer.chrome.com/docs/crux/api#example_queries) and [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
- [UnoCSS](https://unocss.dev/)
- [nuxt-og-image](https://github.com/harlan-zw/nuxt-og-image), powered by [Satori](https://github.com/vercel/satori)
- Deployed on [Azure Static Web Apps](https://azure.microsoft.com/en-gb/products/app-service/static/)
- Using [unjs/unstorage](https://unstorage.unjs.io/) for caching on [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs/)
- Using [route rules](https://nitro.unjs.io/guide/cache#route-rules) to persist images, HTML and API requests
- SVG badges for displaying Core Web Vitals metrics in GitHub READMEs

## SVG Badges

You can now embed Core Web Vitals metrics in your GitHub README or documentation using our SVG badges:

```markdown
![Core Web Vitals](https://page-speed.dev/badge/roe.dev)
```

Example:
![Core Web Vitals](https://page-speed.dev/badge/roe.dev)

### Badge Options

You can customize the badges with different metrics and styles:

#### Metrics

```markdown
![LCP](https://page-speed.dev/badge/roe.dev?metric=lcp)
![CLS](https://page-speed.dev/badge/roe.dev?metric=cls)
![INP](https://page-speed.dev/badge/roe.dev?metric=inp)
```

Examples:
![LCP](https://page-speed.dev/badge/roe.dev?metric=lcp)
![CLS](https://page-speed.dev/badge/roe.dev?metric=cls)
![INP](https://page-speed.dev/badge/roe.dev?metric=inp)

#### Styles

```markdown
![Core Web Vitals](https://page-speed.dev/badge/roe.dev?style=flat)
![Core Web Vitals](https://page-speed.dev/badge/roe.dev?style=flat-square)
![Core Web Vitals](https://page-speed.dev/badge/roe.dev?style=plastic)
```

Examples:
![Core Web Vitals](https://page-speed.dev/badge/roe.dev?style=flat)
![Core Web Vitals](https://page-speed.dev/badge/roe.dev?style=flat-square)
![Core Web Vitals](https://page-speed.dev/badge/roe.dev?style=plastic)

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

## Credits

Many thanks to [Barry Pollard](https://twitter.com/tunetheweb) for providing essential review and suggestions! ❤️

## Links

- there is a [Raycast extension](https://www.raycast.com/vorillaz/pagespeed) which uses this API as a backend

## License

Made with ❤️

Published under [MIT License](./LICENCE).
