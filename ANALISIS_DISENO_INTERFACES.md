# SDReservas: descripción desde el diseño de interfaces

## Propósito de la experiencia

SDReservas es una interfaz web para descubrir restaurantes y reservar una mesa de manera visual. Su propuesta de valor en la interfaz es reemplazar la reserva por llamada o por una selección abstracta con un proceso tangible: la persona puede elegir el restaurante, definir las condiciones de su visita y seleccionar una mesa directamente sobre el plano del local.

La experiencia se dirige principalmente a clientes que reservan una mesa, aunque incorpora una vista demostrativa para alternar a la perspectiva de recepción. El tono es aspiracional y gastronómico: prioriza la exploración de establecimientos y comunica una sensación de servicio premium, sereno y contemporáneo.

## Arquitectura de información y navegación

La interfaz se organiza en dos áreas principales:

| Área | Objetivo de la persona usuaria | Accesos principales |
| --- | --- | --- |
| Inicio | Explorar la oferta y entrar a un restaurante | Buscador, tarjetas de restaurantes, «Mis Reservas», perfil visual |
| Reserva de un restaurante | Configurar, seleccionar y confirmar una mesa; administrar reservas | Mapa de mesas, formulario de reserva, pestaña «Mis Reservas», cambio de rol |

El inicio funciona como punto de descubrimiento. Cada tarjeta de restaurante lleva al flujo de reserva de ese establecimiento. Dentro de la reserva, una navegación lateral en escritorio —o pestañas en móvil— separa dos tareas: crear una reserva y consultar las reservas existentes. El logotipo permite regresar al inicio.

## Perfiles contemplados

### Cliente

Es el perfil predominante. Busca un restaurante, revisa su disponibilidad espacial y crea una reserva. Sus necesidades visibles en la interfaz son:

- Encontrar opciones atractivas de restaurantes.
- Elegir fecha, hora y número de personas.
- Distinguir de inmediato qué mesas puede seleccionar.
- Confirmar que eligió la mesa adecuada.
- Consultar o cancelar una reserva posterior.

### Recepcionista

La interfaz incluye un selector de rol denominado «Simulador de Rol». Al cambiarlo, la identidad mostrada en la barra lateral pasa de «Cliente Demo» a «Recepcionista». Esto comunica que el sistema contempla la operación del restaurante, aunque los elementos y acciones visibles actualmente conservan la misma estructura de navegación y reserva que para el cliente.

## Flujo principal de reserva

El recorrido está diseñado como una secuencia guiada y de baja ambigüedad:

1. En la pantalla inicial, la persona explora las tarjetas de «Selecciones Premium» y abre un restaurante.
2. En «Crear Nueva Reserva», define fecha, hora, cantidad de personas y duración.
3. Consulta el plano del restaurante y elige una mesa disponible. La propia interfaz solicita esta acción antes de habilitar la confirmación.
4. El formulario muestra una confirmación contextual de la mesa elegida.
5. Al pulsar «Confirmar Reserva», aparece una ventana con el resumen de fecha, hora, personas y mesa.
6. La persona completa nombre, correo, teléfono e instrucciones especiales opcionales.
7. Al finalizar, recibe una pantalla de éxito y puede revisar la reserva en «Mis Reservas».

Este flujo conserva información clave durante el proceso y repite el resumen justo antes de confirmar, lo que reduce el riesgo de reservar una mesa o un horario incorrectos.

## Pantalla de inicio

### Encabezado

En la parte superior se sitúan la marca SDReservas, el acceso a «Mis Reservas» y un botón de perfil representado por icono. El encabezado permanece visualmente ligero para no competir con el contenido de descubrimiento.

### Hero y búsqueda

El bloque principal comunica el beneficio con el mensaje «Encuentra tu mesa perfecta hoy» y una promesa de rapidez y comodidad. Incluye un campo de búsqueda con icono y una llamada a la acción «Buscar». Visualmente funciona como la acción prioritaria de la página y está centrado para guiar la mirada.

### Catálogo de restaurantes

Los restaurantes se presentan en tarjetas editoriales de gran formato. Cada una reúne:

- Imagen ambiental del establecimiento.
- Tipo de gastronomía.
- Nombre del restaurante.
- Ubicación.
- Calificación con estrella.
- Indicador visual de acceso al pasar el cursor.

