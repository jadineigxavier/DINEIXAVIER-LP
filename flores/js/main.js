/**
 * CHROMA ATELIER - JAVASCRIPT PRINCIPAL
 * Funcionalidades interativas da página de produto:
 * - Seletor de Variações / Kits com atualização de preço
 * - Galeria de imagens dinâmica
 * - Carrinho de Compras Drawer funcional (com persistência local)
 * - Sistema de Cupom de Desconto (ex: ARTE10)
 * - Simulador de Frete com cálculo visual
 * - Cronômetro regressivo de oferta
 * - FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DADOS DOS KITS (VARIAÇÕES DO PRODUTO)
  // =========================================================================
  const productKits = {
    essencial: {
      id: 'kit-essencial',
      name: 'Kit Essencial (24 Cores + 3 Pincéis)',
      subtitle: '24 pastilhas de aquarela profissional + 3 pincéis sintéticos',
      price: 189.90,
      oldPrice: 249.90,
      discountPercent: '24% OFF',
      installments: '6x de R$ 31,65 sem juros',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
      badge: 'Ideal para Iniciantes'
    },
    master: {
      id: 'kit-master',
      name: 'Kit Master Studio (48 Cores + 6 Pincéis + Cavalete)',
      subtitle: '48 pigmentos puros, 6 pincéis de precisão e mini cavalete de mesa',
      price: 289.90,
      oldPrice: 399.90,
      discountPercent: '28% OFF',
      installments: '10x de R$ 28,99 sem juros',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
      badge: 'Mais Popular 🔥'
    },
    colecionador: {
      id: 'kit-colecionador',
      name: 'Edição Colecionador (72 Cores + Estojo Madeira Nobre)',
      subtitle: '72 cores premium em estojo de nogueira maciça + bloco algodão 300g/m²',
      price: 429.90,
      oldPrice: 589.90,
      discountPercent: '27% OFF',
      installments: '12x de R$ 35,82 sem juros',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
      badge: 'Edição Limitada'
    }
  };

  let currentSelectedKit = 'master'; // Kit padrão selecionado
  let productQuantity = 1;

  // Formatação de moeda BRL
  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // =========================================================================
  // 2. SELEÇÃO DE KITS / VARIAÇÕES
  // =========================================================================
  const kitOptions = document.querySelectorAll('.kit-option');
  const priceCurrentEl = document.getElementById('priceCurrent');
  const priceOldEl = document.getElementById('priceOld');
  const discountTagEl = document.getElementById('discountTag');
  const priceInstallmentEl = document.getElementById('priceInstallment');
  const mainImageEl = document.getElementById('mainImage');
  const mobilePriceValEl = document.getElementById('mobilePriceVal');

  function updateKitSelection(kitKey) {
    const kit = productKits[kitKey];
    if (!kit) return;

    currentSelectedKit = kitKey;

    // Atualiza classes ativas
    kitOptions.forEach(opt => {
      if (opt.dataset.kit === kitKey) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    // Atualiza valores visuais
    if (priceCurrentEl) priceCurrentEl.textContent = formatCurrency(kit.price);
    if (priceOldEl) priceOldEl.textContent = formatCurrency(kit.oldPrice);
    if (discountTagEl) discountTagEl.textContent = kit.discountPercent;
    if (priceInstallmentEl) {
      priceInstallmentEl.innerHTML = `ou até <strong>${kit.installments}</strong> no cartão`;
    }
    if (mobilePriceValEl) {
      mobilePriceValEl.textContent = formatCurrency(kit.price);
    }
  }

  kitOptions.forEach(option => {
    option.addEventListener('click', () => {
      const kitKey = option.dataset.kit;
      updateKitSelection(kitKey);
    });
  });

  // =========================================================================
  // 3. GALERIA DE FOTOS INTERATIVA
  // =========================================================================
  const thumbnails = document.querySelectorAll('.thumb-item');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.dataset.full;
      if (mainImageEl && newSrc) {
        mainImageEl.style.opacity = '0.4';
        setTimeout(() => {
          mainImageEl.src = newSrc;
          mainImageEl.style.opacity = '1';
        }, 150);
      }
    });
  });

  // =========================================================================
  // 4. CONTROLE DE QUANTIDADE
  // =========================================================================
  const qtyMinusBtn = document.getElementById('qtyMinus');
  const qtyPlusBtn = document.getElementById('qtyPlus');
  const qtyInput = document.getElementById('qtyInput');

  if (qtyMinusBtn && qtyPlusBtn && qtyInput) {
    qtyMinusBtn.addEventListener('click', () => {
      if (productQuantity > 1) {
        productQuantity--;
        qtyInput.value = productQuantity;
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      if (productQuantity < 10) {
        productQuantity++;
        qtyInput.value = productQuantity;
      }
    });

    qtyInput.addEventListener('change', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 10) val = 10;
      productQuantity = val;
      qtyInput.value = productQuantity;
    });
  }

  // =========================================================================
  // 5. CRONÔMETRO REGRESSIVO DA OFERTA (FLASH SALE)
  // =========================================================================
  let countdownSeconds = 5 * 3600 + 43 * 60 + 28; // 5h 43m 28s
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  function updateCountdown() {
    if (countdownSeconds <= 0) return;
    countdownSeconds--;

    const h = Math.floor(countdownSeconds / 3600);
    const m = Math.floor((countdownSeconds % 3600) / 60);
    const s = countdownSeconds % 60;

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 6. SIMULADOR DE FRETE (CEP)
  // =========================================================================
  const cepInput = document.getElementById('cepInput');
  const cepSubmitBtn = document.getElementById('cepSubmitBtn');
  const shippingResults = document.getElementById('shippingResults');

  if (cepInput) {
    // Máscara 00000-000
    cepInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 8) val = val.substring(0, 8);
      if (val.length > 5) {
        val = val.replace(/^(\d{5})(\d)/, '$1-$2');
      }
      e.target.value = val;
    });

    if (cepSubmitBtn) {
      cepSubmitBtn.addEventListener('click', () => {
        const rawCep = cepInput.value.replace(/\D/g, '');
        if (rawCep.length !== 8) {
          alert('Por favor, informe um CEP válido com 8 dígitos.');
          return;
        }

        cepSubmitBtn.textContent = 'Calculando...';
        cepSubmitBtn.disabled = true;

        setTimeout(() => {
          cepSubmitBtn.textContent = 'Calcular';
          cepSubmitBtn.disabled = false;
          if (shippingResults) {
            shippingResults.style.display = 'block';
          }
        }, 600);
      });
    }
  }

  // =========================================================================
  // 7. CARRINHO DE COMPRAS (DRAWER & ESTADO)
  // =========================================================================
  let cart = [];
  let appliedCoupon = null;

  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartEmptyMsg = document.getElementById('cartEmpty');
  const cartBadge = document.getElementById('cartBadge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartDiscountVal = document.getElementById('cartDiscountVal');
  const cartTotalEl = document.getElementById('cartTotal');
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const btnCheckout = document.getElementById('btnCheckout');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');

  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Adicionar ao Carrinho
  function addToCart(kitKey, qty = 1) {
    const kit = productKits[kitKey];
    if (!kit) return;

    const existingIndex = cart.findIndex(item => item.kitKey === kitKey);
    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        kitKey: kitKey,
        name: kit.name,
        price: kit.price,
        image: kit.image,
        qty: qty
      });
    }

    renderCart();
    openCart();
  }

  const btnAddToCart = document.getElementById('btnAddToCart');
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      addToCart(currentSelectedKit, productQuantity);
    });
  }

  const btnBuyNow = document.getElementById('btnBuyNow');
  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      addToCart(currentSelectedKit, productQuantity);
    });
  }

  const mobileBtnBuy = document.getElementById('mobileBtnBuy');
  if (mobileBtnBuy) {
    mobileBtnBuy.addEventListener('click', () => {
      addToCart(currentSelectedKit, 1);
    });
  }

  // Renderização dos Itens no Carrinho
  function renderCart() {
    if (!cartItemsContainer) return;

    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalQty;
      cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      if (cartEmptyMsg) cartEmptyMsg.style.display = 'block';
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(0);
      if (cartTotalEl) cartTotalEl.textContent = formatCurrency(0);
      if (cartDiscountRow) cartDiscountRow.style.display = 'none';
      if (btnCheckout) btnCheckout.disabled = true;
      return;
    }

    if (cartEmptyMsg) cartEmptyMsg.style.display = 'none';
    if (btnCheckout) btnCheckout.disabled = false;

    let subtotal = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      const itemSubtotal = item.price * item.qty;
      subtotal += itemSubtotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="cart-item-price">${formatCurrency(item.price)} cada</p>
          <div class="cart-item-qty">
            <button class="cart-qty-btn" data-action="decrease" data-index="${index}">-</button>
            <span style="font-size:0.85rem; font-weight:700; min-width:18px; text-align:center;">${item.qty}</span>
            <button class="cart-qty-btn" data-action="increase" data-index="${index}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-index="${index}" title="Remover item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    // Eventos de clique nos botões internos do carrinho
    cartItemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const action = btn.dataset.action;
        if (action === 'increase') {
          cart[idx].qty++;
        } else if (action === 'decrease') {
          if (cart[idx].qty > 1) {
            cart[idx].qty--;
          } else {
            cart.splice(idx, 1);
          }
        }
        renderCart();
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        cart.splice(idx, 1);
        renderCart();
      });
    });

    // Cálculos de Total e Desconto
    let discount = 0;
    if (appliedCoupon === 'ARTE10') {
      discount = subtotal * 0.10;
      if (cartDiscountRow) cartDiscountRow.style.display = 'flex';
      if (cartDiscountVal) cartDiscountVal.textContent = `- ${formatCurrency(discount)}`;
    } else {
      if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    }

    const finalTotal = subtotal - discount;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(subtotal);
    if (cartTotalEl) cartTotalEl.textContent = formatCurrency(finalTotal);
  }

  // Cupom de Desconto
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'ARTE10') {
        appliedCoupon = 'ARTE10';
        alert('🎉 Cupom ARTE10 aplicado com sucesso! Você ganhou 10% de desconto.');
        renderCart();
      } else if (code === '') {
        alert('Digite um código de cupom.');
      } else {
        alert('Cupom inválido ou expirado. Tente "ARTE10"');
      }
    });
  }

  // Finalização do Pedido (Checkout Simulado)
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCart();
      if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (closeSuccessModalBtn && checkoutModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      document.body.style.overflow = '';
      // Limpar carrinho
      cart = [];
      appliedCoupon = null;
      if (couponInput) couponInput.value = '';
      renderCart();
    });
  }

  // Inicializa carrinho vazio
  renderCart();

  // =========================================================================
  // 8. FAQ ACCORDION
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros
      faqItems.forEach(other => other.classList.remove('active'));

      // Alterna o atual
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Atualização inicial do seletor
  updateKitSelection('master');
});
