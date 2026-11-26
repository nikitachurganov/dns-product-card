<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { BaseUiButton, BaseUiIconButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
import { Breadcrumbs } from '@dns-modules/breadcrumbs'
import { Checkbox } from '@dns-modules/checkbox'
import BaseUiInputSearch from '@dns-modules/base-ui-input-search'
import { IconCompare, IconWishlist, IconWishlistFill, IconCart, IconCircleUser, IconLocation, IconChevronDown, IconChevronLeft, IconChevronRight, IconPlus, IconPlayFill, IconRatingFill, IconChat, IconShieldCheck, IconLink, IconCircleInfo, IconClose, IconCheck, IconZoomIn } from '@dns-modules/font-icon'
import { productName, productUrl, productCode, basePrice, baseCredit, builds, money, discountVariants } from './data'
import DiscountVariants from './components/DiscountVariants.vue'
import './styles/discount-variants.css'
import ReadyBuilds from './components/ReadyBuilds.vue'
import ProductSpecifications from './components/ProductSpecifications.vue'
import RecommendationWidgets from './components/RecommendationWidgets.vue'
import CustomerFeedback from './components/CustomerFeedback.vue'
import VideoIndicator from './components/VideoIndicator.vue'
import recommendations from './recommendations.json'

const favorite = ref(false), compare = ref(false), inCart = ref(false), added = ref(false)
const isDiscountSelected = ref(true), selectedDiscountId = ref(1)
const currentDiscountVariant = computed(() => discountVariants.find(v => v.id === selectedDiscountId.value) || discountVariants[0])
const selectedPhoto = ref(0), selectedReview = ref(0), modal = ref(null), activeBuild = ref(null), toast = ref('')
const query = ref(''), partsRail = ref(null), catalogOpen = ref(false)
const buildSelection = ref({cart:[],favorites:[],compare:[]})
const savedBuilds = computed(() => builds.filter(build => buildSelection.value[modal.value]?.includes(build.id)))
const savedRecommendations = computed(() => [...recommendations.accessories,...recommendations.services,...recommendations.together].filter(item=>buildSelection.value[modal.value]?.includes(item.id)))
function removeSavedBuild(id) { buildSelection.value = {...buildSelection.value, [modal.value]:buildSelection.value[modal.value].filter(value=>value!==id)} }
let toastTimer
let modalTrigger
watch(modal, (value, previous) => {
 if(value && !previous) { modalTrigger=document.activeElement; document.body.style.overflow='hidden' }
 if(!value) { document.body.style.overflow=''; nextTick(()=>modalTrigger?.focus()) }
})
function notify(message) { toast.value = message; clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.value='',3000) }
function addToCart() {
  inCart.value = !inCart.value
  const itemType = isDiscountSelected.value ? `Уцененный блок питания (${currentDiscountVariant.value.store})` : 'Блок питания'
  notify(inCart.value ? `${itemType} добавлен в корзину` : `${itemType} удалён из корзины`)
}
function toggleFavorite() { favorite.value=!favorite.value; notify(favorite.value?'Товар добавлен в избранное':'Товар удалён из избранного') }
async function copyLink() { try { await navigator.clipboard.writeText(productUrl); notify('Ссылка скопирована') } catch { notify(productUrl) } }
function addToBuild() { added.value=!added.value; notify(added.value?'DEEPCOOL PL750D добавлен в вашу сборку':'Блок питания удалён из сборки') }
function showBuild(build) { activeBuild.value=build; modal.value='build' }
function search() { if(query.value.trim()) window.open('https://www.dns-shop.ru/search/?q='+encodeURIComponent(query.value),'_blank','noopener,noreferrer') }
function onKey(e) { if(e.key==='Escape'){modal.value=null;catalogOpen.value=false} }
const mainPhoto = computed(()=>selectedPhoto.value===0?'/images/asus-thor.png':`/images/gallery-${selectedPhoto.value}.jpg`)
const categories = [
 {name:'Процессор',icon:'cpu'},{name:'Мат. плата',icon:'motherboard'},{name:'Корпус',icon:'pc'},{name:'Видеокарта',icon:'gpu'},{name:'Охлаждение процессора',icon:'cooler'},{name:'Оперативная память',icon:'ram'},{name:'Накопители',icon:'hdd'},{name:'Звуковая карта',icon:'audio'},{name:'Доп. детали',icon:'add-more'},
]
const crumbs = [
  { label: 'Каталог', to: 'https://www.dns-shop.ru/catalog/' },
  { label: 'Комплектующие для ПК', to: 'https://www.dns-shop.ru/catalog/17aa522a16404e77/komplektuyushhie-dlya-pk/' },
  { label: 'Основные комплектующие для ПК', to: 'https://www.dns-shop.ru/catalog/88f4ff1d48f3a86e/osnovnye-komplektuyushhie-dlya-pk/' },
  { label: 'Блоки питания', to: 'https://www.dns-shop.ru/catalog/17a89c2216404e77/bloki-pitaniya/' },
  { label: productName, to: productUrl }
]
const mobileCrumbs = [
  { label: 'DNS', to: 'https://www.dns-shop.ru/' },
  { label: 'Каталог', to: 'https://www.dns-shop.ru/catalog/' },
  { label: 'Уценённые товары', to: 'https://www.dns-shop.ru/catalog/markdown/' },
  { label: productName, to: productUrl }
]
const descExpanded = ref(false)
onMounted(()=>window.addEventListener('keydown',onKey))
onUnmounted(()=>{clearTimeout(toastTimer);window.removeEventListener('keydown',onKey)})
</script>

