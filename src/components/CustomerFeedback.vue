<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { BaseUiButton, BaseUiIconButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
import { TabList, Tab } from '@dns-modules/base-ui-tabs'
import { ActionTag, ReadonlyTag } from '@dns-modules/tag'
import { BaseFilter } from '@dns-modules/base-filter'
import { Checkbox } from '@dns-modules/checkbox'
import { Rating } from '@dns-modules/rating'
import BaseUiInputSearch from '@dns-modules/base-ui-input-search'
import { Expansion } from '@dns-modules/expansion'
import { SelectInline, RadioOption } from '@dns-modules/select-inline'
import { IconClose } from '@dns-modules/font-icon'
import { IconActionThumbUp, IconActionThumbDown, IconActionStarFilled, IconNavMenuDotsVertical } from '@dns-modules/font-icon-v3'
import '@dns-modules/rating/style.css'
import '@dns-modules/select-inline/style.css'
import '@dns-modules/base-filter/style.css'
import VideoIndicator from './VideoIndicator.vue'
import ReviewInsights from './ReviewInsights.vue'
import media from '../review-media.json'

const sourceUrl='https://www.dns-shop.ru/product/5117a7c5fa5fd763/blok-pitania-deepcool-pf750-r-pf750d-ha0b-eu-cernyj/'
const opinionsUrl=sourceUrl.replace('/product/','/product/opinion/')
const questionUrl=sourceUrl.replace('/product/','/product/communicator/')
const selectedTab=ref('reviews'), query=ref(''), onlyModel=ref(false), onlyPhotos=ref(false), onlyVideos=ref(false), selectedScores=ref([]), sort=ref('newest'), sortOpen=ref(false)
const sortOptions=[{id:'newest',title:'По дате'},{id:'rating',title:'По рейтингу'},{id:'popular',title:'По популярности'},{id:'modified',title:'По дате изменения'}]
const mediaRail=ref(null), mediaCapacity=ref(0)
let mediaObserver
watch(mediaRail,element=>{
 mediaObserver?.disconnect()
 if(!element)return
 mediaObserver=new ResizeObserver(([entry])=>{
  const styles=getComputedStyle(element),size=parseFloat(styles.getPropertyValue('--media-size')),gap=parseFloat(styles.columnGap)
  mediaCapacity.value=Math.max(0,Math.floor((entry.contentRect.width+gap)/(size+gap)))
 })
 mediaObserver.observe(element)
},{flush:'post'})
onUnmounted(()=>mediaObserver?.disconnect())
function toggleScore(score){selectedScores.value=selectedScores.value.includes(score)?selectedScores.value.filter(value=>value!==score):[...selectedScores.value,score]}
function selectSort(id){sort.value=id;sortOpen.value=false}
async function navigateModelTabs(event){
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return
 event.preventDefault();onlyModel.value=event.key==='Home'?false:event.key==='End'?true:!onlyModel.value
 await nextTick();document.getElementById(onlyModel.value?'review-model-tab':'review-all-tab')?.focus()
}
const explanationOpen=ref(false), mediaIndex=ref(null), votes=ref({}), commentsOpen=ref({}), menuOpen=ref(null), visibleCount=ref(4), copiedReview=ref(null)
const mediaDialog=ref(null)
let mediaTrigger, previousOverflow=''
watch(mediaIndex,async(value,previous)=>{
 if(value!==null&&previous===null){mediaTrigger=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';await nextTick();mediaDialog.value?.querySelector('button')?.focus()}
 if(value===null){document.body.style.overflow=previousOverflow;await nextTick();mediaTrigger?.focus()}
})
onUnmounted(()=>{if(mediaIndex.value!==null)document.body.style.overflow=previousOverflow})
function onMediaKey(event){
 if(event.key==='Escape'){mediaIndex.value=null;return}
 if(event.key!=='Tab')return
 const controls=mediaDialog.value.querySelectorAll('button,a[href]'),first=controls[0],last=controls[controls.length-1]
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
}
const topics=['не шумит','отлично работает','рекомендую к покупке','хороший блок питания','черные провода','длинные провода','кабель питания','не включается','не советую','цена качество']
const allTopicsVisible=ref(false)
// The layout follows the Figma sample; the excerpts stay about the current PSU.
const analysisItems=[
 {title:'О корпусе и внешнем виде',icon:'/images/reviews/figma/appearance.svg',text:'В отзывах отмечают аккуратный внешний вид блока питания. Покупатели описывают его словами «Нормальный внешний вид» и «Красивый, тихий». Внешний вид — один из положительных моментов в опубликованных отзывах.'},
 {title:'О работе блока питания',icon:'/images/reviews/figma/performance.svg',text:'Покупатели пишут, что блок обеспечивает компьютер питанием. В одном отзыве модель рекомендуют для сборки с потреблением 500–550 Вт. Среди впечатлений встречаются «Все норм.» и «Очень доволен».'},
 {title:'О компонентах и надежности',icon:'/images/reviews/figma/quality.svg',text:'В популярном отзыве к недостаткам отнесены конденсаторы AsiaX. Встречаются замечания по надежности и отрицательные рекомендации. Оценки покупателей различаются, поэтому перед выбором полезно прочитать и положительные, и отрицательные отзывы.'},
 {title:'О шуме и сроке службы',icon:'/images/reviews/figma/lifetime.svg',text:'Несколько покупателей называют блок тихим. Есть и отрицательный опыт: один владелец сообщил об отказе через два года после установки при работе в щадящем режиме. Долговечность оценивают по-разному.'},
]
const counts=[{score:5,percent:87.05,count:17071},{score:4,percent:6.45,count:1265},{score:3,percent:2.11,count:414},{score:2,percent:1.32,count:259},{score:1,percent:3.07,count:602}]
// Short excerpts from public DNS reviews. Full reviews and later additions remain on DNS.
const reviews=[
 {id:1,author:'Пришелец-GT85334',date:'04.05.2022',score:5,power:'700',popular:true,pros:'Тихий. Нормальный внешний вид.',cons:'Конденсаторы AsiaX.',photos:['/images/reviews/opinion-0.jpg','/images/reviews/opinion-1.jpg','/images/reviews/opinion-2.jpg'],tags:['не шумит','отлично работает','хороший блок питания']},
 {id:2,author:'alex1924',date:'18.10.2026',score:2,power:'700',pros:'Красивый, тихий',cons:'Сдох чере3 2 года после установки. Работал в щадящем режиме.',comment:'Не рекомендую к приобретению',photos:[],tags:['не шумит','не советую','не включается']},
 {id:3,author:'Loyrlaw',date:'16.10.2026',score:3,power:'600',pros:'Тихий',cons:'Нету',comment:'Все норм.',photos:[],tags:['не шумит']},
 {id:4,author:'Пришелец-CNZN879558',date:'16.10.2026',score:3,power:'750',comment:'есть фоновое ощущение ненадежности...',photos:[],tags:['не советую']},
 {id:5,author:'Пришелец-NG63750',date:'14.10.2026',score:5,power:'600',pros:'бпшник классный, в целом для сборки где потребление 500-550 ват он пойдет',cons:'не обнаружил',photos:[],tags:['хороший блок питания']},
 {id:6,author:'Пришелец-IRU36784',date:'14.10.2026',score:5,power:'700',pros:'Суперски обеспечивает питанием блок',cons:'Отсутствуют',comment:'Очень доволен',photos:[],tags:['отлично работает']},
]
const originalVotes={1:6225,2:-1,3:1}
function voteCount(id){return (originalVotes[id]||0)+(votes.value[id]||0)}
function formatVotes(id){const count=voteCount(id);return count>0?'+'+count:String(count)}
function toggleVote(id,value){votes.value={...votes.value,[id]:votes.value[id]===value?0:value}}
async function copyReview(){
 try{await navigator.clipboard.writeText(opinionsUrl);copiedReview.value=menuOpen.value}
 catch{copiedReview.value=null}
}
watch([query,onlyModel,onlyPhotos,onlyVideos,selectedScores,sort],()=>{visibleCount.value=4})
const filteredReviews=computed(()=>{
 const term=query.value.toLocaleLowerCase('ru')
 const result=reviews.filter(r=>(!onlyModel.value||r.power==='750')&&(!onlyPhotos.value||r.photos.length)&&(!onlyVideos.value||r.videos?.length)&&(!selectedScores.value.length||selectedScores.value.includes(r.score))&&(!term||[r.author,r.pros,r.cons,r.comment,...r.tags].filter(Boolean).join(' ').toLocaleLowerCase('ru').includes(term)))
 return [...result].sort((a,b)=>{
  if(a.popular||b.popular)return Number(!!b.popular)-Number(!!a.popular)
  if(sort.value==='rating')return b.score-a.score
  if(sort.value==='popular')return (originalVotes[b.id]||0)-(originalVotes[a.id]||0)
  return (sort.value==='modified'?(b.modified||b.date):b.date).split('.').reverse().join('').localeCompare((sort.value==='modified'?(a.modified||a.date):a.date).split('.').reverse().join(''))
 })
})
function resetFilters(){query.value='';onlyModel.value=false;onlyPhotos.value=false;onlyVideos.value=false;selectedScores.value=[]}
async function navigateFeedbackTabs(event){
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return
 event.preventDefault()
 selectedTab.value=event.key==='Home'?'reviews':event.key==='End'?'questions':selectedTab.value==='reviews'?'questions':'reviews'
 await nextTick();document.getElementById('feedback-tab-'+selectedTab.value)?.focus()
}
const defects=[['Прочие дефекты','0.25%'],['Дефект контактной группы','0.02%'],['Дефект дросселя','0.01%'],['Дефект конденсатора','0.01%'],['Дефект микросхемы','0.01%']]
</script>

<template>
 <section id="customer-reviews" class="surface customer-feedback" aria-label="Отзывы и вопросы покупателей">
  <TabList :tabs="[{id:'reviews',label:'Отзывы 19.6k'},{id:'questions',label:'Вопрос-ответ 130'}]" type="text" role="tablist" aria-label="Отзывы и вопросы" @keydown="navigateFeedbackTabs"><template #default="tab"><Tab :id="'feedback-tab-'+tab.id" type="text" role="tab" :is-active="selectedTab===tab.id" :aria-selected="selectedTab===tab.id" :aria-controls="'feedback-'+tab.id" :tabindex="selectedTab===tab.id?0:-1" @click="selectedTab=tab.id">{{tab.label}}</Tab></template></TabList>
  <div v-if="selectedTab==='reviews'" id="feedback-reviews" role="tabpanel" aria-labelledby="feedback-tab-reviews">
   <div class="feedback-media" aria-label="Фото и видео покупателей"><div ref="mediaRail" class="feedback-media-rail"><button v-for="(item,index) in media.slice(0,mediaCapacity)" :key="index" :aria-label="(item.video?'Превью видео':'Фото покупателя')+' '+(index+1)" @click="mediaIndex=index"><img :src="item.image" alt="" loading="lazy"/><VideoIndicator v-if="item.video"/></button></div><BaseLink :href="opinionsUrl" class="feedback-media-all" variant="navigation">Всего 909</BaseLink></div>
   <div class="real-buyers-banner"><div class="real-buyers-art" aria-hidden="true"><img class="banner-star" src="/images/reviews/figma/banner-star.png" alt=""/><img class="banner-smile" src="/images/reviews/figma/banner-smile.png" alt=""/><img class="banner-small" src="/images/reviews/figma/banner-small.png" alt=""/></div><h3>Отзывы реальных покупателей</h3><p>Их опыт помогает формировать честный рейтинг.</p></div>
   <div class="feedback-layout">
    <aside class="feedback-summary">
     <div class="feedback-total"><strong>4.75</strong><div><Rating :rating="4.75" is-read-only size="md"/><BaseLink :href="opinionsUrl" variant="navigation">19611 отзывов</BaseLink></div></div>
     <div class="rating-distribution" aria-label="Распределение оценок"><button v-for="row in counts" :key="row.score" :aria-label="'Отзывы с оценкой '+row.score" :aria-pressed="selectedScores.includes(row.score)" @click="toggleScore(row.score)"><span>{{row.score}}</span><i><span :style="{width:row.percent+'%'}"/></i></button></div>
     <div class="feedback-characteristics"><div v-for="[title,value] in [['Качество','4.6'],['Надежность','4.6'],['Бесшумность','4.7'],['Внешний вид','4.8']]" :key="title"><b>{{value}}</b><span>{{title}}</span></div></div>
     <div class="feedback-invite"><h3>Есть что рассказать?</h3><p>Оцените товар, ваш опыт будет полезен</p><BaseUiButton tag="a" :href="opinionsUrl" size="large">Добавить отзыв</BaseUiButton></div>
    </aside>
    <div class="feedback-list">
     <ReviewInsights :items="analysisItems"/>
     <h3 class="mentions-title">Часто упоминают</h3><div class="feedback-topics"><div class="feedback-topic-row"><BaseFilter v-for="topic in topics.slice(0,allTopicsVisible?8:5)" :key="topic" type="discrete" color="gray" class="positive-topic" :is-selected="query===topic" :aria-pressed="query===topic" @click="query=query===topic?'':topic">{{topic}}</BaseFilter><BaseFilter v-if="!allTopicsVisible" type="discrete" color="gray" class="positive-topic" aria-label="Показать остальные темы отзывов" @click="allTopicsVisible=true">+3</BaseFilter></div><div class="feedback-topic-row"><BaseFilter v-for="topic in topics.slice(8)" :key="topic" type="discrete" color="gray" :is-selected="query===topic" :aria-pressed="query===topic" @click="query=query===topic?'':topic">{{topic}}</BaseFilter></div></div>
     <TabList class="feedback-model-tabs" :tabs="[{id:'all',label:'Все отзывы 19611'},{id:'model',label:'Только к этой модели 4889'}]" type="filled" role="tablist" aria-label="Модель товара в отзывах" @keydown="navigateModelTabs"><template #default="tab"><Tab :id="tab.id==='all'?'review-all-tab':'review-model-tab'" type="filled" role="tab" :is-active="onlyModel===(tab.id==='model')" :aria-selected="onlyModel===(tab.id==='model')" :tabindex="onlyModel===(tab.id==='model')?0:-1" aria-controls="review-results" @click="onlyModel=tab.id==='model'"><span>{{tab.id==='all'?'Все отзывы':'Только к этой модели'}} <span class="feedback-tab-count">{{tab.id==='all'?'19611':'4889'}}</span></span></Tab></template></TabList>
     <div class="feedback-search"><BaseUiInputSearch placeholder="Поиск по отзывам" :external-value="query" search-icon-location="right" color="grey" size="small" @input="query=$event"/><div class="feedback-sort" role="group" aria-label="Сортировка отзывов"><SelectInline :is-open="sortOpen" :options="sortOptions" size="small" position="right" @click:input="sortOpen=!sortOpen" @close="sortOpen=false"><template #value>{{sortOptions.find(option=>option.id===sort).title}}</template><template #default="option"><RadioOption :is-selected="sort===option.id" @click="selectSort(option.id)">{{option.title}}</RadioOption></template></SelectInline></div></div>
     <div class="feedback-filters" aria-label="Фильтры отзывов">
      <ActionTag tag="div" class="feedback-checkbox-tag" size="small"><Checkbox size="medium" :checked="onlyPhotos" aria-label="С фото 492" @vue-click="onlyPhotos=!onlyPhotos"><template #label>С фото</template></Checkbox></ActionTag>
      <ActionTag tag="div" class="feedback-checkbox-tag" size="small"><Checkbox size="medium" :checked="onlyVideos" aria-label="С видео 10" @vue-click="onlyVideos=!onlyVideos"><template #label>С видео</template></Checkbox></ActionTag>
      <ActionTag v-for="row in counts" :key="row.score" tag="div" class="feedback-checkbox-tag" size="small"><Checkbox size="medium" :checked="selectedScores.includes(row.score)" :aria-label="row.score+' звезд, '+row.count+' отзывов'" @vue-click="toggleScore(row.score)"><template #label><span class="feedback-score-stars" aria-hidden="true"><IconActionStarFilled v-for="star in row.score" :key="star"/></span><span>{{row.count}}</span></template></Checkbox></ActionTag>
     </div>
     <div v-if="selectedScores.length || query || onlyModel || onlyPhotos || onlyVideos" class="feedback-filter-state"><span>Показано отзывов: {{filteredReviews.length}}</span><BaseLink tag="button" @click="resetFilters">Сбросить фильтры</BaseLink></div>
     <div id="review-results" role="tabpanel" :aria-labelledby="onlyModel?'review-model-tab':'review-all-tab'">
     <article v-for="review in filteredReviews.slice(0,visibleCount)" :key="review.id" class="customer-opinion" :class="{'popular-opinion':review.popular}">
      <h3 v-if="review.popular" class="popular-opinion-title">Самый популярный отзыв</h3>
      <div class="opinion-heading"><div class="opinion-author"><span class="opinion-avatar" aria-hidden="true"><img src="/images/reviews/figma/avatar-frame.svg" alt="" width="46" height="46"/><img class="opinion-avatar-picture" src="/images/reviews/figma/avatar-default.png" alt="" width="38" height="38"/></span><BaseLink :href="opinionsUrl" variant="navigation">{{review.author}}</BaseLink></div><div class="opinion-heading-actions"><div class="opinion-meta"><span>{{review.date}}</span><span>Dns-shop.ru</span></div><div class="opinion-menu" @keydown.esc="menuOpen=null"><BaseUiIconButton size="small" variant="secondary" :aria-label="'Действия с отзывом '+review.author" :aria-expanded="menuOpen===review.id" :aria-controls="'opinion-menu-'+review.id" @click="menuOpen=menuOpen===review.id?null:review.id"><IconNavMenuDotsVertical/></BaseUiIconButton><div v-if="menuOpen===review.id" :id="'opinion-menu-'+review.id" class="opinion-menu-panel"><BaseLink tag="button" @click="copyReview">{{copiedReview===review.id?'Ссылка скопирована':'Скопировать ссылку'}}</BaseLink><BaseLink :href="opinionsUrl">Пожаловаться</BaseLink></div></div></div></div>
      <div class="opinion-grades"><ReadonlyTag size="small"><Rating :rating="review.score" is-read-only size="xs"/></ReadonlyTag><ReadonlyTag size="small">Мощность (Вт): {{review.power}}</ReadonlyTag></div>
      <div v-if="review.pros" class="opinion-detail"><b>Достоинства</b><p>{{review.pros}}</p></div><div v-if="review.cons" class="opinion-detail"><b>Недостатки</b><p>{{review.cons}}</p></div><div v-if="review.comment" class="opinion-detail"><b>Комментарий</b><p>{{review.comment}}</p></div>
      <div v-if="review.photos.length" class="opinion-media"><b>Фото</b><div class="opinion-photos"><a v-for="photo in review.photos" :key="photo" :href="opinionsUrl" aria-label="Фотографии к отзыву на DNS"><img :src="photo" alt="Фото из отзыва покупателя" loading="lazy"/></a></div></div>
      <div class="opinion-footer"><Expansion class="opinion-comments-expansion" :id="'opinion-comments-'+review.id" :is-expanded="!!commentsOpen[review.id]" @toggle="commentsOpen[review.id]=!commentsOpen[review.id]"><div class="opinion-comments"><p>Чтобы оставить комментарий, войдите в аккаунт DNS.</p><BaseLink :href="opinionsUrl">{{review.popular?'Открыть комментарии':'Войти и комментировать'}}</BaseLink></div><template #collapsed>{{review.popular?'Комментарии (354)':'Комментировать'}}</template><template #expanded>Свернуть комментарии</template></Expansion><div class="opinion-votes"><BaseUiIconButton size="small" variant="tertiary" aria-label="Лайк" :aria-pressed="votes[review.id]===1" @click="toggleVote(review.id,1)"><IconActionThumbUp/></BaseUiIconButton><output class="opinion-vote-count" :class="{'negative-votes':voteCount(review.id)<0}" aria-live="polite">{{formatVotes(review.id)}}</output><BaseUiIconButton size="small" variant="tertiary" aria-label="Дизлайк" :aria-pressed="votes[review.id]===-1" @click="toggleVote(review.id,-1)"><IconActionThumbDown/></BaseUiIconButton></div></div>

     </article>
     <div v-if="!filteredReviews.length" class="feedback-empty"><p>Среди загруженных отзывов подходящих нет.</p><BaseLink tag="button" @click="resetFilters">Сбросить фильтры</BaseLink></div>
     <BaseUiButton v-if="visibleCount<filteredReviews.length" class="feedback-all" variant="secondary" size="large" @click="visibleCount+=4">Показать ещё</BaseUiButton>
     </div>
    </div>
   </div>
  </div>
  <div v-else id="feedback-questions" class="feedback-questions" role="tabpanel" aria-labelledby="feedback-tab-questions"><h3>Вопросы и ответы покупателей</h3><p>Обсуждайте товар и опыт его использования с другими покупателями.</p><BaseUiButton tag="a" :href="questionUrl" variant="secondary">Открыть 130 вопросов на DNS</BaseUiButton></div>
 </section>

 <section id="product-reliability" class="surface product-reliability" aria-label="Надёжность товара">
  <div class="reliability-panel"><div><h2>Отличная надежность</h2><p>Крайне редко возникают проблемы при использовании</p></div><img src="/images/reviews/reliability-shield.png" alt="" width="54" height="60"/></div>
  <div class="reliability-data"><div class="reliability-success"><span>Без проблем</span><b>99.7%</b></div><div class="reliability-defects-total"><span>Всего обращений в сервис</span><b>0.3%</b></div>
   <dl id="reliability-defects" class="reliability-defects"><div v-for="[label,value] in defects" :key="label"><dt>{{label}}</dt><dd>{{value}}</dd></div></dl>
   <p class="reliability-note">Для сравнения, среднее количество обращений в сервис по категории Блоки питания — 1.01%</p><p class="reliability-note">Оценка надежности сформирована на основе данных о продажах и браке выбранного товара</p>
   <Expansion id="reliability-explanation" :is-expanded="explanationOpen" @toggle="explanationOpen=!explanationOpen"><p>DNS рассчитывает надёжность по собственным данным: это доля проданных товаров без выявленного производственного недостатка. Статистика других продавцов, производителей и сервисных центров в расчёт не входит.</p><template #collapsed>Об оценке</template><template #expanded>Свернуть</template></Expansion>
  </div>
 </section>
 <div v-if="mediaIndex!==null" class="modal-overlay" @click.self="mediaIndex=null"><section ref="mediaDialog" class="modal-panel feedback-media-dialog" role="dialog" aria-modal="true" aria-label="Фото покупателей" @keydown="onMediaKey"><BaseUiIconButton class="modal-close" variant="tertiary" size="small" aria-label="Закрыть фото покупателя" @click="mediaIndex=null"><IconClose/></BaseUiIconButton><img :src="media[mediaIndex].image" alt="Фото из галереи покупателей"/><BaseLink :href="opinionsUrl">{{media[mediaIndex].video?'Смотреть видео на DNS':'Открыть галерею на DNS'}}</BaseLink></section></div>
</template>

<style scoped>
.customer-feedback{padding:32px}.customer-feedback>:first-child{max-width:100%;overflow-x:auto;scrollbar-width:none;white-space:nowrap}.feedback-media{display:flex;gap:12px;margin:32px 0 40px}.feedback-media-rail{display:flex;gap:12px;flex:1;min-width:0;overflow-x:auto;scrollbar-width:none}.feedback-media-rail>button{width:80px;height:80px;flex-shrink:0;border-radius:12px;position:relative;overflow:hidden;padding:0;background:var(--background-primary)}.feedback-media img{width:100%;height:100%;object-fit:cover}.feedback-media-rail>button>[class*="_base-icon_"]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;font-size:24px;border-radius:50%;background:#ffffffb8;color:var(--text-secondary);display:grid;place-items:center}.feedback-media-all{flex:0 0 80px;display:flex!important;align-items:center;justify-content:center;background:var(--background-primary);border-radius:12px;font-size:12px!important}
.real-buyers-banner{padding:20px 24px;border-radius:12px;background:var(--background-primary) url('/images/reviews/real-buyers.png') no-repeat right center;background-size:auto 100%;margin-bottom:40px}.real-buyers-banner h3{font-size:18px;margin:0 0 4px}.real-buyers-banner p{font-size:16px}
.feedback-layout{display:grid;grid-template-columns:340px minmax(0,1fr);gap:80px}.feedback-summary{min-width:0}.feedback-total{display:flex;align-items:center;gap:16px}.feedback-total>strong{font-size:64px;line-height:1.2}.feedback-total>div{display:flex;flex-direction:column;gap:4px}.feedback-total a{font-size:16px!important}.rating-distribution{margin:24px 0 40px;display:flex;flex-direction:column;gap:8px}.rating-distribution button{padding:0;background:none;display:flex;align-items:center;gap:12px;line-height:1}.rating-distribution button>span{width:8px}.rating-distribution i{flex:1;height:8px;border-radius:4px;background:var(--background-primary);overflow:hidden}.rating-distribution i>span{display:block;height:100%;border-radius:4px;background:var(--background-brand-main)}.rating-distribution button[aria-pressed=true]{font-weight:bold;color:var(--text-brand)}
.feedback-characteristics{display:flex;flex-wrap:wrap;gap:8px}.feedback-characteristics>div{display:flex;flex-direction:column;gap:4px;background:var(--background-primary);padding:12px;border-radius:8px}.feedback-characteristics b{font-size:18px}.feedback-characteristics span{font-size:14px}.feedback-invite{margin-top:40px}.feedback-invite h3{font-size:18px}.feedback-invite p{color:var(--text-tertiary);margin:4px 0 16px}
.feedback-list{min-width:0}.mentions-title{font-size:16px;margin-bottom:8px}.feedback-topics{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px}.feedback-topics .positive-topic{background:var(--background-success-light)}.feedback-topics [aria-pressed=true]{box-shadow:inset 0 0 0 1px var(--stroke-border-brand)}.feedback-filters{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px}.feedback-filters label{display:flex;align-items:center;gap:6px;padding:8px;background:var(--background-primary);border-radius:8px;cursor:pointer}.feedback-filters label>span{color:var(--text-tertiary)}.feedback-filters a{font-size:14px!important}.feedback-search{display:flex;gap:8px;margin-bottom:20px}.feedback-search>div{flex:1;min-width:0}.feedback-search select{max-width:180px;min-width:0;border:0;border-radius:8px;padding:8px;background:var(--background-primary);color:var(--text-primary);font:inherit}.feedback-filter-state{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:16px;font-size:14px;color:var(--text-tertiary)}
.customer-opinion{padding:24px 0;border-top:1px solid var(--stroke-border-light)}.popular-opinion{border:1px solid var(--stroke-border-light);border-radius:16px;padding:20px;margin-bottom:24px}.popular-opinion-title{font-size:18px;margin-bottom:20px}.opinion-heading{display:flex;justify-content:space-between;align-items:center;gap:16px}.opinion-author{display:flex;gap:12px;align-items:center}.opinion-author>[class*="_base-icon_"]{font-size:40px;color:var(--icon-primary)}.opinion-meta{display:flex;gap:8px;flex-direction:column;align-items:flex-end;font-size:12px;color:var(--text-tertiary)}.opinion-grades{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.opinion-grades>span{display:flex;align-items:center;gap:4px;background:var(--background-primary);border-radius:8px;padding:8px;font-size:12px}.opinion-detail{margin-top:16px;font-size:16px;line-height:1.4}.opinion-detail b{display:block;margin-bottom:4px}.opinion-full{margin-top:16px;font-size:14px!important}.opinion-photos{display:flex;gap:8px;margin-top:16px}.opinion-photos img{width:80px;height:80px;border-radius:8px;object-fit:cover}.opinion-footer{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:24px}.opinion-footer>a{font-size:14px!important}.opinion-footer>a :deep(>span){display:flex;gap:6px;align-items:center}.feedback-all{width:100%;margin-top:12px}.feedback-empty{padding:32px;background:var(--background-primary);border-radius:12px}.feedback-empty p{margin-bottom:12px}.feedback-questions{padding:40px 0}.feedback-questions p{margin:12px 0 24px}
.product-reliability{padding:32px;display:grid;grid-template-columns:360px minmax(0,1fr);gap:60px}.reliability-panel{display:flex;align-items:flex-start;gap:16px;padding:20px;background:var(--background-success-light);border-radius:12px;height:fit-content}.reliability-panel h2{font-size:22px;line-height:1.3}.reliability-panel p{font-size:16px;line-height:1.3;margin-top:4px}.reliability-panel img{object-fit:contain;flex-shrink:0}.reliability-success,.reliability-defects-total{display:flex;gap:12px;align-items:center;width:100%;padding:12px 0;font-size:18px;font-weight:700;background:none;text-align:left}.reliability-success:before,.reliability-defects-total:before{content:'';width:8px;height:20px;border-radius:4px;background:var(--background-success-main);flex-shrink:0}.reliability-defects-total:before{background:var(--background-error-main)}.reliability-success>b,.reliability-defects-total>b{margin-left:auto}.reliability-defects-total>[class*="_base-icon_"]{font-size:16px;color:var(--icon-primary);transition:transform .2s}.rotated{transform:rotate(180deg)}.reliability-defects{margin:8px 0 24px;padding:16px;background:var(--background-primary);border-radius:12px}.reliability-defects>div{display:flex;justify-content:space-between;gap:16px;padding:8px 0;font-size:16px}.reliability-defects dd{margin:0;white-space:nowrap}.reliability-note{padding:12px;font-size:14px;line-height:1.4;background:var(--background-primary);border-radius:8px;margin-bottom:8px}.reliability-data>:last-child{margin-top:16px}.feedback-media-dialog{display:flex;flex-direction:column;gap:24px}.feedback-media-dialog>img{width:auto;max-width:100%;height:350px;object-fit:contain;image-rendering:auto}
@media(max-width:1399px){.feedback-layout{grid-template-columns:260px minmax(0,1fr);gap:32px}.feedback-total>strong{font-size:56px}.product-reliability{grid-template-columns:260px minmax(0,1fr);gap:32px}.reliability-panel{padding:16px;gap:8px}.reliability-panel h2{font-size:18px}}
@media(max-width:991.98px){.customer-feedback,.product-reliability{padding:20px 16px}.feedback-layout{display:flex;flex-direction:column;gap:32px}.feedback-summary{display:grid;grid-template-columns:1fr 1fr;gap:16px}.rating-distribution{margin:0}.feedback-characteristics{grid-column:1 / -1}.feedback-invite{margin:0;grid-column:1 / -1}.feedback-invite p{display:none}.feedback-invite h3{margin-bottom:12px}.product-reliability{grid-template-columns:1fr;gap:24px}.real-buyers-banner{background-image:none;padding:16px;margin-bottom:24px}.feedback-media{margin:24px 0;gap:8px}.feedback-media-rail{gap:8px}.feedback-media-rail>button{width:64px;height:64px}.feedback-total>strong{font-size:48px}}
@media(max-width:500px){.feedback-summary{grid-template-columns:1fr}.feedback-total{gap:12px}.rating-distribution{grid-column:1}.feedback-search{flex-wrap:wrap}.feedback-search>div{flex-basis:100%}.opinion-heading{align-items:flex-start}.opinion-author{gap:6px}.opinion-author>b{font-size:13px}.opinion-author>[class*="_base-icon_"]{font-size:28px}.popular-opinion{padding:12px}.opinion-footer{flex-wrap:wrap}.reliability-success,.reliability-defects-total{font-size:16px}.reliability-defects>div{font-size:14px}.feedback-media-dialog>img{height:250px}}
.opinion-author{min-width:0;gap:8px}.opinion-author>img{width:46px;height:46px;flex-shrink:0;border-radius:50%;object-fit:cover}.opinion-author>a{font-size:14px!important;font-weight:400;min-width:0;overflow-wrap:anywhere}.opinion-heading-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}.opinion-meta{gap:2px;font-size:14px}.opinion-meta>span+span{font-size:12px}.opinion-menu{position:relative}.opinion-menu-panel{position:absolute;right:0;top:calc(100% + 4px);z-index:3;display:flex;flex-direction:column;gap:16px;padding:16px;background:var(--background-secondary);border-radius:12px;box-shadow:0 4px 24px #0002;white-space:nowrap}.opinion-menu-panel>*{font-size:14px!important}.opinion-comments-toggle{font-size:14px!important}.opinion-comments-toggle :deep(>span){display:inline-flex;align-items:center;gap:4px}.opinion-comments-toggle :deep([class*="_base-icon_"]){font-size:16px;width:16px;height:16px;transition:transform .2s}.opinion-votes{display:flex;align-items:center;gap:8px}.opinion-votes>button{width:24px;min-width:24px;height:24px;padding:0;color:var(--icon-primary)}.opinion-votes :deep(.font-icon-v3){font-size:24px}.opinion-votes>button[aria-pressed=true]{color:var(--text-brand)}.opinion-vote-count{display:grid;place-items:center;min-width:24px;height:36px;padding:0 8px;border-radius:8px;background:var(--background-success-transparent,rgba(0,214,129,.18));color:var(--text-success,#00be70);font-size:12px;font-weight:700}.opinion-vote-count.negative-votes{background:var(--background-error-transparent,#ff544b1a);color:var(--text-error,#ff544b)}.opinion-comments{margin-top:16px;padding:16px;background:var(--background-primary);border-radius:12px;font-size:14px}.opinion-comments>p{margin-bottom:8px}.opinion-comments>a{font-size:14px!important}
.reliability-success,.reliability-defects-total{padding:10px 16px 10px 0;gap:8px}.reliability-defects{position:relative;display:flex;flex-direction:column;gap:8px;margin:12px 0;padding:16px}.reliability-defects:before{content:'';position:absolute;right:17px;top:-3.5px;width:39px;height:39px;transform:rotate(-45deg);background:var(--background-primary);z-index:0}.reliability-defects>div{position:relative;padding:0;line-height:1.4}.reliability-panel h2{font-size:20px}
@media(max-width:500px){.opinion-heading{gap:8px;flex-wrap:wrap}.opinion-author{flex:1}.opinion-author>img{width:36px;height:36px}.opinion-heading-actions{margin-left:auto}.opinion-author>a{font-size:13px!important}.opinion-meta{font-size:12px}.opinion-footer{gap:8px}.opinion-votes{gap:6px}.reliability-panel h2{font-size:18px}}
.opinion-comments-toggle{padding:0;background:none;border:0}.opinion-menu-panel>button{padding:0;background:none;border:0;text-align:left}
.feedback-media{--media-size:80px}.feedback-media-rail{overflow:hidden;gap:12px;min-height:var(--media-size)}.feedback-media-rail>button{width:var(--media-size);height:var(--media-size);border-radius:8px}.feedback-media-all{flex-basis:var(--media-size)}.feedback-media-rail>button>img{display:block}
.feedback-model-tabs{margin-bottom:12px;max-width:100%}.feedback-search{margin-bottom:12px}.feedback-search>.feedback-sort{flex:0 0 auto;min-width:0}.feedback-filters{gap:8px;margin-bottom:24px}.feedback-checkbox-tag{padding:0!important;height:36px;min-height:36px}.feedback-checkbox-tag :deep([class*="__main-container"]){padding:8px;min-height:36px;box-sizing:border-box}.feedback-checkbox-tag :deep([data-testid=label]){display:inline-flex;gap:8px;align-items:center;white-space:nowrap;margin-left:4px;color:var(--text-primary);font-size:14px}.feedback-score-stars{display:inline-flex;gap:0;color:var(--icon-brand-main,#ffa218)}.feedback-score-stars :deep(.font-icon-v3){font-size:16px}.feedback-filter-state>button{padding:0;border:0;background:none}
@media(max-width:991.98px){.feedback-media{--media-size:64px;gap:8px}.feedback-media-rail{gap:8px}}
@media(max-width:500px){.feedback-model-tabs{width:100%;white-space:normal}.feedback-model-tabs :deep(button){height:auto;min-height:36px;white-space:normal;text-align:left}.feedback-search>div:not(.feedback-sort){flex-basis:100%}.feedback-search>.feedback-sort{margin-left:auto}.feedback-checkbox-tag :deep([data-testid=label]){font-size:12px}}
.feedback-sort :deep(button[class*="input"]){height:36px;padding:0 12px;border-radius:8px;background:var(--background-tertiary);color:var(--text-primary);white-space:nowrap}.feedback-sort :deep([class*="value"]){color:var(--text-primary)}.feedback-sort :deep([class*="chevron"]){color:var(--icon-primary)}.feedback-sort :deep(button[class*="input"]:hover){background:var(--background-neutral-transparent)}.feedback-model-tabs :deep(button[aria-selected=true]){background:var(--background-secondary);box-shadow:0 2px 8px #00000014;border-color:var(--stroke-border-light)}.feedback-checkbox-tag{border-radius:8px!important}
.feedback-sort :deep([data-testid=wrapper]){min-width:220px}.feedback-sort :deep([class*="base-option"]){white-space:nowrap}.feedback-sort :deep([class*="radio-option__content"]){white-space:nowrap}
.feedback-tab-count{white-space:nowrap}.feedback-model-tabs :deep(button){word-break:normal;overflow-wrap:normal}
.feedback-sort{position:relative;z-index:4}


/* Reviews, Figma 30644:7894. Data and interactive DS controls stay shared. */
.customer-feedback{padding:32px}
.feedback-media{margin:40px 0;justify-content:flex-start}
.feedback-media-rail{flex:1 1 0;max-width:calc(100% - 92px)}
.feedback-media-all{height:80px;white-space:pre-line;text-align:center;font-size:14px!important;line-height:1.3;color:var(--text-tertiary)}
.real-buyers-banner{position:relative;overflow:hidden;background-image:none;min-height:89px;box-sizing:border-box}
.real-buyers-banner h3,.real-buyers-banner p{position:relative;z-index:1}
.real-buyers-banner p{color:var(--text-secondary)}
.real-buyers-art{position:absolute;right:45px;top:50%;width:184px;height:77px;transform:translateY(calc(-50% + 3px));opacity:.5;mask:url('/images/reviews/figma/banner-mask.svg') center/184px 77px no-repeat;pointer-events:none}
.real-buyers-art img{position:absolute;object-fit:cover;object-position:bottom}
.banner-star{left:111px;top:0;width:73px;height:73px}
.banner-smile{left:39px;top:32px;width:59px;height:59px}
.banner-small{left:0;top:-5px;width:37px;height:37px}
.feedback-layout{grid-template-columns:360px minmax(0,1fr);gap:60px;align-items:start}
.feedback-summary{padding:16px 12px;border-radius:12px;box-sizing:border-box}
.feedback-total{gap:8px}
.feedback-total>strong{font-size:56px;line-height:68px;min-width:110px;text-align:center}
.feedback-total>div{gap:8px}
.feedback-total a{font-size:14px!important;line-height:1.3}
.feedback-total :deep([class*="rating"]){gap:0}
.rating-distribution{margin:12px 0 16px;gap:0}
.rating-distribution button{height:16px;font-size:12px;line-height:1.3}
.rating-distribution i{background:var(--background-tertiary)}
.feedback-characteristics{gap:12px 8px}
.feedback-characteristics>div{gap:4px;padding:8px 12px;min-width:70px}
.feedback-characteristics b{font-size:16px;line-height:1.3}
.feedback-characteristics span{font-size:12px;line-height:1.3}
.feedback-invite{margin-top:16px}
.feedback-invite h3{font-size:16px;line-height:1.3}
.feedback-invite p{font-size:14px;line-height:1.3;color:var(--text-primary);margin:8px 0 16px}
.feedback-list{width:100%}
.feedback-topics{display:flex;flex-direction:column;gap:8px;margin-bottom:32px}
.feedback-topic-row{display:flex;flex-wrap:wrap;gap:4px;align-items:center}
.feedback-topic-row>.positive-topic{background:var(--background-success-light)}
.feedback-topic-row>button{max-width:100%;font-size:14px}
.feedback-topic-row>button:hover{background:var(--background-neutral-transparent)}
.feedback-model-tabs{margin-bottom:12px}
.feedback-tab-count{color:var(--text-tertiary);font-weight:400}
.feedback-model-tabs :deep(button){border-radius:12px!important}
.feedback-model-tabs :deep(button[aria-selected=true]){box-shadow:none;border-color:var(--stroke-border)}
.feedback-search{margin-bottom:12px}
.feedback-search>div:first-child{width:100%}
.feedback-filters{gap:4px;margin-bottom:24px}
.feedback-checkbox-tag{height:32px;min-height:32px}
.feedback-checkbox-tag :deep([class*="__main-container"]){padding:4px 8px;min-height:32px}
.feedback-checkbox-tag :deep([data-testid=label]){gap:4px;margin-left:4px;font-size:16px;line-height:24px}
.feedback-score-stars :deep(.font-icon-v3){font-size:12px}
.customer-opinion{border:0;padding:0;margin:0 0 32px;min-width:0}
.popular-opinion{background:var(--background-primary);border:0;border-radius:12px;padding:12px;margin-bottom:32px}
.popular-opinion-title{font-size:16px;line-height:1.3;margin-bottom:8px}
.opinion-heading{margin-bottom:16px}
.opinion-author{flex:1;min-width:0}
.opinion-author>a{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;overflow-wrap:normal}
.opinion-meta{line-height:1.3}
.opinion-meta>span+span{font-size:12px}
.opinion-menu :deep(.font-icon-v3){font-size:20px}
.opinion-grades{gap:4px;margin:0 0 16px;align-items:center}
.opinion-grades>span{background:var(--background-neutral-light,var(--background-tertiary));padding:4px 8px;min-height:32px;font-size:16px;box-sizing:border-box}
.opinion-grades :deep([class*="base-tag"]){background:var(--background-neutral-light,var(--background-tertiary));border:0;min-height:32px;border-radius:8px}
.opinion-detail{margin-top:12px;font-size:16px;line-height:1.4}
.opinion-detail>b{line-height:1.3;margin-bottom:4px}
.opinion-media{margin-top:12px;font-size:16px;line-height:1.3}.opinion-photos{gap:12px;margin-top:12px}
.opinion-footer{margin-top:24px;align-items:flex-start}
.opinion-comments-expansion{min-width:0;flex:1}
.opinion-comments-expansion :deep(button){font-size:14px}
.opinion-comments{margin-top:12px}
.opinion-votes{height:36px;flex-shrink:0}
.feedback-all{margin-top:0}
@media(max-width:1399px){
 .feedback-layout{grid-template-columns:260px minmax(0,1fr);gap:32px}
 .feedback-summary{padding:12px}
 .feedback-total>strong{min-width:100px;font-size:48px}
 .feedback-total a{font-size:12px!important}
}
@media(max-width:991.98px){
 .customer-feedback{padding:20px 16px}
 .feedback-layout{display:flex;gap:32px}
 .feedback-summary{width:100%;padding:0;grid-template-columns:1fr 1fr}
 .feedback-total>strong{min-width:100px}
 .rating-distribution{margin:0;align-self:center}
 .feedback-media{margin:24px 0}
 .feedback-media-rail{max-width:calc(100% - 72px)}
 .feedback-media-all{height:64px;font-size:12px!important}
 .real-buyers-banner{padding:16px;min-height:89px;margin-bottom:24px}
 .real-buyers-banner h3,.real-buyers-banner p{max-width:calc(100% - 160px)}
 .real-buyers-art{right:8px}
 .feedback-invite{margin-top:0}
 .feedback-filters{gap:4px}
}
@media(max-width:600px){
 .real-buyers-banner h3,.real-buyers-banner p{max-width:100%}
 .real-buyers-art{display:none}
 .feedback-summary{grid-template-columns:1fr 1fr}
 .feedback-characteristics{grid-column:1/-1}
 .feedback-model-tabs :deep(button){padding:8px;max-width:none;font-size:14px}
 .feedback-checkbox-tag :deep([data-testid=label]){font-size:14px}
 .opinion-heading-actions{gap:4px}
 .opinion-author>a{font-size:13px!important}
 .opinion-author>img{width:36px;height:36px}
 .opinion-meta{font-size:12px}
 .opinion-heading{flex-wrap:nowrap}
 .opinion-footer{flex-wrap:nowrap}
 .opinion-votes{gap:4px}
}



.opinion-avatar{position:relative;display:block;width:46px;height:46px;flex-shrink:0}
.opinion-avatar>img{display:block;width:46px;height:46px;position:absolute;inset:0}
.opinion-avatar>.opinion-avatar-picture{width:37.822px;height:37.822px;inset:4.089px;object-fit:cover;border-radius:50%}

</style>
