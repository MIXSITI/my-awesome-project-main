// Инициализация элементов
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phone = document.getElementById('phone');
let lastActive = null;

// Переключатель темы (дополнительно из Практики 4)
const themeKey = 'theme';
const themeBtn = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (localStorage.getItem(themeKey) === 'dark' || (!localStorage.getItem(themeKey) && prefersDark)) {
    document.body.classList.add('theme-dark');
    themeBtn?.setAttribute('aria-pressed', 'true');
}

themeBtn?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('theme-dark');
    themeBtn.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
});

// Открытие модального окна
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal(); // Открытие модального окна с затемнением
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// Закрытие модального окна
closeBtn.addEventListener('click', () => dlg.close('cancel'));

// Обработка отправки формы
form?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений об ошибках
    [...form.elements].forEach(el => el.setCustomValidity(''));

    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();

        // Проверка email на корректность
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        // Проверка телефона на соответствие маске (если требуется дополнительная валидация)
        const phoneValue = phone?.value.replace(/\D/g, '');
        if (phone && phoneValue.length !== 11) {
            phone.setCustomValidity('Введите корректный номер телефона (11 цифр)');
        }

        form.reportValidity(); // Показать браузерные подсказки

        // A11y: Подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;
    }

    // 3) Успешная "отправка" (без сервера)
    e.preventDefault();
    dlg.close('success');
    form.reset();
});

// Обработка закрытия модального окна
dlg.addEventListener('close', () => {
    lastActive?.focus();
});

// Лёгкая маска телефона
phone?.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '').slice(0, 11); // Ограничение до 11 цифр
    const d = digits.replace(/^8/, '7'); // Нормализация 8 → 7
    const parts = [];
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1, 4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
    if (d.length >= 8) parts.push('-' + d.slice(7, 9));
    if (d.length >= 10) parts.push('-' + d.slice(9, 11));
    phone.value = parts.join('');
});

// Установка паттерна для телефона (если нужно для валидации)
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

 