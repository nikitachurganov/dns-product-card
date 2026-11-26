<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { BaseUiButton, BaseUiIconButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
import { BottomSheet } from '@dns-modules/bottom-sheet'
import BaseUiInputSearch from '@dns-modules/base-ui-input-search'
import { IconActionSearchInList, IconActionHeartOutlined, IconDataMapPin, IconNavChevronDown, IconNavChevronRight, IconActionClose, IconNavHamburgerMenu } from '@dns-modules/font-icon-v3'
import { city, phone, topLinks, categories, dnsUrl } from '../data'

const query = ref('')
const catalogOpen = ref(false)
const openMenu = ref(null)
// На планшете и телефоне верхние ссылки не помещаются — их забирает шторка из ДС
const menuOpen = ref(false)
const scrolled = ref(false)

function search() {
  const q = query.value.trim()
  window.open(q ? `${dnsUrl}/search/?q=${encodeURIComponent(q)}` : `${dnsUrl}/catalog/`, '_blank', 'noopener')
}
function closeAll(event) {
  if (!event.target.closest('[data-popup]')) { catalogOpen.value = false; openMenu.value = null }
}
function onKey(event) { if (event.key === 'Escape') { catalogOpen.value = false; openMenu.value = null } }
function onScroll() { scrolled.value = window.scrollY > 120 }

onMounted(() => {
  document.addEventListener('click', closeAll)
  document.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  document.removeEventListener('click', closeAll)
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-top">
      <div class="page-width header-top__row">
        <div class="header-top__locale">
          <button class="text-button" type="button">Ru<IconNavChevronDown aria-hidden="true" /></button>
          <BaseLink class="header-top__city" :href="`${dnsUrl}/shops/vladivostok/`" size="small" variant="navigation"><IconDataMapPin aria-hidden="true" />{{ city }}</BaseLink>
        </div>
        <nav class="header-top__nav" aria-label="Информация">
          <template v-for="link in topLinks" :key="link.label">
            <div v-if="link.menu" class="header-top__dropdown" data-popup>
              <button class="text-button" type="button" :aria-expanded="openMenu === link.label" @click="openMenu = openMenu === link.label ? null : link.label">
                {{ link.label }}<IconNavChevronDown aria-hidden="true" :class="{ 'is-flipped': openMenu === link.label }" />
              </button>
              <ul v-if="openMenu === link.label" class="popup-menu">
                <li v-for="item in link.menu" :key="item.label"><a :href="item.href">{{ item.label }}</a></li>
              </ul>
            </div>
            <BaseLink v-else class="top-link" :href="link.href" size="small" variant="navigation">{{ link.label }}<span v-if="link.dot" class="orange-dot" aria-label="новое"></span></BaseLink>
          </template>
        </nav>
        <a class="header-top__phone" :href="phone.href">{{ phone.label }}</a>
      </div>
    </div>

    <div class="header-main">
      <div class="page-width header-main__row">
        <BaseUiIconButton class="burger" variant="secondary" size="medium" aria-label="Меню сайта" aria-haspopup="dialog" :aria-expanded="menuOpen" @click="menuOpen = true"><IconNavHamburgerMenu /></BaseUiIconButton>
        <a class="header-main__logo" :href="dnsUrl" aria-label="DNS — на главную"><img src="/home/header/dns-logo.svg" alt="DNS" width="120" height="33" /></a>
        <div class="header-main__search" data-popup>
          <BaseUiButton class="catalog-button" variant="primary" size="medium" :aria-expanded="catalogOpen" aria-controls="catalog-menu" @click="catalogOpen = !catalogOpen">
            <template #icon-left><component :is="catalogOpen ? IconActionClose : IconActionSearchInList" /></template>
            <span class="catalog-button__label">Каталог</span>
          </BaseUiButton>
          <form class="search-field" role="search" @submit.prevent="search">
            <label class="sr-only" for="site-search">Поиск по сайту</label>
            <BaseUiInputSearch id="site-search" placeholder="Поиск по сайту" color="grey" size="large" search-icon-location="right" :external-value="query" @input="query = $event" @submit="search" />
          </form>
          <nav v-if="catalogOpen" id="catalog-menu" class="catalog-menu" aria-label="Каталог товаров">
            <a v-for="item in categories" :key="item.label" :href="item.href">{{ item.label }}<IconNavChevronRight aria-hidden="true" /></a>
          </nav>
        </div>
        <nav class="header-main__actions" aria-label="Личный кабинет">
          <a class="icon-action" :href="`${dnsUrl}/compare/`" aria-label="Сравнение"><img src="/home/header/compare.svg" alt="" width="24" height="24" /></a>
          <a class="icon-action" :href="`${dnsUrl}/profile/wishlist/`" aria-label="Избранное"><IconActionHeartOutlined /></a>
          <a class="icon-action" :href="`${dnsUrl}/cart/`" aria-label="Корзина"><img src="/home/header/cart.svg" alt="" width="24" height="24" /></a>
          <a class="avatar" :href="`${dnsUrl}/profile/`" aria-label="Профиль"><span class="avatar__image"></span></a>
        </nav>
      </div>
    </div>

    <nav class="header-categories" aria-label="Популярные категории">
      <div class="page-width header-categories__row">
        <BaseLink v-for="item in categories" :key="item.label" class="category-link" :href="item.href" size="small" variant="navigation">{{ item.label }}</BaseLink>
      </div>
    </nav>

    <BottomSheet v-if="menuOpen" @close="menuOpen = false">
      <template #header><h2 class="menu-sheet__title">Меню</h2></template>
      <div class="menu-sheet">
        <div class="menu-sheet__contacts">
          <BaseLink :href="`${dnsUrl}/shops/vladivostok/`" size="big" variant="navigation"><IconDataMapPin aria-hidden="true" />{{ city }}</BaseLink>
          <BaseLink :href="phone.href" size="big" variant="navigation">{{ phone.label }}</BaseLink>
          <span class="menu-sheet__hours">{{ phone.hours }}</span>
        </div>
        <nav aria-label="Информация">
          <ul class="menu-sheet__list">
            <template v-for="link in topLinks" :key="link.label">
              <li v-if="link.menu" class="menu-sheet__group">
                <span class="menu-sheet__group-title">{{ link.label }}</span>
                <ul>
                  <li v-for="item in link.menu" :key="item.label"><BaseLink :href="item.href" size="big" variant="navigation">{{ item.label }}</BaseLink></li>
                </ul>
              </li>
              <li v-else><BaseLink :href="link.href" size="big" variant="navigation">{{ link.label }}<span v-if="link.dot" class="orange-dot" aria-label="новое"></span></BaseLink></li>
            </template>
          </ul>
        </nav>
      </div>
    </BottomSheet>
  </header>
</template>
