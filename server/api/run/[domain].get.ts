export default defineCachedEventHandler(async (event) => {
  const domain = await validateDomain(getRouterParam(event, 'domain'))

  const token = useRuntimeConfig(event).google.apiToken
  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'PageSpeed Insights API token is not configured' })
  }

  try {
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
  }
  catch (e: unknown) {
    const err = e as { statusCode?: number, status?: number, data?: { error?: { message?: string, status?: string } } }
    const upstreamStatus = err.statusCode ?? err.status
    const upstreamMessage = err.data?.error?.message ?? err.data?.error?.status ?? (e as Error).message
    console.error('PageSpeed Insights request failed', { domain, upstreamStatus, upstreamMessage })
    throw createError({
      statusCode: upstreamStatus === 429 ? 503 : 502,
      statusMessage: `PageSpeed Insights upstream error (${upstreamStatus ?? 'unknown'}): ${upstreamMessage ?? 'no message'}`,
    })
  }
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
