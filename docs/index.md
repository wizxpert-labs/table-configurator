---
layout: home
title: Table Configurator
hero:
  name: Table Configurator
  text: Vue 3 toolkit for PrimeVue 4.x
  tagline: Extends PrimeVue DataTable & TreeTable with persistent column visibility, per-column styling, and toggleable in-cell sub-fields
  image:
    src: /sample.png
    alt: Table Configurator — demo of control panel toggling sub-fields
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-github-user/table-configurator
    - theme: alt
      text: View on npm
      link: https://www.npmjs.com/package/@wizxpert/table-configurator
features:
  - title: Requirements
    details: · vue ^3.5.0 <br>· primevue ^4.3.0 <br> · pinia ^3.0.0<br> · primeicons ^7.0.0<br> · primeflex ^4.0.0 <br>· @primevue/themes ^4.3.0

  - title: Persistent settings
    details: Column visibility, order, widths, and sub-fields are saved per storageKey

  - title: In-cell sub-fields
    details: Named slots in WxTableCell that users can toggle from the control panel

  - title: Per-column styles
    details: Styles defined in WxTableHeader override global table styles
---

<script setup lang="ts">
/* All comments in English */
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  // Ensure DOM is ready before querying
  await nextTick()

  // Mark page for CSS that uses hero image as background
  document.documentElement.setAttribute('data-hero-as-bg', '1')

  // Grab hero elements
  const heroImg = document.querySelector<HTMLImageElement>('.VPHomeHero .image .image-src')
  const heroRoot = document.querySelector<HTMLElement>('.VPHomeHero')

  if (heroImg && heroRoot) {
    const src = heroImg.getAttribute('src') || ''
    if (src) {
      // Expose hero image URL via CSS var (used by custom styles)
      heroRoot.style.setProperty('--hero-bg-url', `url("${src}")`)
    }

    // Replace inline <img> with transparent pixel and hide it from a11y tree
    const transparentPx =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA' +
      'AAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='

    heroImg.setAttribute('src', transparentPx)
    heroImg.setAttribute('alt', '')
    heroImg.setAttribute('aria-hidden', 'true')
  }
})
</script>

## Live demo

<!-- Prevent SSR issues with localStorage / window -->
<ClientOnly>
  <LiveWxTableDemo />
</ClientOnly>
