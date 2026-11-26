<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { TabList, Tab } from '@dns-modules/base-ui-tabs'
import { BaseUiIconButton } from '@dns-modules/base-ui-button'
import { IconNavChevronLeft, IconNavChevronRight, IconActionPlayFilled } from '@dns-modules/font-icon-v3'
import { feed, feedTabs } from '../data'

const selected = ref('all')
const rail = ref(null)
const canPrev = ref(false)
const canNext = ref(false)
const items = computed(() => selected.value === 'all' ? feed : feed.filter((item) => item.types.includes(selected.value)))

function updateArrows() {
  const el = rail.value
  if (!el) return
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
function scroll(direction) {
  rail.value.scrollBy({ left: direction * (rail.value.clientWidth - 80), behavior: 'smooth' })
}
async function onTabsKeydown(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const index = feedTabs.findIndex((tab) => tab.id === selected.value)
  const last = feedTabs.length - 1
  const next = { ArrowLeft: index ? index - 1 : last, ArrowRight: index === last ? 0 : index + 1, Home: 0, End: last }[event.key]
  selected.value = feedTabs[next].id
  await nextTick()
  document.getElementById(`feed-tab-${selected.value}`)?.focus()
}

watch(items, async () => { await nextTick(); rail.value.scrollLeft = 0; updateArrows() })
let observer
onMounted(() => { updateArrows(); observer = new ResizeObserver(updateArrows); observer.observe(rail.value) })
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section class="feed" aria-labelledby="feed-title">
    <div class="page-width">
      <h2 id="feed-title" class="sr-only">Новости, блоги и обзоры</h2>
      <TabList class="feed__tabs" :tabs="feedTabs" type="filled" role="tablist" aria-label="Тип материалов" @keydown="onTabsKeydown">
        <template #default="tab">
          <Tab :id="`feed-tab-${tab.id}`" type="filled" size="small" role="tab" :is-active="selected === tab.id" :aria-selected="selected === tab.id" aria-controls="feed-list" :tabindex="selected === tab.id ? 0 : -1" @click="selected = tab.id">{{ tab.label }}</Tab>
        </template>
      </TabList>
      <div class="feed__viewport">
        <ul id="feed-list" ref="rail" class="feed__rail" role="tabpanel" :aria-labelledby="`feed-tab-${selected}`" @scroll.passive="updateArrows">
          <li v-for="item in items" :key="item.id" class="feed-card">
            <a :href="item.href">
              <span class="feed-card__image">
                <img v-fade :src="item.image" :alt="item.title" loading="lazy" width="262" height="177" />
                <span v-if="item.types.includes('video')" class="feed-card__play" aria-label="Есть видео"><IconActionPlayFilled /></span>
              </span>
              <span class="feed-card__title">{{ item.title }}</span>
            </a>
          </li>
        </ul>
        <BaseUiIconButton v-show="canPrev" class="feed__arrow feed__arrow--prev" variant="secondary" size="small" aria-label="Предыдущие материалы" @click="scroll(-1)"><IconNavChevronLeft /></BaseUiIconButton>
        <BaseUiIconButton v-show="canNext" class="feed__arrow feed__arrow--next" variant="secondary" size="small" aria-label="Следующие материалы" @click="scroll(1)"><IconNavChevronRight /></BaseUiIconButton>
      </div>
    </div>
  </section>
</template>
