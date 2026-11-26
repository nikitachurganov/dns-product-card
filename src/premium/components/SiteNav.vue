<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { BottomSheet } from '@dns-modules/bottom-sheet'
import { BaseLink } from '@dns-modules/base-link'
import BaseUiInputSearch from '@dns-modules/base-ui-input-search'
import { IconActionSearch, IconActionHeartOutlined, IconBusinessShoppingBag, IconNavHamburgerMenu, IconActionClose } from '@dns-modules/font-icon-v3'
import { navLinks, quickSearch, phone, dnsUrl } from '../data'

const searchOpen = ref(false)
const menuOpen = ref(false)
const query = ref('')

function search(text = query.value) {
  const q = text.trim()
  window.open(q ? `${dnsUrl}/search/?q=${encodeURIComponent(q)}` : `${dnsUrl}/catalog/`, '_blank', 'noopener')
}
function onKey(event) { if (event.key === 'Escape') searchOpen.value = false }
function onClick(event) { if (!event.target.closest('[data-search]')) searchOpen.value = false }

onMounted(() => { document.addEventListener('keydown', onKey); document.addEventListener('click', onClick) })
onUnmounted(() => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick) })
</script>

<template>
  <header class="nav" data-search>
    <div class="nav__bar">
      <button class="nav__icon nav__burger" type="button" aria-label="Меню" aria-haspopup="dialog" :aria-expanded="menuOpen" @click="menuOpen = true"><IconNavHamburgerMenu /></button>
      <a class="nav__logo" :href="dnsUrl" aria-label="DNS — на главную"><img src="/home/header/dns-logo.svg" alt="DNS" width="56" height="15" /></a>
      <nav class="nav__links" aria-label="Разделы">
        <a v-for="link in navLinks" :key="link.label" :href="link.href">{{ link.label }}</a>
      </nav>
      <div class="nav__tools">
        <button class="nav__icon" type="button" :aria-label="searchOpen ? 'Закрыть поиск' : 'Поиск'" :aria-expanded="searchOpen" aria-controls="nav-search" @click.stop="searchOpen = !searchOpen">
          <component :is="searchOpen ? IconActionClose : IconActionSearch" />
        </button>
        <a class="nav__icon nav__wish" :href="`${dnsUrl}/profile/wishlist/`" aria-label="Избранное"><IconActionHeartOutlined /></a>
        <a class="nav__icon" :href="`${dnsUrl}/cart/`" aria-label="Корзина"><IconBusinessShoppingBag /></a>
      </div>
    </div>

    <div v-if="searchOpen" id="nav-search" class="nav__search">
      <form class="nav__search-form" role="search" @submit.prevent="search()">
        <label class="sr-only" for="premium-search">Поиск по сайту</label>
        <BaseUiInputSearch id="premium-search" placeholder="Поиск по сайту" color="grey" size="large" search-icon-location="left" :external-value="query" @input="query = $event" @submit="search()" />
      </form>
      <div class="nav__quick">
        <p>Быстрые ссылки</p>
        <ul>
          <li v-for="item in quickSearch" :key="item"><a :href="`${dnsUrl}/search/?q=${encodeURIComponent(item)}`">{{ item }}</a></li>
        </ul>
      </div>
    </div>

    <BottomSheet v-if="menuOpen" @close="menuOpen = false">
      <template #header><h2 class="sheet__title">Меню</h2></template>
      <nav class="sheet" aria-label="Разделы">
        <a v-for="link in navLinks" :key="link.label" :href="link.href">{{ link.label }}</a>
        <div class="sheet__contacts">
          <BaseLink :href="phone.href" size="big" variant="navigation">{{ phone.label }}</BaseLink>
          <span>{{ phone.hours }}</span>
        </div>
      </nav>
    </BottomSheet>
  </header>
</template>
