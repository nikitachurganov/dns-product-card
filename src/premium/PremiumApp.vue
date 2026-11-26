<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { BaseUiButton, BaseUiIconButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
import { IconNavChevronRight, IconNavChevronLeft, IconDataPhone } from '@dns-modules/font-icon-v3'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
import { categories, brands, journal, buildSteps, phone, dnsUrl } from './data'
import { productUrl } from '../data'

// Лента журнала: стрелки активны, только когда есть куда листать
const rail = ref(null)
const canPrev = ref(false)
const canNext = ref(true)
function updateArrows() {
  const el = rail.value
  if (!el) return
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
function scroll(direction) { rail.value.scrollBy({ left: direction * (rail.value.clientWidth * 0.8), behavior: 'smooth' }) }
let observer
onMounted(() => { updateArrows(); observer = new ResizeObserver(updateArrows); observer.observe(rail.value) })
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <SiteNav />
  <main id="main">
    <!-- 1. Главный герой: один товар, одна мысль -->
    <section class="stage stage--black hero" aria-labelledby="hero-title">
      <div class="stage__copy" v-reveal>
        <p class="eyebrow">ASUS ROG Thor</p>
        <h1 id="hero-title" class="display">Энергия на максимум.</h1>
        <p class="lead">Титановый блок питания на 1600&nbsp;Вт для самых требовательных сборок.</p>
        <div class="actions">
          <BaseUiButton class="pill" tag="a" :href="productUrl" variant="primary" size="medium">В магазин</BaseUiButton>
          <BaseLink class="more more--on-dark" :href="productUrl" size="big">Подробнее<IconNavChevronRight aria-hidden="true" /></BaseLink>
        </div>
      </div>
      <div class="hero__visual" v-reveal="{ delay: 200 }">
        <span class="hero__glow" aria-hidden="true"></span>
        <img v-fade class="hero__product" src="/images/asus-thor.png" alt="Блок питания ASUS ROG Thor 1600W Titanium III" width="500" height="357" />
      </div>
    </section>

    <!-- 2. Сборка ПК -->
    <section class="stage stage--light build" aria-labelledby="build-title">
      <div class="stage__copy" v-reveal>
        <p class="eyebrow">Конфигуратор</p>
        <h2 id="build-title" class="headline">Соберите свой ПК. Без догадок.</h2>
        <p class="lead">Подберите комплектующие и сразу узнайте, подходят ли они друг другу.</p>
        <div class="actions">
          <BaseLink class="more" :href="`${dnsUrl}/configurator/`" size="big">Открыть конфигуратор<IconNavChevronRight aria-hidden="true" /></BaseLink>
        </div>
      </div>
      <img v-fade v-reveal="{ delay: 150 }" class="build__art" src="/home/hero/build-pc.webp" alt="" width="480" height="480" />
      <ol class="steps wrap">
        <li v-for="step in buildSteps" :key="step.n" v-reveal="{ delay: 80 }">
          <span class="steps__n">{{ step.n }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <!-- 3. Две плитки -->
    <section class="duo" aria-label="Подарки и игры">
      <article class="tile tile--dark" v-reveal>
        <div class="tile__copy">
          <p class="eyebrow">Подарочные карты</p>
          <h2 class="headline headline--s">Подарок, который выберут сами.</h2>
          <BaseLink class="more more--on-dark" :href="`${dnsUrl}/gift-cards/`" size="big">Подробнее<IconNavChevronRight aria-hidden="true" /></BaseLink>
        </div>
        <img v-fade class="tile__art" src="/home/hero/gift-cards.webp" alt="" width="480" height="460" loading="lazy" />
      </article>
      <article class="tile tile--soft" v-reveal="{ delay: 120 }">
        <div class="tile__copy">
          <p class="eyebrow">Карты оплаты</p>
          <h2 class="headline headline--s">Играйте больше.</h2>
          <BaseLink class="more" :href="`${dnsUrl}/catalog/payment-cards/`" size="big">Подробнее<IconNavChevronRight aria-hidden="true" /></BaseLink>
        </div>
        <img v-fade class="tile__art" src="/home/hero/payment-cards.webp" alt="" width="373" height="420" loading="lazy" />
      </article>
    </section>

    <!-- 4. Категории -->
    <section class="section wrap" aria-labelledby="cat-title">
      <h2 id="cat-title" class="headline" v-reveal>Найдите свою технику.</h2>
      <ul class="cats">
        <li v-for="(item, i) in categories" :key="item.label" v-reveal="{ delay: (i % 3) * 80 }">
          <a :href="item.href"><span>{{ item.label }}</span><i aria-hidden="true"><IconNavChevronRight /></i></a>
        </li>
      </ul>
    </section>

    <!-- 5. Лаборатория -->
    <section class="stage stage--black lab" aria-labelledby="lab-title">
      <img v-fade class="lab__bg" src="/premium/macro.webp" alt="" width="1600" height="1600" loading="lazy" />
      <div class="lab__shade" aria-hidden="true"></div>
      <div class="lab__copy wrap" v-reveal>
        <p class="eyebrow">Лаборатория DNS</p>
        <h2 id="lab-title" class="headline">Проверено. Не на слово.</h2>
        <p class="lead">Характеристики популярных товаров подтверждаются измерениями в собственной лаборатории.</p>
        <div class="actions">
          <BaseLink class="more more--on-dark" :href="`${dnsUrl}/blogs/`" size="big">Как мы проверяем<IconNavChevronRight aria-hidden="true" /></BaseLink>
        </div>
      </div>
    </section>

    <!-- 6. Сервис -->
    <section class="section wrap" aria-labelledby="care-title">
      <h2 id="care-title" class="headline" v-reveal>Рядом. Даже после покупки.</h2>
      <div class="care">
        <article class="card" v-reveal>
          <h3>Сервисные центры</h3>
          <p>Гарантия, обмен, возврат и ремонт.</p>
          <BaseLink class="more" :href="`${dnsUrl}/service-center/`" size="big">Подробнее<IconNavChevronRight aria-hidden="true" /></BaseLink>
          <img v-fade class="card__photo" src="/home/service/service-center.png" alt="" width="454" height="340" loading="lazy" />
        </article>
        <article class="card" v-reveal="{ delay: 100 }">
          <h3>Поиск драйверов</h3>
          <p>Установка и обновление в пару кликов.</p>
          <BaseLink class="more" :href="`${dnsUrl}/drivers/`" size="big">Подробнее<IconNavChevronRight aria-hidden="true" /></BaseLink>
          <img v-fade class="card__drivers" src="/home/service/drivers.png" alt="" width="339" height="151" loading="lazy" />
        </article>
        <article class="card card--phone" v-reveal="{ delay: 200 }">
          <h3>Помощь</h3>
          <p>Позвоните — подскажем и поможем разобраться.</p>
          <a class="phone" :href="phone.href"><IconDataPhone aria-hidden="true" />{{ phone.label }}</a>
          <span class="phone__hours">{{ phone.hours }}</span>
        </article>
      </div>
    </section>

    <!-- 7. Бренды -->
    <section class="brands" aria-label="Бренды" v-reveal>
      <p class="brands__title">Бренды, которым доверяют миллионы</p>
      <ul class="wrap">
        <li v-for="brand in brands" :key="brand.name">
          <a :href="brand.href" :aria-label="brand.name"><img :src="`/home/brands/${brand.file}`" alt="" :width="brand.w" :height="brand.h" loading="lazy" /></a>
        </li>
      </ul>
    </section>

    <!-- 8. Журнал -->
    <section class="journal" aria-labelledby="journal-title">
      <div class="wrap journal__head">
        <h2 id="journal-title" class="headline" v-reveal>Журнал DNS.</h2>
        <div class="journal__arrows">
          <BaseUiIconButton variant="secondary" size="medium" aria-label="Назад" :disabled="!canPrev" @click="scroll(-1)"><IconNavChevronLeft /></BaseUiIconButton>
          <BaseUiIconButton variant="secondary" size="medium" aria-label="Вперёд" :disabled="!canNext" @click="scroll(1)"><IconNavChevronRight /></BaseUiIconButton>
        </div>
      </div>
      <ul ref="rail" class="journal__rail" @scroll.passive="updateArrows">
        <li v-for="item in journal" :key="item.id" class="story">
          <a :href="item.href">
            <span class="story__image" :class="{ 'story__image--contain': item.contain }">
              <img v-fade :src="item.image" alt="" loading="lazy" />
            </span>
            <span class="story__kind">{{ item.kind }}</span>
            <span class="story__title">{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </section>
  </main>
  <SiteFooter />
</template>
