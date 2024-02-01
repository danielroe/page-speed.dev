import { withoutLeadingSlash } from 'ufo'

export default defineEventHandler(async event => {
  if (event.path.startsWith('/api') || event.path.startsWith('/__og-image__')) { return }

  const path = '/' + withoutLeadingSlash(event.path).toLowerCase().replace(/(\/|\?).*$/, '').trim()
  if (event.path !== path) {
    await sendRedirect(event, path)
  }
})
