import { validateDomain } from '../../utils/redirect'
import type { CruxData } from '../../api/crux/[domain].get'
import type { LighthouseData } from '../../api/run/[domain].get'

interface StyleConfig {
  gradient: string
  rect: string
}

export default defineCachedEventHandler(async (event) => {
  // Get and validate the domain from the URL parameter
  const domain = await validateDomain(getRouterParam(event, 'domain'))

  // Get optional query parameters for customization
  const query = getQuery(event)
  const style = String(query.style || 'default') // default, flat, flat-square, plastic
  const metric = String(query.metric || 'cwv') // cwv, lcp, cls, inp, performance

  try {
    // Fetch the CrUX data using the existing API
    const cruxData = await $fetch(`/api/crux/${domain}`)

    setResponseHeader(event, 'Content-Type', 'image/svg+xml')

    // Generate the badge with Core Web Vitals based on requested metric
    let svgBadge: string

    if (metric === 'cwv') {
      svgBadge = generateCWVBadge(domain, cruxData, style)
    }
    else if (['lcp', 'cls', 'inp'].includes(metric)) {
      svgBadge = generateMetricBadge(domain, cruxData, metric, style)
    }
    else {
      // Default to CWV badge if invalid metric specified
      svgBadge = generateCWVBadge(domain, cruxData, style)
    }

    return svgBadge
  }
  catch {
    // If CrUX data is not available, try to fetch Lighthouse data
    try {
      const lighthouseData = await $fetch(`/api/run/${domain}`)

      // Set content type header for SVG
      setResponseHeader(event, 'Content-Type', 'image/svg+xml')

      let svgBadge: string

      // Check if user requested a Lighthouse metric specifically
      if (metric === 'performance' || !['cwv', 'lcp', 'cls', 'inp'].includes(metric)) {
        svgBadge = generateLighthouseBadge(domain, lighthouseData, metric, style)
      }
      else {
        // Generate default Lighthouse badge if CrUX data not available but CWV metric requested
        svgBadge = generateLighthouseBadge(domain, lighthouseData, 'performance', style)
      }

      return svgBadge
    }
    catch {
      throw createError({
        statusCode: 404,
        message: 'No performance data available for this domain.',
      })
    }
  }
}, {
  base: 'pagespeed',
  swr: true,
  shouldBypassCache: () => !!import.meta.dev,
  getKey: event => `badge:v1:${getRouterParam(event, 'domain')}${getQuery(event).style || 'default'}${getQuery(event).metric || 'cwv'}`,
  maxAge: 60 * 60,
  staleMaxAge: 24 * 60 * 60,
})

function generateCWVBadge(domain: string, data: CruxData, style: string = 'default'): string {
  // Color mappings for Core Web Vitals
  const getStatusColor = (pass: boolean) => pass ? '#23c55e' : '#ef4444'
  const overallStatus = data.cwv

  // Get badge width based on content
  const labelText = domain
  const statusText = overallStatus ? 'CWV Pass' : 'CWV Fail'

  const labelWidth = Math.max(labelText.length * 6.5, 70) + 10
  const statusWidth = statusText.length * 7.5 + 10
  const totalWidth = labelWidth + statusWidth

  const styleConfig = getBadgeStyleConfig(style)

  // Create SVG with Core Web Vitals data
  return `<svg width="${totalWidth}" height="20" viewBox="0 0 ${totalWidth} 20" xmlns="http://www.w3.org/2000/svg">
    ${styleConfig.gradient}
    <rect width="${labelWidth}" height="20" fill="#212121" ${styleConfig.rect}/>
    <rect x="${labelWidth}" width="${statusWidth}" height="20" fill="${getStatusColor(overallStatus)}" ${styleConfig.rect}/>
    <rect width="${totalWidth}" height="20" fill="url(#a)" ${styleConfig.rect}/>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,sans-serif" font-size="11">
      <text x="${labelWidth / 2}" y="14">${labelText}</text>
      <text x="${labelWidth + statusWidth / 2}" y="14">${statusText}</text>
    </g>
    <title>
      ${domain} - Core Web Vitals ${overallStatus ? 'Pass' : 'Fail'}
      LCP: ${data.lcp.caption} | CLS: ${data.cls.caption} | INP: ${data.inp.caption}
    </title>
  </svg>`
}

