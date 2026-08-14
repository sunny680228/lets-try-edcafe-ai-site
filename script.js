const tabs = [...document.querySelectorAll('.nav-tab')];
const pages = [...document.querySelectorAll('.page')];
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');

function showPage(id, updateHash = true) {
  const target = document.getElementById(id) || document.getElementById('home');
  pages.forEach(page => {
    const active = page === target;
    page.hidden = !active;
    page.classList.toggle('active', active);
  });
  tabs.forEach(tab => {
    const active = tab.dataset.page === target.id;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  if (updateHash) history.replaceState(null, '', `#${target.id}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  target.focus({ preventScroll: true });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => showPage(tab.dataset.page));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const index = tabs.indexOf(tab);
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    showPage(tabs[next].dataset.page);
  });
});

document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.go)));
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

const dialog = document.getElementById('image-dialog');
const dialogImage = dialog.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
  dialogImage.src = button.dataset.lightbox;
  dialog.showModal();
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

document.querySelectorAll('.copy-analysis-prompt').forEach(button => button.addEventListener('click', async () => {
  const prompt = button.dataset.prompt;
  const label = button.querySelector('.copy-label');
  try {
    await navigator.clipboard.writeText(prompt);
    label.textContent = '已複製，可直接貼上 ✓';
    button.classList.add('copied');
  } catch {
    label.textContent = '請長按提示詞複製';
  }
  setTimeout(() => {
    label.textContent = '一鍵複製';
    button.classList.remove('copied');
  }, 1800);
}));

showPage(location.hash.slice(1) || 'home', false);
