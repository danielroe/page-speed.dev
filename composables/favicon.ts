export function useFavicon (getValue: () => number | false) {
  const favicon = computed(() => {
    const radius = 80
    const stroke = 14
    const normalizedRadius = radius - stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI

    const value = getValue()

    const color = !value ? '#6b7280' : value >= 90 ? '#23c55e' : value >= 50 ? '#fbbf24' : '#ef4444'
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="${radius * 2}" width="${radius * 2}">
    <style>@keyframes spin {
  from {transform: rotate(0deg)}
  to {transform: rotate(360deg)}
}</style>
    <circle
      stroke="${color}"
      fill="transparent"
      stroke-linecap="round"
      stroke-dasharray="${circumference + ' ' + circumference}"
      style="transform-origin:center;stroke-dashoffset:${circumference - (Math.floor((value || 85) / 4) * 4) / 100 * circumference};transform:rotate(270deg)${!value ? ';animation:spin 1s linear infinite' : ''}"
      stroke-width="${stroke}"
      r="${normalizedRadius}"
      cx="${radius}"
      cy="${radius}"
    />
    <circle
      fill="${color}"
      stroke-width="${stroke}"
      r="${normalizedRadius - 35}"
      cx="${radius}"
      cy="${radius}"
    />
  </svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
  })

  useHead({
    link: [
      () => ({
        key: 'favicon',
        rel: 'icon',
        type: 'image/svg',
        href: favicon.value
      })
    ]
  })
}