La tarjeta completa es seleccionable, lo cual simplifica el acceso. La combinación de texto claro sobre una capa oscura permite conservar la legibilidad encima de las fotografías.

### Acceso a reservas

«Mis Reservas» abre un panel lateral superpuesto. Este patrón permite consultar el historial sin abandonar el inicio. El panel oscurece suavemente el fondo y ofrece un botón de cierre visible; por tanto, conserva el contexto de la página anterior y hace explícito cómo volver.

## Pantalla de reserva

### Estructura de escritorio

En pantallas amplias se presenta una barra lateral permanente y una zona de contenido. La barra contiene marca, identidad del rol, navegación y el selector de rol. El área principal coloca el plano del restaurante y el formulario de reserva en dos columnas, permitiendo contrastar la disponibilidad visual con los datos de la reserva sin cambiar de pantalla.

### Estructura móvil

En móvil, la barra lateral se sustituye por una cabecera compacta y dos pestañas: «Mapa» y «Reservas». El plano conserva un ancho panorámico y puede desplazarse horizontalmente, como un selector de asientos. Esta decisión evita reducir tanto las mesas que pierdan legibilidad o precisión táctil.

## Plano interactivo de mesas

El plano es el elemento distintivo del sistema. Representa el espacio mediante una cuadrícula sutil y mesas posicionadas dentro de un área delimitada. Las mesas muestran su identificador y capacidad con un icono de personas. Las formas —cuadradas, rectangulares o circulares— sugieren la tipología y tamaño de cada mesa.

La leyenda superior proporciona tres estados visibles:

| Estado | Tratamiento visual | Comportamiento esperado |
| --- | --- | --- |
| Disponible | Fondo blanco y borde neutro | Se puede seleccionar |
| Seleccionada | Fondo oscuro y texto claro | Representa la elección actual |
| Ocupada | Gris tenue | No admite selección |

Las mesas bloqueadas también pueden expresarse como reservadas o no disponibles mediante variaciones cromáticas. Al elegir una disponible, esta cambia de estado y escala ligeramente; esto confirma la interacción sin depender solo de un mensaje externo.

Algunos restaurantes disponen de más de un nivel. En esos casos aparece un selector flotante de pisos. El cambio entre «Planta Baja» y «Rooftop (Balcón)», por ejemplo, permite explorar el espacio sin perder el contexto de la reserva. Las zonas especiales, como balcón, se señalan con una superficie decorativa y etiqueta dentro del plano.

## Formulario de reserva

El formulario acompaña al plano y agrupa los campos por afinidad:

- Fecha y hora de la visita.
- Personas y duración estimada.
- Estado de la selección de mesa.
- Acciones para confirmar o cancelar.

Los rótulos incorporan iconos de calendario, reloj y personas, lo que acelera el reconocimiento. La fecha no admite días anteriores y el selector de hora desactiva los horarios ya transcurridos cuando se está reservando para el día actual. La selección de mesa es un requisito visible: mientras no exista una, se muestra una instrucción y la acción de confirmar permanece deshabilitada.

Cuando una mesa se selecciona, el aviso pasa a un estado positivo con el número de mesa. Esta retroalimentación hace que la dependencia entre el plano y el formulario sea clara.

## Ventana de confirmación

La confirmación se realiza en una ventana modal centrada, con el fondo atenuado. Antes de solicitar datos personales, resume fecha, hora, número de personas y mesa. Esto permite validar la decisión sin volver al plano.

El formulario solicita nombre completo, correo electrónico y teléfono como datos obligatorios, y ofrece un área opcional para alergias, celebraciones u otras instrucciones. Durante el procesamiento se muestra un indicador de espera y, al concluir, una pantalla de éxito con icono de confirmación y un mensaje de reserva confirmada.

## Gestión de reservas

La vista «Mis Reservas» diferencia claramente dos grupos:

- **Próximas reservas:** tarjetas activas con fecha, hora, mesa, nombre y número de personas; usan un acento verde y la etiqueta «Confirmada».
- **Historial y canceladas:** tarjetas de menor énfasis visual, con tonos grises y rojos para comunicar que no están vigentes.

Cada reserva próxima ofrece «Cancelar Reserva». Al elegirla, el sistema no ejecuta la acción inmediatamente: muestra una confirmación con advertencia, explica que la mesa quedará liberada y presenta dos opciones de igual jerarquía espacial: «Mantener» y «Sí, Cancelar». Esta confirmación es apropiada para una acción difícil de revertir.

