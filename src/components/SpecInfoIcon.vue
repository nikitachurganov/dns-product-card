<script setup>
import { IconCircleInfo } from '@dns-modules/font-icon'
import { BaseUiTooltip } from '@dns-modules/base-ui-tooltip'
import '@dns-modules/base-ui-tooltip/style.css'

// Иконка ⓘ у названия характеристики (по нажатию — шторка/модалка с пояснением):
//  - 'info'     — серая ⓘ, только пояснение
//  - 'matched'  — серая ⓘ, проверено в DNS, совпало с заявленным
//  - 'warning'  — желтая ⓘ, проверено в DNS, не совпало
// У проверенных характеристик при наведении — тултип из дизайн-системы «Проверено в DNS»
// (только на устройствах с hover; на тач-экранах нажатие сразу открывает шторку).
defineProps({
  state: { type: String, default: 'info' },
  label: { type: String, default: '' },
})
defineEmits(['open'])

const canHover = window.matchMedia('(hover: hover)').matches

const titles = {
  info: 'Пояснение к характеристике',
  matched: 'Проверено в DNS: совпадает с заявленным',
  warning: 'Проверено в DNS: не совпадает с заявленным',
}
</script>

<template>
  <BaseUiTooltip v-if="state !== 'info' && canHover" tag="span" position="top" class="spec-info-tooltip">
    <button
      type="button"
      class="spec-info-icon"
      :class="`is-${state}`"
      :aria-label="`${label}: ${titles[state]}`"
      @click="$emit('open')"
    >
      <IconCircleInfo aria-hidden="true" />
    </button>
    <template #content>
      <div class="spec-info-tooltip-text">Проверено в DNS</div>
    </template>
  </BaseUiTooltip>
  <button
    v-else
    type="button"
    class="spec-info-icon"
    :class="`is-${state}`"
    :aria-label="`${label}: ${titles[state]}`"
    @click="$emit('open')"
  >
    <IconCircleInfo aria-hidden="true" />
  </button>
</template>

<style scoped>
.spec-info-tooltip {
  display: inline-flex;
  vertical-align: -4px;
  margin-left: 4px;
}
.spec-info-tooltip .spec-info-icon {
  margin-left: 0;
  vertical-align: top;
}
.spec-info-tooltip-text {
  font-size: 12px;
  line-height: 1.3;
  color: #fff;
  white-space: nowrap;
  padding: 2px 4px;
}
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
.spec-info-icon.is-warning {
  color: #f59e0b;
}
</style>
