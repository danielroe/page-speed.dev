import { withoutLeadingSlash } from 'ufo'

const VALID_DOMAIN_RE = /^[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

export const isValidDomain = (domain: string) => VALID_DOMAIN_RE.test(domain)

export function sanitizeDomain(domain: string) {
  return withoutLeadingSlash(domain).toLowerCase().replace(/\\/g, '').replace(/[?/].*$/, '').trim()
}
