/* ===========================================================
       APP.JS – El Sabor de la Vida
       Módulos:
         0. CONFIGURACIÓN SUPABASE
         1. DATOS DEL MENÚ  – catálogo de platos por categoría
         2. TESTIMONIOS     – datos de clientes para el carrusel
         3. NAVEGACIÓN      – scroll activo + hamburguesa móvil
         4. MENÚ            – renderizado y filtrado por pestaña
         5. TESTIMONIOS     – rotación automática con botón
         6. RESERVACIONES   – validación + Supabase + WhatsApp
         7. BOLETÍN         – suscripción al newsletter
         8. ANIMACIONES     – IntersectionObserver para scroll
         9. INICIALIZACIÓN  – ajustes al cargar la página
    =========================================================== */

    /* -----------------------------------------------------------
       0. CONFIGURACIÓN SUPABASE
          Reemplaza los valores con los de tu proyecto en:
          https://supabase.com/dashboard → Settings → API
    ----------------------------------------------------------- */
    const SUPABASE_URL    = 'https://tmgvgzagroxvtwrnkoij.supabase.co';   
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ3ZnemFncm94dnR3cm5rb2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTI3MzQsImV4cCI6MjA5NjAyODczNH0.lYh3TDIQyoY5as0n6HRmwIFmv5EvM5felNBBI90WcuY';                // 🔴 CAMBIAR

    /**
     * Inserta una reservación directamente en Supabase
     * usando la REST API (no se necesita librería externa).
     * @param {Object} datos – Datos validados del formulario.
     * @returns {Object} { ok: boolean, error?: string }
     */
    async function guardarEnSupabase(datos) {
      const payload = {
        nombre:           datos.nombre,
        primer_apellido:  datos.primerApellido,
        segundo_apellido: datos.segundoApellido || null,
        telefono:         datos.telefono,
        edad:             parseInt(datos.edad, 10),
        fecha_reserva:    datos.fechaReserva,    // ISO "YYYY-MM-DDTHH:MM"
        nota:             datos.nota || null
      };

      const respuesta = await fetch(
        `${SUPABASE_URL}/rest/v1/reservaciones`,
        {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':         SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer':         'return=minimal'   // No devuelve la fila (más rápido)
          },
          body: JSON.stringify(payload)
        }
      );

      if (respuesta.ok) {
        return { ok: true };
      } else {
        const err = await respuesta.json().catch(() => ({}));
        return { ok: false, error: err.message || `Error ${respuesta.status}` };
      }
    }

    /* -----------------------------------------------------------
       1. DATOS DEL MENÚ
          Catálogo de platos del restaurante. Cada objeto tiene:
          id, categoria, nombre, descripcion, precio y emoji.
    ----------------------------------------------------------- */
    const MENU_DATOS = [
      /* ── Platos Fuertes ── */
      { id: 1,  categoria: 'platos',    nombre: 'Gallo Pinto con Cerdo',    descripcion: 'Arroz con frijoles salteados, chuleta de cerdo a la plancha, maduro y cuajada.',      precio: 180, emoji: '🍛' },
      { id: 2,  categoria: 'platos',    nombre: 'Pollo a la Plancha',        descripcion: 'Pechuga marinada con especias criollas, arroz blanco y ensalada fresca.',              precio: 160, emoji: '🍗' },
      { id: 3,  categoria: 'platos',    nombre: 'Fritanga Nicaragüense',     descripcion: 'Combinado de cerdo frito, maduro, yuca y chicharrón. Sabor de mercado.',              precio: 200, emoji: '🥩' },
      { id: 4,  categoria: 'platos',    nombre: 'Res Encebollada',           descripcion: 'Bistec de res con cebolla caramelizada, chiltoma y tomate. Con arroz blanco.',         precio: 190, emoji: '🥗' },
      /* ── Antojitos ── */
      { id: 5,  categoria: 'antojitos', nombre: 'Nachos Especiales',         descripcion: 'Nachos con frijoles, guacamole, crema, jalapeños y salsa roja casera.',               precio: 120, emoji: '🌮' },
      { id: 6,  categoria: 'antojitos', nombre: 'Tostones con Queso',        descripcion: 'Plátano verde frito dos veces, acompañado de cuajada y crema.',                       precio:  80, emoji: '🍌' },
      { id: 7,  categoria: 'antojitos', nombre: 'Vigorón',                   descripcion: 'Yuca cocida con chicharrón y curtido de repollo. Clásico nicaragüense.',               precio:  95, emoji: '🥙' },
      { id: 8,  categoria: 'antojitos', nombre: 'Güirilas con Cuajada',      descripcion: 'Tortillas de elote tierno servidas con cuajada fresca y crema.',                      precio:  70, emoji: '🫓' },
      /* ── Ceviches ── */
      { id: 9,  categoria: 'ceviches',  nombre: 'Ceviche de Camarón',        descripcion: 'Camarones frescos marinados en limón, cebolla morada, cilantro y chile.',             precio: 220, emoji: '🦐' },
      { id: 10, categoria: 'ceviches',  nombre: 'Ceviche Mixto',             descripcion: 'Mezcla de camarón, pescado y pulpo en leche de tigre con tostones.',                  precio: 250, emoji: '🐟' },
      { id: 11, categoria: 'ceviches',  nombre: 'Ceviche de Pescado',        descripcion: 'Filete de pescado blanco curado en limón con vegetales frescos.',                     precio: 180, emoji: '🐠' },
      /* ── Bebidas ── */
      { id: 12, categoria: 'bebidas',   nombre: 'Pinolillo',                 descripcion: 'Bebida tradicional de maíz tostado con cacao y canela. El sabor de Nicaragua.',       precio:  40, emoji: '🥛' },
      { id: 13, categoria: 'bebidas',   nombre: 'Chicha de Maíz',            descripcion: 'Bebida fermentada artesanal de maíz blanco. Refrescante y natural.',                  precio:  35, emoji: '🍺' },
      { id: 14, categoria: 'bebidas',   nombre: 'Fresco Natural',            descripcion: 'Elige entre: jamaica, tamarindo, maracuyá, guanábana o pitahaya.',                    precio:  30, emoji: '🥤' },
      { id: 15, categoria: 'bebidas',   nombre: 'Limonada Especial',         descripcion: 'Limonada artesanal con menta fresca, jengibre y hielo triturado.',                    precio:  45, emoji: '🍋' },
      /* ── Extras ── */
      { id: 16, categoria: 'extras',    nombre: 'Arroz Blanco Extra',        descripcion: 'Porción extra de arroz blanco con mantequilla.',                                      precio:  25, emoji: '🍚' },
      { id: 17, categoria: 'extras',    nombre: 'Cuajada Fresca',            descripcion: 'Porción de cuajada artesanal nicaragüense.',                                          precio:  30, emoji: '🧀' },
      { id: 18, categoria: 'extras',    nombre: 'Postre del Día',            descripcion: 'Consulta disponibilidad: tres leches, queque seco o flan de vainilla.',               precio:  60, emoji: '🍰' }
    ];

    /* -----------------------------------------------------------
       2. DATOS DE TESTIMONIOS
    ----------------------------------------------------------- */
    const TESTIMONIOS = [
      {
        cita: '"La comida más auténtica de Ticuantepe. Cada vez que vengo me siento como en la casa de mi abuela en Nicaragua."',
        nombre: 'María González',
        rol: 'Cliente frecuente'
      },
      {
        cita: '"El gallo pinto de aquí no tiene competencia. Siempre que vuelvo a Nicaragua vengo al Sabor de la Vida."',
        nombre: 'Carlos Mejía',
        rol: 'Cliente habitual'
      },
      {
        cita: '"Organizaron el catering de nuestra boda y todo estuvo perfecto. La comida llegó caliente y deliciosa."',
        nombre: 'Ana Rodríguez',
        rol: 'Evento corporativo'
      }
    ];

    /* -----------------------------------------------------------
       3. MÓDULO: NAVEGACIÓN
    ----------------------------------------------------------- */
    const navEl        = document.getElementById('nav');
    const hamburguerEl = document.getElementById('hamburger');
    const navMenuEl    = document.getElementById('navMenu');

    function manejarScroll() {
      navEl.classList.toggle('nav--scrolled', window.scrollY > 20);
      const secciones = document.querySelectorAll('section[id]');
      const enlaces   = document.querySelectorAll('.nav__enlace');
      let   actual    = '';
      secciones.forEach(sec => {
        if (sec.getBoundingClientRect().top < window.innerHeight * 0.45) actual = sec.id;
      });
      enlaces.forEach(a => {
        a.classList.toggle('nav__enlace--activo', a.getAttribute('href') === `#${actual}`);
      });
    }

    function toggleHamburguesa() {
      const abierto = navMenuEl.classList.toggle('nav__menu--abierto');
      hamburguerEl.setAttribute('aria-expanded', abierto.toString());
    }

    function cerrarMenuMovil() {
      navMenuEl.classList.remove('nav__menu--abierto');
      hamburguerEl.setAttribute('aria-expanded', 'false');
    }

    window.addEventListener('scroll', manejarScroll, { passive: true });
    hamburguerEl.addEventListener('click', toggleHamburguesa);
    navMenuEl.querySelectorAll('.nav__enlace').forEach(a => a.addEventListener('click', cerrarMenuMovil));

    /* -----------------------------------------------------------
       4. MÓDULO: MENÚ
    ----------------------------------------------------------- */
    const menuGridEl = document.getElementById('menuGrid');
    const menuTabs   = document.querySelectorAll('.menu__tab');
    let categoriaActual = 'platos';

    function crearTarjeta(plato) {
      const msg   = encodeURIComponent(`Hola, quiero pedir: *${plato.nombre}* – C$${plato.precio}`);
      const urlWA = `https://wa.me/50589472132?text=${msg}`;
      return `
        <article class="menu__tarjeta" aria-label="${plato.nombre}">
          <div class="menu__tarjeta-imagen" aria-hidden="true">${plato.emoji}</div>
          <div class="menu__tarjeta-cuerpo">
            <h3 class="menu__tarjeta-nombre">${plato.nombre}</h3>
            <p class="menu__tarjeta-descripcion">${plato.descripcion}</p>
            <div class="menu__tarjeta-pie">
              <span class="menu__tarjeta-precio">C$${plato.precio}</span>
              <a href="${urlWA}" target="_blank" rel="noopener"
                 class="menu__tarjeta-btn" aria-label="Pedir ${plato.nombre} por WhatsApp">💬 Pedir</a>
            </div>
          </div>
        </article>`;
    }

    function renderizarMenu(categoria) {
      const filtrados = MENU_DATOS.filter(p => p.categoria === categoria);
      menuGridEl.style.opacity = '0';
      setTimeout(() => {
        menuGridEl.innerHTML = filtrados.length
          ? filtrados.map(crearTarjeta).join('')
          : '<p style="color:var(--c-gris);text-align:center;padding:2rem 0;">Sin platos en esta categoría.</p>';
        menuGridEl.style.transition = 'opacity .3s ease';
        menuGridEl.style.opacity    = '1';
      }, 160);
    }

    function seleccionarCategoria(e) {
      const tab   = e.currentTarget;
      const nueva = tab.dataset.categoria;
      if (nueva === categoriaActual) return;
      categoriaActual = nueva;
      menuTabs.forEach(t => { t.classList.remove('menu__tab--activo'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('menu__tab--activo');
      tab.setAttribute('aria-selected', 'true');
      renderizarMenu(categoriaActual);
    }

    menuTabs.forEach(tab => tab.addEventListener('click', seleccionarCategoria));
    renderizarMenu(categoriaActual);

    /* -----------------------------------------------------------
       5. MÓDULO: TESTIMONIOS
    ----------------------------------------------------------- */
    let idxTestimonio = 0;
    const btnTestimonio = document.getElementById('btnTestimonio');

    function mostrarTestimonio(idx) {
      const t      = TESTIMONIOS[idx];
      const citaEl = document.querySelector('.testimonio__cita');
      const nomEl  = document.querySelector('.testimonio__nombre');
      const rolEl  = document.querySelector('.testimonio__rol');
      citaEl.style.opacity = '0';
      setTimeout(() => {
        citaEl.textContent = t.cita;
        nomEl.textContent  = t.nombre;
        rolEl.textContent  = t.rol;
        citaEl.style.transition = 'opacity .35s ease';
        citaEl.style.opacity = '1';
      }, 200);
    }

    function siguienteTestimonio() {
      idxTestimonio = (idxTestimonio + 1) % TESTIMONIOS.length;
      mostrarTestimonio(idxTestimonio);
    }

    btnTestimonio.addEventListener('click', siguienteTestimonio);
    setInterval(siguienteTestimonio, 6000);

    /* -----------------------------------------------------------
       6. MÓDULO: RESERVACIONES
          Flujo:
            1. Validar campos del formulario (cliente).
            2. Guardar en Supabase (tabla reservaciones).
            3. Mostrar mensaje de éxito.
            4. Abrir WhatsApp con resumen de la reserva.
    ----------------------------------------------------------- */
    const reservaFormEl    = document.getElementById('reservaForm');
    const mensajeReservaEl = document.getElementById('mensajeReserva');
    const notaEl           = document.getElementById('nota');
    const contadorNotaEl   = document.getElementById('contadorNota');

    notaEl.addEventListener('input', () => {
      contadorNotaEl.textContent = `${notaEl.value.length} / 500`;
    });

    function mostrarError(inputId, errorId, mensaje) {
      const campo = document.getElementById(inputId);
      const span  = document.getElementById(errorId);
      if (campo) campo.classList.add('reserva__input--error');
      if (span)  span.textContent = mensaje;
    }

    function limpiarErrores() {
      document.querySelectorAll('.reserva__input--error').forEach(el =>
        el.classList.remove('reserva__input--error')
      );
      document.querySelectorAll('.reserva__error').forEach(el => el.textContent = '');
      mensajeReservaEl.className   = 'reserva__mensaje';
      mensajeReservaEl.textContent = '';
    }

    function validarReserva(d) {
      let ok = true;
      if (!d.nombre || d.nombre.length < 2) {
        mostrarError('nombre', 'errorNombre', 'El nombre debe tener al menos 2 caracteres.');
        ok = false;
      }
      if (!d.primerApellido || d.primerApellido.length < 2) {
        mostrarError('primerApellido', 'errorPrimerApellido', 'El primer apellido es obligatorio.');
        ok = false;
      }
      if (!d.telefono || !/^[\+]?[0-9\s\-]{7,15}$/.test(d.telefono)) {
        mostrarError('telefono', 'errorTelefono', 'Ingresa un número de teléfono válido.');
        ok = false;
      }
      const edad = parseInt(d.edad, 10);
      if (isNaN(edad) || edad < 1 || edad > 120) {
        mostrarError('edad', 'errorEdad', 'Ingresa una edad válida (1 – 120).');
        ok = false;
      }
      if (!d.fechaReserva) {
        mostrarError('fechaReserva', 'errorFecha', 'Selecciona la fecha y hora de reserva.');
        ok = false;
      } else if (new Date(d.fechaReserva) < new Date()) {
        mostrarError('fechaReserva', 'errorFecha', 'La fecha no puede estar en el pasado.');
        ok = false;
      }
      return ok;
    }

    function notificarWhatsApp(d) {
      const fechaFormateada = new Date(d.fechaReserva).toLocaleString('es-NI', {
        dateStyle: 'full',
        timeStyle: 'short'
      });
      const texto = encodeURIComponent(
        `*Nueva Reservación – El Sabor de la Vida* 🍴\n\n` +
        `👤 Nombre:   ${d.nombre} ${d.primerApellido} ${d.segundoApellido}\n` +
        `📞 Teléfono: ${d.telefono}\n` +
        `🎂 Edad:     ${d.edad} años\n` +
        `📅 Fecha:    ${fechaFormateada}\n` +
        `📝 Nota:     ${d.nota || 'Sin notas adicionales'}`
      );
      window.open(`https://wa.me/50589472132?text=${texto}`, '_blank', 'noopener');
    }

    /**
     * Maneja el envío del formulario:
     *   1. Valida datos en el cliente.
     *   2. Guarda en Supabase.
     *   3. Abre WhatsApp (tanto en éxito como en error de red).
     */
    async function manejarReserva(e) {
      e.preventDefault();
      limpiarErrores();

      const datos = {
        nombre:          document.getElementById('nombre').value.trim(),
        primerApellido:  document.getElementById('primerApellido').value.trim(),
        segundoApellido: document.getElementById('segundoApellido').value.trim(),
        telefono:        document.getElementById('telefono').value.trim(),
        edad:            document.getElementById('edad').value,
        fechaReserva:    document.getElementById('fechaReserva').value,
        nota:            notaEl.value.trim()
      };

      if (!validarReserva(datos)) return;

      /* Bloquear botón mientras se procesa */
      const btnEl = document.getElementById('btnReservar');
      btnEl.textContent = '⏳ Guardando reservación...';
      btnEl.disabled = true;
      btnEl.classList.add('btn--cargando');

      try {
        const resultado = await guardarEnSupabase(datos);

        if (resultado.ok) {
          /* ✅ Guardado exitoso en Supabase */
          mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--exito';
          mensajeReservaEl.textContent =
            `✅ ¡Reservación confirmada! Te contactaremos al ${datos.telefono} para confirmar tu mesa.`;

          reservaFormEl.reset();
          contadorNotaEl.textContent = '0 / 500';

          /* Abrir WhatsApp con el resumen */
          notificarWhatsApp(datos);

        } else {
          /* ❌ Error de Supabase */
          console.error('[Reserva] Error Supabase:', resultado.error);
          mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--error';
          mensajeReservaEl.textContent =
            '❌ No se pudo guardar la reservación. Por favor, intenta de nuevo o contáctanos por WhatsApp.';
        }

      } catch (err) {
        /* ❌ Error de red – aún así abrimos WhatsApp como alternativa */
        console.error('[Reserva] Error de red:', err);
        mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--advertencia';
        mensajeReservaEl.textContent =
          '⚠️ Sin conexión al servidor. Te redirigimos a WhatsApp para completar tu reservación.';
        notificarWhatsApp(datos);

      } finally {
        btnEl.textContent = '📅 Confirmar Reservación';
        btnEl.disabled    = false;
        btnEl.classList.remove('btn--cargando');
      }
    }

    reservaFormEl.addEventListener('submit', manejarReserva);

    /* -----------------------------------------------------------
       7. MÓDULO: BOLETÍN
    ----------------------------------------------------------- */
    const boletinFormEl = document.getElementById('boletinForm');

    async function manejarBoletin(e) {
      e.preventDefault();
      const correo = boletinFormEl.querySelector('input[name="correo"]').value.trim();
      if (!correo) return;
      try {
        await fetch('api/boletin.php', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ correo })
        });
      } catch { /* Fallo silencioso */ }
      boletinFormEl.innerHTML = '<p style="color:rgba(255,255,255,.9);font-size:.875rem;">✅ ¡Suscrito exitosamente!</p>';
    }

    boletinFormEl.addEventListener('submit', manejarBoletin);

    /* -----------------------------------------------------------
       8. MÓDULO: ANIMACIONES POR SCROLL
    ----------------------------------------------------------- */
    const scrollObs = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('animar');
            obs.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    function registrarAnimaciones() {
      const selectores = [
        '.menu__tarjeta', '.promo__tarjeta', '.galeria__celda',
        '.catering__icono', '.nosotros__texto', '.testimonio'
      ];
      document.querySelectorAll(selectores.join(', ')).forEach(el => {
        el.style.opacity = '0';
        scrollObs.observe(el);
      });
    }

    /* -----------------------------------------------------------
       9. INICIALIZACIÓN
    ----------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
      const fechaEl = document.getElementById('fechaReserva');
      if (fechaEl) {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        fechaEl.min = ahora.toISOString().slice(0, 16);
      }
      manejarScroll();
      setTimeout(registrarAnimaciones, 100);
    });
