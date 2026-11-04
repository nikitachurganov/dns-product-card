<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { BaseUiButton, BaseUiIconButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
import { ActionTag } from '@dns-modules/tag'
import { Checkbox } from '@dns-modules/checkbox'
import { IconChevronLeft, IconChevronRight, IconChevronDown, IconArrowUpRight, IconWishlist, IconWishlistFill, IconController, IconRatingFill } from '@dns-modules/font-icon'
import { builds, money } from '../data'

const props = defineProps({ selection: { type: Object, required: true } })
const emit = defineEmits(['show-build', 'notify', 'update:selection'])
const rail = ref(null), expanded = ref(false), canPrev = ref(false), canNext = ref(false)
const names = computed(() => Object.fromEntries(builds.map(build => [build.id, `ПК ${build.cpu} / ${build.gpu} / ${build.ram} DDR5 / SSD ${build.ssd}`])))
function updateArrows() {
 const el = rail.value
 if (!el) return
 canPrev.value = el.scrollLeft > 4
 canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
function scroll(dir) {
 const card = rail.value?.querySelector('.build-card')
 const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail.value).columnGap) : 224
 rail.value?.scrollBy({ left: dir * step * 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
function selected(kind, id) { return props.selection[kind].includes(id) }
function toggle(kind, build) {
 const exists = selected(kind, build.id)
 emit('update:selection', { ...props.selection, [kind]: exists ? props.selection[kind].filter(id => id !== build.id) : [...props.selection[kind], build.id] })
 const messages = { cart: ['Сборка добавлена в корзину', 'Сборка удалена из корзины'], favorites: ['Сборка добавлена в избранное', 'Сборка удалена из избранного'], compare: ['Сборка добавлена к сравнению', 'Сборка удалена из сравнения'] }
 emit('notify', messages[kind][exists ? 1 : 0])
}
async function toggleExpanded() { expanded.value = !expanded.value; await nextTick(); updateArrows() }
let observer
onMounted(() => { observer = new ResizeObserver(updateArrows); observer.observe(rail.value); updateArrows() })
onUnmounted(() => observer?.disconnect())
</script>

<template>
 <section id="ready-builds" class="surface ready-builds" aria-labelledby="builds-title">
  <div class="builds-heading"><h2 id="builds-title">Готовые сборки с этим блоком питания</h2><ActionTag class="assemble-pc-tag" tag="a" href="https://www.dns-shop.ru/configurator/">Собрать ПК<template #icon-right><IconArrowUpRight/></template></ActionTag></div>
  <div class="build-carousel" :class="{ 'is-expanded': expanded }" role="region" aria-label="Карусель готовых сборок">
   <div ref="rail" class="builds-rail" :class="{ expanded }" @scroll="updateArrows">
    <article v-for="build in builds" :key="build.id" class="build-card" :aria-label="names[build.id]">
     <div class="build-card-shell">
      <button class="build-image" :aria-label="'Посмотреть сборку '+build.cpu+' / '+build.gpu" @click="emit('show-build',build)">
       <img :src="'/images/'+build.image" :alt="'Готовый ПК в корпусе '+build.case" loading="lazy"/>
       <span class="gaming-badge" aria-hidden="true"><IconController/></span>
      </button>
      <div class="build-info">
       <strong class="build-price">{{money(build.price)}}</strong>
       <BaseLink class="build-title" tag="button" variant="navigation" size="small" :title="names[build.id]" @click="emit('show-build',build)">{{names[build.id]}}</BaseLink>
      </div>
      <div class="build-hover-actions">
       <div class="build-social">
        <label class="build-compare"><Checkbox :checked="selected('compare',build.id)" @click="toggle('compare',build)"/><span>Сравнить</span></label>
        <button class="build-rating" :aria-label="'Отзывы о сборке '+build.cpu" @click="emit('show-build',build)"><IconRatingFill aria-hidden="true"/><b>4.81</b><span class="rating-divider"></span><span>266</span></button>
       </div>
       <div class="build-purchase">
        <BaseUiButton size="medium" :variant="selected('cart',build.id)?'info':'primary'" :aria-label="(selected('cart',build.id)?'Удалить из корзины сборку ':'Купить сборку ')+build.cpu+' / '+build.gpu" @click="toggle('cart',build)">{{selected('cart',build.id)?'В корзине':'Купить'}}</BaseUiButton>
        <BaseUiIconButton size="medium" variant="secondary" :aria-pressed="selected('favorites',build.id)" :aria-label="(selected('favorites',build.id)?'Удалить из избранного сборку ':'Добавить в избранное сборку ')+build.cpu+' / '+build.gpu" @click="toggle('favorites',build)"><component :is="selected('favorites',build.id)?IconWishlistFill:IconWishlist" aria-hidden="true"/></BaseUiIconButton>
       </div>
      </div>
     </div>
    </article>
   </div>
   <template v-if="!expanded">
    <BaseUiIconButton class="build-arrow build-arrow-prev" size="medium" variant="tertiary" aria-label="Предыдущие сборки" :disabled="!canPrev" @click="scroll(-1)"><IconChevronLeft aria-hidden="true"/></BaseUiIconButton>
    <BaseUiIconButton class="build-arrow build-arrow-next" size="medium" variant="tertiary" aria-label="Следующие сборки" :disabled="!canNext" @click="scroll(1)"><IconChevronRight aria-hidden="true"/></BaseUiIconButton>
   </template>
  </div>
  <BaseUiButton class="all-builds" variant="secondary" size="large" @click="toggleExpanded">{{expanded?'Свернуть сборки':'Все сборки'}}<template #icon-right><component :is="expanded?IconChevronDown:IconArrowUpRight" aria-hidden="true"/></template></BaseUiButton>
 </section>
</template>
