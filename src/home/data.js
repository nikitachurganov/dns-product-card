// Данные главной DNS. Тексты и картинки — из Figma «🔴Главная — Homepage — Master», узел 18008:46059.
// Ссылки ведут на соответствующие разделы dns-shop.ru.

const DNS = 'https://www.dns-shop.ru'

export const city = 'Владивосток'
export const phone = { label: '8-800-77-07-999', href: 'tel:88007707999', hours: 'c 03:00 до 22:00' }

export const topLinks = [
  { label: 'DNS Видео', href: `${DNS}/short/`, dot: true },
  { label: 'Магазины', href: `${DNS}/shops/` },
  { label: 'Доставка', href: `${DNS}/help/delivery/` },
  {
    label: 'Покупателям',
    menu: [
      { label: 'Как оформить заказ', href: `${DNS}/help/how-to-order/` },
      { label: 'Способы оплаты', href: `${DNS}/help/payment/` },
      { label: 'Обмен, возврат, гарантия', href: `${DNS}/help/return/` },
      { label: 'Статус заказа', href: `${DNS}/order/status/` },
    ],
  },
  { label: 'Юрлицам', href: `${DNS}/help/legal-entities/` },
  { label: 'Клуб DNS', href: 'https://club.dns-shop.ru/' },
  { label: 'Предложения брендов', href: `${DNS}/actions/` },
  { label: 'Вакансии', href: 'https://www.dns-shop.ru/vacancy/' },
]

export const categories = [
  'Красота и здоровье',
  'Смартфоны и фототехника',
  'ТВ и мультимедиа',
  'ПК, ноутбуки, периферия',
  'Комплектующие для ПК',
  'Офис и мебель',
  'Сетевое оборудование',
  'Отдых и развлечение',
  'Инструмент и стройка',
].map((label) => ({ label, href: `${DNS}/search/?q=${encodeURIComponent(label)}` }))

export const serviceTiles = [
  { id: 'created', title: 'Создано DNS', text: 'Техника для дома\nи вас', href: `${DNS}/catalog/brand/dexp/` },
  { id: 'build', title: 'Собрать ПК', text: 'Без проблем\nс совместимостью', href: `${DNS}/configurator/` },
  { id: 'gift', title: 'Подарочные карты', text: 'Дарите любимым', href: `${DNS}/gift-cards/` },
  { id: 'payment', title: 'Карты оплаты', text: 'Оплата игр и сервисов', href: `${DNS}/catalog/payment-cards/` },
]

// Первая вакансия — из макета. Остальные — демонстрационные, чтобы показать работу слайдера.
export const vacancies = [
  { role: 'Кладовщик', place: 'г. Артём, ул. Солнечная, 46', salary: 110000 },
  { role: 'Продавец-консультант', place: 'г. Владивосток, ул. Светланская, 29', salary: 75000, demo: true },
  { role: 'Водитель-экспедитор', place: 'г. Владивосток, ул. Шилкинская, 7', salary: 95000, demo: true },
  { role: 'Сборщик ПК', place: 'г. Уссурийск, ул. Некрасова, 70', salary: 85000, demo: true },
]

export const feedTabs = [
  { id: 'all', label: 'Все' },
  { id: 'news', label: 'Новости' },
  { id: 'blogs', label: 'Блоги' },
  { id: 'reviews', label: 'Обзоры' },
  { id: 'video', label: 'DNS Видео' },
]

export const feed = [
  { id: 'dexp-coffee', title: 'Новинка! Рожковая кофеварка DEXP DEM-1520', image: '/home/feed/dexp-coffee.png', types: ['news'], href: `${DNS}/news/` },
  { id: 'motherboard', title: 'Количество слоев материнской платы — на что влияет и есть ли смысл переплачивать', image: '/home/feed/motherboard.webp', types: ['blogs', 'video'], href: `${DNS}/blogs/` },
  { id: 'air-fryer', title: 'Обзор и полное тестирование аэрогриля DEXP DAF-2007', image: '/home/feed/air-fryer.webp', types: ['reviews', 'video'], href: `${DNS}/reviews/` },
  { id: 'bread-maker', title: 'Обзор и полное тестирование хлебопечи DEXP DBM-550P', image: '/home/feed/bread-maker.webp', types: ['reviews'], href: `${DNS}/reviews/` },
  { id: 'keyron', title: 'Новинка! Клавиатура KEYRON Proxima', image: '/home/feed/keyron.png', types: ['news'], href: `${DNS}/news/` },
  // В макете ленту замыкает повтор первой карточки: она обрезана правым краем и показывает, что ленту можно листать
  { id: 'dexp-coffee-2', title: 'Новинка! Рожковая кофеварка DEXP DEM-1520', image: '/home/feed/dexp-coffee.png', types: ['news'], href: `${DNS}/news/` },
]

