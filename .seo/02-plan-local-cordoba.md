# Plan SEO local · Córdoba y Andalucía

**Fecha:** 2026-07-27
**Punto de partida medido:** la portada menciona «Córdoba» 5 veces y **las 5 hablan de un cliente**, nunca de OpsPilot. «Andalucía», 1 vez, también de un cliente. Cero precio, cero «quiénes somos», cero testimonios.
**Valoración:** 7/10 como landing de conversión · **2/10 como activo local**.

---

## 0. La tesis

No hay que inventar autoridad local: **ya la tenéis y no la estáis declarando**. ObraFácil es de Puente Genil. J.R. Rodríguez es de Córdoba capital. Eso es relevancia local auténtica —la que ningún competidor puede fabricar— desperdiciada por no escribir dos palabras en los sitios correctos.

Y hay una ironía que además es el mejor argumento comercial que tenéis: **le construisteis a J.R. Rodríguez la arquitectura de páginas por servicio × ciudad que vosotros no usáis**. Él tiene `/reformas-banos-cordoba/`, `/reformas-cocinas-cordoba/` y una sección de zonas de actuación con ocho pueblos. Vosotros no tenéis ninguna. Estáis vendiendo algo que no os aplicáis.

---

## 1. Lo que necesito de ti (bloqueante)

Sin esto no se puede hacer la mitad del plan. Ordenado de más a menos urgente.

| # | Dato | Para qué | Bloquea |
|---|---|---|---|
| 1 | **Razón social, NIF y domicilio completo** | Aviso legal, política de privacidad, schema `LocalBusiness` | LSSI (ilegal sin ello), Fase 1 y el Bloque A entero |
| 2 | **Rango de precios orientativo** | Responder la objeción nº1 | Fase 2 |
| 3 | **Quiénes sois**: nombres, cargos, foto, desde cuándo | E-E-A-T y la objeción nº2 | Fase 2 |
| 4 | **¿Sois agente digitalizador del Kit Digital?** | Decide si atacamos el término con más intención comercial de todo el mapa | Fase 5 |
| 5 | **¿Podéis pedir testimonio a los 3 clientes?** | Prueba social real | Fase 2 |
| 6 | **Zonas donde trabajáis de verdad** | Página y bloque de cobertura sin mentir | Fase 3 |
| 7 | **¿Tenéis ficha de Google Business Profile?** | Es el mayor factor local, con diferencia | Fase 4 |

> ⚠️ El **1** no es una preferencia: sin aviso legal identificativo se incumple el artículo 10 de la LSSI, y ahora mismo el formulario del embudo recoge datos personales apuntando a una `/privacidad` que devuelve 404.

---

## 2. Fase 1 — Declarar dónde estáis *(no depende de nadie salvo el dato 1)*

La más barata y la de mayor retorno inmediato.

- **Portada**: que el `H1`, el `title` y la `description` digan Córdoba sin sonar forzado. Hoy dicen «para tu PYME» y «en España».
- **Schema**: el `@graph` ya declara `ProfessionalService` con `addressLocality: Córdoba` y coordenadas, pero **sin dirección postal real ni identificador fiscal**. Completarlo con el dato 1 y revisar `areaServed` para que cubra provincia y comunidad, no solo «España».
- **Pie de página**: dirección visible. Hoy solo hay email, WhatsApp y un «Córdoba, España» suelto.
- **Los casos, que ya son locales**: «empresa de reformas» → «empresa de reformas **de Córdoba**». ObraFácil: nombrar Puente Genil, que ya está en la narrativa pero no en resumen ni titulares.
- **Bloque de cobertura** en portada o pie, con las zonas del dato 6. Exactamente lo que tiene la web de vuestro cliente.

**Criterio de aceptación:** que «Córdoba» aparezca hablando de OpsPilot en el `title`, el `H1`, el pie y el schema.

---

## 3. Fase 2 — Responder las objeciones que hoy se quedan en el aire *(datos 2, 3, 5)*

De las siete objeciones típicas se responden bien tres. Las cuatro que faltan, por gravedad:

1. **¿Cuánto cuesta?** — Cero pistas. Se dice «precio cerrado» cuatro veces sin cerrar ninguno. Para quien ya ha pedido tres presupuestos, el silencio total se lee como «es caro y no lo dicen». Basta un rango honesto; filtra curiosos y multiplica confianza.
2. **¿Quiénes sois?** — Ni nombres, ni caras, ni antigüedad. Es la peor carencia de E-E-A-T de la web y encima la respuesta buena la tenéis: sois de aquí.
3. **¿Y si desaparecéis? ¿De quién es el código?** — La respuesta está escrita… en un artículo del blog, o sea donde no la lee quien está decidiendo. Súbela a la portada.
4. **Preguntas frecuentes en la portada** — Hoy no hay. Es contenido que Google lee, que responde objeciones y que admite marcado `FAQPage` (el componente ya existe y se usa en `/soluciones`).

