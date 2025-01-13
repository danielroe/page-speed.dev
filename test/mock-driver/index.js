// @ts-check

import { defineDriver } from 'unstorage'

import * as atinux from './data/atinux.com.js'
import * as roe from './data/roe.dev.js'

/** @param {string} domain */
const crux = domain => `nitro:handlers:_:cruxdomainv2${domain.replace('.', '')}.json`
/** @param {string} domain */
const lighthouse = domain => `nitro:handlers:_:domainv1${domain.replace('.', '')}.json`

const store = {
  [crux('roe.dev')]: roe.crux,
  [lighthouse('roe.dev')]: roe.lighthouse,
  [lighthouse('atinux.com')]: atinux.lighthouse,
}

const keys = new Set(Object.keys(store))
const YEAR_FROM_NOW = Date.now() + (1000 * 60 * 60 * 24 * 365)

export default defineDriver(() => {
  return {
    name: 'mock-driver',
    watch: () => () => {},
    dispose: () => {},
    hasItem: id => keys.has(id),
    getKeys: () => [...keys],
    setItem: () => {},
    getItem: async (id) => {
      const result = store[id] ?? null
      console.log({ result })
      return {
        ...result,
        mtime: Date.now(),
        expires: YEAR_FROM_NOW,
      }
    },
  }
})