function generateMetricBadge(domain: string, data: CruxData, metric: string, style: string = 'default'): string {
  let metricLabel = ''
  let metricValue: string | number = ''
  let metricThresholds = { good: 0, needsImprovement: 0, unit: '' }

  // Define thresholds and get values based on metric
  const thresholds = {
    lcp: { good: 2.5, needsImprovement: 4.0, unit: 's' }, // seconds
    cls: { good: 0.1, needsImprovement: 0.25, unit: '' }, // unitless
    inp: { good: 200, needsImprovement: 500, unit: 'ms' }, // milliseconds
  }

  if (metric === 'lcp') {
    metricLabel = 'LCP'
    metricValue = data.lcp.caption
    metricThresholds = thresholds.lcp
  }
  else if (metric === 'cls') {
    metricLabel = 'CLS'
    metricValue = data.cls.caption
    metricThresholds = thresholds.cls
  }
  else if (metric === 'inp') {
    metricLabel = 'INP'
    metricValue = data.inp.caption
    metricThresholds = thresholds.inp
  }

  // Get badge width based on content
  const labelWidth = Math.max(domain.length * 6.5, 70) + 10
  const valueWidth = Math.max(metricValue.toString().length * 7.5, 40) + 20
  const totalWidth = labelWidth + valueWidth

  // Convert string metric value to numeric for comparison
  const numericValue = typeof metricValue === 'string' ? parseFloat(metricValue) : metricValue

  // Determine color based on metric value and thresholds
  const metricColor = getMetricColor(numericValue, metricThresholds)

  const styleConfig = getBadgeStyleConfig(style)

  // Create SVG with the specific metric
  return `<svg width="${totalWidth}" height="20" viewBox="0 0 ${totalWidth} 20" xmlns="http://www.w3.org/2000/svg">
    ${styleConfig.gradient}
    <rect width="${labelWidth}" height="20" fill="#212121" ${styleConfig.rect}/>
    const<rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${metricColor}" ${styleConfig.rect}/>
    <rect width="${totalWidth}" height="20" fill="url(#a)" ${styleConfig.rect}/>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,sans-serif" font-size="11">
      <text x="${labelWidth / 2}" y="14">${domain} ${metricLabel}</text>
      <text x="${labelWidth + valueWidth / 2}" y="14">${metricValue}</text>
    </g>
    <title>
      ${domain} - ${metricLabel}: ${metricValue}
      Good: ≤${metricThresholds.good}${metricThresholds.unit} | Needs Improvement: ≤${metricThresholds.needsImprovement}${metricThresholds.unit} | Poor: >${metricThresholds.needsImprovement}${metricThresholds.unit}
    </title>
  </svg>`
}

function generateLighthouseBadge(domain: string, data: LighthouseData, metric: string = 'performance', style: string = 'default'): string {
  // Get performance score and determine color
  let metricLabel = ''
  let score = 0

  if (metric === 'performance') {
    metricLabel = 'Performance'
    score = data.performance
  }
  else if (metric === 'accessibility') {
    metricLabel = 'Accessibility'
    score = data.accessibility
  }
  else if (metric === 'best-practices' || metric === 'bestPractices') {
    metricLabel = 'Best Practices'
    score = data.bestPractices
  }
  else if (metric === 'seo') {
    metricLabel = 'SEO'
    score = data.seo
  }
  else {
    // Default to performance
    metricLabel = 'Performance'
    score = data.performance
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#23c55e' // green
    if (score >= 50) return '#fbbf24' // yellow
    return '#ef4444' // red
  }

  // Get badge width based on content
  const labelWidth = Math.max((domain + ' ' + metricLabel).length * 6, 70) + 10
  const scoreWidth = 40
  const totalWidth = labelWidth + scoreWidth

  const styleConfig = getBadgeStyleConfig(style)

  // Create SVG with Lighthouse performance score
  return `<svg width="${totalWidth}" height="20" viewBox="0 0 ${totalWidth} 20" xmlns="http://www.w3.org/2000/svg">
    ${styleConfig.gradient}
    <rect width="${labelWidth}" height="20" fill="#212121" ${styleConfig.rect}/>
    <rect x="${labelWidth}" width="${scoreWidth}" height="20" fill="${getScoreColor(score)}" ${styleConfig.rect}/>
    <rect width="${totalWidth}" height="20" fill="url(#a)" ${styleConfig.rect}/>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,sans-serif" font-size="11">
      <text x="${labelWidth / 2}" y="14">${domain} ${metricLabel}</text>
      <text x="${labelWidth + scoreWidth / 2}" y="14">${Math.round(score)}</text>
    </g>
    <title>
      ${domain} - ${metricLabel}: ${Math.round(score)}
      Performance: ${Math.round(data.performance)} | Accessibility: ${Math.round(data.accessibility)} | Best Practices: ${Math.round(data.bestPractices)} | SEO: ${Math.round(data.seo)}
    </title>
  </svg>`
}

function getBadgeStyleConfig(style: string): StyleConfig {
  // Define different badge styles
  const styles: Record<string, StyleConfig> = {
    'default': {
      gradient: `<linearGradient id="a" x2="0" y2="100%">
        <stop offset="0" stop-color="#eee" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>`,
      rect: '',
    },
    'flat': {
      gradient: '',
      rect: '',
    },
    'flat-square': {
      gradient: '',
      rect: '',
    },
    'plastic': {
      gradient: `<linearGradient id="a" x2="0" y2="100%">
        <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
        <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
        <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
        <stop offset="1" stop-color="#000" stop-opacity=".5"/>
      </linearGradient>`,
      rect: '',
    },
  }

  // Apply border radius except for flat-square style
  if (style !== 'flat-square' && style in styles) {
    styles[style].rect = 'rx="3"'
  }

  return styles[style] || styles.default
}

function getMetricColor(value: number, thresholds: { good: number, needsImprovement: number }): string {
  if (value <= thresholds.good) {
    return '#23c55e' // green
  }
  else if (value <= thresholds.needsImprovement) {
    return '#fbbf24' // yellow
  }
  return '#ef4444' // red
}
