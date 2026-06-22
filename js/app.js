/* ==========================================================================
   CONTRÓL DE PANTALLA DE BIENVENIDA (PRELOADER) Y AUDIO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const btnEnter = document.getElementById('btn-enter');
    const welcomeScreen = document.getElementById('welcome-screen');
    const bgAudio = document.getElementById('bg-audio');
    const musicToggle = document.getElementById('music-toggle');
    const musicStatus = document.querySelector('.music-status');

    // 1. Acción al dar clic en "ENTRAR"
    if (btnEnter && welcomeScreen) {
        btnEnter.addEventListener('click', () => {
            // Desvanecer pantalla de bienvenida
            welcomeScreen.style.transition = 'opacity 0.8s ease, visibility 0.8s';
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.visibility = 'hidden';

            // Intentar reproducir música automáticamente al ingresar
            if (bgAudio) {
                playAudio();
            }
        });
    }

    // 2. Control del botón flotante de música
    if (musicToggle && bgAudio) {
        musicToggle.addEventListener('click', () => {
            if (bgAudio.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }

    function playAudio() {
        bgAudio.play().then(() => {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicStatus) musicStatus.textContent = 'SONANDO';
        }).catch(err => {
            console.log("El navegador bloqueó la reproducción automática: ", err);
        });
    }

    function pauseAudio() {
        bgAudio.pause();
        if (musicToggle) musicToggle.classList.remove('playing');
        if (musicStatus) musicStatus.textContent = 'PAUSADO';
    }

    /* ==========================================================================
       CUENTA REGRESIVA (TARGET: 23 ENERO 2027 19:00:00)
       ========================================================================== */
    const targetDate = new Date('January 23, 2027 19:00:00').getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // Elementos del HTML
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const segsEl = document.getElementById('seconds');

        if (difference < 0) {
            clearInterval(countdownInterval);
            if (daysEl) daysEl.textContent = "00";
            if (hoursEl) hoursEl.textContent = "00";
            if (minsEl) minsEl.textContent = "00";
            if (segsEl) segsEl.textContent = "00";
            return;
        }

        // Cálculos de tiempo
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Renderizar en pantalla con formato de dos dígitos (01, 02, etc.)
        if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        if (minsEl) minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        if (segsEl) segsEl.textContent = seconds < 10 ? '0' + seconds : seconds;

    }, 1000);

    /* ==========================================================================
       ENVÍO DE FORMULARIO RSVP (RESPALDO POR WHATSAPP)
       ========================================================================== */
    const rsvpForm = document.getElementById('rsvpForm');
    const statusMessage = document.getElementById('confirmacion');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            // Nota: Si estás usando Firebase en otro script, este preventDefault evitará que choque.
            e.preventDefault();

            // Obtener valores de los campos
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const personas = document.getElementById('personas').value;
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !telefono) {
                if (statusMessage) {
                    statusMessage.style.color = '#ff6b6b';
                    statusMessage.textContent = '❌ Por favor llena los campos obligatorios.';
                }
                return;
            }

            // Crear el texto estructurado para WhatsApp
            const textoWhatsApp = `¡Hola Jesús Tadeo! 👋%0A` +
                `Quiero confirmar mi asistencia a tus XV Años: %0A%0A` +
                `🤠 *Nombre:* ${encodeURIComponent(nombre)}%0A` +
                `📱 *Teléfono:* ${encodeURIComponent(telefono)}%0A` +
                `👥 *Acompañantes:* ${personas} persona(s)%0A` +
                `📝 *Nota:* ${encodeURIComponent(mensaje || 'Sin notas adicionales.')}`;

            // Número de WhatsApp configurado en tu HTML
            const numeroTel = "528711092087"; 
            const urlWhatsApp = `https://wa.me/${numeroTel}?text=${textoWhatsApp}`;

            if (statusMessage) {
                statusMessage.style.color = '#cf9f41';
                statusMessage.textContent = '🔄 Redirigiendo a WhatsApp para enviar confirmación...';
            }

            // Abrir pestaña de WhatsApp y limpiar formulario
            setTimeout(() => {
                window.open(urlWhatsApp, '_blank');
                rsvpForm.reset();
                if (statusMessage) {
                    statusMessage.style.color = '#2ecc71';
                    statusMessage.textContent = '✅ ¡Confirmación estructurada con éxito!';
                }
            }, 1200);
        });
    }
});