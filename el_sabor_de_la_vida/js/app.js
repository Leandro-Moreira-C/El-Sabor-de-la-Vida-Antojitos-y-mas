/* ===========================================================
       APP.JS – El Sabor de la Vida
    =========================================================== */

    const SUPABASE_URL    = 'https://tmgvgzagroxvtwrnkoij.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ3ZnemFncm94dnR3cm5rb2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTI3MzQsImV4cCI6MjA5NjAyODczNH0.lYh3TDIQyoY5as0n6HRmwIFmv5EvM5felNBBI90WcuY';

    async function guardarEnSupabase(datos) {
      const payload = {
        nombre:           datos.nombre,
        primer_apellido:  datos.primerApellido,
        segundo_apellido: datos.segundoApellido || null,
        telefono:         datos.telefono,
        edad:             parseInt(datos.edad, 10),
        fecha_reserva:    datos.fechaReserva,
        nota:             datos.nota || null
      };
      const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/reservaciones`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':         SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer':         'return=minimal'
        },
        body: JSON.stringify(payload)
      });
      if (respuesta.ok) {
        return { ok: true };
      } else {
        const err = await respuesta.json().catch(() => ({}));
        return { ok: false, error: err.message || `Error ${respuesta.status}` };
      }
    }

    const MENU_DATOS = [

      /* ---------- PLATOS FUERTES ---------- */
      { id: 1, categoria: 'platos', nombre: 'Pollo', descripcion: 'Fajitas, Filete Jalapeño o Brochetas. Acompañado de arroz, ensalada, encurtido, papas o tostones.', precio: 320, emoji: '🍗' },
      { id: 2, categoria: 'platos', nombre: 'Res', descripcion: 'Churrasco, Fajitas, Filete Jalapeño o Brochetas. Acompañado de arroz, ensalada, encurtido, papas o tostones.', precio: 450, emoji: '🥩' },
      { id: 3, categoria: 'platos', nombre: 'Cerdo', descripcion: 'Chuleta Ahumada. Acompañado de arroz, ensalada, encurtido, papas o tostones.', precio: 300, emoji: '🍖' },
      { id: 4, categoria: 'platos', nombre: 'Pescado', descripcion: 'Filete, Empanizado, Al Ajillo o Deditos. Acompañado de arroz, ensalada, encurtido, papas o tostones.', precio: 300, emoji: '🐟' },
      { id: 5, categoria: 'platos', nombre: 'Camarones', descripcion: 'Empanizados o Al Ajillo. Acompañado de arroz, ensalada, encurtido, papas o tostones.', precio: 430, emoji: '🍤' },

      /* ---------- ANTOJITOS Y MÁS ---------- */
      { id: 6, categoria: 'antojitos', nombre: 'Alitas de Pollo BBQ / Búfalo', descripcion: 'Acompañadas de papas western, papas francesas o tostones.', precio: 320, emoji: '🍗',
        variantes: [
          { nombre: '6 unidades', precio: 320 },
          { nombre: '8 unidades', precio: 380 },
          { nombre: '12 unidades', precio: 600 }
        ]
      },
      { id: 7, categoria: 'antojitos', nombre: 'Tostones con Carne de Res y Mixtos', descripcion: 'Variedad de carnes sobre tostones.', precio: 350, emoji: '🍌',
        variantes: [
          { nombre: 'Carne de Res', precio: 350 },
          { nombre: 'Mixtos', precio: 370 }
        ]
      },
      { id: 8, categoria: 'antojitos', nombre: 'Tostones con Queso', descripcion: 'Tostones con queso frito.', precio: 200, emoji: '🧀' },
      { id: 9, categoria: 'antojitos', nombre: 'Costilla de Cerdo', descripcion: 'Ahumada, Natural, BBQ o Picante.', precio: 380, emoji: '🍖' },
      { id: 10, categoria: 'antojitos', nombre: 'Cazuela de Cerdo Frito con Queso', descripcion: 'Incluye pico de gallo, tajadas, tostón y frijoles molidos.', precio: 300, emoji: '🍲' },
      { id: 11, categoria: 'antojitos', nombre: 'Surtido de Chorizo (4 Unidades)', descripcion: 'Mexicano, Argentino, Italiano y Español. Incluye 4 salchichas, pico de gallo, tajadas, tostón y papas.', precio: 350, emoji: '🌭' },
      { id: 12, categoria: 'antojitos', nombre: 'Bowl de Papas', descripcion: 'Salchichas, papas y aderezos.', precio: 250, emoji: '🍟' },
      { id: 13, categoria: 'antojitos', nombre: 'Surtido Familiar Sabor de la Vida', descripcion: 'Para 4 personas. Incluye pollo, res, cerdo, chorizos, queso, maduro, papas, tajadas, gallopinto y encurtido.', precio: 1200, emoji: '🍽️' },

      /* ---------- NACHOS ESPECIALES ---------- */
      { id: 14, categoria: 'nachos', nombre: 'Nachos Especiales', descripcion: 'Personal: 1 proteína (Pollo o Res). 2 Personas: 2 proteínas. 4 Personas: Mixto (Pollo, Res, Cerdo).', precio: 300, emoji: '🌮',
        variantes: [
          { nombre: 'Personal (1 proteína: Pollo o Res)', precio: 300 },
          { nombre: '2 Personas (2 proteínas)', precio: 450 },
          { nombre: '4 Personas (Mixto: Pollo, Res, Cerdo)', precio: 600 }
        ]
      },

      /* ---------- ESPECIALES ---------- */
      { id: 15, categoria: 'especiales', nombre: 'Criadillas de Toro en Salsa Jalapeña y Roja Natural', descripcion: 'Acompañados con tortillas, tajadas o tostones.', precio: 350, emoji: '🍴' },

      /* ---------- CEVICHES ---------- */
      { id: 16, categoria: 'ceviches', nombre: 'Ceviche de Camarón', descripcion: 'Acompañado con galletas o tajadas verdes.', precio: 320, emoji: '🦐' },
      { id: 17, categoria: 'ceviches', nombre: 'Ceviche de Pescado', descripcion: 'Acompañado con galletas o tajadas verdes.', precio: 270, emoji: '🐠' },
      { id: 18, categoria: 'ceviches', nombre: 'Ceviche Mixto de Camarón y Pescado', descripcion: 'Acompañado con galletas o tajadas verdes.', precio: 380, emoji: '🐟' },
      { id: 19, categoria: 'ceviches', nombre: 'Conchas Negras (Temporal)', descripcion: 'Acompañado con galletas o tajadas verdes.', precio: 270, emoji: '🐚' },
      { id: 20, categoria: 'ceviches', nombre: 'Coctel de Camarones con Salsa Rosada', descripcion: 'Acompañado con galletas o tajadas verdes.', precio: 450, emoji: '🍤' },

      /* ---------- EXTRAS Y ADEREZOS ---------- */
      { id: 21, categoria: 'extras', nombre: 'Fuente de Hielo', descripcion: 'Acompañamiento extra.', precio: 40, emoji: '🧊' },
      { id: 22, categoria: 'extras', nombre: 'Liga de Ron', descripcion: 'Acompañamiento extra.', precio: 40, emoji: '🥤' },
      { id: 23, categoria: 'extras', nombre: 'Limón', descripcion: 'Acompañamiento extra.', precio: 10, emoji: '🍋' },
      { id: 24, categoria: 'extras', nombre: 'Vaso de Hielo', descripcion: 'Acompañamiento extra.', precio: 20, emoji: '🧊' },
      { id: 25, categoria: 'extras', nombre: 'Papas Western', descripcion: 'Acompañamiento extra.', precio: 70, emoji: '🍟' },
      { id: 26, categoria: 'extras', nombre: 'Papas Francesas', descripcion: 'Acompañamiento extra.', precio: 50, emoji: '🍟' },
      { id: 27, categoria: 'extras', nombre: 'Frijoles Molidos', descripcion: 'Acompañamiento extra.', precio: 50, emoji: '🫘' },
      { id: 28, categoria: 'extras', nombre: 'Tajadas Verdes', descripcion: 'Acompañamiento extra.', precio: 40, emoji: '🍌' },
      { id: 29, categoria: 'extras', nombre: 'Tostones', descripcion: 'Acompañamiento extra.', precio: 40, emoji: '🍌' },
      { id: 30, categoria: 'extras', nombre: 'Queso', descripcion: 'Acompañamiento extra.', precio: 40, emoji: '🧀' },
      { id: 31, categoria: 'extras', nombre: 'Ensalada', descripcion: 'Acompañamiento extra.', precio: 50, emoji: '🥗' },
      { id: 32, categoria: 'extras', nombre: 'Pico de Gallo', descripcion: 'Acompañamiento extra.', precio: 30, emoji: '🍅' },
      { id: 33, categoria: 'extras', nombre: 'Salsa Ranch', descripcion: 'Aderezo / Salsa.', precio: 40, emoji: '🥄' },
      { id: 34, categoria: 'extras', nombre: 'Salsa Búfalo', descripcion: 'Aderezo / Salsa.', precio: 40, emoji: '🥄' },
      { id: 35, categoria: 'extras', nombre: 'Salsa BBQ', descripcion: 'Aderezo / Salsa.', precio: 40, emoji: '🥄' },
      { id: 36, categoria: 'extras', nombre: 'Chile Criollo', descripcion: 'Aderezo / Salsa.', precio: 30, emoji: '🌶️' },
      { id: 37, categoria: 'extras', nombre: 'Salsa de Tomate', descripcion: 'Aderezo / Salsa.', precio: 30, emoji: '🥄' },
      { id: 38, categoria: 'extras', nombre: 'Mostaza Miel', descripcion: 'Aderezo / Salsa.', precio: 40, emoji: '🥄' },
      { id: 39, categoria: 'extras', nombre: 'Queso Cheddar', descripcion: 'Aderezo / Salsa.', precio: 40, emoji: '🧀' },

      /* ---------- CERVEZAS (Nacionales + Cubetazos + Internacionales) ---------- */
      { id: 40, categoria: 'cervezas', nombre: 'Victoria Frost', descripcion: 'Botella regular o Litro.', precio: 45, emoji: '🍺',
        variantes: [
          { nombre: 'Botella regular', precio: 45 },
          { nombre: 'Litro', precio: 75 }
        ]
      },
      { id: 41, categoria: 'cervezas', nombre: 'Victoria Clásica', descripcion: 'Botella regular o Litro.', precio: 55, emoji: '🍺',
        variantes: [
          { nombre: 'Botella regular', precio: 55 },
          { nombre: 'Litro', precio: 90 }
        ]
      },
      { id: 42, categoria: 'cervezas', nombre: 'Toña', descripcion: 'Botella regular o Litro.', precio: 55, emoji: '🍺',
        variantes: [
          { nombre: 'Botella regular', precio: 55 },
          { nombre: 'Litro', precio: 90 }
        ]
      },
      { id: 43, categoria: 'cervezas', nombre: 'Toña Ultra', descripcion: 'Botella regular.', precio: 55, emoji: '🍺' },
      { id: 44, categoria: 'cervezas', nombre: 'Toña Light', descripcion: 'Botella regular.', precio: 55, emoji: '🍺' },
      { id: 45, categoria: 'cervezas', nombre: 'Boreal', descripcion: 'Botella regular.', precio: 65, emoji: '🍺' },
      { id: 46, categoria: 'cervezas', nombre: 'Smirnoff Ice', descripcion: 'Red, Raspberry o Green Apple.', precio: 80, emoji: '🍹' },
      { id: 47, categoria: 'cervezas', nombre: 'Bliss', descripcion: 'Frutas Mixtas.', precio: 75, emoji: '🍹' },
      { id: 48, categoria: 'cervezas', nombre: 'Bamboo', descripcion: 'Botella regular o Lata 473 ml.', precio: 60, emoji: '🍺',
        variantes: [
          { nombre: 'Botella regular', precio: 60 },
          { nombre: 'Lata 473 ml', precio: 75 }
        ]
      },
      { id: 49, categoria: 'cervezas', nombre: 'Hard Seltzer Spark', descripcion: 'Botella regular.', precio: 55, emoji: '🍹' },
      { id: 50, categoria: 'cervezas', nombre: 'Adán y Eva', descripcion: 'Botella regular.', precio: 65, emoji: '🍺' },
      { id: 51, categoria: 'cervezas', nombre: 'Cubetazo Victoria Frost', descripcion: 'Promoción: Pedí 6 y pagá 5. Precio total del cubetazo.', precio: 225, emoji: '🧊' },
      { id: 52, categoria: 'cervezas', nombre: 'Cubetazo Victoria Clásica, Toña o Toña Light', descripcion: 'Promoción: Pedí 6 y pagá 5. Precio total del cubetazo.', precio: 275, emoji: '🧊' },
      { id: 53, categoria: 'cervezas', nombre: 'Miller Lite', descripcion: 'Cerveza internacional.', precio: 60, emoji: '🍺' },
      { id: 54, categoria: 'cervezas', nombre: 'Sol', descripcion: 'Cerveza internacional.', precio: 75, emoji: '🍺' },
      { id: 55, categoria: 'cervezas', nombre: 'Heineken', descripcion: 'Cerveza internacional.', precio: 82, emoji: '🍺' },
      { id: 56, categoria: 'cervezas', nombre: 'Heineken 0.0', descripcion: 'Cerveza internacional sin alcohol.', precio: 82, emoji: '🍺' },
      { id: 57, categoria: 'cervezas', nombre: 'Paulaner', descripcion: 'Cerveza internacional.', precio: 102, emoji: '🍺' },

      /* ---------- REFRESCOS ---------- */
      { id: 58, categoria: 'refrescos', nombre: 'Jugo de Naranja, Té Limón o Té de Jamaica', descripcion: 'Bebida sin alcohol.', precio: 50, emoji: '🥤' },
      { id: 59, categoria: 'refrescos', nombre: 'Limonada Fresa, Hierba Buena y Clásica', descripcion: 'Bebida sin alcohol.', precio: 80, emoji: '🍋',
        variantes: [
          { nombre: 'Presentación regular', precio: 80 },
          { nombre: 'Presentación grande', precio: 100 }
        ]
      },
      { id: 60, categoria: 'refrescos', nombre: 'Hi-C Té, Frutas y Manzanas', descripcion: 'Bebida sin alcohol.', precio: 35, emoji: '🧃',
        variantes: [
          { nombre: 'Presentación regular', precio: 35 },
          { nombre: 'Presentación grande', precio: 50 }
        ]
      },
      { id: 61, categoria: 'refrescos', nombre: 'Botella de Agua', descripcion: 'Bebida sin alcohol.', precio: 35, emoji: '💧' },

      /* ---------- LICORES Y CÓCTELES (+ Importados) ---------- */
      { id: 62, categoria: 'licores', nombre: 'Flor de Caña Centenario 18', descripcion: 'Media (1/2).', precio: 1200, emoji: '🥃' },
      { id: 63, categoria: 'licores', nombre: 'Flor de Caña Centenario 12', descripcion: 'Media (1/2).', precio: 900, emoji: '🥃' },
      { id: 64, categoria: 'licores', nombre: 'Flor de Caña Gran Reserva 7', descripcion: 'Media (1/2).', precio: 400, emoji: '🥃' },
      { id: 65, categoria: 'licores', nombre: 'Flor de Caña Extra Lite', descripcion: 'Media (1/2).', precio: 270, emoji: '🥃' },
      { id: 66, categoria: 'licores', nombre: 'Flor de Caña Ultra Lite', descripcion: 'Media (1/2).', precio: 250, emoji: '🥃' },
      { id: 67, categoria: 'licores', nombre: 'Flor de Caña Cristalino', descripcion: 'Media (1/2).', precio: 265, emoji: '🥃' },
      { id: 68, categoria: 'licores', nombre: 'Seltzer FDC', descripcion: 'Lata.', precio: 60, emoji: '🍹' },
      { id: 69, categoria: 'licores', nombre: 'Margarita', descripcion: 'Copa / Vaso.', precio: 180, emoji: '🍸' },
      { id: 70, categoria: 'licores', nombre: 'Daiquirí de Fresa', descripcion: 'Copa / Vaso.', precio: 180, emoji: '🍹' },
      { id: 71, categoria: 'licores', nombre: 'Piña Colada', descripcion: 'Copa / Vaso.', precio: 150, emoji: '🍹' },
      { id: 72, categoria: 'licores', nombre: 'Sangría', descripcion: 'Copa / Vaso.', precio: 180, emoji: '🍷' },
      { id: 73, categoria: 'licores', nombre: 'Chelada / Michelada', descripcion: 'Tamarindo u Original.', precio: 50, emoji: '🍺' },
      { id: 74, categoria: 'licores', nombre: 'José Cuervo', descripcion: 'Shot.', precio: 130, emoji: '🥃' },
      { id: 75, categoria: 'licores', nombre: 'Cerro de Oro', descripcion: 'Shot.', precio: 80, emoji: '🥃' },
      { id: 76, categoria: 'licores', nombre: 'Johnnie Walker Black Label', descripcion: 'Trago o Media (1/2).', precio: 200, emoji: '🥃',
        variantes: [
          { nombre: 'Trago', precio: 200 },
          { nombre: 'Media (1/2)', precio: 1800 }
        ]
      },
      { id: 77, categoria: 'licores', nombre: 'Johnnie Walker Red Label', descripcion: 'Trago o Media (1/2).', precio: 100, emoji: '🥃',
        variantes: [
          { nombre: 'Trago', precio: 100 },
          { nombre: 'Media (1/2)', precio: 900 }
        ]
      },
      { id: 78, categoria: 'licores', nombre: 'Vodka Finlandia', descripcion: 'Trago o Media (1/2).', precio: 70, emoji: '🥃',
        variantes: [
          { nombre: 'Trago', precio: 70 },
          { nombre: 'Media (1/2)', precio: 700 }
        ]
      },
      { id: 79, categoria: 'licores', nombre: 'Vodka Stolichnaya', descripcion: 'Trago o Media (1/2).', precio: 100, emoji: '🥃',
        variantes: [
          { nombre: 'Trago', precio: 100 },
          { nombre: 'Media (1/2)', precio: 1000 }
        ]
      },
      { id: 80, categoria: 'licores', nombre: 'Extras de Hielo y Limón', descripcion: 'Adicional de hielo o limón.', precio: 30, emoji: '🧊',
        variantes: [
          { nombre: 'Hielo', precio: 30 },
          { nombre: 'Limón', precio: 20 }
        ]
      }

    ];

    const TESTIMONIOS = [
      { cita: '"La comida más auténtica de Ticuantepe. Cada vez que vengo me siento como en la casa de mi abuela en Nicaragua."', nombre: 'María González', rol: 'Cliente frecuente' },
      { cita: '"El gallo pinto de aquí no tiene competencia. Siempre que vuelvo a Nicaragua vengo al Sabor de la Vida."',         nombre: 'Carlos Mejía',   rol: 'Cliente habitual' },
      { cita: '"Organizaron el catering de nuestra boda y todo estuvo perfecto. La comida llegó caliente y deliciosa."',          nombre: 'Ana Rodríguez',  rol: 'Evento corporativo' }
    ];

    /* -----------------------------------------------------------
       SISTEMA DE VISTAS
       El Hero (#inicio) siempre visible.
       Las demás secciones se muestran/ocultan según el nav.
    ----------------------------------------------------------- */


     const VISTA_DEFECTO = 'inicio';

    function mostrarVista(idVista) {
      document.querySelectorAll('[data-vista]:not([data-vista="Bienvenida"])').forEach(sec => {
        sec.classList.add('vista--oculta');
      });
      if (idVista === 'Bienvenida') {
        document.querySelectorAll('[data-vista="Bienvenida"]').forEach(sec => {
          sec.classList.remove('vista--oculta');
        });
      } else if (idVista === 'inicio') {
        document.querySelectorAll('[data-vista="inicio"]').forEach(sec => {
          sec.classList.remove('vista--oculta');
        });
      } else {
        document.querySelectorAll('[data-vista="' + idVista + '"]').forEach(function(el) {
          el.classList.remove('vista--oculta');
        });
      }


    document.querySelectorAll('.nav__enlace').forEach(function(a) {
        var href = a.getAttribute('href').replace('#', '');
        a.classList.toggle('nav__enlace--activo', href === idVista);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function inicializarVistas() {
      var hash = window.location.hash.replace('#', '') || VISTA_DEFECTO;
      mostrarVista(hash);

      document.querySelectorAll('.nav__enlace, .nav__cta, .footer__enlace').forEach(function(a) {
        a.addEventListener('click', function(e) {
          var href = a.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            var id = href.replace('#', '');
            window.location.hash = id;
            mostrarVista(id);
            cerrarMenuMovil();
          }
        });
      });

      window.addEventListener('hashchange', function() {
        var id = window.location.hash.replace('#', '') || VISTA_DEFECTO;
        mostrarVista(id);
      });
    }

    /* -----------------------------------------------------------
       NAVEGACIÓN
    ----------------------------------------------------------- */
    const heroSlides   = document.querySelectorAll('.hero__slide');
    const navEl        = document.getElementById('nav');
    const hamburguerEl = document.getElementById('hamburger');
    const navMenuEl    = document.getElementById('navMenu');

    let heroSlideActual = 0;

    function avanzarHeroSlide() {
      if (heroSlides.length <= 1) return;
      heroSlides[heroSlideActual].classList.remove('hero__slide--activo');
      heroSlideActual = (heroSlideActual + 1) % heroSlides.length;
      heroSlides[heroSlideActual].classList.add('hero__slide--activo');
    }

    if (heroSlides.length > 1) setInterval(avanzarHeroSlide, 10000);

    function manejarScroll() {
      navEl.classList.toggle('nav--scrolled', window.scrollY > 20);
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
       MENÚ  (variables y funciones puras – sin acceso al DOM)
    ----------------------------------------------------------- */
    let menuGridEl      = null;
    let categoriaActual = 'platos';

    function crearTarjeta(plato) {
      const tieneVariantes = Array.isArray(plato.variantes) && plato.variantes.length > 0;
      const msg   = encodeURIComponent(`Hola, quiero pedir: *${plato.nombre}* – C$${plato.precio}`);
      const urlWA = `https://wa.me/50589472132?text=${msg}`;

      const pieAccion = tieneVariantes
        ? `<button type="button" class="menu__tarjeta-btn menu__tarjeta-btn--opciones" data-plato-id="${plato.id}" aria-label="Ver opciones de ${plato.nombre}">🔍 Ver opciones</button>`
        : `<a href="${urlWA}" target="_blank" rel="noopener"
                 class="menu__tarjeta-btn" aria-label="Pedir ${plato.nombre} por WhatsApp">💬 Pedir</a>`;

      const etiquetaPrecio = tieneVariantes
        ? `<span class="menu__tarjeta-precio">Desde C$${plato.precio}</span>`
        : `<span class="menu__tarjeta-precio">C$${plato.precio}</span>`;

      return `
        <article class="menu__tarjeta" aria-label="${plato.nombre}">
          <div class="menu__tarjeta-imagen" aria-hidden="true">${plato.emoji}</div>
          <div class="menu__tarjeta-cuerpo">
            <h3 class="menu__tarjeta-nombre">${plato.nombre}</h3>
            <p class="menu__tarjeta-descripcion">${plato.descripcion}</p>
            <div class="menu__tarjeta-pie">
              ${etiquetaPrecio}
              ${pieAccion}
            </div>
          </div>
        </article>`;
    }

    /* -----------------------------------------------------------
       MODAL DE VARIANTES – muestra opciones y precios de un plato
    ----------------------------------------------------------- */
    let modalVariantesEl        = null;
    let modalVariantesOverlayEl = null;
    let modalVariantesCerrarEl  = null;
    let modalVariantesTituloEl  = null;
    let modalVariantesListaEl   = null;

    function abrirModalVariantes(platoId) {
      const plato = MENU_DATOS.find(p => p.id === Number(platoId));
      if (!plato || !Array.isArray(plato.variantes)) return;
      if (!modalVariantesEl) return;

      modalVariantesTituloEl.textContent = plato.nombre;
      modalVariantesListaEl.innerHTML = plato.variantes.map(v => {
        const msg   = encodeURIComponent(`Hola, quiero pedir: *${plato.nombre} (${v.nombre})* – C$${v.precio}`);
        const urlWA = `https://wa.me/50589472132?text=${msg}`;
        return `
          <div class="modal-variantes__item">
            <div class="modal-variantes__item-info">
              <span class="modal-variantes__item-nombre">${v.nombre}</span>
              <span class="modal-variantes__item-precio">C$${v.precio}</span>
            </div>
            <a href="${urlWA}" target="_blank" rel="noopener" class="btn btn--primario modal-variantes__item-btn">💬 Pedir</a>
          </div>`;
      }).join('');

      modalVariantesEl.classList.add('modal-variantes--abierto');
      modalVariantesEl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function cerrarModalVariantes() {
      if (!modalVariantesEl) return;
      modalVariantesEl.classList.remove('modal-variantes--abierto');
      modalVariantesEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrarModalVariantes();
    });

    function renderizarMenu(categoria) {
      if (!menuGridEl) return;
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
      const menuTabs = document.querySelectorAll('.menu__tab');
      const tab   = e.currentTarget;
      const nueva = tab.dataset.categoria;
      if (nueva === categoriaActual) return;
      categoriaActual = nueva;
      menuTabs.forEach(t => { t.classList.remove('menu__tab--activo'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('menu__tab--activo');
      tab.setAttribute('aria-selected', 'true');
      renderizarMenu(categoriaActual);
    }

    function inicializarMenu() {
      menuGridEl = document.getElementById('menuGrid');

      // Modal de variantes
      modalVariantesEl        = document.getElementById('modalVariantes');
      modalVariantesOverlayEl = document.getElementById('modalVariantesOverlay');
      modalVariantesCerrarEl  = document.getElementById('modalVariantesCerrar');
      modalVariantesTituloEl  = document.getElementById('modalVariantesTitulo');
      modalVariantesListaEl   = document.getElementById('modalVariantesLista');

      if (menuGridEl) {
        menuGridEl.addEventListener('click', (e) => {
          const btn = e.target.closest('.menu__tarjeta-btn--opciones');
          if (btn) abrirModalVariantes(btn.dataset.platoId);
        });
      }

      if (modalVariantesOverlayEl) modalVariantesOverlayEl.addEventListener('click', cerrarModalVariantes);
      if (modalVariantesCerrarEl)  modalVariantesCerrarEl.addEventListener('click', cerrarModalVariantes);

      const menuTabs = document.querySelectorAll('.menu__tab');
      menuTabs.forEach(tab => tab.addEventListener('click', seleccionarCategoria));
      renderizarMenu(categoriaActual);
    }

    /* -----------------------------------------------------------
       TESTIMONIOS
    ----------------------------------------------------------- */
    let idxTestimonio = 0;
    const btnTestimonio = document.getElementById('btnTestimonio');

    function mostrarTestimonio(idx) {
      const t      = TESTIMONIOS[idx];
      const citaEl = document.querySelector('.testimonio__cita');
      const nomEl  = document.querySelector('.testimonio__nombre');
      const rolEl  = document.querySelector('.testimonio__rol');
      if (!citaEl) return;
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

    if (btnTestimonio) {
      btnTestimonio.addEventListener('click', siguienteTestimonio);
      setInterval(siguienteTestimonio, 6000);
    }

    /* -----------------------------------------------------------
       RESERVACIONES
    ----------------------------------------------------------- */
    const reservaFormEl    = document.getElementById('reservaForm');
    const mensajeReservaEl = document.getElementById('mensajeReserva');
    const notaEl           = document.getElementById('nota');
    const contadorNotaEl   = document.getElementById('contadorNota');

    if (notaEl) {
      notaEl.addEventListener('input', () => {
        contadorNotaEl.textContent = `${notaEl.value.length} / 500`;
      });
    }

    function mostrarError(inputId, errorId, mensaje) {
      const campo = document.getElementById(inputId);
      const span  = document.getElementById(errorId);
      if (campo) campo.classList.add('reserva__input--error');
      if (span)  span.textContent = mensaje;
    }

    function limpiarErrores() {
      document.querySelectorAll('.reserva__input--error').forEach(el => el.classList.remove('reserva__input--error'));
      document.querySelectorAll('.reserva__error').forEach(el => el.textContent = '');
      if (mensajeReservaEl) { mensajeReservaEl.className = 'reserva__mensaje'; mensajeReservaEl.textContent = ''; }
    }

    function validarReserva(d) {
      let ok = true;
      if (!d.nombre || d.nombre.length < 2) { mostrarError('nombre', 'errorNombre', 'El nombre debe tener al menos 2 caracteres.'); ok = false; }
      if (!d.primerApellido || d.primerApellido.length < 2) { mostrarError('primerApellido', 'errorPrimerApellido', 'El primer apellido es obligatorio.'); ok = false; }
      if (!d.telefono || !/^[\+]?[0-9\s\-]{7,15}$/.test(d.telefono)) { mostrarError('telefono', 'errorTelefono', 'Ingresa un número de teléfono válido.'); ok = false; }
      const edad = parseInt(d.edad, 10);
      if (isNaN(edad) || edad < 1 || edad > 120) { mostrarError('edad', 'errorEdad', 'Ingresa una edad válida (1 – 120).'); ok = false; }
      if (!d.fechaReserva) { mostrarError('fechaReserva', 'errorFecha', 'Selecciona la fecha y hora de reserva.'); ok = false; }
      else if (new Date(d.fechaReserva) < new Date()) { mostrarError('fechaReserva', 'errorFecha', 'La fecha no puede estar en el pasado.'); ok = false; }
      return ok;
    }

    function notificarWhatsApp(d) {
      const fechaFormateada = new Date(d.fechaReserva).toLocaleString('es-NI', { dateStyle: 'full', timeStyle: 'short' });
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
      const btnEl = document.getElementById('btnReservar');
      btnEl.textContent = '⏳ Guardando reservación...';
      btnEl.disabled = true;
      btnEl.classList.add('btn--cargando');
      try {
        const resultado = await guardarEnSupabase(datos);
        if (resultado.ok) {
          mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--exito';
          mensajeReservaEl.textContent = `✅ ¡Reservación confirmada! Te contactaremos al ${datos.telefono} para confirmar tu mesa.`;
          reservaFormEl.reset();
          contadorNotaEl.textContent = '0 / 500';
          notificarWhatsApp(datos);
        } else {
          mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--error';
          mensajeReservaEl.textContent = '❌ No se pudo guardar la reservación. Por favor, intenta de nuevo o contáctanos por WhatsApp.';
        }
      } catch (err) {
        mensajeReservaEl.className   = 'reserva__mensaje reserva__mensaje--advertencia';
        mensajeReservaEl.textContent = '⚠️ Sin conexión al servidor. Te redirigimos a WhatsApp para completar tu reservación.';
        notificarWhatsApp(datos);
      } finally {
        btnEl.textContent = '📅 Confirmar Reservación';
        btnEl.disabled    = false;
        btnEl.classList.remove('btn--cargando');
      }
    }

    if (reservaFormEl) reservaFormEl.addEventListener('submit', manejarReserva);

    /* -----------------------------------------------------------
       BOLETÍN
    ----------------------------------------------------------- */
    const boletinFormEl = document.getElementById('boletinForm');

    async function manejarBoletin(e) {
      e.preventDefault();
      const correo = boletinFormEl.querySelector('input[name="correo"]').value.trim();
      if (!correo) return;
      try {
        await fetch('api/boletin.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo }) });
      } catch { /* Fallo silencioso */ }
      boletinFormEl.innerHTML = '<p style="color:rgba(255,255,255,.9);font-size:.875rem;">✅ ¡Suscrito exitosamente!</p>';
    }

    if (boletinFormEl) boletinFormEl.addEventListener('submit', manejarBoletin);

    /* -----------------------------------------------------------
       ANIMACIONES POR SCROLL
    ----------------------------------------------------------- */
    const scrollObs = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) { entrada.target.classList.add('animar'); obs.unobserve(entrada.target); }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    function registrarAnimaciones() {
      const selectores = ['.menu__tarjeta', '.promo__tarjeta', '.galeria__celda', '.catering__icono', '.nosotros__texto', '.testimonio'];
      document.querySelectorAll(selectores.join(', ')).forEach(el => {
        el.style.opacity = '0';
        scrollObs.observe(el);
      });
    }

    /* -----------------------------------------------------------
       INICIALIZACIÓN
    ----------------------------------------------------------- */
   document.addEventListener('DOMContentLoaded', function() {
  inicializarVistas();
  inicializarMenu();
  inicializarGaleria();
  var fechaEl = document.getElementById('fechaReserva');
  if (fechaEl) {
    var ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    fechaEl.min = ahora.toISOString().slice(0, 16);
  }
  manejarScroll();
  setTimeout(registrarAnimaciones, 100);
});


    /* -----------------------------------------------------------
   GALERÍA – Carrusel + Filtros
----------------------------------------------------------- */
function inicializarGaleria() {
  const pista    = document.getElementById('galeriaPista');
  const prevBtn  = document.getElementById('galeriaPrev');
  const nxtBtn   = document.getElementById('galeriaNxt');
  const puntosEl = document.getElementById('galeriaPuntos');
  const filtros  = document.querySelectorAll('.galeria-filtros__btn');
  if (!pista) return;

  let slides       = Array.from(pista.querySelectorAll('.galeria-carrusel__slide'));
  let visibles     = [...slides];
  let indice       = 0;
  let porPagina    = obtenerPorPagina();
  let autoTimer    = null;

  function obtenerPorPagina() {
    return window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 4;
  }

  function totalPaginas() {
    return Math.max(1, Math.ceil(visibles.length / porPagina));
  }

  function construirPuntos() {
    puntosEl.innerHTML = '';
    for (let i = 0; i < totalPaginas(); i++) {
      const p = document.createElement('button');
      p.className = 'galeria-carrusel__punto' + (i === indice ? ' galeria-carrusel__punto--activo' : '');
      p.setAttribute('aria-label', 'Página ' + (i + 1));
      p.addEventListener('click', () => { irA(i); reiniciarAuto(); });
      puntosEl.appendChild(p);
    }
  }

  function irA(idx) {
    indice = Math.max(0, Math.min(idx, totalPaginas() - 1));
    const offset = indice * porPagina * (visibles[0] ? visibles[0].offsetWidth + 16 : 0);
    pista.style.transform = 'translateX(-' + offset + 'px)';
    document.querySelectorAll('.galeria-carrusel__punto').forEach((p, i) => {
      p.classList.toggle('galeria-carrusel__punto--activo', i === indice);
    });
  }

  function siguiente() { irA(indice < totalPaginas() - 1 ? indice + 1 : 0); }
  function anterior()  { irA(indice > 0 ? indice - 1 : totalPaginas() - 1); }

  function iniciarAuto() {
    autoTimer = setInterval(siguiente, 4000);
  }
  function reiniciarAuto() {
    clearInterval(autoTimer);
    iniciarAuto();
  }

  function aplicarFiltro(cat) {
    indice = 0;
    slides.forEach(s => {
      const mostrar = (cat === 'todos' || s.dataset.cat === cat);
      s.style.display = mostrar ? '' : 'none';
    });
    visibles = slides.filter(s => s.style.display !== 'none');
    pista.style.transform = 'translateX(0)';
    construirPuntos();
    reiniciarAuto();
  }

  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('galeria-filtros__btn--activo'));
      btn.classList.add('galeria-filtros__btn--activo');
      aplicarFiltro(btn.dataset.filtro);
    });
  });

  prevBtn.addEventListener('click', () => { anterior(); reiniciarAuto(); });
  nxtBtn.addEventListener('click',  () => { siguiente(); reiniciarAuto(); });

  window.addEventListener('resize', () => {
    porPagina = obtenerPorPagina();
    indice = 0;
    pista.style.transform = 'translateX(0)';
    construirPuntos();
  });

  construirPuntos();
  iniciarAuto();
}