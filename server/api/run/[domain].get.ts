export default defineCachedEventHandler(async (event) => {
  const domain = await validateDomain(getRouterParam(event, 'domain'))

  const token = useRuntimeConfig(event).google.apiToken
  const results = await $fetch<PagespeedInsightsResult>(`/runPagespeed?url=${encodeURIComponent(`https://${domain}`)}&category=ACCESSIBILITY&category=BEST_PRACTICES&category=PERFORMANCE&category=SEO&strategy=mobile&key=${token}`, {
    baseURL: 'https://www.googleapis.com/pagespeedonline/v5',
  })
  return {
    domain,
    performance: results.lighthouseResult.categories.performance.score * 100,
    seo: results.lighthouseResult.categories.seo.score * 100,
    accessibility: results.lighthouseResult.categories.accessibility.score * 100,
    bestPractices: results.lighthouseResult.categories['best-practices'].score * 100,
    timestamp: Date.now(),
  } satisfies LighthouseData
}, {
  base: 'pagespeed',
  swr: true,
  getKey: event => `domain:v1:${getRouterParam(event, 'domain')}`,
  maxAge: 60 * 60,
  staleMaxAge: 24 * 60 * 60,
})

/** Helpers */

export interface LighthouseData {
  domain: string
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
  timestamp: number
}

interface PagespeedInsightsResult {
  lighthouseResult: {
    categories: {
      'performance': {
        score: number
      }
      'seo': {
        score: number
      }
      'accessibility': {
        score: number
      }
      'best-practices': {
        score: number
      }
    }
  }
}
