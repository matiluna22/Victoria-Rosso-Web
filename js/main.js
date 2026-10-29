/**
 * ==========================================================================
 * VICTORIA ROSSO - BIÓLOGA & MANTIS EXPEDICIONES
 * Script Principal de Interacciones y Experiencia de Usuario
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroActions();
  initExperienceTabs();
  initGalleryAndLightbox();
  initFaqTabs();
  initFaqAccordion();
  initContactForm();
  initCardTriggers();
  initNewsSlider();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MENU MÓVIL
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header blur al scrollear
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Toggle menú hamburguesa
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Cerrar al clickear cualquier link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al clickear afuera
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active Link Observer
  const sections = document.querySelectorAll('main > section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));
}

/* --------------------------------------------------------------------------
   2. ACCIONES DEL HERO
   -------------------------------------------------------------------------- */
function initHeroActions() {
  const btnHeroPlan = document.getElementById('btn-hero-plan');
  const btnHeroSafaris = document.getElementById('btn-hero-safaris');
  const tabBtnMantis = document.getElementById('tab-btn-mantis');
  const panelMantis = document.getElementById('panel-mantis');
  const planificarSection = document.getElementById('planificar');

  if (btnHeroSafaris && tabBtnMantis && panelMantis) {
    btnHeroSafaris.addEventListener('click', () => {
      tabBtnMantis.click();
    });
  }

  if (btnHeroPlan && planificarSection) {
    btnHeroPlan.addEventListener('click', (e) => {
      e.preventDefault();
      planificarSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   3. SELECTOR DE PESTAÑAS (TABS)
   -------------------------------------------------------------------------- */
function initExperienceTabs() {
  const tabBtnVoluntariados = document.getElementById('tab-btn-voluntariados');
  const tabBtnMantis = document.getElementById('tab-btn-mantis');
  const panelVoluntariados = document.getElementById('panel-voluntariados');
  const panelMantis = document.getElementById('panel-mantis');

  if (!tabBtnVoluntariados || !tabBtnMantis) return;

  function switchTab(isVoluntariados) {
    if (isVoluntariados) {
      tabBtnVoluntariados.classList.add('active');
      tabBtnVoluntariados.setAttribute('aria-selected', 'true');
      tabBtnMantis.classList.remove('active');
      tabBtnMantis.setAttribute('aria-selected', 'false');

      panelVoluntariados.classList.add('active');
      panelMantis.classList.remove('active');
    } else {
      tabBtnMantis.classList.add('active');
      tabBtnMantis.setAttribute('aria-selected', 'true');
      tabBtnVoluntariados.classList.remove('active');
      tabBtnVoluntariados.setAttribute('aria-selected', 'false');

      panelMantis.classList.add('active');
      panelVoluntariados.classList.remove('active');
    }
  }

  tabBtnVoluntariados.addEventListener('click', () => switchTab(true));
  tabBtnMantis.addEventListener('click', () => switchTab(false));

  // Accesibilidad por teclado
  tabBtnVoluntariados.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      tabBtnMantis.focus();
      switchTab(false);
    }
  });

  tabBtnMantis.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      tabBtnVoluntariados.focus();
      switchTab(true);
    }
  });
}

/* --------------------------------------------------------------------------
   4. GALERÍA Y LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentIndex = 0;
  let visibleItems = [...galleryItems];

  // Filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      visibleItems = [];
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          item.style.display = 'block';
          visibleItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Abrir Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      currentIndex = visibleItems.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function updateLightboxContent() {
    if (visibleItems.length === 0) return;
    const item = visibleItems[currentIndex];
    const src = item.getAttribute('data-src');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
  }

  function showNext() {
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxContent();
  }

  function showPrev() {
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  // Cerrar al clickear fuera del contenedor
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* --------------------------------------------------------------------------
   5. BOTONES DE TARJETAS DIRECTOS A FORMULARIO
   -------------------------------------------------------------------------- */
