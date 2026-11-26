import { ref, watch } from 'vue'

// Вариант отображения проверки DNS в характеристиках. Хранится в URL (?specs=info),
// чтобы на каждый вариант была своя ссылка.
//  - 'value' (по умолчанию): иконка проверки стоит после значения
//  - 'info': иконка проверки заменяет иконку ⓘ у названия, по нажатию — шторка с пояснением
const PARAM = 'specs'

export const specsVariant = ref(new URLSearchParams(window.location.search).get(PARAM) === 'info' ? 'info' : 'value')

watch(specsVariant, variant => {
  const url = new URL(window.location.href)
  if (variant === 'info') url.searchParams.set(PARAM, 'info')
  else url.searchParams.delete(PARAM)
  window.history.replaceState(window.history.state, '', url)
})
