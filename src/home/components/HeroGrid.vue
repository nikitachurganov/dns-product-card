<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BaseUiButton } from '@dns-modules/base-ui-button'
import { serviceTiles, vacancies, money, dnsUrl } from '../data'

const art = { created: 'created-by-dns', build: 'build-pc', gift: 'gift-cards', payment: 'payment-cards' }
const active = ref(0)
const paused = ref(false)
const vacancy = computed(() => vacancies[active.value])
let timer

// Размер точки повторяет индикатор из макета: 8 · 8 · 6 · 4 px по мере удаления от активной
const dotSize = (index) => [8, 8, 6, 4][Math.min(Math.abs(index - active.value), 3)]

function go(index) { active.value = (index + vacancies.length) % vacancies.length }
function start() {
  clearInterval(timer)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => { if (!paused.value) go(active.value + 1) }, 5000)
}
// Ручной выбор перезапускает автопрокрутку, чтобы слайд не сменился сразу после клика
function select(index) { go(index); start() }
onMounted(start)
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="hero page-width" aria-label="Сервисы DNS">
    <article class="tile tile--account">
      <div class="tile__info tile__info--wide">
        <h2 class="tile__title">Личный кабинет</h2>
        <p class="tile__text tile__text--account">Получайте бонусы, отслеживайте заказы и делитесь мнением</p>
      </div>
      <BaseUiButton class="account-login" tag="a" :href="`${dnsUrl}/profile/`" variant="primary" size="small">Войти</BaseUiButton>
      <div class="account-art" aria-hidden="true"><img v-fade src="/home/hero/account.webp" alt="" /></div>
    </article>

    <a v-for="tile in serviceTiles" :key="tile.id" class="tile tile--service" :class="`tile--${tile.id}`" :href="tile.href">
      <span class="tile__info">
        <span class="tile__title">{{ tile.title }}</span>
        <span class="tile__text">{{ tile.text }}</span>
      </span>
      <span class="service-art" :class="`service-art--${tile.id}`" aria-hidden="true">
        <span class="service-art__frame"><img v-fade :src="`/home/hero/${art[tile.id]}.webp`" alt="" /></span>
      </span>
    </a>

    <article class="tile tile--vacancy" aria-roledescription="карусель" aria-label="Вакансии" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false">
      <div class="vacancy-bg" aria-hidden="true"><img src="/home/hero/warehouse.jpg" alt="" /></div>
      <img v-fade class="vacancy-mascot" src="/home/hero/mascot.webp" alt="" aria-hidden="true" />
      <a :key="active" class="tile__info vacancy-info" href="https://www.dns-shop.ru/vacancy/" aria-live="polite">
        <span class="tile__title">Вакансия</span>
        <span class="tile__text">{{ vacancy.role }}<br />Место работы {{ vacancy.place }}</span>
        <span class="tile__title">от {{ money(vacancy.salary) }}</span>
      </a>
      <div class="vacancy-dots" role="tablist" aria-label="Выбор вакансии">
        <button v-for="(item, index) in vacancies" :key="item.role" type="button" role="tab" class="vacancy-dot" :class="{ 'is-active': index === active }" :style="{ '--dot': dotSize(index) + 'px' }" :aria-selected="index === active" :aria-label="`Вакансия ${index + 1}: ${item.role}`" @click="select(index)"></button>
      </div>
    </article>
  </section>
</template>
