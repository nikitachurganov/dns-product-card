<script setup>
import { specsVariant } from '../specsVariant'

const options = [
  { id: 'value', label: 'Иконка у значения' },
  { id: 'info', label: 'Иконка в инфо' },
]
</script>

<template>
  <!-- Плавающий переключатель вариантов прототипа (не часть интерфейса DNS) -->
  <div class="specs-variant-switch" role="radiogroup" aria-label="Вариант отображения проверки DNS">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      role="radio"
      :aria-checked="specsVariant === option.id"
      :class="{ 'is-active': specsVariant === option.id }"
      @click="specsVariant = option.id"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.specs-variant-switch {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 1000;
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(29, 29, 29, 0.88);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  font-size: 13px;
  line-height: 1.2;
}
.specs-variant-switch button {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
}
.specs-variant-switch button:hover {
  color: #fff;
}
.specs-variant-switch button.is-active {
  background: #fff;
  color: #1d1d1d;
}
@media (max-width: 991.98px) {
  /* Над нижней панелью «Купить» */
  .specs-variant-switch {
    bottom: 84px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
