<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BaseLink } from '@dns-modules/base-link'
import { BaseUiButton, BaseUiIconButton } from '@dns-modules/base-ui-button'
import { Expansion } from '@dns-modules/expansion'
import {
  IconArrowRight,
  IconChevronRight,
  IconShieldCheck,
  IconCircleInfo,
  IconLink,
  IconFilter,
  IconClose,
} from '@dns-modules/font-icon'
import '@dns-modules/expansion/style.css'
import { BottomSheet } from '@dns-modules/bottom-sheet'
import '@dns-modules/bottom-sheet/style.css'
import { productUrl } from '../data'
import VerifiedTag from './VerifiedTag.vue'

const characteristicsUrl = productUrl.replace('/product/', '/product/characteristics/')
const filesUrl = 'https://www.dns-shop.ru/product/driver/5117a7c5fa5fd763/blok-pitania-deepcool-pf750-r-pf750d-ha0b-eu-cernyj/'
const descriptionExpanded = ref(false), specificationsExpanded = ref(false)
const priceChart = ref(null), chartScale = ref(1)
let chartObserver

onMounted(() => {
  chartObserver = new ResizeObserver(([entry]) => { chartScale.value = entry.contentRect.width / 328 })
  if (priceChart.value) chartObserver.observe(priceChart.value)
})
onUnmounted(() => chartObserver?.disconnect())

const files = [
  { title: 'Декларация: DN500EU-WGBE, PQ550P, PQ550P-FD, PQ600G, PQ600G-FD и другие модели', url: 'https://tech.eaeunion.org/tech/registers/35-1/ru/registryList/conformityDocs/view/66b2387630dcf805187e7eda' },
  { title: 'Декларация: PN550D-FC, PN600D, PN600D WH и другие модели', url: 'https://www.dns-shop.ru/product/driver/5117a7c5fa5fd763/blok-pitania-deepcool-pf750-r-pf750d-ha0b-eu-cernyj/' },
]

// Глоссарий для модальных окон (справка по термину)
const modalContent = {
  powerSupply: {
    title: 'Блок питания',
    text: 'Вторичный источник электропитания, предназначенный для снабжения узлов компьютера электрической энергией постоянного тока необходимого напряжения (+12V, +5V, +3.3V), а также гальванической развязки и защиты от помех бытовой сети.',
    linkText: 'Больше советов по выбору',
    linkUrl: 'https://club.dns-shop.ru/blog/t-104-bloki-pitaniya/',
  },
  atx: {
    title: 'Форм-фактор ATX',
    text: 'Общепринятый отраслевой стандарт габаритов и крепежных отверстий компьютерных блоков питания, совместимый с подавляющим большинством корпусов типоразмеров Midi-Tower и Full-Tower.',
    linkText: 'Больше советов по выбору',
    linkUrl: 'https://club.dns-shop.ru/blog/t-104-bloki-pitaniya/',
  },
  plus80: {
    title: 'Сертификат 80 PLUS',
    text: 'Стандарт энергоэффективности блоков питания, удостоверяющий коэффициент полезного действия (КПД) не менее 80% при нагрузках 20%, 50% и 100%. Чем выше градация сертификата (Bronze, Silver, Gold, Platinum, Titanium), тем меньше электроэнергии рассеивается в виде бесполезного тепла.',
    linkText: 'Больше советов по выбору',
    linkUrl: 'https://club.dns-shop.ru/blog/t-104-bloki-pitaniya/',
  },
  apfc: {
    title: 'Корректор коэффициента мощности (PFC)',
    text: 'Схема, предназначенная для повышения коэффициента мощности блока питания и снижения нагрузки на электросеть. Активный корректор (APFC) стабильно работает при перепадах напряжения в широком диапазоне (100–240 В) и обеспечивает более чистую форму потребляемого тока по сравнению с пассивным.',
    linkText: 'Больше советов по выбору',
    linkUrl: 'https://club.dns-shop.ru/blog/t-104-bloki-pitaniya/',
  },
}

