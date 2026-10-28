/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AudiovisualResource } from '../types/audiovisual.ts';

export const INITIAL_AUDIOVISUAL_RESOURCES: AudiovisualResource[] = [
  // ==========================================================================
  // 1. VIDEOS DE BIENESTAR EMOCIONAL
  // ==========================================================================
  {
    id: 'av-stop-emociones',
    title: 'Técnica STOP para la Regulación Emocional Inmediata',
    category: 'emociones',
    categoryLabel: 'Emociones & Autorregulación',
    format: 'video',
    duration: '4:15 min',
    thumbnail: '/src/assets/images/video_stop_technique_1792612453981.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/fD3lC_d8s6c',
    youtubeId: 'fD3lC_d8s6c',
    author: 'Departamento de Orientación y Psicología Escolar',
    description:
      'Aprende a pausar impulsos antes de que escalen mediante los 4 pasos clave: Stop (Para), Take a breath (Respira), Observe (Observa) y Proceed (Procede). Un recurso esencial para desactivar la reactividad en momentos de frustración o enojo.',
    takeaways: [
      'S (Stop / Para): Detén cualquier acción impulsiva o palabra hiriente.',
      'T (Take a breath / Respira): Haz 3 inhalaciones diafragmáticas lentas llenando el abdomen.',
      'O (Observe / Observa): Nota la tensión en tus músculos y nombra la emoción sin juzgarla.',
      'P (Proceed / Procede): Actúa con calma y elige la respuesta más sana para ti.',
    ],
    transcript:
      'Hola y bienvenido a esta cápsula de Expresa Te. En los momentos de conflicto o tensión, nuestro cerebro emocional se activa más rápido que nuestra parte racional. La técnica STOP funciona como un freno de seguridad de 30 segundos. Al respirar profundo y etiquetar la emoción, desactivamos la alarma biológica y podemos tomar decisiones acertadas.',
    isDemo: true,
    publishedAt: '2026-03-01T10:00:00.000Z',
    tags: ['emociones', 'calma', 'stop', 'autorregulacion', 'psicologia'],
  },
  {
    id: 'av-estres-evaluaciones',
    title: 'Estrategias Neurocientíficas ante el Estrés y la Ansiedad de Exámenes',
    category: 'estres',
    categoryLabel: 'Manejo del Estrés & Enfoque',
    format: 'video',
    duration: '6:30 min',
    thumbnail: '/src/assets/images/video_exam_anxiety_1792612455262.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/1ZYbU88VzII',
    youtubeId: '1ZYbU88VzII',
    author: 'Equipo de Orientación Académica y Bienestar',
    description:
      'Pautas prácticas para evitar la mente en blanco, desensibilizar la tensión previa a las pruebas, programar descansos activos con técnica Pomodoro y mantener la concentración durante las evaluaciones.',
    takeaways: [
      'Estudio en bloques Pomodoro: 25 minutos de concentración y 5 minutos sin pantallas.',
      'Anclaje corporal: Apoyar firmemente los pies y realizar 2 exhalaciones largas antes de abrir el examen.',
      'Estrategia de barrido: Responder primero las preguntas más seguras para generar inercia positiva.',
      'Diferenciar nervios normales de ansiedad desbordante y saber cuándo pedir apoyo.',
    ],
    transcript:
      'Tener la mente en blanco no es falta de inteligencia, sino exceso de cortisol. Cuando el cuerpo percibe el examen como una amenaza, bloquea temporalmente la memoria de trabajo. Para desbloquearte, suelta el lapicero 15 segundos, mira un punto fijo y exhala despacio. Tu mente volverá a enfocarse.',
    isDemo: true,
    publishedAt: '2026-03-05T14:30:00.000Z',
    tags: ['estres', 'ansiedad', 'examenes', 'pomodoro', 'concentracion'],
  },
  {
    id: 'av-autoestima-resiliencia',
    title: 'Cómo Cultivar la Autoestima y Superar los Días Difíciles',
    category: 'autoestima',
    categoryLabel: 'Autoestima & Resiliencia',
    format: 'video',
    duration: '7:10 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDdDzLNgGpLtHKSSTuoOFGQRX-GMcf24WOKrZFCwbyFhypz_Zi9C0nEYtyHPIzMHA30DwSk-fIAJXbMlqcV5J2Ud_3Rdbya6WimrZiB8kFNTt_unxO301mEK6r8AAErEAoEDB8xGK3MmWRxE54GKp2O8JZyMZ1B1n2c5jq2RLkJEdMvNGtk3iGmssbzCPoe1Z9EMGR-fq9LutAfV43aZFI5zpCYMRfTZcLXm8PGb2q1yNUkyFiepTsng',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/5F2o3eWp2hU',
    youtubeId: '5F2o3eWp2hU',
    author: 'Psicología y Desarrollo Personal',
    description:
      'Aprende a transformar la voz crítica interna en autocompasión constructiva. Un mal resultado, un error o un mal día no definen tu valor como ser humano.',
    takeaways: [
      'El valor personal es intrínseco y no depende únicamente de una calificación escolar.',
      'Identificar la autocrítica destructiva y sustituirla por retroalimentación amable.',
      'La resiliencia se entrena aceptando la frustración temporal sin desanimarse.',
      'Celebrar pequeños avances diarios en lugar de exigir perfección inmediata.',
    ],
    transcript:
      'Todos los seres humanos fallamos, dudamos y tenemos días donde sentimos que nada sale bien. La autoestima sana no consiste en creer que somos perfectos, sino en aceptarnos incondicionalmente mientras seguimos aprendiendo y creciendo.',
    isDemo: true,
    publishedAt: '2026-03-08T09:15:00.000Z',
    tags: ['autoestima', 'resiliencia', 'autocompasion', 'crecimiento'],
  },
  {
    id: 'av-autocuidado-respiracion',
    title: 'Rutina de Autocuidado Diario y Respiración 4-7-8',
    category: 'autocuidado',
    categoryLabel: 'Autocuidado & Bienestar Físico',
    format: 'video',
    duration: '3:50 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAul5PfvJhJ-jUl_Bd1eUiGuFYdMyBAq2Rbs_KMSfXUXFYOfpPzQWYy51gkoqtvI0F86uQCJCIoohyzSAkdQjheOldHd6UExWEmIr3Sid21u8Qpt8_TborD6kxUbdnNnedxTaYIoWj4V5jkyrMkAHjBLwsZ7tQ_WATiiDHa3-T_5xsC4n4QN8Q466bxjtgLPoQN0EeiLXge2n3-lDfvR8GA88qcJrrJN9OJqQmE6OkE6Rb555D-VQ0z0w',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/LiUnFJ8P4gM',
    youtubeId: 'LiUnFJ8P4gM',
    author: 'Promoción de Hábitos de Vida Saludable',
    description:
      'Guía paso a paso para ejecutar la técnica de respiración diafragmática 4-7-8, excelente para reducir taquicardias, preparar el cuerpo para un sueño reparador y recargar energía.',
    takeaways: [
      'Inhalación lenta por la nariz en 4 segundos inflando el vientre.',
      'Retención suave del aire durante 7 segundos manteniendo la postura relajada.',
      'Exhalación sonora por la boca en 8 segundos liberando toda la tensión acumulada.',
      'Efecto comprobado de estimulación del nervio vago y reducción de la presión arterial.',
    ],
    transcript:
      'Esta respiración es conocida como el tranquilizante natural del sistema nervioso. Practícala por lo menos cuatro ciclos continuos al despertar o antes de dormir. Notarás cómo tu pulso se desacelera de manera natural.',
    isDemo: true,
    publishedAt: '2026-03-10T16:00:00.000Z',
    tags: ['autocuidado', 'respiracion', 'sueño', 'salud', 'relajacion'],
  },

  // ==========================================================================
  // 2. ORIENTACIÓN ESCOLAR: CONVIVENCIA, RESOLUCIÓN DE CONFLICTOS, ACOSO, ASERTIVIDAD
  // ==========================================================================
  {
    id: 'av-convivencia-ley1620',
    title: 'Convivencia Pacífica y Clima Escolar Seguro (Ruta Ley 1620)',
    category: 'convivencia',
    categoryLabel: 'Convivencia Escolar & Ley 1620',
    format: 'video',
    duration: '5:45 min',
    thumbnail: '/src/assets/images/video_peaceful_coexistence_1792612455559.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/jZkq_7ZrnY8',
    youtubeId: 'jZkq_7ZrnY8',
    author: 'Comité de Convivencia Escolar Institucional',
    description:
      'Conoce cómo la institución promueve un entorno libre de agresiones, cuáles son los tipos de situaciones de convivencia según la Ley 1620 y qué garantías de confidencialidad existen para los estudiantes.',
    takeaways: [
      'Tipología de situaciones escolares: Situaciones Tipo I (leves), Tipo II (reiteradas) y Tipo III (graves).',
      'Confidencialidad absoluta: Toda solicitud o reporte en Expresa Te es atendida por profesionales idóneos.',
      'Cultura del acuerdo: La convivencia se construye dialogando y respetando la diversidad.',
      'Ruta de atención integral: Prevención, atención, seguimiento y reparación pedagógica.',
    ],
    transcript:
      'El colegio debe ser un lugar donde cada estudiante se sienta seguro y respetado. La Ley 1620 de Convivencia Escolar no busca castigar, sino formar ciudadanos empáticos, resolver diferencias con justicia restaurativa y proteger la dignidad de todos.',
    isDemo: true,
    publishedAt: '2026-03-12T11:00:00.000Z',
    tags: ['convivencia', 'ley1620', 'colegio', 'derechos', 'respeto'],
  },
  {
    id: 'av-resolucion-conflictos',
    title: 'Resolución Pacífica de Conflictos: Método de Mediación Escolar',
    category: 'conflictos',
    categoryLabel: 'Resolución de Conflictos',
    format: 'video',
    duration: '5:20 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGIcoPfvGy9utMaFfoF5Pti0OebMRUq-93tHRJhc8TJbgFz-5810Xmf7cpEscJrBeLzReNwP7piCbAm29SL1yb8q_9eRK2CWseQWt0W1OGe9PTenBeJJziW9qa0yM5zO94TOOKDJPzA-TSwH4Kt7bXaql3Fsn8ydtA4srqRhosUPV5oLl55QbgvJlhAxPlG9GAaWAKHpsiVVb1Gr-Uk1ciz7lFPhRiU1zdakGBnwuFaNKPsUTgBdfv9Q',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/4p5286T_kn0',
    youtubeId: '4p5286T_kn0',
    author: 'Equipo de Mediadores Escolares',
    description:
      'Un conflicto no tiene por qué terminar en violencia o distanciamiento. Aprende las 5 fases de la mediación escolar para llegar a compromisos ganar-ganar en el salón de clases.',
    takeaways: [
      'Separar a la persona del problema: Atacar el desacuerdo, no la identidad del otro.',
      'Escucha activa sin interrupciones: Comprender antes de buscar ser comprendido.',
      'Identificar necesidades comunes debajo de las posturas rígidas.',
      'Crear compromisos concretos, medibles y con seguimiento mutuo.',
    ],
    transcript:
      'El desacuerdo es inevitable cuando convivimos muchas horas juntos, pero la agresión es siempre una elección. Cuando usamos la mediación, abrimos la puerta a entender qué originó el malentendido y salimos con soluciones más justas.',
    isDemo: true,
    publishedAt: '2026-03-14T08:00:00.000Z',
    tags: ['conflictos', 'mediacion', 'dialogo', 'acuerdos', 'paz'],
  },
  {
    id: 'av-prevencion-acoso',
    title: 'Prevención del Acoso y Ciberacoso: El Rol Transformador del Testigo',
    category: 'acoso',
    categoryLabel: 'Prevención del Acoso Escolar',
    format: 'video',
    duration: '6:15 min',
    thumbnail: '/src/assets/images/video_peaceful_coexistence_1792612455559.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/jZkq_7ZrnY8',
    youtubeId: 'jZkq_7ZrnY8',
    author: 'Comité de Convivencia & Orientación',
    description:
      'El silencio fortalece la intimidación. Descubre cómo los compañeros que presencian burlas, exclusión o mensajes ofensivos en redes sociales pueden marcar la diferencia sin ponerse en riesgo.',
    takeaways: [
      'No reírse ni compartir burlas o fotos denigrantes en chats grupales.',
      'Ofrecer apoyo solidario a la víctima en privado: "Estoy contigo, lo que hicieron no está bien".',
      'Informar de manera confidencial a orientación escolar mediante el botón de solicitud.',
      'Diferenciar broma de acoso: Si hay dolor o es repetitivo, es agresión que debe detenerse.',
    ],
    transcript:
      'Más del 80% de los incidentes de acoso se detienen cuando un testigo o grupo dice firmemente: "Eso no da risa". Tu voz como compañero tiene un poder inmenso para proteger a quienes lo necesitan.',
    isDemo: true,
    publishedAt: '2026-03-16T15:00:00.000Z',
    tags: ['acoso', 'bullying', 'ciberacoso', 'solidaridad', 'apoyo'],
  },
  {
    id: 'av-comunicacion-asertiva',
    title: 'Comunicación Asertiva: Decir lo que Sientes con Firmeza y Respeto',
    category: 'comunicacion',
    categoryLabel: 'Comunicación Asertiva',
    format: 'video',
    duration: '4:45 min',
    thumbnail: '/src/assets/images/video_stop_technique_1792612453981.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/fD3lC_d8s6c',
    youtubeId: 'fD3lC_d8s6c',
    author: 'Departamento de Orientación Vocacional y Habilidades Blandas',
    description:
      'Aprende a usar la fórmula del Mensaje Yo: "Cuando ocurre X, yo me siento Y, y necesitaría Z". Establece límites claros sin insultar ni quedarte en silencio.',
    takeaways: [
      'Evitar los extremos: Ni la pasividad que se resigna ni la agresividad que lastima.',
      'Fórmula del Mensaje Yo: Hablar desde tus emociones sin culpar agresivamente al otro.',
      'Contacto visual firme y tono de voz sereno pero seguro.',
      'Saber decir "no" sin sentir culpa ni necesidad de dar explicaciones excesivas.',
    ],
    transcript:
      'Ser asertivo es hacer valer tus derechos respetando al mismo tiempo los derechos ajenos. Cuando comunicas con claridad tus límites, evitas resentimientos y mejoras la calidad de tus amistades.',
    isDemo: true,
    publishedAt: '2026-03-18T12:00:00.000Z',
    tags: ['comunicacion', 'asertividad', 'limites', 'respeto', 'habilidades'],
  },

  // ==========================================================================
  // 3. MATERIAL EDUCATIVO: PRESENTACIONES, INFOGRAFÍAS Y AUDIOS
  // ==========================================================================
  {
    id: 'av-presentacion-habitos',
    title: 'Guía de Hábitos de Estudio y Gestión del Tiempo Libre',
    category: 'estres',
    categoryLabel: 'Material Educativo — Diapositivas',
    format: 'presentacion',
    duration: '8 láminas',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGIcoPfvGy9utMaFfoF5Pti0OebMRUq-93tHRJhc8TJbgFz-5810Xmf7cpEscJrBeLzReNwP7piCbAm29SL1yb8q_9eRK2CWseQWt0W1OGe9PTenBeJJziW9qa0yM5zO94TOOKDJPzA-TSwH4Kt7bXaql3Fsn8ydtA4srqRhosUPV5oLl55QbgvJlhAxPlG9GAaWAKHpsiVVb1Gr-Uk1ciz7lFPhRiU1zdakGBnwuFaNKPsUTgBdfv9Q',
    mediaUrl: '#diapositivas-habitos',
    author: 'Coordinación Académica & Orientación',
    description:
      'Presentación pedagógica interactiva con diapositivas explicativas para optimizar tu tiempo de estudio, organizar tareas y equilibrar el ocio con las metas académicas.',
    takeaways: [
      'Lámina 1: Matriz de Eisenhower (Urgente vs. Importante).',
      'Lámina 2: Regla de los dos minutos para tareas cortas.',
      'Lámina 3: Ergonomía y ambiente libre de distractores.',
      'Lámina 4: Plan semanal con descansos y pasatiempos protegidos.',
    ],
    slides: [
      {
        title: 'Lámina 1: La Matriz de Prioridades',
        content:
          'Clasifica tus actividades en: 1) Urgente e Importante (hacer ya), 2) No urgente pero Importante (planificar con calma), 3) Urgente pero No Importante (delegar o minimizar), y 4) Ni urgente ni Importante (eliminar o posponer).',
        keyIdea: 'Planifica antes de que las cosas se vuelvan urgencias de última hora.',
      },
      {
        title: 'Lámina 2: El Espacio de Concentración',
        content:
          'Estudiar en la cama le envía una señal confusa al cerebro entre descanso y trabajo. Organiza un escritorio iluminado con agua fresca y coloca tu teléfono en modo "No molestar" en otra habitación.',
        keyIdea: 'Tu entorno físico define el 70% de tu disciplina escolar.',
      },
      {
        title: 'Lámina 3: Bloques de Estudio y Repaso Espaciado',
        content:
          'La curva del olvido demuestra que repasamos mejor en intervalos cortos (10 minutos al día siguiente, 15 minutos al fin de semana) que haciendo jornadas maratónicas la noche anterior.',
        keyIdea: 'La constancia supera a la intensidad sin estrategia.',
      },
      {
        title: 'Lámina 4: El Ocio como Parte del Éxito',
        content:
          'El descanso, el deporte y compartir con amigos no son premios: son necesidades biológicas para fijar lo aprendido. Dedica al menos una hora diaria a desconectar completamente.',
        keyIdea: 'Dormir 8 horas diarias es la mejor técnica de estudio demostrada.',
      },
    ],
    isDemo: true,
    publishedAt: '2026-03-20T10:00:00.000Z',
    tags: ['presentacion', 'habitos', 'estudio', 'organizacion', 'tiempo'],
  },
  {
    id: 'av-infografia-emociones',
    title: 'Infografía Dinámica: Termómetro Emocional y Señales Corporales',
    category: 'emociones',
    categoryLabel: 'Material Educativo — Infografía',
    format: 'infografia',
    duration: 'Lectura visual (3 min)',
    thumbnail: '/src/assets/images/infographic_emotional_scale_1792612455887.jpg',
    mediaUrl: '/src/assets/images/infographic_emotional_scale_1792612455887.jpg',
    author: 'Departamento de Psicología Institucional',
    description:
      'Herramienta visual gráfica interactiva para identificar en qué nivel de la escala emocional te encuentras (Verde: Calma; Amarillo: Tensión inicial; Naranja: Agitación; Rojo: Crisis/Desborde) y qué recurso activar en cada nivel.',
    takeaways: [
      'Nivel Verde (0 a 3): Zona de regulación y aprendizaje óptimo.',
      'Nivel Amarillo (4 a 6): Señales tempranas (ceño fruncido, inquietud); aplicar técnica STOP.',
      'Nivel Naranja (7 a 8): Tensión alta (respiración corta); pedir una pausa activa o ir al baño.',
      'Nivel Rojo (9 a 10): Crisis; no intentar razonar, acudir de inmediato a orientación escolar.',
    ],
    isDemo: true,
    publishedAt: '2026-03-22T08:30:00.000Z',
    tags: ['infografia', 'escala', 'termometro', 'emociones', 'prevencion'],
  },
  {
    id: 'av-audio-mindfulness',
    title: 'Audio Guiado: Cápsula de Conexión Corporal y Mindfulness de 3 Minutos',
    category: 'autocuidado',
    categoryLabel: 'Material Educativo — Audio Relajante',
    format: 'audio',
    duration: '3:20 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAul5PfvJhJ-jUl_Bd1eUiGuFYdMyBAq2Rbs_KMSfXUXFYOfpPzQWYy51gkoqtvI0F86uQCJCIoohyzSAkdQjheOldHd6UExWEmIr3Sid21u8Qpt8_TborD6kxUbdnNnedxTaYIoWj4V5jkyrMkAHjBLwsZ7tQ_WATiiDHa3-T_5xsC4n4QN8Q466bxjtgLPoQN0EeiLXge2n3-lDfvR8GA88qcJrrJN9OJqQmE6OkE6Rb555D-VQ0z0w',
    mediaUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
    author: 'Gabinete de Bienestar Juvenil',
    description:
      'Cápsula de audio binaural con sonido de lluvia relajante e instrucciones de anclaje sensorial para devolver la atención al momento presente y soltar la sobrecarga de pensamientos.',
    takeaways: [
      'Cerrar los ojos o enfocar la mirada en un punto neutro durante 3 minutos.',
      'Escanear el cuerpo desde los pies hasta la coronilla, soltando puntos de presión.',
      'Permitir que los pensamientos pasen como nubes en el cielo sin aferrarse a ellos.',
      'Retornar al aula o a las tareas con mente renovada y pulso sereno.',
    ],
    transcript:
      'Cierra suavemente los ojos. Inhala por la nariz sintiendo el aire fresco... y exhala liberando el peso del día. Escucha el suave ritmo de la lluvia de fondo. Nota cómo tus hombros caen un centímetro más. No hay nada urgente que resolver en este instante; este momento te pertenece.',
    isDemo: true,
    publishedAt: '2026-03-24T17:00:00.000Z',
    tags: ['audio', 'mindfulness', 'relajacion', 'lluvia', 'bienestar'],
  },
];
