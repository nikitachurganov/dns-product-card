<script setup>
import { BaseUiTooltip } from '@dns-modules/base-ui-tooltip'
import '@dns-modules/base-ui-tooltip/style.css'

defineProps({
  label: { type: String, default: '' },
  declared: { type: String, default: '' },
  verified: { type: String, default: '' },
  diffText: { type: String, default: '' },
  mobile: { type: Boolean, default: false },
  matched: { type: Boolean, default: false },
})
defineEmits(['open'])
</script>

<template>
  <button
    v-if="mobile"
    type="button"
    :class="['verified-icon-btn', matched ? 'is-matched' : 'is-warning']"
    aria-label="Проверено в лаборатории DNS"
    @click="$emit('open')"
  >
    <svg v-if="matched" class="verified-icon" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#2e9e4f"/>
      <path d="M5 8.2l2 2 4-4.2" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg v-else class="verified-icon" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="#c98a2b" stroke-width="1.5"/>
      <path d="M8 5v3.5" stroke="#c98a2b" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="8" cy="10.9" r="0.9" fill="#c98a2b"/>
    </svg>
  </button>
  <BaseUiTooltip v-else tag="span" position="top" class="verified-tooltip-trigger">
    <span
      :class="['verified-icon-btn', matched ? 'is-matched' : 'is-warning']"
      role="button"
      tabindex="0"
      aria-label="Проверено в лаборатории DNS"
      @click="$emit('open')"
      @keydown.enter="$emit('open')"
      @keydown.space.prevent="$emit('open')"
    >
      <svg v-if="matched" class="verified-icon" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="#2e9e4f"/>
        <path d="M5 8.2l2 2 4-4.2" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else class="verified-icon" width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" stroke="#c98a2b" stroke-width="1.5"/>
        <path d="M8 5v3.5" stroke="#c98a2b" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="8" cy="10.9" r="0.9" fill="#c98a2b"/>
      </svg>
    </span>
    <template #content>
      <div class="verified-tooltip-simple">
        {{ matched ? 'Совпадает с заявленным — проверено в лаборатории DNS' : 'Не совпадает с заявленным — проверено в лаборатории DNS' }}
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
  margin: 0;
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
.verified-tooltip-simple {
  font-size: 12px;
  line-height: 1.3;
  color: #fff;
  white-space: nowrap;
  padding: 2px 4px;
}
</style>
