<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { BaseUiButton, BaseUiIconButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
import { Checkbox } from '@dns-modules/checkbox'
import { IconChevronLeft, IconChevronRight, IconArrowUpRight, IconWishlist, IconWishlistFill, IconController, IconRatingFill } from '@dns-modules/font-icon'
import { money } from '../data'

const props = defineProps({ id: {type:String,required:true}, title: {type:String,required:true}, items: {type:Array,required:true}, selection: {type:Object,required:true}, allUrl: String, allLabel: String, tabId: String })
const emit = defineEmits(['update:selection','notify'])
const rail = ref(null), canPrev = ref(false), canNext = ref(false)
function updateArrows() {
 const el = rail.value
 if (!el) return
 canPrev.value = el.scrollLeft > 4
 canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
function scroll(direction) {
 const el = rail.value, card = el?.querySelector('.build-card')
 if (!card) return
 el.scrollBy({left:direction * (card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap)) * 2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
}
function selected(kind,item) { return props.selection[kind].includes(item.id) }
function toggle(kind,item) {
 const exists = selected(kind,item)
 emit('update:selection',{...props.selection,[kind]:exists?props.selection[kind].filter(id=>id!==item.id):[...props.selection[kind],item.id]})
 const labels={cart:['Товар добавлен в корзину','Товар удалён из корзины'],compare:['Товар добавлен к сравнению','Товар удалён из сравнения'],favorites:['Товар добавлен в избранное','Товар удалён из избранного']}
 emit('notify',labels[kind][exists?1:0])
}
watch(()=>props.items,async()=>{await nextTick();if(rail.value)rail.value.scrollLeft=0;updateArrows()})
let observer
onMounted(()=>{observer=new ResizeObserver(updateArrows);observer.observe(rail.value);updateArrows()})
onUnmounted(()=>observer?.disconnect())
</script>

<template>
 <section :id="id" class="surface ready-builds recommendation-widget" :aria-label="title">
  <div class="builds-heading"><slot name="heading"><h2>{{title}}</h2></slot></div>
  <div :id="id+'-panel'" class="build-carousel" :role="tabId?'tabpanel':'region'" :aria-labelledby="tabId || undefined" :aria-label="tabId?undefined:title" :tabindex="tabId?0:undefined">
   <div ref="rail" class="builds-rail" @scroll="updateArrows">
    <article v-for="item in items" :key="item.id" class="build-card" :aria-label="item.name">
     <div class="build-card-shell">
      <a class="build-image" :href="item.url" :aria-label="item.name"><img :src="item.image" :alt="item.alt || item.name" loading="lazy"/><span v-if="item.gaming" class="gaming-badge" aria-hidden="true"><IconController/></span></a>
      <div class="build-info"><strong class="build-price">{{money(item.price)}}</strong><BaseLink class="build-title" :href="item.url" variant="navigation" size="small" :title="item.name">{{item.name}}</BaseLink></div>
      <div class="build-hover-actions">
       <div v-if="item.rating" class="build-social"><label class="build-compare"><Checkbox :checked="selected('compare',item)" @click="toggle('compare',item)"/><span>Сравнить</span></label><a class="build-rating" :href="item.url+'?opinion'" :aria-label="'Отзывы: '+item.name"><IconRatingFill aria-hidden="true"/><b>{{item.rating}}</b><span class="rating-divider"></span><span>{{item.reviews}}</span></a></div>
       <div class="build-purchase"><BaseUiButton size="medium" :variant="selected('cart',item)?'info':'primary'" :aria-label="(selected('cart',item)?'Удалить из корзины: ':'Купить: ')+item.name" @click="toggle('cart',item)">{{selected('cart',item)?'В корзине':'Купить'}}</BaseUiButton><BaseUiIconButton size="medium" variant="secondary" :aria-pressed="selected('favorites',item)" :aria-label="(selected('favorites',item)?'Удалить из избранного: ':'В избранное: ')+item.name" @click="toggle('favorites',item)"><component :is="selected('favorites',item)?IconWishlistFill:IconWishlist" aria-hidden="true"/></BaseUiIconButton></div>
      </div>
     </div>
    </article>
   </div>
   <BaseUiIconButton class="build-arrow build-arrow-prev" size="medium" variant="tertiary" :aria-label="'Предыдущие товары: '+title" :disabled="!canPrev" @click="scroll(-1)"><IconChevronLeft aria-hidden="true"/></BaseUiIconButton>
   <BaseUiIconButton class="build-arrow build-arrow-next" size="medium" variant="tertiary" :aria-label="'Следующие товары: '+title" :disabled="!canNext" @click="scroll(1)"><IconChevronRight aria-hidden="true"/></BaseUiIconButton>
  </div>
  <BaseUiButton class="all-builds" tag="a" :href="allUrl" variant="secondary" size="large">{{allLabel}}<template #icon-right><IconArrowUpRight aria-hidden="true"/></template></BaseUiButton>
 </section>
</template>

<style scoped>
.recommendation-widget .build-image{display:flex;align-items:center;justify-content:center}
.recommendation-widget .build-rating{font-size:14px!important;text-decoration:none}
.recommendation-widget .all-builds:hover{color:var(--text-primary)}
</style>
