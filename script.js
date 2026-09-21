// ============================================================
// DINEIX — script.js
// Toda a interatividade do site, em JavaScript puro (sem build).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const appShell = document.getElementById('app-shell');

  /* ---------- Scroll suave para seções ---------- */
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    closeMobileNav();
  }
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => scrollToId(btn.dataset.scroll));
  });

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const siteHeader = document.getElementById('site-header');
  const iconMenu = menuToggle.querySelector('.icon-menu');
  const iconX = menuToggle.querySelector('.icon-x');

  function closeMobileNav() {
    mobileNav.hidden = true;
    siteHeader.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    iconMenu.hidden = false;
    iconX.hidden = true;
  }
  function toggleMobileNav() {
    const isOpen = !mobileNav.hidden;
    if (isOpen) {
      closeMobileNav();
    } else {
      mobileNav.hidden = false;
      siteHeader.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      iconMenu.hidden = true;
      iconX.hidden = false;
    }
  }
  menuToggle.addEventListener('click', toggleMobileNav);

  /* ---------- Tema claro/escuro ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  themeToggle.addEventListener('click', () => {
    const isDark = appShell.classList.toggle('theme-dark');
    themeLabel.textContent = isDark ? 'Claro' : 'Canvas';
    themeToggle.setAttribute('aria-label', isDark ? 'Usar tema claro' : 'Usar tema escuro');
  });

  /* ---------- Reveal ao rolar ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Toasts (substitui a lib "sonner") ---------- */
  const toastViewport = document.getElementById('toast-viewport');
  function showToast(title, { description = '', variant = 'default' } = {}) {
    const toast = document.createElement('div');
    toast.className = `toast ${variant === 'success' ? 'toast-success' : ''}`;
    toast.innerHTML = `<strong>${title}</strong>${description ? `<span>${description}</span>` : ''}`;
    toastViewport.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  /* ---------- Filtro do portfólio ---------- */
  const categoryButtons = document.querySelectorAll('.category-tabs button');
  const portfolioCards = document.querySelectorAll('.portfolio-card-wrap');
  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      const category = btn.dataset.category;
      portfolioCards.forEach((card) => {
        const show = category === 'all' || card.dataset.category === category;
        card.hidden = !show;
      });
    });
  });
  document.getElementById('portfolio-all-link').addEventListener('click', () => {
    showToast('Mais referências em breve', { description: 'Enquanto isso, explore os projetos abaixo.' });
  });

  /* ---------- Lightbox: imagem do projeto ---------- */
  const imageOverlay = document.getElementById('image-dialog-overlay');
  const imageDialogImg = document.getElementById('image-dialog-image');

  function openDialog(overlay) {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeDialog(overlay) {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeDialog(document.getElementById(btn.dataset.close)));
  });
  document.querySelectorAll('.dialog-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeDialog(overlay);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.dialog-overlay').forEach((overlay) => {
        if (!overlay.hidden) closeDialog(overlay);
      });
    }
  });

  document.querySelectorAll('.portfolio-card').forEach((card) => {
    card.addEventListener('click', () => {
      const d = card.dataset;
      if (d.link) {
        window.open(d.link, '_blank', 'noopener');
        return;
      }
      imageDialogImg.src = d.image;
      imageDialogImg.alt = d.alt;
      openDialog(imageOverlay);
    });
  });

  document.querySelectorAll('.service-link').forEach((btn) => btn.addEventListener('click', () => scrollToId('contato')));


  /* ---------- Formulário de contato ---------- */
  const contactForm = document.getElementById('contact-form');
  const WHATSAPP_NUMBER = '5532984180744';
  const CONTACT_EMAIL = 'dineixavierr@gmail.com';

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    const fullMessage = `Olá, meu nome é ${name} (${email}).\n\n${message}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Novo contato pelo site — ' + name)}&body=${encodeURIComponent(fullMessage)}`;

    window.open(whatsappUrl, '_blank', 'noopener');
    window.location.href = mailtoUrl;

    showToast('Quase lá!', { description: 'Abrimos o WhatsApp com sua mensagem pronta — o seu e-mail também deve abrir para você enviar por lá.', variant: 'success' });
    contactForm.reset();
  });

});