// Краткая сводка характеристик в шапке
const summaryColumns = [
  [
    { label: 'Мощность', value: '750 Вт', verified: '742 Вт', filter: true },
    { label: 'Длина кабеля питания', value: '450 мм', verified: '500 мм', filter: false },
    { label: 'Размеры вентиляторов', value: '120 × 120 мм', filter: true },
  ],
  [
    { label: 'Сертификат 80 PLUS', value: 'Standard', filter: true, modal: modalContent.plus80 },
    { label: 'Корректор коэффициента мощности', value: 'активный (APFC)', verified: 'пассивный (без APFC)', filter: true, modal: modalContent.apfc },
  ],
]

// Полный перечень характеристик по группам
const groups = [
  {
    title: 'Заводские данные',
    columns: [
      [
        { label: 'Гарантия продавца / производителя', value: '36 мес.' },
      ],
      [
        { label: 'Срок эксплуатации', value: '36 мес.', info: true },
        { label: 'Страна-производитель', value: 'Китай', info: true, filter: true },
      ],
    ],
  },
  {
    title: 'Общие параметры',
    columns: [
      [
        { label: 'Тип', value: 'блок питания', modal: modalContent.powerSupply },
        { label: 'Модель', value: 'DEEPCOOL PL750D' },
      ],
      [
        { label: 'Код производителя', value: '[R-PL750D-FC0B-WDEU-V2]' },
        { label: 'Мощность (номинал)', value: '750 Вт', verified: '742 Вт', info: true, filter: true },
      ],
    ],
  },
  {
    title: 'Основные характеристики',
    columns: [
      [
        { label: 'Форм-фактор', value: 'ATX', filter: true, modal: modalContent.atx },
        { label: 'Сертификат 80 PLUS', value: 'Standard', filter: true, modal: modalContent.plus80 },
        { label: 'Корректор коэффициента мощности', value: 'активный (APFC)', verified: 'пассивный (без APFC)', filter: true, modal: modalContent.apfc },
      ],
      [
        { label: 'Размеры вентиляторов', value: '120 × 120 мм', filter: true },
      ],
    ],
  },
  {
    title: 'Кабели и разъемы',
    columns: [
      [
        { label: 'Основной разъем питания', value: '20+4 pin', filter: true },
        { label: 'Длина основного кабеля питания', value: '450 мм', verified: '500 мм', filter: false },
        { label: 'Разъемы для питания процессора (CPU)', value: '2 × 4+4 pin', filter: true },
      ],
      [
        { label: 'Разъемы для питания видеокарты (PCI-E)', value: '16 pin (12VHPWR), 3 × 6+2 pin', verified: '16 pin (12VHPWR), 2 × 6+2 pin', filter: true },
        { label: 'Количество разъемов 15-pin SATA', value: '8', verified: '8', filter: true },
      ],
    ],
  },
]

// Состояние модального окна глоссария
const activeModal = ref(null)
const openModal = (modal) => { activeModal.value = modal }
const closeModal = () => { activeModal.value = null }

// Модальное окно лабораторной проверки DNS (десктоп) и мобильная шторка (мобилка)
const sheet = ref(null)
const verifiedModal = ref(null)

const openVerifiedDetails = (label, value, verified, diffText = '', sign = 'minus') => {
  if (isMobile.value) {
    sheet.value = { label, value, verified, diffText, sign }
  } else {
    verifiedModal.value = { label, value, verified, diffText, sign }
  }
}

const mobileQuery = window.matchMedia('(max-width:991.98px)')
const isMobile = ref(mobileQuery.matches)
const onMobileChange = e => {
  isMobile.value = e.matches
  if (!e.matches) {
    sheet.value = null
  } else {
    verifiedModal.value = null
  }
}
const closeOnEscape = e => {
  if (e.key === 'Escape') {
    sheet.value = null
    verifiedModal.value = null
    activeModal.value = null
  }
}