<template>
 <header class="site-header">
  <div class="page-width">
   <div class="topbar">
    <div class="locale"><span class="russian-flag" aria-label="Россия"></span><span>Ru</span><IconChevronDown/><BaseLink href="https://www.dns-shop.ru/shops/vladivostok/" size="small" variant="navigation"><IconLocation/>Владивосток</BaseLink></div>
    <nav class="top-links" aria-label="О магазине"><a href="https://www.dns-shop.ru/short/">DNS Видео<span class="orange-dot"></span></a><a href="https://www.dns-shop.ru/shops/">Магазины</a><a href="https://www.dns-shop.ru/help/delivery/">Доставка</a><a href="https://www.dns-shop.ru/help/">Покупателям⌄</a><a href="https://www.dns-shop.ru/help/legal-entities/">Юрлицам</a><a href="https://club.dns-shop.ru/">Клуб DNS</a><a href="https://www.dns-shop.ru/actions/">Предложения брендов</a><a href="https://www.dns-shop.ru/help/partners/">Сотрудничество⌄</a></nav>
    <a class="phone" href="tel:88007707999">8-800-77-07-999</a>
   </div>
   <div class="main-header">
    <BaseUiIconButton class="mobile-back" tag="a" :href="crumbs[3].to" variant="secondary" size="small" aria-label="Назад к блокам питания"><IconChevronLeft/></BaseUiIconButton>
    <div class="brand-block"><a href="https://www.dns-shop.ru/" aria-label="DNS — главная"><img class="dns-logo" src="/images/dns-logo.svg" alt="DNS"/></a><button class="catalog-button" @click="catalogOpen=!catalogOpen" :aria-expanded="catalogOpen">Каталог<IconChevronDown/></button></div>
    <label class="header-search"><span class="sr-only">Поиск по сайту</span><BaseUiInputSearch placeholder="Поиск по сайту" color="grey" size="large" search-icon-location="right" :external-value="query" @input="query=$event" @submit="search"/></label>
    <nav class="header-actions" aria-label="Личный кабинет">
     <button aria-label="Сравнение" @click="modal='compare'"><span class="header-icon"><IconCompare/><b v-if="compare || buildSelection.compare.length" class="counter">{{Number(compare)+buildSelection.compare.length}}</b></span><span>Сравнение</span></button>
     <button aria-label="Избранное" @click="modal='favorites'"><span class="header-icon"><IconWishlist/><b v-if="favorite || buildSelection.favorites.length" class="counter">{{Number(favorite)+buildSelection.favorites.length}}</b></span><span>Избранное</span></button>
     <button aria-label="Корзина" @click="modal='cart'"><span class="header-icon"><IconCart/><b v-if="inCart || buildSelection.cart.length" class="counter">{{Number(inCart)+buildSelection.cart.length}}</b></span><span>Корзина</span></button>
     <button class="profile-button" aria-label="Личный кабинет" @click="modal='profile'"><IconCircleUser/></button>
    </nav>
    <div class="mobile-header-actions"><BaseUiIconButton variant="secondary" size="small" aria-label="Вопросы о товаре" tag="a" :href="productUrl.replace('/product/','/product/communicator/')"><IconChat/></BaseUiIconButton><BaseUiIconButton variant="secondary" size="small" aria-label="Поделиться товаром" @click="copyLink"><IconLink/></BaseUiIconButton></div>
   </div>
   <nav v-if="catalogOpen" class="catalog-menu" aria-label="Каталог"><BaseLink v-for="(name,i) in ['Комплектующие для ПК','Готовые компьютеры','Ноутбуки','Смартфоны']" :key="name" :href="i===0?crumbs[1].to:'https://www.dns-shop.ru/search/?q='+encodeURIComponent(name)">{{name}}<IconChevronRight/></BaseLink></nav>
  </div>
 </header>

 <main class="page-width">
  <div class="product-heading">
   <!-- Оригинальные хлебные крошки каталога на ПК -->
   <Breadcrumbs class="desktop-breadcrumbs" :items="crumbs"/>
   <!-- Хлебные крошки уцененных товаров на мобильных -->
   <Breadcrumbs class="mobile-breadcrumbs" :items="mobileCrumbs"/>
   <div class="title-row"><h1>{{productName}}</h1><span class="product-number">#{{productCode}}</span></div>
  </div>
  <section class="surface product-card" aria-label="Карточка товара">
   <div class="product-top">
    <!-- Галерея -->
    <div class="gallery">
     <div class="thumbnails"><button class="video-thumb" aria-label="Видео о блоке питания" @click="modal='video'"><IconPlayFill/></button><button v-for="i in 8" :key="i" :class="{active:selectedPhoto===i-1}" :aria-label="'Фото блока питания '+i" :aria-pressed="selectedPhoto===i-1" @click="selectedPhoto=i-1"><img :src="`/images/thumb-${i-1}.webp`" alt=""/></button></div>
     <button class="main-photo" aria-label="Увеличить фотографию блока питания" @click="modal='photo'"><img :src="mainPhoto" alt="Блок питания ASUS ROG THOR 1600W Titanium III [90YE00V1-B0NA00] черный"/><span class="zoom-icon"><IconZoomIn/></span></button>
     <div class="bronze-badge" title="Сертификат 80 PLUS Bronze"><b>80</b><span>PLUS</span><small>BRONZE</small></div>
     <BaseLink class="product-code" :href="productUrl" size="small">Код товара: {{productCode}}</BaseLink>

     <!-- Мобильные пагинация и код товара (скрыты на ПК) -->
     <div class="mobile-gallery-controls">
      <div class="mobile-gallery-dots">
       <span v-for="dot in 6" :key="dot" class="mobile-gallery-dot" :class="{ 'is-active': selectedPhoto === dot - 1 }" @click="selectedPhoto = dot - 1"></span>
      </div>
      <div class="mobile-gallery-code">Код товара: {{productCode}}</div>
     </div>
    </div>

    <!-- Правая колонка с информацией о товаре -->
    <div class="product-info">
     <!-- Мобильное название товара (скрыто на ПК) -->
     <h1 class="mobile-product-name">{{productName}}</h1>

     <!-- Мобильные действия: Сравнить и В избранное (скрыты на ПК) -->
     <div class="mobile-actions-row">
      <label class="mobile-action-compare">
       <input type="checkbox" v-model="compare" class="mobile-action-checkbox" />
       <span>Сравнить</span>
      </label>
      <button type="button" class="mobile-action-favorite" :class="{ 'is-active': favorite }" @click="toggleFavorite">
       <component :is="favorite ? IconWishlistFill : IconWishlist" />
       <span>В избранное</span>
      </button>
     </div>

     <!-- Мобильный виджет отзывов и вопросов (скрыт на ПК) -->
     <div class="mobile-reviews-card">
      <img src="/images/review-0.jpg" alt="" class="mobile-review-avatar" />
      <a href="#reviews" class="mobile-review-rating-block">
       <span class="mobile-star">4.82 ★</span>
       <span class="mobile-rating-text">4.6k отзывов</span>
      </a>
      <span class="mobile-review-sep"></span>
      <a href="#questions" class="mobile-review-questions-block">
       <span class="mobile-q-count">14</span>
       <span class="mobile-q-icon">?</span>
       <span>вопросов</span>
      </a>
     </div>

     <!-- ПК блок характеристик (скрыт на мобильном) -->
     <div class="specification-summary"><div><p><span>Мощность:</span> 750 Вт</p><p><span>Размеры вентиляторов:</span> 120 × 120 мм</p><p><span>Сертификат 80 PLUS:</span> Bronze</p><BaseLink size="small" :href="productUrl.replace('/product/','/product/characteristics/')">Подробнее<IconChevronRight/></BaseLink></div><img class="deepcool-logo" src="/images/deepcool.png" alt="DEEPCOOL"/></div>

     <!-- ПК бейджи (скрыты на мобильном) -->
     <div class="product-badges"><BaseUiButton class="mobile-favorite" variant="secondary" size="small" @click="toggleFavorite"><template #icon-left><component :is="favorite?IconWishlistFill:IconWishlist"/></template>{{favorite?'В избранном':'В избранное'}}</BaseUiButton><label class="compare-control"><Checkbox :checked="compare" @click="compare=!compare"/>Сравнить</label><a class="chip" :href="productUrl.replace('/product/','/product/opinion/')"><IconRatingFill class="star"/><b>4.82</b><span class="divider">|</span><span class="rating-count">4.6k отзывов</span></a><a class="chip" :href="productUrl.replace('/product/','/product/communicator/')"><IconChat/>14 вопросов</a><a class="chip reliability" :href="productUrl.replace('/product/','/product/service-rating/')"><IconShieldCheck/>Отличная надежность</a><button class="chip share-button" aria-label="Скопировать ссылку" @click="copyLink"><IconLink/></button></div>

     <!-- ПК строка покупки (скрыта на мобильном) -->
     <div class="purchase-row"><div class="price-block"><div><strong>{{ isDiscountSelected ? money(currentDiscountVariant.price) : money(basePrice) }}</strong><span>{{ isDiscountSelected ? currentDiscountVariant.credit : baseCredit }}</span></div><IconCircleInfo/></div><BaseUiIconButton class="favorite-button" variant="secondary" size="medium" :aria-pressed="favorite" :aria-label="favorite?'Удалить из избранного':'Добавить в избранное'" @click="toggleFavorite"><component :is="favorite?IconWishlistFill:IconWishlist"/></BaseUiIconButton><BaseUiButton :variant="inCart?'info':'primary'" size="medium" class="buy-button" @click="addToCart">{{ inCart ? 'В корзине' : 'Купить' }}</BaseUiButton></div>

     <!-- ПК блок наличия (скрыт на мобильном) -->
     <div class="availability desktop-availability">
      <a href="https://www.dns-shop.ru/shops/vladivostok/"><div class="availability-copy">В наличии<span>в 19 магазинах</span></div><span class="availability-icon shops-icon" aria-hidden="true"><span><img src="/images/availability/shops.png" alt=""/></span></span></a>
      <a href="https://www.dns-shop.ru/help/delivery/"><div class="availability-copy">Доставим на дом<span>за 2 часа</span></div><span class="availability-icon delivery-icon" aria-hidden="true"><img src="/images/availability/delivery.png" alt="" width="34" height="34"/></span></a>
     </div>

     <!-- Доступные варианты (мульти-параметр по макету из Figma) -->
     <DiscountVariants
       v-model="selectedDiscountId"
       v-model:is-discount-selected="isDiscountSelected"
       :variants="discountVariants"
       :product-code="productCode"
     />

     <!-- Мобильный блок «В наличии» (скрыт на ПК) -->
     <div class="mobile-availability-card">
      <div class="mobile-avail-text">
       <span class="mobile-avail-label">В наличии:</span>
       <a href="https://www.dns-shop.ru/shops/vladivostok/" class="mobile-avail-store">DNS ТЦ «Черёмушки»</a>
      </div>
      <div class="mobile-avail-icon" aria-hidden="true">
       <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#fc8507"/>
       </svg>
      </div>
     </div>

     <!-- Мобильный блок описания товара (скрыт на ПК) -->
     <div class="mobile-description-card">
      <p class="mobile-desc-text" :class="{ 'is-collapsed': !descExpanded }">
       Блок питания ASUS ROG THOR 1600W Titanium III [90YE00V1-B0NA00] черный обладает рекордным КПД с сертификатом 80 PLUS Titanium и ультратихим охлаждением. Оснащен силовыми компонентами на базе нитрида галлия (GaN), OLED-дисплеем мониторинга мощности в реальном времени и разъемом 12V-2x6 (PCIe 5.0) для флагманских видеокарт.
      </p>
      <button type="button" class="mobile-desc-toggle" @click="descExpanded = !descExpanded">
       {{ descExpanded ? 'Свернуть' : 'Развернуть описание' }}
      </button>
     </div>
    </div>
   </div>
   <div class="customer-photos" aria-label="Фото и видео покупателей"><button v-for="i in 13" :key="i" :aria-label="i===1?'Видео покупателя':'Фотография покупателя '+(i-1)" @click="modal='review'; selectedReview=i-1"><img :src="`/images/review-${i-1}.jpg`" alt=""/><VideoIndicator v-if="i===1" class="customer-play"/></button></div>
  </section>

  <section class="surface configurator" aria-labelledby="config-title">
   <h2 id="config-title">Добавьте товар в сборку</h2><p class="section-description">При выборе остальных комплектующих мы отметим совместимые</p>
   <div class="parts-wrap"><div ref="partsRail" class="parts-rail"><div class="part-tile current-part" :class="{added}"><b>Блок питания</b><BaseUiButton variant="tertiary" size="tiny" @click="addToBuild"><template #icon-left><component :is="added?IconCheck:IconPlus"/></template>{{added?'Добавлен':'Добавить'}}</BaseUiButton></div><a v-for="part in categories" :key="part.name" class="part-tile" :href="'https://www.dns-shop.ru/configurator/'" :title="part.name"><IconCircleInfo class="part-info"/><span class="part-icon" aria-hidden="true"><img :src="`/icons/configurator/${part.icon}.svg`" alt="" width="36" height="36"/></span><span>{{part.name}}</span></a></div><BaseUiIconButton class="parts-next floating-arrow" size="small" variant="tertiary" aria-label="Следующие комплектующие" @click="partsRail.scrollBy({left:350,behavior:'smooth'})"><IconChevronRight/></BaseUiIconButton></div>
   <div class="config-links"><BaseLink href="https://www.dns-shop.ru/configurator/" variant="navigation" size="small">В конфигуратор</BaseLink><BaseLink href="#ready-builds" variant="navigation" size="small">Сборки с этим блоком питания</BaseLink></div>
  </section>

  <ReadyBuilds v-model:selection="buildSelection" @show-build="showBuild" @notify="notify"/>
  <ProductSpecifications/>
  <RecommendationWidgets v-model:selection="buildSelection" @notify="notify"/>
  <CustomerFeedback/>
 </main>

 <div class="mobile-purchase"><strong>{{ isDiscountSelected ? money(currentDiscountVariant.price) : money(basePrice) }}</strong><BaseUiIconButton variant="secondary" size="medium" :aria-label="favorite?'Удалить из избранного':'Добавить в избранное'" @click="toggleFavorite"><component :is="favorite?IconWishlistFill:IconWishlist"/></BaseUiIconButton><BaseUiButton size="medium" :variant="inCart?'info':'primary'" @click="addToCart">{{ inCart ? 'В корзине' : 'Купить' }}</BaseUiButton></div>

 <Transition name="toast"><div v-if="toast" class="toast-message" role="status"><IconCircleInfo/>{{toast}}</div></Transition>
 <div v-if="modal" class="modal-overlay" @click.self="modal=null"><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1" v-autofocus><BaseUiIconButton variant="tertiary" size="small" class="modal-close" aria-label="Закрыть" @click="modal=null"><IconClose/></BaseUiIconButton>
  <template v-if="modal==='build' && activeBuild"><h2 id="modal-title">Готовая сборка ПК</h2><div class="build-detail"><img :src="'/images/'+activeBuild.image" :alt="activeBuild.case"/><div><h3>{{activeBuild.cpu}} / {{activeBuild.gpu}}</h3><dl><dt>Процессор</dt><dd>{{activeBuild.cpu}}</dd><dt>Видеокарта</dt><dd>{{activeBuild.gpu}}</dd><dt>Материнская плата</dt><dd>{{activeBuild.board}}</dd><dt>Оперативная память</dt><dd>{{activeBuild.ram}} DDR5</dd><dt>Накопитель</dt><dd>SSD {{activeBuild.ssd}}</dd><dt>Блок питания</dt><dd>DEEPCOOL PL750D, 750 Вт</dd><dt>Корпус</dt><dd>{{activeBuild.case}}</dd></dl><strong class="detail-price">{{money(activeBuild.price)}}</strong><BaseUiButton tag="a" :href="activeBuild.url || 'https://www.dns-shop.ru/configurator/'" target="_blank" rel="noopener noreferrer">Открыть в конфигураторе</BaseUiButton></div></div><p class="demo-note">Демонстрационная конфигурация и цена для прототипа.</p></template>
  <template v-else-if="modal==='photo'"><h2 id="modal-title">DEEPCOOL PL750D</h2><img class="enlarged-photo" :src="mainPhoto" alt="Фотография блока питания DEEPCOOL PL750D"/></template>
  <template v-else-if="modal==='review'"><h2 id="modal-title">Фото покупателей</h2><img class="enlarged-photo customer-detail" :src="`/images/review-${selectedReview}.jpg`" alt="Фото покупателя"/><BaseLink :href="productUrl.replace('/product/','/product/opinion/')" target="_blank">Все фотографии и отзывы на DNS</BaseLink></template>
  <template v-else-if="modal==='cart' || modal==='favorites' || modal==='compare'"><h2 id="modal-title">{{modal==='cart'?'Корзина':modal==='favorites'?'Избранное':'Сравнение товаров'}}</h2><div v-if="modal==='cart'?inCart:modal==='favorites'?favorite:compare" class="saved-product"><img src="/images/psu.webp" alt="DEEPCOOL PL750D"/><div><h3>{{productName}}</h3><strong>7 399 ₽</strong><BaseUiButton variant="secondary" size="small" @click="modal==='cart'?addToCart():modal==='favorites'?toggleFavorite():compare=false">Удалить</BaseUiButton></div></div><div v-for="build in savedBuilds" :key="build.id" class="saved-product saved-build"><img :src="'/images/'+build.image" :alt="build.case"/><div><h3>ПК {{build.cpu}} / {{build.gpu}} / {{build.ram}} / SSD {{build.ssd}}</h3><strong>{{money(build.price)}}</strong><BaseUiButton variant="secondary" size="small" @click="removeSavedBuild(build.id)">Удалить</BaseUiButton></div></div><div v-for="item in savedRecommendations" :key="item.id" class="saved-product saved-build"><img :src="item.image" :alt="item.alt"/><div><h3>{{item.name}}</h3><strong>{{money(item.price)}}</strong><BaseUiButton variant="secondary" size="small" @click="removeSavedBuild(item.id)">Удалить</BaseUiButton></div></div><p v-if="!(modal==='cart'?inCart:modal==='favorites'?favorite:compare) && !savedBuilds.length && !savedRecommendations.length" class="empty-message">{{modal==='cart'?'В корзине пока нет товаров':modal==='favorites'?'В избранном пока нет товаров':'Добавьте товары для сравнения'}}</p></template>
  <template v-else-if="modal==='video'"><h2 id="modal-title">Видео о DEEPCOOL PL750D</h2><p>Видео и обзоры доступны на странице товара.</p><BaseUiButton tag="a" :href="productUrl" target="_blank" rel="noopener noreferrer">Открыть на DNS</BaseUiButton></template>
  <template v-else><h2 id="modal-title">Личный кабинет</h2><p>Войдите на DNS, чтобы сохранять сборки и отслеживать заказы.</p><BaseUiButton tag="a" href="https://www.dns-shop.ru/" target="_blank" rel="noopener noreferrer">Перейти на DNS</BaseUiButton></template>
 </section></div>
</template>

<script>
export default {directives:{autofocus:{mounted(el){el.focus();el.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=el.querySelectorAll('button:not([disabled]),a[href],input,[tabindex="0"]');const first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===el)){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}})}}}}
</script>