function initCardTriggers() {
  const triggers = document.querySelectorAll('.trigger-contact-select');
  const experienceSelect = document.getElementById('experience-type');
  const destinationSelect = document.getElementById('preferred-destination');
  const contactSection = document.getElementById('contacto');
  const nameInput = document.getElementById('user-name');

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');

      if (choice.includes('Voluntariado')) {
        if (experienceSelect) experienceSelect.value = 'Voluntariado con Fauna Silvestre';
        if (choice.includes('HESC') && destinationSelect) {
          destinationSelect.value = 'HESC (Rinocerontes y Guepardos - Kruger)';
        } else if (choice.includes('SANCCOB') && destinationSelect) {
          destinationSelect.value = 'SANCCOB (Pingüinos Africanos - Cape Town)';
        } else if (choice.includes('Daktari') && destinationSelect) {
          destinationSelect.value = 'Daktari Bush School (Orfanato de Fauna)';
        } else if (choice.includes('Nourish') && destinationSelect) {
          destinationSelect.value = 'Nourish Eco Village (Comunidad Sustentable)';
        }
      } else if (choice.includes('Safari') || choice.includes('Mantis')) {
        if (experienceSelect) experienceSelect.value = 'Safari All-Inclusive Mantis (Lujo & Ecoturismo)';
        if (choice.includes('Kruger') && destinationSelect) {
          destinationSelect.value = 'Parque Nacional Kruger (Lodges Mantis All-Inclusive)';
        } else if (choice.includes('Cape Town') && destinationSelect) {
          destinationSelect.value = 'Cape Town & Garden Route (Mantis Collection)';
        } else if (choice.includes('Botlierskop') && destinationSelect) {
          destinationSelect.value = 'Cape Town & Garden Route (Mantis Collection)';
        }
      }

      // Desplazar al formulario
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 500);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. FAQ ACORDEÓN
   -------------------------------------------------------------------------- */