onMounted(() => {
  document.addEventListener('keydown', closeOnEscape)
  mobileQuery.addEventListener('change', onMobileChange)
})
onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape)
  mobileQuery.removeEventListener('change', onMobileChange)
})

// Анализ совпадения фактического значения с заявленным:
// - sign: 'plus' (улучшение, например +50 мм длины кабеля) -> иконка инфо ⓘ
// - sign: 'minus' (ухудшение, например -8 Вт или пассивный APFC вместо активного) -> желтый треугольник ⚠️
const verdict = (value, verified) => {
  if (!verified) return null
  if (verified === value) return { same: true }
  const a = parseFloat(String(value).replace(',', '.'))
  const b = parseFloat(String(verified).replace(',', '.'))
  if (/^\d/.test(value) && /^\d/.test(verified) && !isNaN(a) && !isNaN(b)) {
    const delta = Math.round((b - a) * 100) / 100
    if (delta !== 0) {
      const unit = String(value).replace(/^[\d\s.,]+/, '')
      const absDelta = Math.abs(delta)
      const sign = delta > 0 ? 'plus' : 'minus'
      const diffText = delta > 0
        ? `на ${absDelta}${unit ? ' ' + unit : ''} больше`
        : `на ${absDelta}${unit ? ' ' + unit : ''} меньше`
      return { diff: true, sign, diffText, delta, unit }
    }
  }
  return { diff: true, sign: 'minus', diffText: 'значения не совпали' }
}

const visibleGroups = computed(() => specificationsExpanded.value ? groups : groups.slice(0, 1))
</script>

