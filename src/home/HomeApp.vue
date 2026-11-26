<script setup>
import { BaseUiButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
import { IconNavArrowRight, IconBusinessStore } from '@dns-modules/font-icon-v3'
import SiteHeader from './components/SiteHeader.vue'
import HeroGrid from './components/HeroGrid.vue'
import ContentFeed from './components/ContentFeed.vue'
import SiteFooter from './components/SiteFooter.vue'
import { brands, partners, promos, dnsUrl } from './data'
</script>

<template>
  <SiteHeader />
  <main id="main">
    <h1 class="sr-only">DNS — интернет-магазин цифровой и бытовой техники</h1>
    <HeroGrid />
    <ContentFeed />

    <section class="promo page-width" aria-label="Клуб DNS и магазины">
      <article v-for="promo in promos" :key="promo.id" class="promo-card" :class="[`promo-card--${promo.id}`, { 'promo-card--dark': promo.dark }]">
        <div class="promo-card__info">
          <h2>{{ promo.title }}</h2>
          <p>{{ promo.text }}</p>
        </div>
        <BaseUiButton class="promo-card__action" tag="a" :href="promo.href" variant="secondary" size="small">
          {{ promo.action }}
          <template #icon-right><IconNavArrowRight /></template>
        </BaseUiButton>
        <div class="promo-card__art" aria-hidden="true">
          <img v-if="promo.id === 'club'" src="/home/footer/club.svg" alt="" width="111" height="17" />
          <span v-else class="promo-card__pin"><IconBusinessStore /></span>
        </div>
      </article>
    </section>

    <section class="section section--white" aria-labelledby="service-title">
      <div class="page-width">
        <header class="section-head">
          <p class="section-head__eyebrow">Помощь и ремонт</p>
          <h2 id="service-title" class="section-head__title">Рядом. Даже после покупки</h2>
        </header>
        <div class="service-grid">
          <div class="service-grid__column">
            <article class="service-card service-card--help">
              <div class="service-card__info"><h3>Помощь</h3><p>Полезная информация</p></div>
              <BaseLink class="service-card__link" :href="`${dnsUrl}/help/`" size="big">Подробнее<IconNavArrowRight aria-hidden="true" /></BaseLink>
              <div class="service-card__art service-art-help" aria-hidden="true"><img v-fade src="/home/service/help.webp" alt="" /></div>
            </article>
            <article class="service-card service-card--drivers">
              <div class="service-card__info"><h3>Поиск драйверов</h3><p>Установка и обновление драйверов</p></div>
              <img v-fade class="service-art-drivers" src="/home/service/drivers.png" alt="" aria-hidden="true" />
              <span class="service-fade service-fade--drivers" aria-hidden="true"></span>
              <BaseLink class="service-card__link" :href="`${dnsUrl}/drivers/`" size="big">Подробнее<IconNavArrowRight aria-hidden="true" /></BaseLink>
            </article>
          </div>
          <article class="service-card service-card--centers">
            <div class="service-card__info"><h3>Сервисные центры</h3><p>Гарантия, обмен, возврат и ремонт</p></div>
            <div class="service-art-centers" aria-hidden="true"><img v-fade src="/home/service/service-center.png" alt="" /></div>
            <span class="service-fade service-fade--centers" aria-hidden="true"></span>
            <BaseLink class="service-card__link" :href="`${dnsUrl}/service-center/`" size="big">Подробнее<IconNavArrowRight aria-hidden="true" /></BaseLink>
          </article>
        </div>
      </div>
    </section>

    <section class="brands" aria-label="Бренды">
      <div class="brands__track">
        <ul v-for="copy in 2" :key="copy" class="brands__list" :aria-hidden="copy === 2">
          <li v-for="brand in brands" :key="brand.name">
            <a :href="brand.href" :tabindex="copy === 2 ? -1 : 0" :aria-label="brand.name">
              <img :src="`/home/brands/${brand.file}`" alt="" :width="brand.w" :height="brand.h" :class="{ 'is-dim': brand.dim }" loading="lazy" />
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="section partners-section" aria-labelledby="partners-title">
      <div class="page-width">
        <header class="section-head">
          <p class="section-head__eyebrow">Сотрудничество с DNS</p>
          <h2 id="partners-title" class="section-head__title">Больше возможностей вместе с DNS</h2>
        </header>
        <div class="partners-grid">
          <article v-for="card in partners" :key="card.id" class="partner-card" :class="[`partner-card--${card.id}`, { 'partner-card--dark': card.dark }]">
            <div class="partner-card__info">
              <h3>{{ card.title }}</h3>
              <p>{{ card.text }}</p>
            </div>
            <BaseUiButton class="partner-card__action" tag="a" :href="card.href" variant="secondary" size="tiny">
              {{ card.action }}
              <template #icon-right><IconNavArrowRight /></template>
            </BaseUiButton>

            <div v-if="card.id === 'team'" class="partner-art partner-art--team" aria-hidden="true"><img v-fade src="/home/partners/team.webp" alt="" /></div>
            <div v-else-if="card.id === 'global'" class="partner-art partner-art--global" aria-hidden="true">
              <span class="globe-glow globe-glow--1"><img src="/home/partners/globe-glow-1.svg" alt="" /></span>
              <span class="globe-glow globe-glow--2"><img src="/home/partners/globe-glow-2.svg" alt="" /></span>
              <img class="globe" src="/home/partners/globe.webp" alt="" />
            </div>
            <div v-else-if="card.id === 'b2b'" class="partner-art partner-art--b2b" aria-hidden="true">
              <img v-fade src="/home/partners/van.webp" alt="" />
              <span class="fade fade--top"></span><span class="fade fade--bottom"></span><span class="fade fade--left"></span><span class="fade fade--right"></span>
            </div>
            <div v-else class="partner-art partner-art--seller" aria-hidden="true">
              <span class="seller-photo"><img v-fade src="/home/partners/seller.webp" alt="" /></span>
              <img class="seller-chart seller-chart--arrow" src="/home/partners/seller-arrow.svg" alt="" />
              <img class="seller-chart seller-chart--dot1" src="/home/partners/seller-dot-1.svg" alt="" />
              <img class="seller-chart seller-chart--dot2" src="/home/partners/seller-dot-2.svg" alt="" />
              <img class="seller-chart seller-chart--line1" src="/home/partners/seller-line-1.svg" alt="" />
              <img class="seller-chart seller-chart--line2" src="/home/partners/seller-line-2.svg" alt="" />
              <span class="fade fade--left"></span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
  <SiteFooter />
</template>
