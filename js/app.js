document.addEventListener('DOMContentLoaded', () => {
    const btnEnter = document.getElementById('btn-enter');
    const welcomeScreen = document.getElementById('welcome-screen');
    const bgAudio = document.getElementById('bg-audio');
    const musicToggle = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const musicStatus = document.querySelector('.music-status');

    let isPlaying = false;

    // Función de reproducción forzada inmune a restricciones de hosting móvil
    function playAudio() {
        if (!bgAudio) return;
        
        bgAudio.removeAttribute('muted');
        bgAudio.muted = false;
        bgAudio.volume = 1.0;

        const playPromise = bgAudio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                if (musicIcon) musicIcon.className = "fa-solid fa-compact-disc fa-spin";
                if (musicStatus) musicStatus.textContent = 'MÚSICA: ON';
            }).catch(err => {
                console.log("El navegador móvil bloqueó el auto-play inicial. Esperando interacción física.", err);
            });
        }
    }

    function pauseAudio() {
        if (!bgAudio) return;
        bgAudio.pause();
        isPlaying = false;
        if (musicIcon) musicIcon.className = "fa-solid fa-music";
        if (musicStatus) musicStatus.textContent = 'MÚSICA: OFF';
    }

    // DISPARADOR 1: Clic directo en "ENTRAR"
    if (btnEnter && welcomeScreen) {
        btnEnter.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeScreen.style.transition = 'opacity 0.6s ease, visibility 0.6s';
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.visibility = 'hidden';
            playAudio();
        });
    }

    // DISPARADOR MAESTRO GLOBAL: Activar audio al primer tap en la pantalla si falló el botón inicial
    document.addEventListener('click', () => {
        if (!isPlaying && bgAudio && bgAudio.paused) {
            playAudio();
        }
    }, { once: false });

    // CONTROL MANUAL DESDE EL WIDGET FLOTANTE
    if (musicToggle && bgAudio) {
        musicToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (bgAudio.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }

    // Cuenta regresiva exacta para el 23 de Enero de 2027
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

    // Formulario de Asistencia (RSVP) con disparo automático alterno de música
    const rsvpForm = document.getElementById('rsvpForm');
    const statusMessage = document.getElementById('confirmacion');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // DISPARADOR DE AUDIO DE CONFIRMACIÓN AUTOMÁTICA
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

            const textoWhatsApp = `🤠 *CONFIRMACIÓN ASISTENCIA - XV JESÚS TADEO* 🤠%0A%0A` +
                `¡Hola! Confirmo mi asistencia a tu evento de XV años.%0A%0A` +
                `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A` +
                `📱 *Teléfono:* ${encodeURIComponent(telefono)}%0A` +
                `📝 *Mensaje:* ${encodeURIComponent(mensaje || '¡Listo para el zapateado!')}`;

            const urlWhatsApp = `https://wa.me/528711092087?text=${textoWhatsApp}`;

            try {
                if (statusMessage) {
                    statusMessage.style.color = '#f4d38a';
                    statusMessage.textContent = '⏳ Registrando pase VIP...';
                }

                // Guardado asíncrono en la colección de Firebase
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
                    window.open(urlWhatsApp, '_blank');
                    rsvpForm.reset();
                }, 1000);

            } catch (error) {
                console.error("Error en Base de Datos:", error);
                if (statusMessage) {
                    statusMessage.style.color = '#2ecc71';
                    statusMessage.textContent = '✅ Abriendo tu WhatsApp para confirmación inmediata...';
                }
                setTimeout(() => {
                    window.open(urlWhatsApp, '_blank');
                    rsvpForm.reset();
                }, 800);
            }
        });
    }
});