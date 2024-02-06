export default defineCachedEventHandler(async event => {
  const domain = getRouterParam(event, 'domain')
  if (!domain || domain.includes('/') || domain.includes('%')) {
    throw createError({ message: 'Invalid domain', statusCode: 422 })
  }

  try {
    const results = await $fetch<CrUXResult>(`/records:queryRecord`, {
      baseURL: 'https://chromeuxreport.googleapis.com/v1',
      method: 'POST',
      query: {
        key: useRuntimeConfig().google.apiToken,
      },
      body: {
        origin: `https://${domain}`,
        formFactor: 'PHONE'
      },
    })

    return {
      cwv: computeCWVScore(results.record.metrics),
      lcp: normalizeHistogram(results.record.metrics['largest_contentful_paint']),
      cls: normalizeHistogram(results.record.metrics['cumulative_layout_shift']),
      inp: normalizeHistogram(results.record.metrics['interaction_to_next_paint']),
      timestamp: Date.now(),
    }
  } catch (e: any) {
    console.error(e)
    throw createError({ message: 'No CrUX report available:' + e.toString(), statusCode: 404 })
  }
}, {
  base: 'pagespeed',
  swr: true,
  shouldBypassCache: () => true,
  getKey: (event) => 'crux:domain:' + getRouterParam(event, 'domain'),
  maxAge: 60 * 60,
  staleMaxAge: 24 * 60 * 60,
})

/** Helpers */

interface CrUXResult {
  record: {
    key: { origin: string }
    metrics: Record<'cumulative_layout_shift' | 'first_contentful_paint' | /* 'first_input_delay' | */ 'interaction_to_next_paint' | 'largest_contentful_paint' | 'experimental_time_to_first_byte', {
      histogram: Array<{
        start: number | string
        end?: number | string
        density?: number
      }>
      percentiles: {
        p75: number
      }
    }>
    collectionPeriod: Record<'firstDate' | 'lastDate', {
      year: number
      month: number
      day: number
    }>
  }
}

const cwvKeys = ['cumulative_layout_shift', 'first_contentful_paint', 'interaction_to_next_paint', 'largest_contentful_paint', 'experimental_time_to_first_byte'] satisfies Array<keyof CrUXResult['record']['metrics']>

function computeCWVScore (metrics: CrUXResult['record']['metrics']) {
  const scores: number[] = []
  for (const key of cwvKeys) {
    const passes = Number(metrics[key].percentiles.p75) < (Number(metrics[key].histogram[0].end || 0))
    scores.push(passes ? 100 : 0)
  }
  return scores.reduce((a, b) => a + b) / scores.length
}

function normalizeHistogram (metric: CrUXResult['record']['metrics'][keyof CrUXResult['record']['metrics']]) {
  const segments = [] as number[]
  let count = 0
  for (const item of metric.histogram) {
    const value = Number(item.density || 0) * 100
    count += value
    segments.push(Math.round(count))
  }

  const caption = metric.percentiles.p75 > 1000
    ? (Number(metric.percentiles.p75) / 1000).toFixed(1) + 's'
    : Math.round(Number(metric.percentiles.p75)) + 'ms'

  return {
    caption,
    segments,
  }
}