// Две плитки на месте серых заглушек из макета. Тексты — предложение дизайнера-разработчика, в макете их нет.
export const promos = [
  {
    id: 'club',
    title: 'Клуб DNS',
    text: 'Бонусная программа для покупателей',
    action: 'Подробнее',
    href: 'https://club.dns-shop.ru/',
    dark: true,
  },
  {
    id: 'shops',
    title: 'Магазины DNS',
    text: 'Найдите ближайший магазин и проверьте наличие',
    action: 'Все магазины',
    href: `${DNS}/shops/`,
  },
]

export const brands = [
  { name: 'DEXP', file: 'brand-01.png', w: 105, h: 21 },
  { name: 'ARDOR', file: 'brand-02.png', w: 83, h: 25 },
  { name: 'FinePower', file: 'brand-03.png', w: 105, h: 21, dim: true },
  { name: 'Ereoka', file: 'brand-04.png', w: 105, h: 20 },
  { name: 'Xiaomi', file: 'brand-05.png', w: 35, h: 35 },
  { name: 'Apple', file: 'brand-06.png', w: 75, h: 26 },
  { name: 'Samsung', file: 'brand-07.png', w: 101, h: 14 },
  { name: 'MSI', file: 'brand-08.png', w: 81, h: 26 },
  { name: 'Haier', file: 'brand-09.png', w: 77, h: 24 },
  { name: 'HUAWEI', file: 'brand-10.png', w: 101, h: 22 },
  { name: 'ASUS', file: 'brand-11.png', w: 101, h: 22 },
].map((b) => ({ ...b, href: `${DNS}/search/?q=${encodeURIComponent(b.name)}` }))

export const partners = [
  {
    id: 'team',
    title: 'Стань частью команды DNS',
    text: 'Работа в магазинах, на складах и в офисах в 900+ городах. Официальное оформление, обучение и карьерный рост.',
    action: 'Вакансии',
    href: 'https://www.dns-shop.ru/vacancy/',
  },
  {
    id: 'global',
    title: 'Партнерам GLOBAL',
    text: 'Расширяйте свой бизнес с помощью DNS Group: поставки, логистика и выход на рынок России и стран СНГ.',
    action: 'Подробнее',
    href: 'https://www.dns-group.ru/',
    dark: true,
  },
  {
    id: 'b2b',
    title: 'Партнерам РФ',
    text: 'Работаем с юридическими лицами и предпринимателями: безналичная оплата, отсрочка платежа и персональный менеджер.',
    action: 'Подробнее',
    href: `${DNS}/help/legal-entities/`,
  },
  {
    id: 'seller',
    title: 'Селлерам',
    text: 'Сотрудничество с поставщиками товаров по формату работы FBO: мы храним, продаём и доставляем ваши товары.',
    action: 'Подробнее',
    href: `${DNS}/help/partners/`,
  },
]

export const footerColumns = {
  company: [
    'О компании', 'Новости', 'Партнерам', 'Вакансии',
    'Политика компании в отношении обработки персональных данных',
    'Персональные данные', 'Правила продаж',
    'Правила применения рекомендательных технологий', 'Сервисные центры',
  ],
  buyers: [
    'Как оформить заказ', 'Способы оплаты', 'Кредиты', 'Доставка',
    'Статус заказа', 'Обмен, возврат, гарантия', 'Проверка статуса ремонта',
  ],
  business: [
    'Юридическим лицам', 'Проверка счёта', 'Корпоративные отделы',
    'Подарочные карты', 'Бонусная программа', 'Помощь', 'Обратная связь',
  ],
}

export const appStores = [
  { name: 'Google Play', href: 'https://play.google.com/store/apps/details?id=ru.dns.shop.android' },
  { name: 'App Store', href: 'https://apps.apple.com/ru/app/dns/id993452556' },
  { name: 'AppGallery', href: 'https://appgallery.huawei.com/app/C101500415' },
  { name: 'RuStore', href: 'https://www.rustore.ru/catalog/app/ru.dns.shop.android' },
]

export const money = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
export const dnsUrl = DNS
