document.addEventListener('DOMContentLoaded', () => {
    const btnEnter = document.getElementById('btn-enter');
    const welcomeScreen = document.getElementById('welcome-screen');
    const bgAudio = document.getElementById('bg-audio');
    const musicToggle = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const musicStatus = document.querySelector('.music-status');

    // Función universal para forzar la reproducción de audio
    function playAudio() {
        if (!bgAudio) return;
        bgAudio.volume = 1.0; 
        
        bgAudio.play().then(() => {
            if (musicIcon) musicIcon.className = "fa-solid fa-compact-disc fa-spin";
            if (musicStatus) musicStatus.textContent = 'MÚSICA: ON';
        }).catch(err => {
            console.log("Audio pausado a la espera de interacción explícita del usuario: ", err);
        });
    }

    function pauseAudio() {
        if (!bgAudio) return;
        bgAudio.pause();
        if (musicIcon) musicIcon.className = "fa-solid fa-music";
        if (musicStatus) musicStatus.textContent = 'MÚSICA: OFF';
    }

    // DISPARADOR 1: Clic en Entrar
    if (btnEnter && welcomeScreen) {
        btnEnter.addEventListener('click', () => {
            welcomeScreen.style.transition = 'opacity 0.6s ease, visibility 0.6s';
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.visibility = 'hidden';
            playAudio();
        });
    }

    // CONTROL MANUAL: Widget flotante clic
    if (musicToggle && bgAudio) {
        musicToggle.addEventListener('click', (e) => {
            e.preventDefault();
            if (bgAudio.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }

    // Cuenta regresiva exacta
    const targetDate = new Date('January 23, 2027 19:00:00').getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;
        if (difference < 0) return;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (document.getElementById('days')) document.getElementById('days').textContent = days < 10 ? '0' + days : days;
        if (document.getElementById('hours')) document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
        if (document.getElementById('minutes')) document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
        if (document.getElementById('seconds')) document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);

    // RSVP - Formulario Corregido para Celulares
    const rsvpForm = document.getElementById('rsvpForm');
    const statusMessage = document.getElementById('confirmacion');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // DISPARADOR DE AUDIO AUTOMÁTICO DE RESPALDO
            if (bgAudio && bgAudio.paused) {
                playAudio();
            }

            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !telefono) {
                if (statusMessage) {
                    statusMessage.style.color = '#ff6b6b';
                    statusMessage.textContent = '❌ Por favor llena los campos requeridos.';
                }
                return;
            }

            // Mensaje estructurado de WhatsApp limpio
            const textoWhatsApp = `🤠 *CONFIRMACIÓN ASISTENCIA - XV JESÚS TADEO* 🤠%0A%0A` +
                `¡Hola! Confirmo mi asistencia a tu evento de XV años.%0A%0A` +
                `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A` +
                `📱 *Teléfono:* ${encodeURIComponent(telefono)}%0A` +
                `📝 *Mensaje:* ${encodeURIComponent(mensaje || '¡Listo para el zapateado!')}`;

            // Enlace optimizado sin caracteres extraños en el número
            const urlWhatsApp = `https://wa.me/528711092087?text=${textoWhatsApp}`;

            try {
                if (statusMessage) {
                    statusMessage.style.color = '#f4d38a';
                    statusMessage.textContent = '⏳ Registrando pase VIP...';
                }

                // Envío asíncrono a Firebase
                if (window.db && window.collection && window.addDoc) {
                    await window.addDoc(window.collection(window.db, "asistencias"), {
                        nombre,
                        telefono,
                        mensaje: mensaje || "¡Ahí nos vemos!",
                        fecha: new Date().toISOString()
                    });
                }

                if (statusMessage) {
                    statusMessage.style.color = '#2ecc71';
                    statusMessage.textContent = '✅ ¡Guardado! Redirigiendo a tu WhatsApp para finalizar...';
                }

                setTimeout(() => {
                    // CORRECCIÓN CLAVE: window.location.href evita el bloqueo de popups en celulares
                    window.location.href = urlWhatsApp;
                    rsvpForm.reset();
                }, 800);

            } catch (error) {
                console.error("Error Firebase:", error);
                if (statusMessage) {
                    statusMessage.style.color = '#2ecc71';
                    statusMessage.textContent = '✅ Abriendo confirmación por WhatsApp...';
                }
                setTimeout(() => {
                    // CORRECCIÓN CLAVE: Redirección directa de respaldo para móviles
                    window.location.href = urlWhatsApp;
                    rsvpForm.reset();
                }, 600);
            }
        });
    }
});