**Testimonios**: tenéis el teléfono de los tres clientes. Un párrafo firmado por J.R. Rodríguez vale más que toda la tabla comparativa.

---

## 4. Fase 3 — Páginas locales *(dato 6, y alguien que escriba)*

`/desarrollo-software-cordoba/` y `/diseno-web-cordoba/`.

**Con una condición innegociable, aprendida ya en este proyecto:** entre 700 y 900 palabras propias cada una. Publicar dos páginas flacas sobre un dominio con **3 páginas indexadas de 22** es la forma más rápida de que Google deje de rastrear el sitio. Si no hay quien escriba, no se publican — y no pasa nada, porque las Fases 1 y 2 ya mueven la aguja.

Ver `.seo/01-rutas-y-metadatos.md` para el formato de la tabla de metadatos.

---

## 5. Fase 4 — Fuera de la web *(datos 4 y 7)*

**Google Business Profile es lo primero y lo más importante de todo este documento.** Es gratis y para «empresa de software en Córdoba» decide el resultado antes que cualquier enlace. Si no existe, crearla; si existe, completarla con categoría, fotos, servicios y horario.

**Citaciones locales**: directorios andaluces, cámara de comercio, guías sectoriales. Con **nombre, dirección y teléfono idénticos** en todos los sitios — la coherencia es lo que cuenta, y por eso el dato 1 va primero y por eso existe `src/lib/company.ts` como fuente única.

### Sobre poner enlaces vuestros en las webs de vuestros clientes

La idea es buena a medias, y la mitad mala tiene coste.

Google lista explícitamente como **esquema de enlaces** los «enlaces ampliamente distribuidos en los pies de página o plantillas de varios sitios». El rastro es trivial de detectar: mismo texto de enlace, mismo generador, probablemente mismo hosting.

| Bajo riesgo | Esquema de enlaces |
|---|---|
| «OpsPilot» como texto del enlace (marca) | «diseño web Córdoba» (palabra clave) |
| En **una** página del cliente | En el pie de **todas** sus páginas |
| Con permiso y como crédito de autoría | Como táctica de posicionamiento |

Y un problema de tamaño: con tres o cuatro webs de cliente el impacto es casi nulo aunque se haga bien. **No vas a mover posiciones con eso.** Lo que sí las mueve es la ficha de Google, decir dónde estáis, y que vuestros casos —que ya son de Córdoba y Puente Genil— lo digan.

---

## 6. Fase 5 — Kit Digital *(dato 4)*

Si sois agente digitalizador adherido, **«kit digital córdoba» y «agente digitalizador córdoba» son los términos con más intención comercial de todo el mapa**: gente con subvención concedida y prisa por gastarla. Merece su propia página y su propio bloque en portada.

Si no lo sois, es una decisión de negocio que merece la pena valorar antes de invertir en lo demás.

---

## 7. Orden de ejecución

1. **Dato 1** → páginas legales + Fase 1. Desbloquea también el Bloque A, que hoy no puede publicarse.
2. **Fase 4**: la ficha de Google Business Profile, en paralelo y desde ya.
3. **Fase 2**, según lleguen los datos 2, 3 y 5.
4. **Fase 3**, solo si hay quien escriba.
5. **Fase 5**, según el dato 4.

**Dependencia externa que sigue bloqueando todo:** la configuración de Nginx en el VPS (ver `DEPLOY.md`). Mientras cualquier URL inventada devuelva 200 con la home y las 21 URLs del sitemap devuelvan 301, publicar contenido nuevo es echar leña a un rastreo roto.

---

## 8. Medición

Congelar el punto de partida **antes** de tocar nada, porque con 6 clics en dos meses cualquier cambio va a parecer una mejora.

A las 4-6 semanas, en Search Console: impresiones y posición media filtrando consultas que contengan «córdoba», páginas indexadas (hoy **3 de 22**), y si aparecen las consultas locales que hoy no existen. En Google Business Profile: visualizaciones, llamadas y peticiones de ruta.

**Qué esperar honestamente:** las Fases 1 y 4 se notan en semanas porque el local es rápido. La Fase 3 tarda meses. Y nada de esto compensa un dominio de dos meses: la autoridad se gana con tiempo, y el trabajo aquí es no desperdiciar la que ya tenéis.