<template>
  <section id="specifications" class="surface product-specifications" aria-labelledby="specifications-title">
    <aside class="specifications-aside">
      <div class="specifications-reliability">
        <div>
          <h3>Отличная надежность</h3>
          <IconShieldCheck aria-hidden="true" />
        </div>
        <p><b>99.77%</b> Продаж без обращений в сервис</p>
        <p class="reliability-comparison">Для сравнения: среднее по категории Блоки питания — <b>98.99%</b>.</p>
        <BaseLink :href="productUrl.replace('/product/','/product/service-rating/')">
          Подробнее<IconChevronRight />
        </BaseLink>
      </div>

      <section class="price-history" aria-labelledby="price-history-title">
        <div class="price-history-heading">
          <h3 id="price-history-title">История цены</h3>
          <span>от 4 099 ₽ до 5 399 ₽</span>
        </div>
        <div class="price-history-plot" role="img" aria-label="График средней цены продажи с мая по октябрь">
          <div ref="priceChart" class="price-history-chart" :style="{height: 87 * chartScale + 'px'}">
            <img src="/images/specifications/price-history.svg" alt="" width="328" height="87" :style="{transform: `scale(${chartScale})`}" />
          </div>
          <div class="price-history-months" aria-hidden="true">
            <span v-for="month in ['май','июнь','июль','авг','сент','окт']" :key="month">{{ month }}</span>
          </div>
        </div>
        <p>За прошедшие недели отображается средняя цена продажи</p>
      </section>

      <BaseLink class="specifications-help" href="https://club.dns-shop.ru/blog/t-104-bloki-pitaniya/" variant="navigation">
        <img src="/images/specifications/choose.png" alt="" width="70" height="70" />
        <span>
          <b>Как выбрать?</b>
          <span>Советуют эксперты DNS</span>
        </span>
      </BaseLink>

      <div class="specifications-help">
        <img src="/images/specifications/error.png" alt="" width="70" height="70" />
        <span>
          <b>Нашли ошибку?</b>
          <span>Выделите текст и нажмите Ctrl+Enter</span>
        </span>
      </div>
    </aside>

    <div class="specifications-content">
      <section class="product-description" aria-label="Описание товара">
        <p>DEEPCOOL PL750D — блок питания мощностью 750 Вт для игрового компьютера. Модель поддерживает стандарт ATX 3.1 и имеет сертификат 80 PLUS Bronze. Активный корректор коэффициента мощности и преобразователи DC-DC обеспечивают стабильное питание компонентов. Для видеокарты предусмотрен разъем 12VHPWR, для процессора — два разъема 4+4 pin. Охлаждение обеспечивает вентилятор диаметром 120 мм.</p>
        <Expansion id="product-description-details" :is-expanded="descriptionExpanded" @toggle="descriptionExpanded = !descriptionExpanded">
          <p>В блоке питания предусмотрена защита от короткого замыкания, перегрузки, перегрева и перенапряжения. Кабели позволяют подключить накопители SATA и видеокарты с разъемами PCI-E 6+2 pin.</p>
          <template #collapsed>Развернуть описание</template>
          <template #expanded>Свернуть описание</template>
        </Expansion>
      </section>

      <section class="product-files" aria-labelledby="product-files-title">
        <div class="specifications-heading">
          <h2 id="product-files-title">Инструкции и файлы <span class="files-count">11</span></h2>
          <BaseUiIconButton tag="a" :href="filesUrl" variant="secondary" size="tiny" aria-label="Открыть инструкции и файлы">
            <IconArrowRight />
          </BaseUiIconButton>
        </div>
        <div class="files-list">
          <BaseLink v-for="file in files" :key="file.url" class="file-card" :href="file.url" :title="file.title" target="_blank" rel="noopener noreferrer" variant="navigation">
            <IconLink aria-hidden="true" />
            <span class="file-copy">
              <span>{{ file.title }}</span>
              <small>Русский</small>
            </span>
          </BaseLink>
          <BaseLink class="files-all" :href="filesUrl" variant="navigation">
            Все<IconChevronRight aria-hidden="true" />
          </BaseLink>
        </div>
      </section>

      <div class="specifications-heading">
        <h2 id="specifications-title">Характеристики</h2>
        <BaseUiIconButton tag="a" :href="characteristicsUrl" variant="secondary" size="tiny" aria-label="Все характеристики товара">
          <IconArrowRight />
        </BaseUiIconButton>
      </div>

      <!-- Краткая сводка основных параметров -->
      <div class="specification-columns specifications-summary">
        <dl v-for="(column, index) in summaryColumns" :key="index">
          <div v-for="row in column" :key="row.label" class="specification-row">
            <dt>
              <span>{{ row.label }}</span>
              <IconCircleInfo v-if="row.info" :title="row.label" aria-hidden="true" />
              <i aria-hidden="true" />
            </dt>
            <dd>
              <div class="spec-dd-wrap">
                <!-- Строка 1: [воронка?] [заявленное значение] [иконка ⚠️ / ⓘ с ховером] -->
                <div class="spec-value-line">
                  <a
                    v-if="row.filter"
                    class="spec-filter-link"
                    href="https://www.dns-shop.ru/catalog/17a89c2216404e77/bloki-pitaniya/"
                    :title="`Подобрать в каталоге: ${row.label}`"
                    @click.prevent
                  >
                    <IconFilter class="spec-filter-icon" aria-hidden="true" />
                  </a>
                  <a
                    v-if="row.modal"
                    href="#"
                    class="spec-modal-link"
                    @click.prevent="openModal(row.modal)"
                  >
                    {{ row.value }}
                  </a>
                  <span v-else class="spec-text-value">
                    {{ row.value }}
                  </span>
                  <!-- Результат лабораторной проверки DNS: зеленая галочка (совпало) / желтый треугольник (расхождение) -->
                  <VerifiedTag
                    v-if="verdict(row.value, row.verified)"
                    class="spec-verified-tag"
                    :label="row.label"
                    :declared="row.value"
                    :verified="row.verified"
                    :matched="verdict(row.value, row.verified).same"
                    :mobile="isMobile"
                    @open="openVerifiedDetails(row.label, row.value, row.verified, verdict(row.value, row.verified).diffText, verdict(row.value, row.verified).sign)"
                  />
                  <span v-if="verdict(row.value, row.verified)?.same" class="spec-verified-note">(проверено в DNS)</span>

                </div>

                <!-- Строка 2 (при расхождении): значение, проверенное в DNS -->
                <div
                  v-if="verdict(row.value, row.verified) && !verdict(row.value, row.verified).same"
                  class="spec-declared-line"
                >
                  {{ row.verified }} (проверено в DNS)
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <!-- Полный список групп характеристик -->
      <div id="specifications-details" :class="{'specifications-collapsed': !specificationsExpanded}">
        <section v-for="group in visibleGroups" :key="group.title" class="specification-group" :aria-label="group.title">
          <h3>{{ group.title }}</h3>
          <div class="specification-columns">
            <dl v-for="(column, index) in group.columns" :key="index">
              <div v-for="row in column" :key="row.label" class="specification-row">
                <dt>
                  <span>{{ row.label }}</span>
                  <IconCircleInfo v-if="row.info" :title="row.label" aria-hidden="true" />
                  <i aria-hidden="true" />
                </dt>
                <dd>
                  <div class="spec-dd-wrap">
                    <!-- Строка 1: [воронка?] [заявленное значение] [иконка ⚠️ / ⓘ с ховером] -->
                    <div class="spec-value-line">
                      <a
                        v-if="row.filter"
                        class="spec-filter-link"
                        href="https://www.dns-shop.ru/catalog/17a89c2216404e77/bloki-pitaniya/"
                        :title="`Подобрать в каталоге: ${row.label}`"
                        @click.prevent
                      >
                        <IconFilter class="spec-filter-icon" aria-hidden="true" />
                      </a>
                      <a
                        v-if="row.modal"
                        href="#"
                        class="spec-modal-link"
                        @click.prevent="openModal(row.modal)"
                      >
                        {{ row.value }}
                      </a>
                      <span v-else class="spec-text-value">
                        {{ row.value }}
                      </span>
                      <!-- Результат лабораторной проверки DNS: зеленая галочка (совпало) / желтый треугольник (расхождение) -->
                      <VerifiedTag
                        v-if="verdict(row.value, row.verified)"
                        class="spec-verified-tag"
                        :label="row.label"
                        :declared="row.value"
                        :verified="row.verified"
                        :matched="verdict(row.value, row.verified).same"
                        :mobile="isMobile"
                        @open="openVerifiedDetails(row.label, row.value, row.verified, verdict(row.value, row.verified).diffText, verdict(row.value, row.verified).sign)"
                      />
                      <span v-if="verdict(row.value, row.verified)?.same" class="spec-verified-note">(проверено в DNS)</span>

                    </div>

                    <!-- Строка 2 (при расхождении): значение, проверенное в DNS -->
                    <div
                      v-if="verdict(row.value, row.verified) && !verdict(row.value, row.verified).same"
                      class="spec-declared-line"
                    >
                      {{ row.verified }} (проверено в DNS)
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      <BaseUiButton
        class="specifications-all"
        :aria-expanded="specificationsExpanded"
        aria-controls="specifications-details"
        variant="secondary"
        size="large"
        @click="specificationsExpanded = !specificationsExpanded"
      >
        {{ specificationsExpanded ? 'Свернуть характеристики' : 'Все характеристики' }}
      </BaseUiButton>
    </div>

    <!-- Модальное окно с описанием термина (как на проде DNS) -->
    <Teleport to="body">
      <div v-if="activeModal" class="spec-modal-overlay" @click.self="closeModal">
        <div class="spec-modal-dialog" role="dialog" aria-modal="true" :aria-labelledby="'modal-title-' + activeModal.title">
          <div class="spec-modal-header">
            <h3 :id="'modal-title-' + activeModal.title" class="spec-modal-title">{{ activeModal.title }}</h3>
            <button type="button" class="spec-modal-close" aria-label="Закрыть" @click="closeModal">
              <IconClose aria-hidden="true" />
            </button>
          </div>
          <div class="spec-modal-body">
            <p>{{ activeModal.text }}</p>
          </div>
          <div v-if="activeModal.linkText" class="spec-modal-footer">
            <a :href="activeModal.linkUrl || 'https://club.dns-shop.ru/'" target="_blank" rel="noopener noreferrer" class="spec-modal-link-more">
              <span>{{ activeModal.linkText }}</span>
              <IconArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Модальное окно деталей лабораторной проверки DNS для десктопа -->
    <Teleport to="body">
      <div v-if="verifiedModal && !isMobile" class="spec-modal-overlay" @click.self="verifiedModal = null">
        <div class="spec-modal-dialog verified-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="verified-modal-title">
          <div class="spec-modal-header">
            <h3 id="verified-modal-title" class="spec-modal-title">{{ verifiedModal.label }}</h3>
            <button type="button" class="spec-modal-close" aria-label="Закрыть" @click="verifiedModal = null">
              <IconClose aria-hidden="true" />
            </button>
          </div>

          <div class="spec-modal-body">
            <dl class="verified-modal-values">
              <div class="verified-modal-col">
                <dt>Заявлено производителем</dt>
                <dd>{{ verifiedModal.value }}</dd>
              </div>
              <div class="verified-modal-col">
                <dt>Проверено в DNS</dt>
                <dd>{{ verifiedModal.verified }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Нижняя шторка деталей лабораторной проверки DNS из дизайн-системы (только на мобилке) -->
    <BottomSheet v-if="sheet && isMobile" @close="sheet = null">
      <template #header>
        <div class="verified-sheet-header">
          <h3 id="verified-sheet-title">{{ sheet.label }}</h3>
        </div>
      </template>

      <dl class="verified-sheet-values">
        <div>
          <dt>Заявлено производителем</dt>
          <dd>{{ sheet.value }}</dd>
        </div>
        <div>
          <dt>Проверено в DNS</dt>
          <dd>{{ sheet.verified }}</dd>
        </div>
      </dl>
    </BottomSheet>
  </section>
</template>

<style scoped>
.product-specifications {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 60px;
  padding: 32px;
  font-size: 16px;
}
.specifications-aside {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}
.specifications-reliability {
  padding: 20px 16px;
  background: var(--background-success-light);
  border-radius: 16px;
  margin-bottom: 12px;
}
.specifications-reliability > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--background-success-main);
  gap: 12px;
}
.specifications-reliability h3 {
  font-size: 18px;
  line-height: 1.3;
}
.specifications-reliability p {
  margin-top: 12px;
  line-height: 1.4;
}
.specifications-reliability .reliability-comparison {
  font-size: 14px;
  line-height: 1.3;
}
.specifications-reliability > a {
  margin-top: 24px;
}
.price-history {
  padding: 24px 16px 28px;
  background: var(--background-primary);
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
}
.price-history-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  margin-bottom: 20px;
}
.price-history-heading h3 {
  font-size: 18px;
  line-height: 1.3;
}
.price-history-heading > span,
.price-history-months,
.price-history > p {
  font-size: 12px;
  line-height: 1.3;
  color: var(--text-tertiary);
}
.price-history-chart {
  position: relative;
  width: 100%;
}
.price-history-chart > img {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  transform-origin: top left;
}
.price-history-months {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  margin-top: -16px;
  position: relative;
}
.price-history > p {
  margin: 12px 8px 0;
}
.specifications-help {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px !important;
  white-space: normal !important;
}
.specifications-help > span {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: normal !important;
}
.specifications-help :deep(> span) {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: normal !important;
}
.specifications-help img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  background: var(--background-primary);
  border-radius: 12px;
  flex-shrink: 0;
}
.specifications-help span span,
.specifications-help > span:not(:has(img)) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.specifications-help b {
  font-size: 16px;
}
.specifications-content {
  min-width: 0;
}
.product-description {
  margin-bottom: 40px;
  font-size: 16px;
  line-height: 1.4;
}
.product-description > p {
  margin-bottom: 8px;
}
.product-files {
  margin-bottom: 24px;
}
.product-files .specifications-heading {
  margin-bottom: 24px;
}
.files-count {
  color: var(--text-tertiary);
  font-weight: 400;
}
.files-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 100px;
  gap: 8px;
}
.file-card,
.files-all {
  background: var(--background-primary);
  border-radius: 12px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  height: 64px;
  padding: 12px;
  display: flex !important;
  align-items: center;
  font-size: 14px !important;
}
.file-card :deep(> span) {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  width: 100%;
}
.file-card [class*="_base-icon_"] {
  background: var(--background-secondary);
  border-radius: 4px;
  color: var(--icon-primary);
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  font-size: 20px;
}
.file-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}
.file-copy > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-copy > small {
  font-size: 12px;
  color: var(--text-tertiary);
}
.files-all {
  justify-content: center;
  gap: 16px;
  font-size: 16px !important;
}
.files-all :deep(> span) {
  display: flex;
  align-items: center;
  gap: 16px;
}
.files-all [class*="_base-icon_"] {
  color: var(--icon-primary);
}
.specifications-summary {
  margin-bottom: 40px;
}
.specifications-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.specifications-heading h2 {
  font-size: 24px;
  line-height: 1.3;
}
.specification-group {
  margin-bottom: 40px;
}
.specifications-collapsed > .specification-group:last-child {
  mask-image: linear-gradient(to bottom, #000 calc(100% - 60px), transparent);
}
.specification-group h3 {
  font-size: 18px;
  line-height: 1.3;
  margin: 0 0 20px;
}
.specification-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 36px;
}
dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.specification-row {
  display: grid;
  grid-template-columns: minmax(0, 42%) minmax(0, 58%);
  gap: 8px;
  line-height: 1.4;
  align-items: baseline;
}
dt {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--text-tertiary);
  min-width: 0;
  line-height: 1.4;
}
dt > span {
  min-width: 0;
}
dt > i {
  flex: 1;
  min-width: 8px;
  border-bottom: 1px solid var(--stroke-border-light);
  transform: translateY(-3px);
}
dt > [class*="_base-icon_"] {
  font-size: 16px;
  color: var(--icon-primary);
  align-self: flex-start;
  margin-top: 3px;
}
dd {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.4;
}

