// ============================================
// VALIDACIÓN Y MANEJO DEL FORMULARIO DE CONTACTO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // ============================================
    // VALIDACIÓN EN TIEMPO REAL
    // ============================================

    // Validar nombre (solo letras y espacios)
    const nombreInput = document.getElementById('nombre');
    if (nombreInput) {
        nombreInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            
            if (value && !regex.test(value)) {
                e.target.setCustomValidity('Solo se permiten letras y espacios');
                e.target.style.borderColor = '#DC3545';
            } else {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '#4A90A4';
            }
        });
    }

    // Validar email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', (e) => {
            const value = e.target.value;
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (value && !regex.test(value)) {
                e.target.setCustomValidity('Por favor ingresa un email válido');
                e.target.style.borderColor = '#DC3545';
                showFieldError(e.target, 'Email inválido');
            } else {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '#4A90A4';
                removeFieldError(e.target);
            }
        });
    }

    // Validar teléfono (formato mexicano)
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', (e) => {
            // Permitir solo números, espacios, guiones y paréntesis
            let value = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
            e.target.value = value;
            
            // Validar longitud mínima
            if (value.replace(/\D/g, '').length < 10 && value.length > 0) {
                e.target.setCustomValidity('El teléfono debe tener al menos 10 dígitos');
                e.target.style.borderColor = '#DC3545';
            } else {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '#4A90A4';
            }
        });

        // Formatear teléfono automáticamente
        telefonoInput.addEventListener('blur', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length === 10) {
                // Formato: (55) 1234-5678
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            }
        });
    }

    // Validar edad
    const edadInput = document.getElementById('edad');
    if (edadInput) {
        edadInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            
            if (value < 1 || value > 120) {
                e.target.setCustomValidity('La edad debe estar entre 1 y 120 años');
                e.target.style.borderColor = '#DC3545';
            } else {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '#4A90A4';
            }
        });
    }

    // ============================================
    // FUNCIONES AUXILIARES PARA ERRORES
    // ============================================

    function showFieldError(field, message) {
        removeFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #DC3545;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
    }

    function removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // ============================================
    // MANEJO DEL ENVÍO DEL FORMULARIO
    // ============================================

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ocultar mensajes anteriores
        formSuccess.style.display = 'none';
        formError.style.display = 'none';

        // Validar todos los campos
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Obtener el botón de envío
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;

        // Deshabilitar botón y mostrar loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // Recopilar datos del formulario
        const formData = new FormData(contactForm);
        
        try {
            // Enviar formulario usando Fetch API
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Éxito
                formSuccess.style.display = 'flex';
                contactForm.reset();
                
                // Scroll al mensaje de éxito
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Limpiar estilos de validación
                const inputs = contactForm.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.style.borderColor = '';
                });

                // Enviar evento de conversión (Google Analytics, Facebook Pixel, etc.)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form'
                    });
                }

                // Opcional: Redirigir después de 3 segundos
                // setTimeout(() => {
                //     window.location.href = 'gracias.html';
                // }, 3000);

            } else {
                // Error del servidor
                throw new Error('Error en el servidor');
            }

        } catch (error) {
            // Error de red o del servidor
            console.error('Error:', error);
            formError.style.display = 'flex';
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Enviar evento de error (opcional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_error', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Error'
                });
            }

        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });

    // ============================================
    // AUTOGUARDADO EN LOCALSTORAGE (OPCIONAL)
    // ============================================

    const STORAGE_KEY = 'contactFormDraft';

    // Guardar borrador automáticamente
    const saveFormDraft = () => {
        const formData = {
            nombre: document.getElementById('nombre')?.value || '',
            email: document.getElementById('email')?.value || '',
            telefono: document.getElementById('telefono')?.value || '',
            edad: document.getElementById('edad')?.value || '',
            tipoTerapia: document.getElementById('tipo-terapia')?.value || '',
            modalidad: document.getElementById('modalidad')?.value || '',
            mensaje: document.getElementById('mensaje')?.value || ''
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    };

    // Cargar borrador al iniciar
    const loadFormDraft = () => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                
                // Preguntar al usuario si quiere restaurar
                const restore = confirm('¿Deseas restaurar el formulario que estabas llenando?');
                
                if (restore) {
                    if (formData.nombre) document.getElementById('nombre').value = formData.nombre;
                    if (formData.email) document.getElementById('email').value = formData.email;
                    if (formData.telefono) document.getElementById('telefono').value = formData.telefono;
                    if (formData.edad) document.getElementById('edad').value = formData.edad;
                    if (formData.tipoTerapia) document.getElementById('tipo-terapia').value = formData.tipoTerapia;
                    if (formData.modalidad) document.getElementById('modalidad').value = formData.modalidad;
                    if (formData.mensaje) document.getElementById('mensaje').value = formData.mensaje;
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (e) {
                console.error('Error al cargar borrador:', e);
            }
        }
    };

    // Guardar cada 2 segundos mientras el usuario escribe
    let saveTimeout;
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveFormDraft, 2000);
        });
    });

    // Cargar borrador al iniciar
    loadFormDraft();

    // Limpiar borrador al enviar exitosamente
    contactForm.addEventListener('submit', () => {
        setTimeout(() => {
            if (formSuccess.style.display === 'flex') {
                localStorage.removeItem(STORAGE_KEY);
            }
        }, 1000);
    });

    // ============================================
    // PROTECCIÓN ANTI-SPAM (HONEYPOT)
    // ============================================

    // Crear campo honeypot invisible
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px;';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    contactForm.appendChild(honeypot);

    // Validar honeypot antes de enviar
    contactForm.addEventListener('submit', (e) => {
        if (honeypot.value !== '') {
            e.preventDefault();
            console.warn('Posible spam detectado');
            return false;
        }
    });

    // ============================================
    // INDICADOR DE FORTALEZA DE MENSAJE
    // ============================================

    const mensajeTextarea = document.getElementById('mensaje');
    if (mensajeTextarea) {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.style.cssText = `
            margin-top: 0.5rem;
            font-size: 0.85rem;
            color: #6C757D;
        `;
        mensajeTextarea.parentNode.appendChild(strengthIndicator);

        mensajeTextarea.addEventListener('input', () => {
            const length = mensajeTextarea.value.length;
            const words = mensajeTextarea.value.trim().split(/\s+/).length;

            if (length === 0) {
                strengthIndicator.textContent = '';
            } else if (length < 20) {
                strengthIndicator.textContent = '💬 Mensaje muy corto. Proporciona más detalles.';
                strengthIndicator.style.color = '#DC3545';
            } else if (length < 50) {
                strengthIndicator.textContent = '📝 Buen comienzo. Puedes agregar más información.';
                strengthIndicator.style.color = '#F4A261';
            } else {
                strengthIndicator.textContent = '✅ Excelente. Mensaje detallado.';
                strengthIndicator.style.color = '#28A745';
            }
        });
    }
});

