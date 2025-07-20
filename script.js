/* ===== script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== HEADER & MOBILE NAV ===== */
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');

    // Add shadow to header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Toggle mobile menu with improved functionality
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && !navMenu.contains(e.target) && e.target !== navToggle) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* ===== ACCORDION ===== */
    const accordionItems = document.querySelectorAll('.accordion__item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        header.addEventListener('click', () => {
            const openItem = document.querySelector('.accordion__item.active');
            
            if (openItem && openItem !== item) {
                openItem.classList.remove('active');
            }
            
            item.classList.toggle('active');
        });
    });
    
    /* ===== SCROLL ANIMATIONS (MODIFIED & ENHANCED) ===== */
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        let delay = 0; // Reset delay on each scroll event
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25) && !el.classList.contains('is-visible')) {
                // Apply a staggered delay for a smoother effect
                setTimeout(() => {
                    displayScrollElement(el);
                }, delay);
                delay += 100; // Increase delay for the next visible element
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    // Trigger on load for elements already in view
    handleScrollAnimation();


    /* ===== FORM HANDLING ===== */
    const form = document.getElementById('workshopForm');
    const formFeedback = document.getElementById('form-feedback');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!validateForm()) return;

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            const formData = new FormData(form);
            const data = {
                nome: formData.get('nome'),
                cpf: formData.get('cpf'),
                cidade: formData.get('cidade'),
                whatsapp: formData.get('whatsapp'),
                email: formData.get('email'),
                finalidade: formData.get('finalidade'),
                participacao: formData.get('participacao'),
                evento: 'Tratamento de Piscinas - Rafa Rlc - 23/08/25',
                dataCadastro: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
            };

            try {
                await sendToTelegram(data);
                
                formFeedback.className = 'success';
                formFeedback.innerHTML = `
                    <h3>Inscrição Confirmada!</h3>
                    <p>Ótimo! Você será redirecionado para o grupo do WhatsApp em instantes.</p>
                `;
                form.reset();
                
                setTimeout(() => {
                    window.location.href = 'https://chat.whatsapp.com/CBVVR54lVfbLQFyRR7yPKR';
                }, 2500);

            } catch (error) {
                formFeedback.className = 'error';
                formFeedback.innerHTML = `
                    <h3>Ocorreu um Erro!</h3>
                    <p>Não foi possível enviar sua inscrição. Por favor, tente novamente ou entre em contato.</p>
                `;
                console.error('Erro no envio:', error);
                submitButton.disabled = false;
                submitButton.textContent = 'Confirmar minha Inscrição';
            }
        });
    }

    function validateForm() {
        let isValid = true;
        
        // Reset previous errors
        document.querySelectorAll('.form__error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form__input.invalid').forEach(el => el.classList.remove('invalid'));

        // Validate text inputs
        ['nome', 'cpf', 'cidade', 'whatsapp', 'email'].forEach(id => {
            const input = document.getElementById(id);
            if (!input.value.trim()) {
                showError(id, 'Este campo é obrigatório.');
                isValid = false;
            }
        });

        // Validate email format
        const emailInput = document.getElementById('email');
        if (emailInput.value && !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
            showError('email', 'Por favor, insira um e-mail válido.');
            isValid = false;
        }

        // Validate radio buttons
        ['finalidade', 'participacao'].forEach(name => {
            if (form && !form.querySelector(`input[name="${name}"]:checked`)) {
                showError(name, 'Por favor, selecione uma opção.');
                isValid = false;
            }
        });

        return isValid;
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const inputElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.classList.add('invalid');
        } else { // For radio groups
             const radioGroup = form.querySelector(`input[name="${fieldId}"]`).closest('.form__radio-group');
             if(radioGroup) radioGroup.classList.add('invalid');
        }
    }

    async function sendToTelegram(data) {
        const botToken = '7311747535:AAEzgJ7ynq_B785QBng8qLuiRiiDMlBoWCk';
        const chatId = '-1002597551822';
        
        const message = `
🚨 *NOVA INSCRIÇÃO - PROFISSÃO PISCINA* 🚨
--------------------------------------------------
*Evento:* ${data.evento}

*Nome:* ${data.nome}
*CPF/CNPJ:* ${data.cpf}
*WhatsApp:* ${data.whatsapp}
*E-mail:* ${data.email}
*Cidade/UF:* ${data.cidade}

*Perfil:* ${data.finalidade}
*Forma de Participação:* ${data.participacao}

*Data da Inscrição:* ${data.dataCadastro}
        `;

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
        });

        if (!response.ok) {
            throw new Error(`Erro no Telegram: ${response.statusText}`);
        }
        return response.json();
    }

    /* ===== INPUT MASKS ===== */
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', e => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                value = value.substring(0, 14);
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', e => {
            let value = e.target.value.replace(/\D/g, '').substring(0, 11);
            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            if (value.length > 9) {
                value = `${value.substring(0, 10)}-${value.substring(10)}`;
            }
            e.target.value = value;
        });
    }
});