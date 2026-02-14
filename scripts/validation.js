document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('openRegistration');
    const modal = document.getElementById('modalRegistration');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('feedbackForm');

    // Логика модального окна (оставляем как было у вас)
    if (openBtn) {
        openBtn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('is-active'); });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => { modal.classList.remove('is-active'); });
    }

    if (!form) return;

    // --- НАЧАЛО ЛОГИКИ ПО МЕТОДИЧКЕ ---

    // 1. Сброс ошибки при вводе (Шаг 3, пункт "Сброс ошибки при вводе")
    // Находим все поля ввода и событие input
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid'); // в методичке is-danger
            const parent = this.parentElement; 
            const errorMsg = parent.querySelector('.invalid-feedback'); 
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    // 2. Обработка отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Отмена перезагрузки 

        // Сбрасываем все предыдущие сообщения об ошибках перед проверкой
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

        let isValid = true;

        // Получаем элементы
        const fullname = document.getElementById('fullname');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        const fullnameValue = fullname.value.trim();
        const phoneValue = phone.value.trim();
        const emailValue = email.value.trim();

        // --- Проверка ФИО ---
        // (не пустое, минимум 2 слова) [cite: 19, 190-192]
        if (fullnameValue === '') {
            showError(fullname, 'Введите фамилию и имя');
            isValid = false;
        } else if (fullnameValue.split(/\s+/).length < 2) {
            showError(fullname, 'Введите фамилию и имя');
            isValid = false;
        }

        // --- Проверка Телефона ---
        // (не пустой, 10 цифр)
        const phoneDigits = phoneValue.replace(/\D/g, '');
        if (phoneValue === '') {
            showError(phone, 'Введите номер телефона');
            isValid = false;
        } else if (phoneDigits.length < 10) {
            showError(phone, 'Введите 10 цифр номера');
            isValid = false;
        }

        // --- Проверка Email ---
        // (не пустой, содержит @ и .) 
        if (emailValue === '') {
            showError(email, 'Введите email');
            isValid = false;
        } else if (!emailValue.includes('@') || !emailValue.includes('.')) {
            showError(email, 'Введите корректный email');
            isValid = false;
        }

        // Если всё корректно
        if (isValid) {
            const formData = {
                fullname: fullnameValue,
                phone: phoneValue,
                email: emailValue,
                message: message.value.trim() || '(не заполнено)'
            };

            // Отправляем событие
            const event = new CustomEvent('formValid', { detail: formData });
            document.dispatchEvent(event);

            alert('Форма отправлена! Данные в консоли.'); 
            // Дополнительно: закрываем модалку и чистим форму
            modal.classList.remove('is-active');
            form.reset();
        }
    });

    function showError(input, message) {
        input.classList.add('is-invalid');
        
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('invalid-feedback'); // класс ошибки в Bootstrap
        errorMsg.style.display = 'block'; // принудительно показываем
        errorMsg.textContent = message;
        
        // Вставляем сообщение после поля ввода
        input.parentElement.appendChild(errorMsg);
    }
});