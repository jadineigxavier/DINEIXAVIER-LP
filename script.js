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

  /* ---------- Hero: animação de fundo (constelação em canvas) ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroSection = document.getElementById('inicio');
  const heroCanvas = document.getElementById('hero-canvas');

  if (heroCanvas && heroSection && !prefersReducedMotion) {
    const ctx = heroCanvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;
    let particles = [];
    let pointer = { x: null, y: null };
    let rafId = null;
    let isRunning = false;

    function accentRGB() {
      // Acompanha o tom "--accent" do tema claro/escuro definido em styles.css
      return appShell.classList.contains('theme-dark') ? '195, 166, 126' : '140, 115, 85';
    }

    function resizeCanvas() {
      const rect = heroCanvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      heroCanvas.width = Math.round(width * dpr);
      heroCanvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.max(18, Math.min(48, Math.round((width * height) / 26000)));
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.5 + 0.6,
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);
      const rgb = accentRGB();
      const linkDist = Math.min(150, width * 0.13);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        if (pointer.x !== null) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0.001) {
            const force = ((130 - dist) / 130) * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx *= 0.995;
        p.vy *= 0.995;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < linkDist) {
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / linkDist) * 0.32})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(${rgb}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(drawFrame);
    }

    function startAnimation() {
      if (isRunning) return;
      isRunning = true;
      rafId = requestAnimationFrame(drawFrame);
    }
    function stopAnimation() {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
    }

    resizeCanvas();

    const heroVisibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? startAnimation() : stopAnimation()));
    }, { threshold: 0.05 });
    heroVisibilityObserver.observe(heroSection);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        stopAnimation();
        resizeCanvas();
        startAnimation();
      }, 150);
    });

    heroSection.addEventListener('mousemove', (event) => {
      const rect = heroCanvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
      pointer.x = null;
      pointer.y = null;
    });
  }

  /* ---------- Hero: título com revelação palavra a palavra ---------- */
  const heroHeadline = document.querySelector('.hero-copy h1');
  if (heroHeadline) {
    (function wrapWords(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/).filter((part) => part.length);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const mask = document.createElement('span');
              mask.className = 'word-mask';
              const inner = document.createElement('span');
              inner.className = 'word-inner';
              inner.textContent = part;
              mask.appendChild(inner);
              frag.appendChild(mask);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapWords(child);
        }
      });
    })(heroHeadline);

    heroHeadline.querySelectorAll('.word-inner').forEach((el, index) => {
      el.style.transitionDelay = `${index * 45}ms`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => heroHeadline.classList.add('is-revealed'));
    });
  }

  /* ---------- Hero: leve tilt 3D na imagem ao mover o mouse ---------- */
  const heroVisual = document.querySelector('.hero-visual');
  const visualFrame = document.querySelector('.hero-visual .visual-frame');
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (heroVisual && visualFrame && !prefersReducedMotion && hasFinePointer) {
    heroVisual.addEventListener('mousemove', (event) => {
      const rect = visualFrame.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      visualFrame.style.transform = `perspective(1200px) rotateX(${(py * -7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      visualFrame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }

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
