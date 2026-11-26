<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { BaseUiButton } from '@dns-modules/base-ui-button'
import { BaseLink } from '@dns-modules/base-link'
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  isDiscountSelected: {
    type: Boolean,
    default: true
  },
  variants: {
    type: Array,
    default: () => []
  },
  productCode: {
    type: String,
    default: '5079498'
  }
})

const emit = defineEmits(['update:modelValue', 'update:isDiscountSelected'])

const currentVariant = computed(() => {
  return props.variants.find(v => v.id === props.modelValue) || props.variants[0]
})

function selectTab(isDiscount) {
  emit('update:isDiscountSelected', isDiscount)
  if (isDiscount && !props.modelValue && props.variants.length) {
    emit('update:modelValue', props.variants[0].id)
  }
}

function selectVariant(id) {
  emit('update:modelValue', id)
}

// В табах показываем не больше 7 вариантов, остальные — в списке по чипу «Ещё N»
const MAX_VISIBLE = 7
// Вид перехода к остальным вариантам: 'button' — кнопка «Ещё N» в ряду чипов, 'link' — ссылка «Посмотреть все (N)» под табами.
// Для сравнения переключается параметром адреса ?more=link
const moreView = new URLSearchParams(window.location.search).get('more') === 'link' ? 'link' : 'button'
const moreOpen = ref(false)
const conditionFilter = ref('all')

const hiddenCount = computed(() => Math.max(0, props.variants.length - MAX_VISIBLE))

// Выбранный вариант из списка подставляем в последний чип, чтобы выбор оставался виден в табах
const visibleVariants = computed(() => {
  const list = props.variants.slice(0, MAX_VISIBLE)
  const index = props.variants.findIndex(v => v.id === props.modelValue)
  if (index >= MAX_VISIBLE) list[MAX_VISIBLE - 1] = props.variants[index]
  return list
})

const conditions = computed(() => [...new Set(props.variants.map(v => v.condition || v.type))])
const filteredVariants = computed(() => conditionFilter.value === 'all'
  ? props.variants
  : props.variants.filter(v => (v.condition || v.type) === conditionFilter.value))

function pickFromList(id) {
  selectVariant(id)
  moreOpen.value = false
}

const closeOnEscape = e => { if (e.key === 'Escape') moreOpen.value = false }
onMounted(() => document.addEventListener('keydown', closeOnEscape))
onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape)
  document.body.style.overflow = ''
})
watch(moreOpen, open => { document.body.style.overflow = open ? 'hidden' : '' })

function money(val) {
  return typeof val === 'number'
    ? val.toLocaleString('ru-RU') + ' ₽'
    : val
}
</script>

