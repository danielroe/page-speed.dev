import { parseURL } from 'ufo'

export async function followRedirect(domain?: string) {
  if (!domain || domain.includes('/') || domain.includes('%'))
    throw createError({ message: 'Invalid domain', statusCode: 422 })

  try {
    const response = await fetch(`https://${domain}`, { method: 'HEAD' })
    if (response.redirected) {
      const host = parseURL(response.url).host
      if (!host || !response.url.startsWith('https://')) {
        throw createError({ message: 'Invalid domain redirect', statusCode: 422 })
      }
      return host
    }
    return domain
  }
  catch (error) {
    throw createError({ message: 'Invalid domain', statusCode: 422 })
  }
}
