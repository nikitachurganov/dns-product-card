// Данные премиальной главной. Ссылки, бренды, ленту и подвал берём из прежней главной,
// здесь только то, что нужно новой странице. Цен на странице нет намеренно.
import { categories, brands, feed, footerColumns, appStores, phone, dnsUrl } from '../home/data'

export { categories, brands, footerColumns, appStores, phone, dnsUrl }

const search = (query) => `${dnsUrl}/search/?q=${encodeURIComponent(query)}`

export const navLinks = [
  { label: 'Каталог', href: `${dnsUrl}/catalog/` },
  { label: 'Смартфоны', href: search('смартфоны') },
  { label: 'Ноутбуки', href: search('ноутбуки') },
  { label: 'ПК', href: search('компьютеры') },
  { label: 'ТВ', href: search('телевизоры') },
  { label: 'Комплектующие', href: search('комплектующие') },
  { label: 'Бытовая техника', href: search('бытовая техника') },
  { label: 'Сервис', href: `${dnsUrl}/service-center/` },
  { label: 'Клуб DNS', href: 'https://club.dns-shop.ru/' },
]

export const quickSearch = ['Смартфоны', 'Ноутбуки', 'Видеокарты', 'Телевизоры', 'Наушники', 'Игровые приставки']

const kinds = { news: 'Новость', blogs: 'Блог', reviews: 'Обзор', video: 'Видео' }
const contain = new Set(['keyron', 'dexp-coffee'])
const order = ['motherboard', 'air-fryer', 'bread-maker', 'keyron', 'dexp-coffee']

export const journal = order
  .map((id) => feed.find((item) => item.id === id))
  .filter(Boolean)
  .map((item) => ({ ...item, kind: kinds[item.types[0]], contain: contain.has(item.id) }))

export const buildSteps = [
  { n: '01', title: 'Выберите основу', text: 'Начните с процессора или видеокарты — остальное подберётся вокруг них.' },
  { n: '02', title: 'Добавьте остальное', text: 'Материнская плата, память, накопители, корпус и блок питания.' },
  { n: '03', title: 'Проверьте совместимость', text: 'Конфигуратор предупредит о конфликте ещё до оформления.' },
]
