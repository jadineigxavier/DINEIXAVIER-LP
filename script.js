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

  /* ---------- Modal: detalhe do projeto ---------- */
  const projectOverlay = document.getElementById('project-dialog-overlay');
  const projectKicker = document.getElementById('project-dialog-kicker');
  const projectTitle = document.getElementById('project-dialog-title');
  const projectDescription = document.getElementById('project-dialog-description');
  const projectImage = document.getElementById('project-dialog-image');
  const projectOutcome = document.getElementById('project-dialog-outcome');
  const projectCta = document.getElementById('project-dialog-cta');

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
      projectKicker.textContent = `${d.categoryLabel} · ${d.number}`;
      projectTitle.textContent = d.title;
      projectDescription.textContent = d.summary;
      projectImage.src = d.image;
      projectImage.alt = d.alt;
      projectOutcome.textContent = d.outcome;
      openDialog(projectOverlay);
    });
  });
  projectCta.addEventListener('click', () => {
    closeDialog(projectOverlay);
    openGuidedExperience();
  });

  /* ---------- Modal: experiência guiada ---------- */
  const guidedOverlay = document.getElementById('guided-dialog-overlay');
  const guidedStepLabel = document.getElementById('guided-step-label');
  const guidedStepCount = document.getElementById('guided-step-count');
  const guidedQuestion = document.getElementById('guided-question');
  const guidedOptionsWrap = document.getElementById('guided-options');
  const guidedProgressBar = document.getElementById('guided-progress-bar');

  const guidedSteps = [
    { eyebrow: '01 / contexto', title: 'Que tipo de presença você quer criar?', options: ['Uma marca mais clara', 'Um produto digital', 'Uma campanha com impacto'] },
    { eyebrow: '02 / momento', title: 'Onde o projeto está hoje?', options: ['Ainda é uma ideia', 'Já existe, mas precisa de direção', 'Quero evoluir o que já funciona'] },
    { eyebrow: '03 / próximo passo', title: 'Qual seria uma boa conversa?', options: ['Receber uma recomendação', 'Ver referências parecidas', 'Pedir um orçamento inicial'] },
  ];
  let guidedStep = 0;

  function renderGuidedStep() {
    const step = guidedSteps[guidedStep];
    guidedStepLabel.textContent = step.eyebrow;
    guidedStepCount.textContent = `${guidedStep + 1} / ${guidedSteps.length}`;
    guidedQuestion.textContent = step.title;
    guidedProgressBar.style.width = `${((guidedStep + 1) / guidedSteps.length) * 100}%`;
    guidedOptionsWrap.innerHTML = '';
    step.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.innerHTML = `<span>0${index + 1}</span>${option}<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
      btn.addEventListener('click', () => chooseGuidedOption(option));
      guidedOptionsWrap.appendChild(btn);
    });
  }

  function openGuidedExperience() {
    guidedStep = 0;
    renderGuidedStep();
    openDialog(guidedOverlay);
  }

  function chooseGuidedOption(option) {
    if (guidedStep < guidedSteps.length - 1) {
      guidedStep += 1;
      renderGuidedStep();
      showToast(`${option} anotado`, { description: 'Vamos deixar a próxima pergunta ainda mais precisa.' });
      return;
    }
    closeDialog(guidedOverlay);
    showToast('Rota definida', { description: 'Seu ponto de partida está pronto. Vamos conversar sobre ele?', variant: 'success' });
    setTimeout(() => scrollToId('contato'), 120);
  }

  ['nav-cta-guided', 'hero-cta-guided', 'ecosystem-cta', 'workspace-calculate-btn'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openGuidedExperience);
  });
  document.querySelectorAll('.service-link').forEach((btn) => btn.addEventListener('click', openGuidedExperience));

  /* ---------- Workspace / calculadora ---------- */
  const areaSlider = document.getElementById('workspace-slider-area');
  const areaValue = document.getElementById('workspace-area-value');
  const styleOptions = document.getElementById('workspace-style-options');
  const estimateEl = document.getElementById('workspace-estimate');
  let workspaceStyle = 'Minimalista';

  const currencyFormatter = new Intl.NumberFormat('pt-BR');

  function updateEstimate() {
    const area = Number(areaSlider.value);
    const bonus = workspaceStyle === 'Expressivo' ? 1200 : workspaceStyle === 'Estratégico' ? 1800 : 0;
    const estimate = Math.round((area * 17.5 + bonus) / 100) * 100;
    areaValue.textContent = `${area} m²`;
    estimateEl.textContent = `R$ ${currencyFormatter.format(estimate)}`;
  }
  areaSlider.addEventListener('input', updateEstimate);
  styleOptions.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      styleOptions.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      workspaceStyle = btn.dataset.style;
      updateEstimate();
    });
  });
  updateEstimate();

  /* ---------- Formulário de contato ---------- */
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Briefing recebido', { description: 'A próxima conversa começa por aqui — retorno em até 1 dia útil.', variant: 'success' });
    contactForm.reset();
  });

});