function initFaqTabs() {
  const tabBtnConservacion = document.getElementById('faq-tab-btn-conservacion');
  const tabBtnMantis = document.getElementById('faq-tab-btn-mantis');
  const panelConservacion = document.getElementById('faq-panel-conservacion');
  const panelMantis = document.getElementById('faq-panel-mantis');

  if (!tabBtnConservacion || !tabBtnMantis || !panelConservacion || !panelMantis) return;

  function switchFaqTab(isConservacion) {
    if (isConservacion) {
      tabBtnConservacion.classList.add('active');
      tabBtnConservacion.setAttribute('aria-selected', 'true');
      tabBtnMantis.classList.remove('active');
      tabBtnMantis.setAttribute('aria-selected', 'false');

      panelConservacion.classList.add('active');
      panelMantis.classList.remove('active');
    } else {
      tabBtnMantis.classList.add('active');
      tabBtnMantis.setAttribute('aria-selected', 'true');
      tabBtnConservacion.classList.remove('active');
      tabBtnConservacion.setAttribute('aria-selected', 'false');

      panelMantis.classList.add('active');
      panelConservacion.classList.remove('active');
    }

    // Recalcular altura del acordeón activo en la pestaña visible
    const activePanel = isConservacion ? panelConservacion : panelMantis;
    const activeFaq = activePanel.querySelector('.faq-item.active');
    if (activeFaq) {
      const answer = activeFaq.querySelector('.faq-answer');
      if (answer) {
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    }
  }

  tabBtnConservacion.addEventListener('click', () => switchFaqTab(true));
  tabBtnMantis.addEventListener('click', () => switchFaqTab(false));
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const container = item.closest('.faq-accordion') || document;

      // Cerrar otros acordeones dentro del mismo panel/acordeón
      container.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherTrigger = otherItem.querySelector('.faq-trigger');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. FORMULARIO DE CONTACTO & GENERADOR DE MENSAJE A WHATSAPP
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('experience-form');
  const btnEmailFallback = document.getElementById('btn-email-fallback');
  const toast = document.getElementById('toast-msg');
  const toastText = document.getElementById('toast-text');

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  function getFormData() {
    const name = document.getElementById('user-name')?.value.trim() || '';
    const email = document.getElementById('user-email')?.value.trim() || '';
    const phone = document.getElementById('user-phone')?.value.trim() || '';
    const expType = document.getElementById('experience-type')?.value || 'A definir';
    const dest = document.getElementById('preferred-destination')?.value || 'A coordinar';
    const dates = document.getElementById('travel-date')?.value.trim() || 'A coordinar';
    const message = document.getElementById('user-message')?.value.trim() || 'Sin detalles adicionales';

    return { name, email, phone, expType, dest, dates, message };
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const { name, email, phone, expType, dest, dates, message } = getFormData();

      if (!name || !email || !phone) {
        showToast('Por favor completá los campos obligatorios (*)');
        return;
      }

      // Crear mensaje para WhatsApp
      const waText = 
`Hola Vicky! 👋 Te contacto desde tu sitio web.
🌿 Mi nombre es: ${name}
📧 Email: ${email}
📱 Teléfono/WhatsApp: ${phone}
✈️ Tipo de experiencia: ${expType}
📍 Destino de interés: ${dest}
🗓️ Fecha estimada: ${dates}
💬 Mensaje: ${message}

¡Me gustaría que me asesores para planificar mi viaje a Sudáfrica!`;

      const encodedWaText = encodeURIComponent(waText);
      const waUrl = `https://wa.me/5493425237932?text=${encodedWaText}`;

      showToast('¡Gracias! Abriendo WhatsApp con los datos de tu consulta...');

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);
    });
  }

  // Enviar por Mailto
  if (btnEmailFallback) {
    btnEmailFallback.addEventListener('click', () => {
      const { name, email, phone, expType, dest, dates, message } = getFormData();

      const mailSubject = encodeURIComponent(`Consulta de Viaje a Sudáfrica - ${name || 'Interesado'}`);
      const mailBody = encodeURIComponent(
`Hola Vicky,

Me contacto a través de tu sitio web para consultarte sobre viajes y voluntariados en Sudáfrica:

- Nombre: ${name}
- Email: ${email}
- Teléfono: ${phone}
- Tipo de Experiencia: ${expType}
- Destino de Interés: ${dest}
- Fechas Estimadas: ${dates}
- Mensaje y Consultas:
${message}

Muchas gracias!`
      );

      const mailtoUrl = `mailto:viickyrosso@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      window.location.href = mailtoUrl;
    });
  }
}
//ARREGLAR ANIMACIONES DE SCROLL QUE MOSTRABAN BLANCO LA PAGINA
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(el => scrollObserver.observe(el));
}

/* --------------------------------------------------------------------------
   8. SECCIÓN DE PRENSA & NOTAS: CARRUSEL HORIZONTAL
   -------------------------------------------------------------------------- */
function initNewsSlider() {
  const track = document.getElementById('news-slider-track');
  const viewport = document.getElementById('news-slider-viewport');
  if (!track || !viewport) return;

  const slides = track.querySelectorAll('.news-slide');
  const prevBtn = document.getElementById('news-prev-btn');
  const nextBtn = document.getElementById('news-next-btn');
  const mobilePrevBtn = document.getElementById('news-mobile-prev-btn');
  const mobileNextBtn = document.getElementById('news-mobile-next-btn');
  const dots = document.querySelectorAll('.news-dot');

  if (slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateSlider(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    slides.forEach((slide, idx) => {
      slide.setAttribute('aria-hidden', idx === currentIndex ? 'false' : 'true');
    });
  }

  // Event Listeners para flechas de escritorio
  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
  }

  // Event Listeners para flechas móviles
  if (mobilePrevBtn) {
    mobilePrevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));
  }
  if (mobileNextBtn) {
    mobileNextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
  }

  // Event Listeners para dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (!isNaN(targetIndex)) {
        updateSlider(targetIndex);
      }
    });
  });

  // Soporte de navegación por teclado en el viewport
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateSlider(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateSlider(currentIndex + 1);
    }
  });

  // Soporte de gestos táctiles (Swipe)
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        updateSlider(currentIndex - 1);
      } else {
        updateSlider(currentIndex + 1);
      }
    }
  }, { passive: true });

  // Inicializar estado inicial
  updateSlider(0);
}