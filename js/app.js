document.addEventListener('DOMContentLoaded', () => {
    const btnEnter = document.getElementById('btn-enter');
    const welcomeScreen = document.getElementById('welcome-screen');
    const bgAudio = document.getElementById('bg-audio');
    const musicToggle = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const musicStatus = document.querySelector('.music-status');

    function playAudio() {
        if (!bgAudio) return;
        bgAudio.volume = 1.0; 
        bgAudio.play().then(() => {
            if (musicIcon) musicIcon.className = "fa-solid fa-compact-disc fa-spin";
            if (musicStatus) musicStatus.textContent = 'MÚSICA: ON';
        }).catch(err => {
            console.log("Audio en espera de interacción: ", err);
        });
    }

    function pauseAudio() {
        if (!bgAudio) return;
        bgAudio.pause();
        if (musicIcon) musicIcon.className = "fa-solid fa-music";
        if (musicStatus) musicStatus.textContent = 'MÚSICA: OFF';
    }

    if (btnEnter && welcomeScreen) {
        btnEnter.addEventListener('click', () => {
            welcomeScreen.style.transition = 'opacity 0.6s ease';
            welcomeScreen.style.opacity = '0';
            setTimeout(() => welcomeScreen.style.display = 'none', 600);
            playAudio();
        });
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (bgAudio) bgAudio.paused ? playAudio() : pauseAudio();
        });
    }

    // === CUENTA REGRESIVA ===
    const targetDate = new Date('January 23, 2027 19:00:00').getTime();
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        if (difference < 0) {
            document.querySelector('.countdown-container').innerHTML = "<h3>¡LLEGÓ EL DÍA DEL JARIPEO!</h3>";
            return;
        }
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');

        if (dEl) dEl.textContent = days < 10 ? '0' + days : days;
        if (hEl) hEl.textContent = hours < 10 ? '0' + hours : hours;
        if (mEl) mEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        if (sEl) sEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // === INTERSECCIÓN DE PARÁMETROS URL Y RENDERIZADO DEL BOLETO VIP ===
    const txtNombre = document.getElementById('nombre');
    const displayPases = document.getElementById('pases-display');
    const inputPases = document.getElementById('pases-input');
    const rsvpInstruction = document.getElementById('rsvp-instruction');

    const urlParams = new URLSearchParams(window.location.search);
    const invitadoParam = urlParams.get('invitado');
    const pasesParam = urlParams.get('pases');

    if (invitadoParam) {
        const nombreLimpio = invitadoParam.replace(/_/g, ' ');
        if (txtNombre) {
            txtNombre.value = nombreLimpio;
            txtNombre.readOnly = true;
            txtNombre.style.background = "rgba(0, 0, 0, 0.04)";
        }
        if (rsvpInstruction) {
            rsvpInstruction.innerHTML = `¡Hola <strong>${nombreLimpio}</strong>! Asegura tus lugares exclusivos respondiendo el formulario.`;
        }
    }

    // Calcular render interno del boleto elaborado
    let cantPases = 1;
    if (pasesParam && !isNaN(pasesParam)) {
        cantPases = parseInt(pasesParam);
    }
    
    if (inputPases) inputPases.value = cantPases;
    
    if (displayPases) {
        const iconHTML = cantPases === 1 
            ? `<i class="fa-solid fa-ticket-simple"></i>` 
            : `<i class="fa-solid fa-tickets-airline"></i>`;
            
        const textHTML = cantPases === 1
            ? `Válido por: <strong>1 PASE EXCLUSIVO</strong>`
            : `Válido por: <strong>${cantPases} PASES EXCLUSIVOS</strong>`;
            
        displayPases.querySelector('.ticket-icon').innerHTML = iconHTML;
        displayPases.querySelector('.ticket-text-main').innerHTML = textHTML;
    }

    // === FORMULARIO RSVP E INTEGRACIÓN ===
    const rsvpForm = document.getElementById('rsvpForm');
    const statusMessage = document.getElementById('confirmacion');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (bgAudio && bgAudio.paused) playAudio();

            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const pasesFinales = document.getElementById('pases-input') ? document.getElementById('pases-input').value : "1";

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
                `🎫 *Lugares Asegurados:* ${pasesFinales} pases%0A` +
                `📝 *Mensaje:* ${encodeURIComponent(mensaje || '¡Listo para el zapateado!')}`;

            const urlWhatsApp = `https://wa.me/528711092087?text=${textoWhatsApp}`;

            try {
                if (statusMessage) {
                    statusMessage.style.color = '#f4d38a';
                    statusMessage.textContent = '⏳ Registrando pase VIP...';
                }

                if (window.db && window.collection && window.addDoc) {
                    await window.addDoc(window.collection(window.db, "asistencias"), {
                        nombre,
                        telefono,
                        pases: parseInt(pasesFinales),
                        mensaje: mensaje || "¡Ahí nos vemos!",
                        fecha: new Date().toISOString()
                    });
                }

                if (statusMessage) {
                    statusMessage.style.color = '#2ecc71';
                    statusMessage.textContent = '✅ ¡Guardado! Redirigiendo a tu WhatsApp para finalizar...';
                }

                setTimeout(() => {
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
                    window.location.href = urlWhatsApp;
                    rsvpForm.reset();
                }, 600);
            }
        });
    }
});