// ============================================
// INTEGRACIÓN CON WHATSAPP (ALTERNATIVA)
// ============================================

function enviarPorWhatsApp() {
    const nombre = document.getElementById('nombre')?.value || '';
    const telefono = document.getElementById('telefono')?.value || '';
    const tipoTerapia = document.getElementById('tipo-terapia')?.value || '';
    const mensaje = document.getElementById('mensaje')?.value || '';

    const numeroWhatsApp = '52XXXXXXXXXX'; // Reemplazar con tu número
    
    const textoMensaje = `
*Nueva Solicitud de Cita*

*Nombre:* ${nombre}
*Teléfono:* ${telefono}
*Tipo de Terapia:* ${tipoTerapia}

*Mensaje:*
${mensaje}
    `.trim();

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoMensaje)}`;
    window.open(url, '_blank');
}

// Agregar botón de WhatsApp alternativo (opcional)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const whatsappBtn = document.createElement('button');
    whatsappBtn.type = 'button';
    whatsappBtn.className = 'btn btn-outline btn-block';
    whatsappBtn.style.marginTop = '1rem';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> O enviar por WhatsApp';
    whatsappBtn.onclick = enviarPorWhatsApp;
    
    // Insertar después del botón de envío
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.parentNode.insertBefore(whatsappBtn, submitBtn.nextSibling);
    }
}