<template>
  <div class="figma-multi-parameter" aria-label="Доступные варианты товара">
    <!-- Название параметра над первыми табами (макет 31481:83730) -->
    <div class="figma-param-title">Доступные варианты</div>

    <!-- Табы 1-го уровня: «Новый» / «Уцененный» -->
    <div class="figma-tabs-group" role="tablist">
      <button
        type="button"
        class="figma-tab-btn"
        :class="{ 'is-active': !isDiscountSelected }"
        role="tab"
        :aria-selected="!isDiscountSelected"
        @click="selectTab(false)"
      >
        Новый
      </button>

      <button
        type="button"
        class="figma-tab-btn"
        :class="{ 'is-active': isDiscountSelected }"
        role="tab"
        :aria-selected="isDiscountSelected"
        @click="selectTab(true)"
      >
        Уцененный
      </button>
    </div>

    <!-- Секция уценки (макет) -->
    <template v-if="isDiscountSelected && variants.length">
      <!-- Название параметра над вторыми табами -->
      <div class="figma-variants-title">Цены и состояния</div>

      <!-- Табы 2-го уровня: чипы вариантов уценки (Hug) -->
      <div class="figma-variants-frame" role="radiogroup" aria-label="Цены и состояния">
        <button
          v-for="item in visibleVariants"
          :key="item.id"
          type="button"
          class="figma-variant-chip"
          :class="{ 'is-active': item.id === modelValue }"
          role="radio"
          :aria-checked="item.id === modelValue"
          @click="selectVariant(item.id)"
        >
          <span class="figma-variant-price">{{ money(item.price) }}</span>
          <span class="figma-variant-condition">{{ item.condition || item.type }}</span>
        </button>

        <BaseUiButton
          v-if="hiddenCount && moreView === 'button'"
          class="figma-variants-more"
          variant="tertiary"
          size="small"
          aria-haspopup="dialog"
          :aria-label="`Показать все варианты, ещё ${hiddenCount}`"
          @click="moreOpen = true"
        >
          Ещё {{ hiddenCount }}
        </BaseUiButton>
      </div>

      <BaseLink
        v-if="hiddenCount && moreView === 'link'"
        class="figma-variants-all"
        tag="button"
        aria-haspopup="dialog"
        @click="moreOpen = true"
      >
        Посмотреть все ({{ variants.length }})
      </BaseLink>

      <!-- Текстовый блок описания уценки под вариантами (Frame 1171275098) -->
      <div v-if="currentVariant" class="figma-discount-desc-block">
        <div class="figma-discount-desc-text">
          <p>Гарантия продавца: {{ currentVariant.sellerWarranty }}</p>
          <p>Тип уцененного товара: {{ currentVariant.type }}</p>
          <p>Внешний вид: {{ currentVariant.appearance }}</p>
          <p v-if="currentVariant.missingPackage">Отсутствующий комплект: {{ currentVariant.missingPackage }}</p>
          <p v-else>Комплектация: {{ currentVariant.package }}</p>
          <p>Тип ремонта: {{ currentVariant.repair }}</p>
          <p>Серийный номер: {{ currentVariant.serialNumber }}</p>
        </div>
      </div>
    </template>

    <!-- Полный список вариантов: окно на десктопе, нижняя шторка на мобильной -->
    <Teleport to="body">
      <div v-if="moreOpen" class="figma-variants-overlay" @click.self="moreOpen = false">
        <div class="figma-variants-modal" role="dialog" aria-modal="true" aria-labelledby="figma-variants-modal-title">
          <div class="figma-variants-modal-head">
            <h3 id="figma-variants-modal-title">Цены и состояния <span>· {{ variants.length }}</span></h3>
            <button type="button" class="figma-variants-modal-close" aria-label="Закрыть" @click="moreOpen = false">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.500" stroke-linecap="round"/></svg>
            </button>
          </div>

          <div class="figma-variants-filter" role="group" aria-label="Состояние">
            <button type="button" class="figma-variants-filter-chip" :class="{ 'is-active': conditionFilter === 'all' }" @click="conditionFilter = 'all'">Все</button>
            <button v-for="c in conditions" :key="c" type="button" class="figma-variants-filter-chip" :class="{ 'is-active': conditionFilter === c }" @click="conditionFilter = c">{{ c }}</button>
          </div>

          <div class="figma-variants-list" role="radiogroup" aria-label="Все варианты">
            <button
              v-for="item in filteredVariants"
              :key="item.id"
              type="button"
              class="figma-variants-row"
              :class="{ 'is-active': item.id === modelValue }"
              role="radio"
              :aria-checked="item.id === modelValue"
              @click="pickFromList(item.id)"
            >
              <span class="figma-variants-row-price">{{ money(item.price) }}</span>
              <span class="figma-variants-row-condition">{{ item.condition || item.type }}</span>
              <span class="figma-variants-row-warranty">Гарантия {{ item.sellerWarranty }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Нижняя плашка: Логотип бренда и код товара (как на проде на мобильных) -->
    <div class="figma-discount-footer">
      <img src="/images/asus-logo.svg" alt="ASUS ROG" class="figma-brand-logo" />
      <span class="figma-product-code">#{{ productCode }}</span>
    </div>
  </div>
</template>
