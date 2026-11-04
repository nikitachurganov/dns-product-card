<script setup>
import { BaseUiTooltip } from '@dns-modules/base-ui-tooltip'
import '@dns-modules/base-ui-tooltip/style.css'

defineProps({
  label: { type: String, default: '' },
  declared: { type: String, default: '' },
  verified: { type: String, default: '' },
  diffText: { type: String, default: '' },
  mobile: { type: Boolean, default: false },
})
defineEmits(['open'])
</script>

<template>
  <button
    v-if="mobile"
    type="button"
    class="verified-icon-btn is-warning"
    aria-label="Проверено в лаборатории DNS"
    @click="$emit('open')"
  >
    <svg class="verified-icon is-warning" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M7.134 1.5a1 1 0 0 1 1.732 0l6.062 10.5A1 1 0 0 1 14.062 13.5H1.938a1 1 0 0 1-.866-1.5L7.134 1.5z" fill="#f59e0b"/>
      <path d="M8 5.5v3.5M8 11.25v.25" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
  <BaseUiTooltip v-else tag="span" position="top" class="verified-tooltip-trigger">
    <span
      class="verified-icon-btn is-warning"
      role="button"
      tabindex="0"
      aria-label="Проверено в лаборатории DNS"
      @click="$emit('open')"
      @keydown.enter="$emit('open')"
      @keydown.space.prevent="$emit('open')"
    >
      <svg class="verified-icon is-warning" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M7.134 1.5a1 1 0 0 1 1.732 0l6.062 10.5A1 1 0 0 1 14.062 13.5H1.938a1 1 0 0 1-.866-1.5L7.134 1.5z" fill="#f59e0b"/>
        <path d="M8 5.5v3.5M8 11.25v.25" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </span>
    <template #content>
      <div class="verified-tooltip-simple">
        Проверено в лаборатории DNS
      </div>
    </template>
  </BaseUiTooltip>
</template>

<style scoped>
.verified-tooltip-trigger {
  display: inline-flex;
  align-items: flex-start;
  flex-shrink: 0;
  vertical-align: top;
}
.verified-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 1px 0 0 6px;
  border: none;
  background: none;
  cursor: pointer;
  line-height: 1;
  flex-shrink: 0;
  vertical-align: top;
  transition: opacity 0.15s ease;
}
.verified-icon-btn:hover {
  opacity: 0.85;
}
.verified-icon {
  flex-shrink: 0;
  display: block;
}
.verified-icon.is-warning {
  width: 20px;
  height: 20px;
  display: block;
}
.verified-tooltip-simple {
  font-size: 12px;
  line-height: 1.3;
  color: #fff;
  white-space: nowrap;
  padding: 2px 4px;
}
</style>
