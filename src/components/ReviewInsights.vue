<script setup>
import { ref } from 'vue'
import { Alert, TYPES } from '@dns-modules/alert'
import { BaseUiButton } from '@dns-modules/base-ui-button'
import '@dns-modules/alert/style.css'

defineProps({ items: { type: Array, required: true } })
const noticeOpen = ref(true), expanded = ref(false)
</script>

<template>
 <div class="review-insights">
  <Alert v-if="noticeOpen" :type="TYPES.INFO" is-closable is-icon @close="noticeOpen=false">
   <template #title>Внимание</template>
   <template #text>29.09.2025 выполнена доработка товара по результатам отзывов и сервисных обращений. Отзывы, оставленные до даты проверки, исключены из расчёта текущего рейтинга. Рейтинг рассчитывается по отзывам после проверки и отражает актуальные качество товара.</template>
  </Alert>
  <section class="review-analysis" aria-labelledby="review-analysis-title">
   <h3 id="review-analysis-title">AI анализ отзывов</h3>
   <div id="review-analysis-content" class="analysis-content" :class="{expanded}">
    <div class="analysis-columns">
     <article v-for="item in items" :key="item.title" class="analysis-column">
      <img :src="item.icon" alt="" width="24" height="24"/>
      <h4>{{item.title}}</h4>
      <p>{{item.text}}</p>
     </article>
    </div>
   </div>
   <BaseUiButton class="analysis-toggle" variant="tertiary" size="medium" :aria-expanded="expanded" aria-controls="review-analysis-content" @click="expanded=!expanded">{{expanded?'Свернуть':'Развернуть'}}</BaseUiButton>
  </section>
 </div>
</template>

<style scoped>
.review-insights{display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
.review-analysis{padding:20px;border-radius:16px;background:var(--background-primary);min-width:0}
.review-analysis h3{margin:0 0 16px;font-size:20px;line-height:1.3}
.analysis-content{position:relative;max-height:210px;overflow:hidden}
.analysis-content:not(.expanded):after{content:'';position:absolute;inset:auto 0 0;height:80px;background:linear-gradient(0deg,var(--background-primary) 10%,transparent);pointer-events:none}
.analysis-content.expanded{max-height:none}
.analysis-columns{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
.analysis-column{min-width:0;padding-bottom:16px}
.analysis-column>img{display:block;margin-bottom:12px}
.analysis-column h4{font-size:16px;line-height:1.3;margin:0 0 12px;min-height:42px}
.analysis-column p{position:relative;margin:0;padding-left:15px;font-size:14px;line-height:1.3}
.analysis-column p:before{content:'';position:absolute;left:0;top:0;width:3px;height:20px;border-radius:30px;background:var(--icon-success-dark,#30b25d)}
.analysis-toggle{width:100%;position:relative;z-index:1}
@media(max-width:1399px){.analysis-columns{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.review-analysis{padding:16px}.analysis-columns{grid-template-columns:1fr}.analysis-column h4{min-height:0}.analysis-content{max-height:230px}}
</style>
