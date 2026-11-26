<script setup>
import { ref } from 'vue'
import { BaseLink } from '@dns-modules/base-link'
import { IconNavArrowElbowLeft, IconSystemCheck } from '@dns-modules/font-icon-v3'
import { footerColumns, appStores, phone, city, dnsUrl } from '../data'

const email = ref('')
const state = ref('idle') // idle | error | done
const year = new Date().getFullYear()
const link = (label) => `${dnsUrl}/search/?q=${encodeURIComponent(label)}`

function subscribe() {
  // Прототип: адрес проверяется и не отправляется никуда
  state.value = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? 'done' : 'error'
}

// Логотип СБП собран из 11 векторов макета; позиции и повороты перенесены из Figma без изменений
const sbp = [
  { n: 2, inset: '36.91% 0 38.31% 85.38%' },
  { n: 3, inset: '28% 16.96% 37.31% 66.91%' },
  { n: 4, inset: '36.26% 34.89% 37.52% 51.66%' },
  { n: 5, inset: '21.67% 86.37% 22.24% -13.4%', h: 'hypot(49.9795cqw, -23.9463cqh)', w: 'hypot(50.0205cqw, 76.0537cqh)', t: 'rotate(-119.31deg) scaleX(-1)' },
  { n: 6, inset: '18.13% 54.27% 50.53% 22.74%', h: 'hypot(-15.427cqw, -32.8212cqh)', w: 'hypot(84.573cqw, -67.1788cqh)', t: 'rotate(148.57deg) scaleX(-1)' },
  { n: 7, inset: '0.01% 73.72% 49.96% 19.4%', h: 'hypot(99.0961cqw, -0.0532278cqh)', w: 'hypot(0.903947cqw, 99.9468cqh)', t: 'rotate(-90.13deg) scaleX(-1)' },
  { n: 8, inset: '0 54.27% 71.55% 19.45%', h: '100cqh', w: '100cqw', t: 'scaleX(-1)' },
  { n: 9, inset: '56.79% 73.72% 0.6% 19.45%', h: '100cqw', w: '100cqh', t: 'rotate(90deg) scaleX(-1)' },
  { n: 10, inset: '21.64% 54.29% 18.68% -3.44%', h: 'hypot(-7.24394cqw, 17.278cqh)', w: 'hypot(-92.7561cqw, -82.722cqh)', t: 'rotate(31.44deg) scaleX(-1)' },
  { n: 11, inset: '57.96% 54.29% -12.45% 19.45%', h: 'hypot(-49.9158cqw, -23.9428cqh)', w: 'hypot(50.0842cqw, -76.0572cqh)', t: 'rotate(119.34deg) scaleX(-1)' },
  { n: 12, inset: '46.52% 80.49% 22.24% -3.42%', h: 'hypot(-15.4566cqw, -32.8912cqh)', w: 'hypot(84.5434cqw, -67.1088cqh)', t: 'rotate(148.59deg) scaleX(-1)' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="page-width">
      <div class="footer-main">
        <section class="footer-col footer-col--company" aria-labelledby="footer-company">
          <img class="footer-logo" src="/home/footer/dns.svg" alt="DNS" width="66" height="17" />
          <h2 id="footer-company" class="footer-heading">Компания</h2>
          <ul class="footer-links">
            <li v-for="item in footerColumns.company" :key="item"><BaseLink class="footer-link" :href="link(item)" size="big" variant="navigation">{{ item }}</BaseLink></li>
          </ul>
        </section>

        <section class="footer-col footer-col--buyers" aria-labelledby="footer-buyers">
          <div class="footer-logos">
            <a href="https://club.dns-shop.ru/" aria-label="Клуб DNS"><img src="/home/footer/club.svg" alt="" width="111" height="17" /></a>
            <a href="https://www.dns-shop.ru/technopoint/" aria-label="DNS tech"><img src="/home/footer/tech.svg" alt="" width="147" height="23" /></a>
          </div>
          <h2 id="footer-buyers" class="footer-heading">Покупателям</h2>
          <div class="footer-links-columns">
            <ul class="footer-links">
              <li v-for="item in footerColumns.buyers" :key="item"><BaseLink class="footer-link" :href="link(item)" size="big" variant="navigation">{{ item }}</BaseLink></li>
            </ul>
            <ul class="footer-links">
              <li v-for="item in footerColumns.business" :key="item"><BaseLink class="footer-link" :href="link(item)" size="big" variant="navigation">{{ item }}</BaseLink></li>
            </ul>
          </div>
        </section>

        <section class="footer-col footer-col--contacts" aria-labelledby="footer-contacts">
          <a class="footer-logo-group" href="https://www.dns-group.ru/" aria-label="DNS Group"><img src="/home/footer/dns-group.svg" alt="" width="131" height="17" /></a>
          <div class="footer-contacts">
            <h2 id="footer-contacts" class="footer-heading">Оставайтесь на связи</h2>
            <div class="footer-contacts__info">
              <a class="footer-phone" :href="phone.href">{{ phone.label }} ({{ phone.hours }})</a>
              <a class="footer-address" :href="`${dnsUrl}/shops/vladivostok/`">Адреса магазинов в г. {{ city }}</a>
            </div>
            <div class="footer-contacts__row">
              <div class="footer-social">
                <a href="https://vk.com/dns_club" aria-label="DNS во ВКонтакте"><img src="/home/footer/vk.svg" alt="" width="38" height="38" /></a>
                <a href="https://www.youtube.com/@dnsclub" aria-label="DNS на YouTube"><img src="/home/footer/youtube.svg" alt="" width="38" height="38" /></a>
              </div>
              <div class="footer-payments" aria-label="Способы оплаты: СБП, Акит">
                <span class="sbp-logo" role="img" aria-label="СБП">
                  <span v-for="part in sbp" :key="part.n" class="sbp-logo__part" :class="{ 'sbp-logo__part--rotated': part.t }" :style="{ inset: part.inset }">
                    <span v-if="part.t" class="sbp-logo__inner" :style="{ width: part.w, height: part.h, transform: part.t }"><img :src="`/home/footer/sbp-${part.n}.svg`" alt="" /></span>
                    <img v-else :src="`/home/footer/sbp-${part.n}.svg`" alt="" />
                  </span>
                </span>
                <img src="/home/footer/pay-logo.svg" alt="" width="36" height="38" />
              </div>
            </div>
          </div>

          <div class="app-card">
            <h3 class="footer-heading">DNS всегда под рукой</h3>
            <div class="app-card__content">
              <span class="app-card__qr"><img src="/home/footer/qr.png" alt="QR-код для скачивания приложения DNS" width="74" height="73" /></span>
              <ul class="app-card__stores">
                <li><a :href="appStores[0].href" :aria-label="appStores[0].name"><img src="/home/footer/google-play.svg" alt="" width="102" height="31" /></a></li>
                <li><a class="app-store" :href="appStores[1].href" :aria-label="appStores[1].name"><img src="/home/footer/app-store.svg" alt="" /></a></li>
                <li><a :href="appStores[2].href" :aria-label="appStores[2].name"><img src="/home/footer/app-gallery.svg" alt="" width="102" height="31" /></a></li>
                <li><a class="rustore" :href="appStores[3].href" :aria-label="appStores[3].name"><img class="rustore__bg" src="/home/footer/rustore-bg.svg" alt="" /><img class="rustore__logo" src="/home/footer/rustore-logo.svg" alt="" /></a></li>
              </ul>
            </div>
          </div>

          <form class="subscribe" novalidate @submit.prevent="subscribe">
            <label class="subscribe__label" for="subscribe-email">Следите за новинками и акциями:</label>
            <div class="subscribe__field" :class="{ 'is-error': state === 'error', 'is-done': state === 'done' }">
              <input id="subscribe-email" v-model="email" type="email" autocomplete="email" placeholder="Введите e-mail и подпишитесь" :aria-invalid="state === 'error'" aria-describedby="subscribe-hint" @input="state = 'idle'" />
              <button type="submit" :aria-label="state === 'done' ? 'Вы подписаны' : 'Подписаться'"><component :is="state === 'done' ? IconSystemCheck : IconNavArrowElbowLeft" /></button>
            </div>
            <p id="subscribe-hint" class="subscribe__hint" :class="{ 'is-error': state === 'error' }" aria-live="polite">
              <template v-if="state === 'error'">Проверьте адрес: например, name@mail.ru</template>
              <template v-else-if="state === 'done'">Готово! Будем присылать новинки и акции на {{ email.trim() }}</template>
              <template v-else>Подписываясь, вы соглашаетесь с условиями <a :href="`${dnsUrl}/rules/privacy/`">политики конфиденциальности</a> и <a :href="`${dnsUrl}/rules/personal-data/`">обработки персональных данных</a></template>
            </p>
          </form>
        </section>
      </div>

      <div class="footer-bottom">
        <p>Нашли ошибку на сайте? Выделите текст с ошибкой, нажмите Ctrl+Enter и напишите нам</p>
        <p>© 2002—{{ year }} Компания DNS. Администрация Сайта не несет ответственности за размещаемые Пользователями материалы (в т.ч. информацию и изображения), их содержание и качество.</p>
      </div>
    </div>
  </footer>
</template>
