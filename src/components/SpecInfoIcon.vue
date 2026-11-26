<script setup>
import { IconCircleInfo } from '@dns-modules/font-icon'

// Иконка у названия характеристики в варианте «Иконка в инфо»:
//  - 'info'     — серая ⓘ, только пояснение
//  - 'matched'  — зеленая ⓘ, проверено в DNS, совпало с заявленным
//  - 'warning'  — желтый треугольник, проверено в DNS, не совпало
defineProps({
  state: { type: String, default: 'info' },
  label: { type: String, default: '' },
})
defineEmits(['open'])

const titles = {
  info: 'Пояснение к характеристике',
  matched: 'Проверено в DNS: совпадает с заявленным',
  warning: 'Проверено в DNS: не совпадает с заявленным',
}
</script>

<template>
  <button
    type="button"
    class="spec-info-icon"
    :class="`is-${state}`"
    :title="titles[state]"
    :aria-label="`${label}: ${titles[state]}`"
    @click="$emit('open')"
  >
    <svg v-if="state === 'warning'" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M7.134 1.5a1 1 0 0 1 1.732 0l6.062 10.5A1 1 0 0 1 14.062 13.5H1.938a1 1 0 0 1-.866-1.5L7.134 1.5z" fill="#f59e0b"/>
      <path d="M8 5.5v3.5M8 11.25v.25" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <IconCircleInfo v-else aria-hidden="true" />
  </button>
</template>

<style scoped>
.spec-info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  margin-left: 4px;
  border: none;
  background: none;
  cursor: pointer;
  vertical-align: -4px;
  font-size: 20px;
  color: var(--text-tertiary);
  transition: opacity 0.15s ease;
}
.spec-info-icon:hover {
  opacity: 0.8;
}
.spec-info-icon.is-matched {
  color: #2e9e4f;
}
.spec-info-icon svg {
  display: block;
}
</style>
