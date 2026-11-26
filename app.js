/* Прототип «Создание отзыва»: интерактив поверх разметки (без зависимостей) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const WEIGHTS = { rating: 20, pros: 10, cons: 10, comment: 10, photo: 20, video: 30 };
  const state = { rating: false, pros: false, cons: false, comment: false, photo: false, video: false };
  const CIRC = 2 * Math.PI * 31.3225; // длина окружности кольца прогресса

  const form = $('#review-form');
  const errorBox = $('#form-error');

  /* ---------- Прогресс / бонусы ---------- */
  const total = () => Object.entries(state).reduce((sum, [k, v]) => sum + (v ? WEIGHTS[k] : 0), 0);

  function render() {
    const t = total();
    $$('[data-ring]').forEach((ring) => {
      $('.ring__bar', ring).style.strokeDasharray = `${(CIRC * t) / 100} ${CIRC}`;
      $('.ring__value', ring).textContent = `${t}%`;
    });
    $$('.bonus__list li').forEach((li) => li.classList.toggle('is-done', !!state[li.dataset.item]));
  }

  /* ---------- Срок использования ---------- */
  const usageBtn = $('#usage-btn');
  const usageMenu = $('#usage-menu');
  const usageValue = $('#usage-value');

  const toggleUsage = (open) => {
    usageMenu.hidden = !open;
    usageBtn.setAttribute('aria-expanded', String(open));
  };
  usageBtn.addEventListener('click', () => toggleUsage(usageMenu.hidden));
  usageMenu.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    $$('li', usageMenu).forEach((x) => x.removeAttribute('aria-selected'));
    li.setAttribute('aria-selected', 'true');
    usageValue.textContent = li.textContent;
    toggleUsage(false);
  });
  usageMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.target.click(); }
  });

  /* ---------- Подсказка «Что написать?» ---------- */
  const hintBtn = $('#hint-btn');
  const hintPop = $('#hint-pop');
  hintBtn.addEventListener('click', () => {
    hintPop.hidden = !hintPop.hidden;
    hintBtn.setAttribute('aria-expanded', String(!hintPop.hidden));
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.usage')) toggleUsage(false);
    if (!e.target.closest('.hint')) { hintPop.hidden = true; hintBtn.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleUsage(false);
      hintPop.hidden = true;
      hintBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Звёздные оценки ---------- */
  const ratings = {};
  $$('.rating-card').forEach((card) => {
    const key = card.dataset.rating;
    const box = $('.stars', card);
    const labelText = $('.rating-card__head span', card).textContent;
    ratings[key] = 0;
    const stars = [1, 2, 3, 4, 5].map((n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'star';
      b.setAttribute('aria-label', `${labelText}: ${n} из 5`);
      b.innerHTML = '<img src="assets/imgSocialStar.svg" alt="" width="36" height="36">';
      b.addEventListener('mouseenter', () => paint(n));
      b.addEventListener('focus', () => paint(n));
      b.addEventListener('click', () => {
        ratings[key] = n;
        paint(n);
        if (key === 'overall') {
          state.rating = true;
          $$('.rating-card.is-locked').forEach((c) => c.classList.remove('is-locked'));
          render();
        }
      });
      box.appendChild(b);
      return b;
    });
    const paint = (n) => stars.forEach((s, i) => s.classList.toggle('is-on', i < n));
    box.addEventListener('mouseleave', () => paint(ratings[key]));
    box.addEventListener('focusout', () => paint(ratings[key]));
  });

  /* ---------- Текстовые поля ---------- */
  $$('.field').forEach((field) => {
    const ta = $('textarea', field);
    const key = field.dataset.field;
    const sync = () => {
      field.classList.toggle('has-value', ta.value.length > 0);
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
      state[key] = ta.value.trim().length > 0;
      render();
    };
    ta.addEventListener('input', sync);
  });

  /* ---------- Фото и видео ---------- */
  const media = {};
  $$('.media').forEach((m) => {
    const kind = m.dataset.media;
    const max = Number(m.dataset.max);
    const prefix = kind === 'photo' ? 'image/' : 'video/';
    const list = $('.previews', m);
    const counter = $('[data-count]', m);
    const items = [];
    media[kind] = items;

    const draw = () => {
      list.innerHTML = '';
      items.forEach((it, i) => {
        const li = document.createElement('li');
        li.className = 'preview';
        if (kind === 'photo') {
          const img = document.createElement('img');
          img.src = it.url; img.alt = it.file.name;
          li.appendChild(img);
        } else {
          const v = document.createElement('video');
          v.src = it.url; v.muted = true; v.preload = 'metadata';
          li.appendChild(v);
        }
        const rm = document.createElement('button');
        rm.type = 'button'; rm.textContent = '×'; rm.setAttribute('aria-label', `Удалить ${it.file.name}`);
        rm.addEventListener('click', () => { URL.revokeObjectURL(it.url); items.splice(i, 1); draw(); });
        li.appendChild(rm);
        list.appendChild(li);
      });
      if (counter) counter.textContent = `${items.length}/${max}`;
      state[kind] = items.length > 0;
      render();
    };

    const add = (files) => {
      [...files].filter((f) => f.type.startsWith(prefix)).forEach((file) => {
        if (items.length < max) items.push({ file, url: URL.createObjectURL(file) });
      });
      draw();
    };

    $$('input[type=file]', m).forEach((inp) => inp.addEventListener('change', () => { add(inp.files); inp.value = ''; }));

    const dz = $('.dropzone', m);
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('is-over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('is-over'));
    dz.addEventListener('drop', (e) => { e.preventDefault(); dz.classList.remove('is-over'); add(e.dataTransfer.files); });
    dz.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('input', dz).click(); }
    });

    m._reset = () => { items.forEach((i) => URL.revokeObjectURL(i.url)); items.length = 0; draw(); };
  });

  /* ---------- Отправка ---------- */
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
  const showError = (msg, target) => {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    if (!state.rating) return showError('Поставьте общую оценку товару — без неё отзыв не отправить.', $('#ratings'));
    if (isMobile() && !$('#privacy').checked) return showError('Подтвердите согласие на обработку персональных данных.', $('.privacy'));

    const t = total();
    $('#done-value').textContent = `${t}%`;
    $('#done-text').textContent = `Отзыв заполнен на ${t}%. После модерации он появится на странице товара.`;
    $('.done .ring__bar').style.strokeDasharray = `${(CIRC * t) / 100} ${CIRC}`;
    $('#done').hidden = false;
    form.classList.add('is-done');
    $('#title').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#again').addEventListener('click', () => {
    form.reset();
    Object.keys(state).forEach((k) => (state[k] = false));
    Object.keys(ratings).forEach((k) => (ratings[k] = 0));
    $$('.star').forEach((s) => s.classList.remove('is-on'));
    $$('.rating-card').forEach((c) => c.classList.toggle('is-locked', c.dataset.rating !== 'overall'));
    $$('.field').forEach((f) => { f.classList.remove('has-value'); $('textarea', f).style.height = ''; });
    $$('.media').forEach((m) => m._reset());
    $$('li', usageMenu).forEach((li, i) => (i === 0 ? li.setAttribute('aria-selected', 'true') : li.removeAttribute('aria-selected')));
    usageValue.textContent = $('li', usageMenu).textContent;
    $('#done').hidden = true;
    form.classList.remove('is-done');
    render();
  });

  render();
})();
