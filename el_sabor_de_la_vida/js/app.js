/* ===========================================================
       APP.JS – El Sabor de la Vida
       Módulos:
         1. DATOS DEL MENÚ  – catálogo de platos por categoría
         2. TESTIMONIOS     – datos de clientes para el carrusel
         3. NAVEGACIÓN      – scroll activo + hamburguesa móvil
         4. MENÚ            – renderizado y filtrado por pestaña
         5. TESTIMONIOS     – rotación automática con botón
         6. RESERVACIONES   – validación + envío fetch + WhatsApp
         7. BOLETÍN         – suscripción al newsletter
         8. ANIMACIONES     – IntersectionObserver para scroll
         9. INICIALIZACIÓN  – ajustes al cargar la página
    =========================================================== */

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
          Array de objetos para rotar en la tarjeta verde.
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
          · Agrega nav--scrolled al bajar el scroll.
          · Actualiza el enlace activo según la sección visible.
          · Controla el menú hamburguesa en móvil.
    ----------------------------------------------------------- */

    /** Referencia a la barra de navegación */
    const navEl       = document.getElementById('nav');

    /** Botón hamburguesa (móvil) */
    const hamburguerEl = document.getElementById('hamburger');

    /** Contenedor del menú de enlaces */
    const navMenuEl   = document.getElementById('navMenu');

    /**
     * Maneja el evento scroll:
     * – Aplica sombra cuando se baja más de 20px.
     * – Marca el enlace de la sección actualmente visible.
     */
    function manejarScroll() {
      /* Agregar/quitar clase de scroll */
      navEl.classList.toggle('nav--scrolled', window.scrollY > 20);

      /* Detectar qué sección está en pantalla */
      const secciones = document.querySelectorAll('section[id]');
      const enlaces   = document.querySelectorAll('.nav__enlace');
      let   actual    = '';

      secciones.forEach(sec => {
        if (sec.getBoundingClientRect().top < window.innerHeight * 0.45) {
          actual = sec.id;
        }
      });

      /* Actualizar clase activo en los enlaces */
      enlaces.forEach(a => {
        a.classList.toggle(
          'nav__enlace--activo',
          a.getAttribute('href') === `#${actual}`
        );
      });
    }

    /**
     * Abre/cierra el menú hamburguesa en móvil.
     * Agrega/quita la clase nav__menu--abierto y actualiza aria-expanded.
     */
    function toggleHamburguesa() {
      const abierto = navMenuEl.classList.toggle('nav__menu--abierto');
      hamburguerEl.setAttribute('aria-expanded', abierto.toString());
    }

    /**
     * Cierra el menú móvil al hacer clic en un enlace.
     */
    function cerrarMenuMovil() {
      navMenuEl.classList.remove('nav__menu--abierto');
      hamburguerEl.setAttribute('aria-expanded', 'false');
    }

    /* Registrar listeners de navegación */
    window.addEventListener('scroll', manejarScroll, { passive: true });
    hamburguerEl.addEventListener('click', toggleHamburguesa);
    navMenuEl.querySelectorAll('.nav__enlace').forEach(a => a.addEventListener('click', cerrarMenuMovil));

    /* -----------------------------------------------------------
       4. MÓDULO: MENÚ
          Renderiza tarjetas según la categoría activa.
          Cada tarjeta tiene un enlace "Pedir" que abre WhatsApp
          con el nombre del plato pre-rellenado.
    ----------------------------------------------------------- */

    /** Contenedor donde se inyectan las tarjetas */
    const menuGridEl = document.getElementById('menuGrid');

    /** Pestañas de categorías */
    const menuTabs   = document.querySelectorAll('.menu__tab');

    /** Categoría seleccionada al inicio */
    let categoriaActual = 'platos';

    /**
     * Genera el HTML de una tarjeta de plato.
     * @param {Object} plato – Objeto del catálogo MENU_DATOS.
     * @returns {string}       Fragmento HTML de la tarjeta.
     */
    function crearTarjeta(plato) {
      /* Mensaje pre-rellenado para WhatsApp */
      const msg = encodeURIComponent(
        `Hola, quiero pedir: *${plato.nombre}* – C$${plato.precio}`
      );
      const urlWA = `https://wa.me/50581675714?text=${msg}`;

      return `
        <!-- Tarjeta de plato: ${plato.nombre} -->
        <article class="menu__tarjeta" aria-label="${plato.nombre}">
          <div class="menu__tarjeta-imagen" aria-hidden="true">${plato.emoji}</div>
          <div class="menu__tarjeta-cuerpo">
            <h3 class="menu__tarjeta-nombre">${plato.nombre}</h3>
            <p class="menu__tarjeta-descripcion">${plato.descripcion}</p>
            <div class="menu__tarjeta-pie">
              <span class="menu__tarjeta-precio">C$${plato.precio}</span>
              <a
                href="${urlWA}"
                target="_blank" rel="noopener"
                class="menu__tarjeta-btn"
                aria-label="Pedir ${plato.nombre} por WhatsApp"
              >💬 Pedir</a>
            </div>
          </div>
        </article>
      `;
    }

    /**
     * Filtra el catálogo por categoría y re-renderiza el grid.
     * @param {string} categoria – Clave de categoría.
     */
    function renderizarMenu(categoria) {
      const filtrados = MENU_DATOS.filter(p => p.categoria === categoria);

      /* Animación de salida */
      menuGridEl.style.opacity = '0';

      setTimeout(() => {
        menuGridEl.innerHTML = filtrados.length
          ? filtrados.map(crearTarjeta).join('')
          : '<p style="color:var(--c-gris);text-align:center;padding:2rem 0;">Sin platos en esta categoría.</p>';

        /* Animación de entrada */
        menuGridEl.style.transition = 'opacity .3s ease';
        menuGridEl.style.opacity    = '1';
      }, 160);
    }

    /**
     * Maneja el clic en una pestaña de categoría.
     * @param {Event} e – Evento clic.
     */
    function seleccionarCategoria(e) {
      const tab      = e.currentTarget;
      const nueva    = tab.dataset.categoria;
      if (nueva === categoriaActual) return;
      categoriaActual = nueva;

      /* Actualizar estados visuales de pestañas */
      menuTabs.forEach(t => {
        t.classList.remove('menu__tab--activo');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('menu__tab--activo');
      tab.setAttribute('aria-selected', 'true');

      renderizarMenu(categoriaActual);
    }

    /* Registrar clic en cada pestaña */
    menuTabs.forEach(tab => tab.addEventListener('click', seleccionarCategoria));

    /* Renderizado inicial con "Platos Fuertes" */
    renderizarMenu(categoriaActual);

    /* -----------------------------------------------------------
       5. MÓDULO: TESTIMONIOS
          Rota los testimonios al hacer clic en el botón "›"
          o automáticamente cada 6 segundos.
    ----------------------------------------------------------- */

    /** Índice del testimonio actualmente visible */
    let idxTestimonio = 0;

    /** Referencia al botón de siguiente */
    const btnTestimonio = document.getElementById('btnTestimonio');

    /**
     * Actualiza el contenido de la tarjeta de testimonio
     * con el objeto del array TESTIMONIOS en el índice dado.
     * @param {number} idx – Índice del testimonio.
     */
    function mostrarTestimonio(idx) {
      const t      = TESTIMONIOS[idx];
      const citaEl = document.querySelector('.testimonio__cita');
      const nomEl  = document.querySelector('.testimonio__nombre');
      const rolEl  = document.querySelector('.testimonio__rol');

      /* Animar opacidad */
      citaEl.style.opacity = '0';
      setTimeout(() => {
        citaEl.textContent  = t.cita;
        nomEl.textContent   = t.nombre;
        rolEl.textContent   = t.rol;
        citaEl.style.transition = 'opacity .35s ease';
        citaEl.style.opacity = '1';
      }, 200);
    }

    /**
     * Avanza al siguiente testimonio (con ciclo).
     */
    function siguienteTestimonio() {
      idxTestimonio = (idxTestimonio + 1) % TESTIMONIOS.length;
      mostrarTestimonio(idxTestimonio);
    }

    /* Listener del botón y rotación automática */
    btnTestimonio.addEventListener('click', siguienteTestimonio);
    setInterval(siguienteTestimonio, 6000);

    /* -----------------------------------------------------------
       6. MÓDULO: RESERVACIONES
          · Valida todos los campos del lado del cliente.
          · Envía los datos al backend (api/reservaciones.php)
            mediante fetch() con Content-Type JSON.
          · Abre WhatsApp con un mensaje resumen de la reserva.
    ----------------------------------------------------------- */

    /** Formulario de reserva */
    const reservaFormEl    = document.getElementById('reservaForm');

    /** Área de mensaje de resultado */
    const mensajeReservaEl = document.getElementById('mensajeReserva');

    /** Campo de nota (para el contador) */
    const notaEl           = document.getElementById('nota');

    /** Contador de caracteres de la nota */
    const contadorNotaEl   = document.getElementById('contadorNota');

    /* Actualizar contador de nota en tiempo real */
    notaEl.addEventListener('input', () => {
      contadorNotaEl.textContent = `${notaEl.value.length} / 500`;
    });

    /**
     * Muestra un mensaje de error debajo de un campo.
     * @param {string} inputId  – ID del campo con error.
     * @param {string} errorId  – ID del span de error.
     * @param {string} mensaje  – Texto del error.
     */
    function mostrarError(inputId, errorId, mensaje) {
      const campo = document.getElementById(inputId);
      const span  = document.getElementById(errorId);
      if (campo) campo.classList.add('reserva__input--error');
      if (span)  span.textContent = mensaje;
    }

    /**
     * Limpia todos los errores de validación del formulario.
     */
    function limpiarErrores() {
      document.querySelectorAll('.reserva__input--error').forEach(el =>
        el.classList.remove('reserva__input--error')
      );
      document.querySelectorAll('.reserva__error').forEach(el =>
        el.textContent = ''
      );
      mensajeReservaEl.className  = 'reserva__mensaje';
      mensajeReservaEl.textContent = '';
    }

    /**
     * Valida todos los campos del formulario de reserva.
     * @param {Object} d – Objeto con los valores del formulario.
     * @returns {boolean} true si el formulario es válido.
     */
    function validarReserva(d) {
      let ok = true;

      /* Validar nombre */
      if (!d.nombre || d.nombre.length < 2) {
        mostrarError('nombre', 'errorNombre', 'El nombre debe tener al menos 2 caracteres.');
        ok = false;
      }

      /* Validar primer apellido */
      if (!d.primerApellido || d.primerApellido.length < 2) {
        mostrarError('primerApellido', 'errorPrimerApellido', 'El primer apellido es obligatorio.');
        ok = false;
      }

      /* Validar teléfono */
      if (!d.telefono || !/^[\+]?[0-9\s\-]{7,15}$/.test(d.telefono)) {
        mostrarError('telefono', 'errorTelefono', 'Ingresa un número de teléfono válido.');
        ok = false;
      }

      /* Validar edad */
      const edad = parseInt(d.edad, 10);
      if (isNaN(edad) || edad < 1 || edad > 120) {
        mostrarError('edad', 'errorEdad', 'Ingresa una edad válida (1 – 120).');
        ok = false;
      }

      /* Validar fecha de reserva */
      if (!d.fechaReserva) {
        mostrarError('fechaReserva', 'errorFecha', 'Selecciona la fecha y hora de reserva.');
        ok = false;
      } else if (new Date(d.fechaReserva) < new Date()) {
        mostrarError('fechaReserva', 'errorFecha', 'La fecha no puede estar en el pasado.');
        ok = false;
      }

      return ok;
    }

    /**
     * Construye y abre un enlace de WhatsApp con el resumen
     * de la reservación para notificar al restaurante.
     * @param {Object} d – Datos de la reservación.
     */
    function notificarWhatsApp(d) {
      const texto = encodeURIComponent(
        `*Nueva Reservación – El Sabor de la Vida*\n\n` +
        `Nombre:    ${d.nombre} ${d.primerApellido} ${d.segundoApellido}\n` +
        `Teléfono:  ${d.telefono}\n` +
        `Edad:      ${d.edad}\n` +
        `Fecha:     ${d.fechaReserva}\n` +
        `Nota:      ${d.nota || 'Sin notas adicionales'}`
      );
      window.open(`https://wa.me/50581675714?text=${texto}`, '_blank', 'noopener');
    }

    /**
     * Maneja el envío del formulario de reservación.
     * 1. Previene el submit nativo.
     * 2. Limpia errores anteriores.
     * 3. Serializa y valida los datos.
     * 4. Envía al backend via fetch().
     * 5. Si hay éxito, abre WhatsApp y resetea el form.
     * @param {Event} e – Evento submit.
     */
    async function manejarReserva(e) {
      e.preventDefault();
      limpiarErrores();

      /* Serializar datos del formulario */
      const datos = {
        nombre:          document.getElementById('nombre').value.trim(),
        primerApellido:  document.getElementById('primerApellido').value.trim(),
        segundoApellido: document.getElementById('segundoApellido').value.trim(),
        telefono:        document.getElementById('telefono').value.trim(),
        edad:            document.getElementById('edad').value,
        fechaReserva:    document.getElementById('fechaReserva').value,
        nota:            notaEl.value.trim()
      };

      /* Validar – si falla, detener aquí */
      if (!validarReserva(datos)) return;

      /* Actualizar estado del botón */
      const btnEl = document.getElementById('btnReservar');
      btnEl.textContent = '⏳ Enviando...';
      btnEl.classList.add('btn--cargando');

      try {
        /* ── Enviar datos al backend ── */
        const respuesta = await fetch('api/reservaciones.php', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.exito) {
          /* Éxito: mostrar mensaje verde */
          mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--exito';
          mensajeReservaEl.textContent =
            `✅ ¡Reservación confirmada! Te contactaremos al ${datos.telefono} para confirmar tu mesa.`;

          /* Resetear formulario y contador */
          reservaFormEl.reset();
          contadorNotaEl.textContent = '0 / 500';

          /* Notificar al restaurante vía WhatsApp */
          notificarWhatsApp(datos);

        } else {
          /* Error del servidor */
          mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--error';
          mensajeReservaEl.textContent = resultado.mensaje || '❌ Error al procesar. Intenta de nuevo.';
        }

      } catch (err) {
        /* Error de red: ofrecer WhatsApp como alternativa */
        console.error('[Reserva] Error de red:', err);
        mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--error';
        mensajeReservaEl.textContent =
          'Puedes reservar directamente por WhatsApp.';

        /* Abrir WhatsApp aunque haya fallo de red */
        notificarWhatsApp(datos);
      } finally {
        /* Restaurar botón siempre */
        btnEl.textContent = '📅 Confirmar Reservación';
        btnEl.classList.remove('btn--cargando');
      }
    }

    /* Registrar listener del formulario */
    reservaFormEl.addEventListener('submit', manejarReserva);

    /* -----------------------------------------------------------
       7. MÓDULO: BOLETÍN
          Envía el correo al endpoint api/boletin.php.
          En modo offline muestra un mensaje de éxito igualmente.
    ----------------------------------------------------------- */

    /** Formulario del boletín en el pie de página */
    const boletinFormEl = document.getElementById('boletinForm');

    /**
     * Maneja el envío del boletín.
     * @param {Event} e – Evento submit.
     */
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
      } catch { /* Fallo silencioso de red */ }

      /* Siempre mostrar confirmación al usuario */
      boletinFormEl.innerHTML = '<p style="color:rgba(255,255,255,.9);font-size:.875rem;">✅ ¡Suscrito exitosamente!</p>';
    }

    boletinFormEl.addEventListener('submit', manejarBoletin);

    /* -----------------------------------------------------------
       8. MÓDULO: ANIMACIONES POR SCROLL
          IntersectionObserver revela elementos con la clase
          .animar cuando entran al viewport.
    ----------------------------------------------------------- */

    /**
     * Observer de entrada al viewport.
     * Threshold 0.15 = se activa cuando el 15% es visible.
     */
    const scrollObs = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('animar');
            obs.unobserve(entrada.target); /* Observar solo una vez */
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    /**
     * Registra elementos para la animación de scroll.
     * Se ocultan inicialmente y el observer los revela.
     */
    function registrarAnimaciones() {
      const selectores = [
        '.menu__tarjeta',
        '.promo__tarjeta',
        '.galeria__celda',
        '.catering__icono',
        '.nosotros__texto',
        '.testimonio'
      ];

      document.querySelectorAll(selectores.join(', ')).forEach(el => {
        el.style.opacity = '0'; /* Ocultar para animar después */
        scrollObs.observe(el);
      });
    }

    /* -----------------------------------------------------------
       9. INICIALIZACIÓN
          Se ejecuta cuando el DOM está completamente cargado.
    ----------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {

      /* Establecer fecha mínima del campo de reserva = ahora */
      const fechaEl = document.getElementById('fechaReserva');
      if (fechaEl) {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        fechaEl.min = ahora.toISOString().slice(0, 16);
      }

      /* Ejecutar scroll inicial para activar enlace correcto */
      manejarScroll();

      /* Registrar animaciones de scroll (con pequeño delay para el DOM) */
      setTimeout(registrarAnimaciones, 100);
    });