<script setup>
import { footerColumns, appStores, phone, dnsUrl } from '../data'

const year = new Date().getFullYear()
const link = (label) => `${dnsUrl}/search/?q=${encodeURIComponent(label)}`
const columns = [
  { title: 'Компания', items: footerColumns.company },
  { title: 'Покупателям', items: footerColumns.buyers },
  { title: 'Бизнесу', items: footerColumns.business },
]
</script>

<template>
  <footer class="footer">
    <div class="wrap">
      <p class="footer__note">Нужна помощь? Позвоните <a :href="phone.href">{{ phone.label }}</a>, {{ phone.hours }}.</p>
      <div class="footer__cols">
        <nav v-for="column in columns" :key="column.title" :aria-label="column.title">
          <h2>{{ column.title }}</h2>
          <ul>
            <li v-for="item in column.items" :key="item"><a :href="link(item)">{{ item }}</a></li>
          </ul>
        </nav>
        <nav aria-label="Приложение DNS">
          <h2>Приложение DNS</h2>
          <ul>
            <li v-for="store in appStores" :key="store.name"><a :href="store.href" target="_blank" rel="noopener">{{ store.name }}</a></li>
          </ul>
        </nav>
      </div>
      <div class="footer__legal">
        <p>© 2002—{{ year }} Компания DNS. Администрация Сайта не несет ответственности за размещаемые Пользователями материалы (в т.ч. информацию и изображения), их содержание и качество.</p>
      </div>
    </div>
  </footer>
</template>
