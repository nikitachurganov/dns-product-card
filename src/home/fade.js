// Директива v-fade: картинка появляется плавно, когда загрузилась.
// Пока файл не пришёл, под ней виден фон-заглушка (скелетон контейнера), поэтому макет не «прыгает».
export const vFade = {
  created(el) { el.classList.add('fade-img') },
  mounted(el) {
    const show = () => el.classList.add('is-loaded')
    if (el.complete) show()
    else { el.addEventListener('load', show, { once: true }); el.addEventListener('error', show, { once: true }) }
  },
  // Для :src, который меняется (например, при смене карточки), снова ждём загрузки
  updated(el) {
    if (!el.complete) {
      el.classList.remove('is-loaded')
      el.addEventListener('load', () => el.classList.add('is-loaded'), { once: true })
    }
  },
}
