<script setup>
import { ref, computed, nextTick } from 'vue'
import { TabList, Tab } from '@dns-modules/base-ui-tabs'
import '@dns-modules/base-ui-tabs/style.css'
import ProductCarousel from './ProductCarousel.vue'
import products from '../recommendations.json'

defineProps({selection:{type:Object,required:true}})
const emit=defineEmits(['update:selection','notify'])
const active=ref('accessories')
const tabs=[{id:'accessories',label:'Аксессуары'},{id:'services',label:'Услуги'}]
const current=computed(()=>active.value==='accessories'?{items:products.accessories,title:'Аксессуары',allLabel:'Все аксессуары',url:products.accessoriesAll}:{items:products.services,title:'Услуги',allLabel:'Все услуги',url:products.servicesAll})
async function navigateTab(event) {
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return
 event.preventDefault()
 active.value=event.key==='Home'?'accessories':event.key==='End'?'services':active.value==='accessories'?'services':'accessories'
 await nextTick();document.getElementById('recommendation-tab-'+active.value)?.focus()
}
</script>

<template>
 <ProductCarousel id="accessories-services" :title="current.title" :items="current.items" :all-url="current.url" :all-label="current.allLabel" :selection="selection" :tab-id="'recommendation-tab-'+active" @update:selection="emit('update:selection',$event)" @notify="emit('notify',$event)">
  <template #heading><TabList class="recommendation-tabs" :tabs="tabs" type="text" role="tablist" aria-label="Аксессуары и услуги" @keydown="navigateTab"><template #default="tab"><Tab :id="'recommendation-tab-'+tab.id" type="text" :is-active="active===tab.id" role="tab" :aria-selected="active===tab.id" aria-controls="accessories-services-panel" :tabindex="active===tab.id?0:-1" @click="active=tab.id">{{tab.label}}</Tab></template></TabList></template>
 </ProductCarousel>
 <ProductCarousel id="buy-together" title="Покупают вместе" :items="products.together" :all-url="products.togetherAll" all-label="Все товары" :selection="selection" @update:selection="emit('update:selection',$event)" @notify="emit('notify',$event)"/>
</template>
