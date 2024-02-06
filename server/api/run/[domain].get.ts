export default defineCachedEventHandler(async event => {
  const domain = getRouterParam(event, 'domain')
  if (!domain || domain.includes('/') || domain.includes('%')) {
    throw createError({ message: 'Invalid domain', statusCode: 422 })
  }
  const token = useRuntimeConfig().google.apiToken
  const results = await $fetch<PagespeedInsightsResult>(`/runPagespeed?url=${encodeURIComponent(`https://${domain}`)}&category=ACCESSIBILITY&category=BEST_PRACTICES&category=PERFORMANCE&category=SEO&strategy=mobile&key=${token}`, {
    baseURL: 'https://www.googleapis.com/pagespeedonline/v5',
  })
  return {
    performance: results.lighthouseResult.categories.performance.score * 100,
    seo: results.lighthouseResult.categories.seo.score * 100,
    accessibility: results.lighthouseResult.categories.accessibility.score * 100,
    bestPractices: results.lighthouseResult.categories['best-practices'].score * 100,
    timestamp: Date.now(),
  }
}, {
  base: 'pagespeed',
  swr: true,
  getKey: (event) => 'domain:' + getRouterParam(event, 'domain'),
  maxAge: 60 * 60,
  staleMaxAge: 24 * 60 * 60,
})

/** Helpers */

interface PagespeedInsightsResult {
  lighthouseResult: {
    categories: {
      performance: {
        score: number
      }
      seo: {
        score: number
      }
      accessibility: {
        score: number
      }
      'best-practices': {
        score: number
      }
    }
  }
}
