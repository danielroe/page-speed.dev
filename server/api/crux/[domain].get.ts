const cwvKeys = ['largest_contentful_paint', 'cumulative_layout_shift', 'interaction_to_next_paint'] as const

export default defineCachedEventHandler(async (event) => {
  const domain = await validateDomain(getRouterParam(event, 'domain'))

  try {
    const results = await $fetch<CrUXResult>(`/records:queryRecord`, {
      baseURL: 'https://chromeuxreport.googleapis.com/v1',
      method: 'POST',
      query: {
        key: useRuntimeConfig().google.apiToken,
      },
      body: {
        origin: `https://${domain}`,
        formFactor: 'PHONE',
      },
    })

    return {
      domain,
      cwv: cwvKeys.every(key => Number(results.record.metrics[key].percentiles.p75) <= (Number(results.record.metrics[key].histogram[0].end || 0))),
      lcp: normalizeHistogram(results.record.metrics.largest_contentful_paint, { timeBased: true }),
      cls: normalizeHistogram(results.record.metrics.cumulative_layout_shift),
      inp: normalizeHistogram(results.record.metrics.interaction_to_next_paint, { timeBased: true }),
      timestamp: Date.now(),
    }
  }
  catch (e: unknown) {
    console.error(e)
    throw createError({ message: `No CrUX report available:${(e as Error).toString()}`, statusCode: 404 })
  }
}, {
  base: 'pagespeed',
  swr: true,
  shouldBypassCache: () => !!import.meta.dev,
  getKey: event => `crux:domain:v1:${getRouterParam(event, 'domain')}`,
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

function normalizeHistogram(metric: CrUXResult['record']['metrics'][keyof CrUXResult['record']['metrics']], options: { timeBased?: boolean } = {}) {
  const segments = [] as number[]
  let count = 0
  for (const item of metric.histogram) {
    const value = Number(item.density || 0) * 100
    count += value
    segments.push(Math.round(count))
  }

  if (!options.timeBased) {
    return {
      segments,
      caption: metric.percentiles.p75,
    }
  }

  const caption = Number(metric.percentiles.p75) > 1000
    ? `${(Number(metric.percentiles.p75) / 1000).toFixed(1)}s`
    : `${Math.round(Number(metric.percentiles.p75))}ms`

  return {
    caption,
    segments,
  }
}
