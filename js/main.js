// ============================================
// NAVEGACIÓN MÓVIL
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Cambiar icono del menú
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú al hacer click en un enlace
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

let lastScroll = 0;
const navbar = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Agregar sombra al navbar al hacer scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }

    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL PARA ENLACES INTERNOS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar enlaces con solo "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // 80px para el navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// FAQ ACCORDION
// ============================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Cerrar otros items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle el item actual
        item.classList.toggle('active');
    });
});

// ============================================
// ANIMACIÓN DE ENTRADA (INTERSECTION OBSERVER)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a elementos específicos
const animatedElements = document.querySelectorAll(`
    .servicio-card,
    .beneficio,
    .especialidad-item,
    .modalidad-card,
    .precio-card,
    .contacto-card,
    .timeline-item,
    .exp-card,
    .enfoque-item
`);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// BOTÓN VOLVER ARRIBA
// ============================================

// Crear botón si no existe
let scrollTopBtn = document.getElementById('scrollTopBtn');

if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTopBtn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollTopBtn);
    
    // Estilos del botón
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 999;
    `;
}

// Mostrar/ocultar botón según scroll
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

// Funcionalidad del botón
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Efecto hover
scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px)';
    scrollTopBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0)';
    scrollTopBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
});

// ============================================
// LAZY LOADING DE IMÁGENES
// ============================================

if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback para navegadores antiguos
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// ============================================
// VALIDACIÓN BÁSICA DE EDAD EN FORMULARIO
// ============================================

const edadInput = document.getElementById('edad');
if (edadInput) {
    edadInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (value < 1 || value > 120) {
            e.target.setCustomValidity('Por favor ingresa una edad válida');
        } else {
            e.target.setCustomValidity('');
        }
    });
}

// ============================================
// CONTADOR DE CARACTERES PARA TEXTAREA
// ============================================

const mensajeTextarea = document.getElementById('mensaje');
if (mensajeTextarea) {
    const maxLength = 500;
    const counter = document.createElement('div');
    counter.style.cssText = 'text-align: right; color: #6C757D; font-size: 0.9rem; margin-top: 0.5rem;';
    mensajeTextarea.parentNode.appendChild(counter);
    
    const updateCounter = () => {
        const remaining = maxLength - mensajeTextarea.value.length;
        counter.textContent = `${mensajeTextarea.value.length}/${maxLength} caracteres`;
        
        if (remaining < 50) {
            counter.style.color = '#DC3545';
        } else {
            counter.style.color = '#6C757D';
        }
    };
    
    mensajeTextarea.setAttribute('maxlength', maxLength);
    mensajeTextarea.addEventListener('input', updateCounter);
    updateCounter();
}

// ============================================
// PREVENIR ENVÍO MÚLTIPLE DEL FORMULARIO
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    let isSubmitting = false;
    
    contactForm.addEventListener('submit', (e) => {
        if (isSubmitting) {
            e.preventDefault();
            return false;
        }
        
        isSubmitting = true;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        }
        
        // Resetear después de 5 segundos (por si falla)
        setTimeout(() => {
            isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
            }
        }, 5000);
    });
}

// ============================================
// ANIMACIÓN DEL SCROLL INDICATOR
// ============================================

const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('.bienvenida, .contacto-info, .mi-historia, .especialidades-detalle');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ============================================
// CONSOLE MESSAGE (Opcional - para desarrolladores)
// ============================================

console.log('%c¡Hola Desarrollador! 👋', 'color: #4A90A4; font-size: 20px; font-weight: bold;');
console.log('%cSi estás viendo esto, probablemente te interesa el desarrollo web.', 'color: #67B8A6; font-size: 14px;');
console.log('%cEste sitio fue creado con HTML, CSS y JavaScript vanilla.', 'color: #6C757D; font-size: 12px;');

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Sitio web cargado correctamente');
    
    // Agregar clase para indicar que JS está activo
    document.documentElement.classList.add('js-enabled');
});