/* Контейнер значения и дополнительных действий */
.spec-dd-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  line-height: 1.4;
}
.spec-value-line {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0 6px;
  line-height: 1.4;
  min-width: 0;
}

/* Иконка воронки (фильтра в каталог) */
.spec-filter-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--text-tertiary, #8c8c8c);
  text-decoration: none;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 1px;
  transition: color 0.15s ease;
  cursor: pointer;
}
.spec-filter-link:hover {
  color: var(--text-primary, #1d1d1d);
}
.spec-filter-icon {
  font-size: 20px;
  line-height: 1;
}

/* Синяя ссылка со справкой/модальным окном */
.spec-modal-link {
  color: var(--text-link, #0070ba);
  text-decoration: none;
  cursor: pointer;
  transition: text-decoration 0.15s ease;
}
.spec-modal-link:hover {
  text-decoration: underline;
}

.spec-text-value {
  color: var(--text-primary);
}
.spec-verified-note {
  color: var(--text-tertiary);
  white-space: nowrap;
}
.spec-verified-tag {
  margin-top: 1px;
}

/* Вторая строка: заявленное значение */
.spec-declared-line {
  font-size: 13px;
  line-height: 1.35;
  color: var(--text-tertiary);
  margin-top: 2px;
}

/* Модальное окно термина / глоссария */
.spec-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--effects-overlay-modal-dark, rgba(0, 0, 0, 0.45));
  padding: 16px;
}
.spec-modal-dialog {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px 28px 26px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  color: var(--text-primary, #1d1d1d);
  animation: specModalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes specModalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.spec-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.spec-modal-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: var(--text-primary, #1d1d1d);
}
.spec-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--text-tertiary, #8c8c8c);
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s, background-color 0.15s;
  padding: 0;
  margin: -4px -6px 0 0;
}
.spec-modal-close:hover {
  color: var(--text-primary, #1d1d1d);
  background: var(--background-secondary, #f2f2f2);
}
.spec-modal-body {
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-primary, #2b2b2b);
}
.spec-modal-body p {
  margin: 0;
}
.spec-modal-footer {
  margin-top: 20px;
}
.spec-modal-link-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-link, #0070ba);
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.15s;
}
.spec-modal-link-more:hover {
  text-decoration: underline;
}

/* Десктопное модальное окно деталей проверки DNS */
.verified-modal-dialog {
  max-width: 480px;
  width: 100%;
  padding: 24px 28px 28px;
}
.verified-modal-subtitle {
  font-size: 14px;
  color: var(--text-tertiary, #8c8c8c);
  margin: 4px 0 0;
  line-height: 1.4;
}
.verified-modal-values {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0;
}
.verified-modal-values > div {
  padding: 14px 16px;
  border-radius: 10px;
  background: #f2f2f2;
}
.verified-modal-values dt {
  font-size: 12px;
  line-height: 1.3;
  color: var(--text-tertiary, #8c8c8c);
  margin-bottom: 6px;
}
.verified-modal-values dd {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1d1d1d);
}

/* Нижняя шторка деталей лабораторной проверки DNS (дизайн-система) */
.verified-sheet-header {
  padding: 4px 0 8px;
}
.verified-sheet-header h3 {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: var(--text-primary);
}
.verified-sheet-name {
  color: var(--text-tertiary);
  font-size: 14px;
  margin: 4px 0 0;
}
.verified-sheet-values {
  margin: 12px 0 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0;
}
.verified-sheet-values > div {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f2f2f2;
}
.verified-sheet-values dt {
  font-size: 12px;
  line-height: 1.3;
  color: var(--text-tertiary);
  margin-bottom: 6px;
}
.verified-sheet-values dd {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}
.verified-sheet-btn {
  width: 100%;
}

.specifications-all {
  width: 100%;
}
@media (max-width: 1399px) {
  .product-specifications {
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 32px;
  }
  .specification-columns {
    gap: 24px;
  }
}
@media (max-width: 1199px) {
  .specification-columns {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 991.98px) {
  .product-specifications {
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    gap: 24px;
  }
  .specifications-aside {
    width: 100%;
  }
  .specifications-reliability {
    margin-bottom: 0;
  }
  .specifications-help {
    display: none;
  }
  .specifications-content {
    width: 100%;
  }
  .specification-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
  .specifications-heading h2 {
    font-size: 22px;
  }
}
@media (max-width: 600px) {
  .specification-columns {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .specification-group {
    margin-bottom: 32px;
  }
  .specification-row {
    font-size: 14px;
    grid-template-columns: minmax(0, 45%) minmax(0, 55%);
  }
  .spec-modal-dialog {
    padding: 20px 16px 20px;
    margin: 12px;
  }
  .spec-modal-title {
    font-size: 18px;
  }
  .files-list {
    grid-template-columns: minmax(0, 1fr) 64px;
  }
  .file-card:nth-child(2) {
    display: none !important;
  }
  .product-description {
    font-size: 14px;
    margin-bottom: 32px;
  }
  .product-files .specifications-heading {
    margin-bottom: 16px;
  }
  .product-files h2 {
    font-size: 20px;
  }
}
@media (max-width: 991.98px) and (min-width: 601px) {
  .files-list {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 72px;
  }
}
</style>