Cuando no existen reservas, se muestra un estado vacío con ilustración de calendario, mensaje explicativo y orientación para volver al plano y comenzar una reserva. Así se evita una pantalla sin contenido o significado.

## Lenguaje visual

La interfaz adopta una estética editorial y minimalista:

- **Paleta:** blancos, grises cálidos y negro casi absoluto. El color oscuro se reserva para títulos, estados seleccionados y acciones principales; verde para éxito y rojo para cancelación o alerta.
- **Tipografía:** una serif elegante en titulares y marca aporta carácter gastronómico; una sans serif sobria en controles, formularios y texto funcional mejora la lectura cotidiana.
- **Jerarquía:** titulares grandes en portada, subtítulos discretos, tarjetas con fotografía y acciones primarias oscuras. Los elementos secundarios usan menor contraste y menos peso visual.
- **Superficies:** tarjetas blancas, bordes suaves, sombras tenues y esquinas redondeadas generan un aspecto cuidado y amable.
- **Iconografía:** iconos lineales acompañan etiquetas y acciones sin sustituir el texto en los controles importantes.

## Retroalimentación e interacción

La experiencia comunica los cambios mediante estados visibles y animaciones breves: entrada escalonada de tarjetas, zoom sutil de imágenes, transición entre mapa y reservas, cambio de piso, selección de mesa, apertura de paneles y modales, e indicadores de procesamiento y éxito. Estas transiciones refuerzan continuidad entre acciones sin obstaculizar el flujo.

Los controles incorporan cambios al pasar el cursor y estados de foco visibles en varios campos y mesas. El uso de botones deshabilitados para impedir confirmar sin mesa seleccionada ayuda a prevenir errores antes de que ocurran.

## Adaptación responsive

La interfaz no se limita a encoger la versión de escritorio; reorganiza la interacción según el dispositivo:

| Contexto | Adaptación de la interfaz |
| --- | --- |
| Escritorio | Navegación lateral fija y mapa/formulario simultáneos |
| Tableta | Espaciados y columnas más flexibles para conservar lectura |
| Teléfono | Cabecera compacta, pestañas para alternar tareas y desplazamiento panorámico del plano |
| Listas extensas | Paneles y contenidos con desplazamiento vertical interno |

## Observaciones de diseño para evolución

El análisis de la interfaz revela oportunidades que podrían mejorar la claridad sin cambiar el concepto del sistema:

1. El buscador, «Buscar», «Ver todos», el icono de perfil y el botón «Cancelar» del formulario principal necesitan una respuesta o destino visible para no generar expectativas incumplidas.
2. La cantidad de personas y la duración se muestran como campos relevantes; convendría que la interfaz reflejara de forma inmediata cómo estas elecciones afectan qué mesas son aptas o disponibles.
3. El plano comunica disponibilidad y capacidad, pero podría hacer más evidente el nombre de cada zona y atributos de preferencia —ventana, balcón, privacidad o accesibilidad— antes de seleccionar una mesa.
4. La leyenda del plano podría contemplar explícitamente todos los estados que pueden aparecer, incluidos «reservada» y «fuera de servicio», para mantener la correspondencia entre color y significado.
5. El modo de recepcionista se beneficiaría de tareas y señales propias de operación, de modo que el cambio de rol no sea solo una variación en la identidad visible.
6. Para accesibilidad, es recomendable complementar los colores de estado con texto, patrones o iconos persistentes, verificar contraste en textos sobre imágenes y asegurar que todos los iconos que actúan como botón tengan una etiqueta accesible.
7. Las fechas y horas de la confirmación podrían mostrarse en un formato natural y localizado, por ejemplo, «martes 13 de octubre, 7:00 p. m.», para reducir interpretación por parte de la persona usuaria.

## Síntesis

Desde el diseño de interfaces, SDReservas se define por una reserva espacial y visual: el plano de mesas transforma una decisión que suele ser opaca en una interacción directa. La arquitectura presenta primero el descubrimiento, después la configuración y selección, y finalmente la gestión de la reserva. Su sistema visual sobrio, las jerarquías claras, la respuesta a estados y la adaptación móvil sostienen una experiencia orientada a clientes que buscan seguridad y control al elegir dónde sentarse.
