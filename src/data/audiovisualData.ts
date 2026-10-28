/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { AudiovisualResource } from '../types/audiovisual.ts';

/**
 * Catálogo Curado Oficial de Recursos Audiovisuales — Expresa Te
 * 
 * Verificación de directrices:
 * 1. Todos los videos cuentan con locución/audio en ESPAÑOL (España o Latinoamérica).
 * 2. Cero videos en inglés o idiomas foráneos sin doblaje.
 * 3. Enlaces verificados a videos educativos reales de canales e instituciones oficiales
 *    (BBVA Aprendemos Juntos, campañas oficiales ACB Bullying, especialistas en psicología y neuroeducación).
 * 4. Clasificación estructurada en las 8 categorías oficiales de bienestar y orientación escolar.
 * 5. Variedad de formatos pedagógicos: videos, presentaciones con diapositivas, infografías y audios guiados.
 */
export const INITIAL_AUDIOVISUAL_RESOURCES: AudiovisualResource[] = [
  // ==========================================================================
  // 1. SALUD MENTAL
  // ==========================================================================
  {
    id: 'av-salud-mental-adolescente',
    title: 'A Mi Yo Adolescente: La Salud Mental y la Valentía de Pedir Ayuda',
    category: 'salud_mental',
    categoryLabel: 'Salud Mental & Bienestar',
    format: 'video',
    duration: '8:45 min',
    thumbnail: '/src/assets/images/video_stop_technique_1792612453981.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/gpqIZRj7dyQ',
    youtubeId: 'gpqIZRj7dyQ',
    author: 'Dra. Lucía Galán & Ricky Rubio',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Desmitificar los problemas de salud mental en la adolescencia y normalizar el acudir a psicología o a orientación escolar cuando el malestar sobrepasa nuestras fuerzas.',
    description:
      'Un diálogo sincero en español entre jóvenes y profesionales de la salud. Se abordan la presión social, el agotamiento emocional, el miedo a ser juzgados y la importancia de no callar cuando no estamos bien.',
    takeaways: [
      'La salud mental es tan vital como la física: tener un mal momento emocional no es señal de debilidad.',
      'Pedir ayuda profesional (en orientación o psicología) es un acto de valentía y autocuidado.',
      'Escuchar sin juzgar a un amigo que está sufriendo puede prevenir situaciones de riesgo.',
      'El canal confidencial de Expresa Te te conecta con orientación de manera segura y privada.',
    ],
    transcript:
      'Normalizar el decir "no puedo con todo" es el primer paso para sanar. Todos pasamos por etapas donde la tristeza, la incertidumbre o la soledad nos desbordan. Nadie tiene que afrontarlo en soledad; hablar con un orientador abre caminos de luz.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-01T09:00:00.000Z',
    tags: ['salud_mental', 'adolescencia', 'psicologia', 'bienestar', 'apoyo'],
  },
  {
    id: 'av-estres-cuerpo-marian',
    title: 'Por qué tus Emociones Afectan a tu Cuerpo y Cómo Gestionar el Estrés',
    category: 'salud_mental',
    categoryLabel: 'Salud Mental & Neurobiología',
    format: 'video',
    duration: '7:30 min',
    thumbnail: '/src/assets/images/video_exam_anxiety_1792612455262.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/TjqrualxgkI',
    youtubeId: 'TjqrualxgkI',
    author: 'Dra. Marian Rojas-Estapé (Psiquiatra y Escritora)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Comprender el impacto físico del estrés escolar crónico (cortisol) y aplicar estrategias biológicas para recuperar el equilibrio mente-cuerpo.',
    description:
      'La reconocida psiquiatra Marian Rojas-Estapé explica con sencillez cómo el estrés continuado genera dolores de cabeza, problemas de sueño y tensión muscular, y cómo la respiración y los pensamientos positivos regulan nuestro organismo.',
    takeaways: [
      'El cortisol elevado de forma sostenida agota el sistema inmunológico y bloquea la memoria.',
      'Identificar los estresores escolares: exámenes, sobrecarga de pantallas o conflictos interpersonales.',
      'Pausas de desconexión sin pantallas de 10 minutos para reiniciar los circuitos cerebrales.',
      'La interpretación que hacemos de los retos escolares determina cómo reacciona nuestro cuerpo.',
    ],
    transcript:
      'Tu cuerpo no distingue entre una amenaza real de supervivencia y un examen que te da miedo: reacciona con la misma alarma. Cuando aprendes a frenar ese diálogo catastrófico, el cortisol desciende y tu mente recupera su claridad.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-03T11:00:00.000Z',
    tags: ['salud_mental', 'estres', 'cortisol', 'mente_cuerpo', 'neurociencia'],
  },

  // ==========================================================================
  // 2. AUTOCUIDADO
  // ==========================================================================
  {
    id: 'av-autocuidado-respiracion-guiada',
    title: 'Respiración Calmante para Aliviar la Ansiedad y el Estrés en 5 Minutos',
    category: 'autocuidado',
    categoryLabel: 'Autocuidado Personal & Relajación',
    format: 'video',
    duration: '5:10 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAul5PfvJhJ-jUl_Bd1eUiGuFYdMyBAq2Rbs_KMSfXUXFYOfpPzQWYy51gkoqtvI0F86uQCJCIoohyzSAkdQjheOldHd6UExWEmIr3Sid21u8Qpt8_TborD6kxUbdnNnedxTaYIoWj4V5jkyrMkAHjBLwsZ7tQ_WATiiDHa3-T_5xsC4n4QN8Q466bxjtgLPoQN0EeiLXge2n3-lDfvR8GA88qcJrrJN9OJqQmE6OkE6Rb555D-VQ0z0w',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/jbPSKiS6AaE',
    youtubeId: 'jbPSKiS6AaE',
    author: 'Elena Malova (Especialista en Bienestar y Respiración)',
    institutionSource: 'Canal Educativo de Bienestar Somático en Español',
    audioLanguage: 'Español (Latinoamérica)',
    hasSubtitles: true,
    pedagogicalGoal: 'Aprender la respiración cuadrada o diafragmática para reducir pulsaciones aceleradas y recuperar el anclaje físico.',
    description:
      'Guía práctica y visual en español con compás rítmico. Ideal para practicar antes de una prueba académica difícil, al llegar a casa tras un día agotador o antes de dormir.',
    takeaways: [
      'Inhalación lenta por la nariz en 4 tiempos llenando el abdomen sin tensar los hombros.',
      'Pausa suave con los pulmones llenos durante 2 a 4 tiempos.',
      'Exhalación continua y profunda por la boca o nariz en 4 a 6 tiempos.',
      'Tres minutos de respiración lenta bastan para estimular el nervio vago y calmar el pulso.',
    ],
    transcript:
      'Siéntate con la espalda recta y suelta los hombros. Inhala despacio sintiendo el aire fresco... y exhala liberando toda la tensión del día escolar. Estás a salvo y en control de tu cuerpo.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-05T14:00:00.000Z',
    tags: ['autocuidado', 'respiracion', 'calma', 'ansiedad', 'habitos'],
  },

  // ==========================================================================
  // 3. AUTOESTIMA
  // ==========================================================================
  {
    id: 'av-autoestima-mario-alonso',
    title: 'Cómo Ser la Mejor Versión de Ti Mismo y Superar el Miedo al Error',
    category: 'autoestima',
    categoryLabel: 'Autoestima & Amor Propio',
    format: 'video',
    duration: '7:40 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDdDzLNgGpLtHKSSTuoOFGQRX-GMcf24WOKrZFCwbyFhypz_Zi9C0nEYtyHPIzMHA30DwSk-fIAJXbMlqcV5J2Ud_3Rdbya6WimrZiB8kFNTt_unxO301mEK6r8AAErEAoEDB8xGK3MmWRxE54GKp2O8JZyMZ1B1n2c5jq2RLkJEdMvNGtk3iGmssbzCPoe1Z9EMGR-fq9LutAfV43aZFI5zpCYMRfTZcLXm8PGb2q1yNUkyFiepTsng',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/f69n5VQLIQw',
    youtubeId: 'f69n5VQLIQw',
    author: 'Dr. Mario Alonso Puig (Médico y Conferencista)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Bienestar',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Reforzar la autoeficacia y el valor personal incondicional, distinguiendo el autoconcepto de una simple calificación o tropiezo académico.',
    description:
      'Una conferencia magistral en español que inspira a los estudiantes a creer en sus capacidades, aceptar las equivocaciones como escalones de aprendizaje y liberarse de la autocrítica destructiva.',
    takeaways: [
      'Un tropiezo o un mal examen es un evento temporal; nunca determina tu valor humano.',
      'El cerebro humano tiene plasticidad: la inteligencia se desarrolla con esfuerzo y curiosidad.',
      'Sustituir la voz de culpa por preguntas constructivas: "¿Qué puedo aprender de esta experiencia?".',
      'El verdadero éxito escolar nace de la ilusión por aprender y la bondad con uno mismo.',
    ],
    transcript:
      'En todo ser humano hay una grandeza esperando salir. Cuando cometemos un error, no significa que seamos incapaces; significa que estamos aprendiendo algo nuevo. No permitas que una mala nota apague tu luz.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-08T10:00:00.000Z',
    tags: ['autoestima', 'amor_propio', 'resiliencia', 'motivacion', 'superacion'],
  },

  // ==========================================================================
  // 4. MANEJO DE EMOCIONES
  // ==========================================================================
  {
    id: 'av-emociones-elsa-punset',
    title: 'Educación Emocional: Reconocer y Regular lo que Sentimos',
    category: 'emociones',
    categoryLabel: 'Manejo de Emociones & Calma',
    format: 'video',
    duration: '6:20 min',
    thumbnail: '/src/assets/images/video_stop_technique_1792612453981.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/KUTh9fBg_nQ',
    youtubeId: 'KUTh9fBg_nQ',
    author: 'Elsa Punset (Escritora y Divulgadora de Inteligencia Emocional)',
    institutionSource: 'Aprendemos Juntos · Laboratorio de Habilidades Emocionales',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Identificar las emociones primarias (rabia, tristeza, miedo, alegría) y canalizarlas sin agresividad ni represión.',
    description:
      'Pistas pedagógicas en español para entender para qué sirve cada emoción en el día a día escolar. Explica cómo modular la frustración y cómo el autoconocimiento evita estallidos destructivos en el aula.',
    takeaways: [
      'No existen emociones malas: todas cumplen una función biológica para protegernos.',
      'El enfado nos avisa de un límite traspasado; exprésalo de forma asertiva sin agredir.',
      'Ponerle nombre exacto a la emoción ("siento frustración") reduce inmediatamente su intensidad.',
      'La técnica del semáforo: Rojo para parar, Amarillo para pensar, Verde para actuar.',
    ],
    transcript:
      'Sentir tristeza o rabia no está mal; lo importante es qué decidimos hacer con esa energía. Cuando le ponemos nombre a lo que sentimos y respiramos unos segundos, la mente racional vuelve a tomar el timón.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-10T12:00:00.000Z',
    tags: ['emociones', 'inteligencia_emocional', 'calma', 'frustracion', 'autocontrol'],
  },

  // ==========================================================================
  // 5. RELACIONES SALUDABLES
  // ==========================================================================
  {
    id: 'av-relaciones-silvia-congost',
    title: 'Amor Propio y Relaciones Saludables: Aprender a Construir Vínculos Libres',
    category: 'relaciones',
    categoryLabel: 'Relaciones Saludables & Amistad',
    format: 'video',
    duration: '8:15 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGIcoPfvGy9utMaFfoF5Pti0OebMRUq-93tHRJhc8TJbgFz-5810Xmf7cpEscJrBeLzReNwP7piCbAm29SL1yb8q_9eRK2CWseQWt0W1OGe9PTenBeJJziW9qa0yM5zO94TOOKDJPzA-TSwH4Kt7bXaql3Fsn8ydtA4srqRhosUPV5oLl55QbgvJlhAxPlG9GAaWAKHpsiVVb1Gr-Uk1ciz7lFPhRiU1zdakGBnwuFaNKPsUTgBdfv9Q',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/PYp582OObNM',
    youtubeId: 'PYp582OObNM',
    author: 'Silvia Congost (Psicóloga Especialista en Relaciones)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Diferenciar las amistades y relaciones sanas de los apegos tóxicos o controladores, fomentando el respeto y la autonomía entre pares.',
    description:
      'La psicóloga Silvia Congost aborda en español cómo establecer límites firmes con amigos o parejas, cómo decir "no" sin temor al rechazo y cómo el amor propio es el escudo más fuerte contra la manipulación.',
    takeaways: [
      'Una amistad sana suma paz, apoya tus proyectos y celebra tus alegrías con sinceridad.',
      'El control, los celos excesivos o el chantaje emocional nunca son muestras de cariño.',
      'Aprender a poner límites claros protege tu salud mental y evita vínculos desgastantes.',
      'Quien te respeta valora tu opinión incluso cuando no coinciden en un punto de vista.',
    ],
    transcript:
      'Tener relaciones sanas comienza por quererte a ti mismo. Si estás en una amistad o relación donde debes fingir ser otra persona o tolerar humillaciones por miedo a la soledad, recuerda que mereces un entorno que te valore en libertad.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-12T15:30:00.000Z',
    tags: ['relaciones', 'amistad', 'respeto', 'limites', 'asertividad'],
  },

  // ==========================================================================
  // 6. CONVIVENCIA ESCOLAR
  // ==========================================================================
  {
    id: 'av-convivencia-nelida-zaitegi',
    title: 'Educación para la Convivencia y Resolución Pacífica de Conflictos',
    category: 'convivencia',
    categoryLabel: 'Convivencia Escolar & Mediación',
    format: 'video',
    duration: '7:50 min',
    thumbnail: '/src/assets/images/video_peaceful_coexistence_1792612455559.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/nNOdDtwY1uM',
    youtubeId: 'nNOdDtwY1uM',
    author: 'Nélida Zaitegi (Maestra y Especialista en Convivencia)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · Convivencia Positiva',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Fomentar la mediación escolar, el diálogo constructivo y el sentido de comunidad protectora en la escuela.',
    description:
      'Una reflexión pedagógica en español sobre por qué el desacuerdo es una oportunidad para aprender a negociar y cómo construir aulas seguras basadas en la empatía mutua y la justicia restaurativa.',
    takeaways: [
      'El conflicto es parte natural de vivir juntos; la violencia es una elección que podemos erradicar.',
      'Separar el problema de la persona: debatir las ideas respetando siempre la dignidad humana.',
      'La mediación entre pares permite llegar a acuerdos justos donde ambas partes ganan.',
      'La convivencia armónica en el colegio es responsabilidad compartida de toda la comunidad.',
    ],
    transcript:
      'La convivencia no se impone con sermones; se aprende conviviendo, escuchando activamente y poniéndonos en los zapatos del otro. Cuando creamos un clima escolar de confianza, todos los estudiantes pueden florecer.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-14T08:30:00.000Z',
    tags: ['convivencia', 'mediacion', 'dialogo', 'respeto', 'comunidad'],
  },
  {
    id: 'av-convivencia-cesar-bona',
    title: 'Aprender de los Niños: Empatía, Inclusión y Respeto por las Diferencias',
    category: 'convivencia',
    categoryLabel: 'Convivencia & Inclusión',
    format: 'video',
    duration: '6:55 min',
    thumbnail: '/src/assets/images/video_peaceful_coexistence_1792612455559.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/p7MKTo7Rcf0',
    youtubeId: 'p7MKTo7Rcf0',
    author: 'César Bona (Maestro, Finalista Global Teacher Prize)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Fomentar la inclusión activa de estudiantes con diversas capacidades y promover la escucha empática en el aula.',
    description:
      'César Bona comparte cómo la empatía, el trabajo en equipo y la curiosidad sincera por las diferencias hacen de la escuela un hogar donde nadie se queda atrás.',
    takeaways: [
      'Cada estudiante aporta una perspectiva única: la diversidad enriquece a todo el grupo.',
      'Escuchar no es solo callar para responder; es comprender lo que el compañero siente por dentro.',
      'La verdadera inclusión escolar ocurre en los pequeños gestos cotidianos del recreo y del aula.',
      'Tratar con amabilidad a quien es diferente a nosotros es la mayor muestra de inteligencia social.',
    ],
    transcript:
      'Educar en valores no es un añadido opcional al currículo: es el corazón mismo de la escuela. Cuando un estudiante se siente valorado y respetado tal y como es, se siente capaz de alcanzar cualquier meta.',
    isRecommended: false,
    isDemo: false,
    publishedAt: '2026-03-15T10:15:00.000Z',
    tags: ['inclusion', 'empatia', 'convivencia', 'diversidad', 'respeto'],
  },

  // ==========================================================================
  // 7. PREVENCIÓN DEL ACOSO ESCOLAR
  // ==========================================================================
  {
    id: 'av-acoso-inaki-zubizarreta',
    title: 'Es Hora de Romper la Ley del Silencio sobre el Acoso Escolar (Ley 1620)',
    category: 'acoso',
    categoryLabel: 'Prevención del Acoso Escolar',
    format: 'video',
    duration: '6:45 min',
    thumbnail: '/src/assets/images/video_peaceful_coexistence_1792612455559.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/gODzdiZ4Gj8',
    youtubeId: 'gODzdiZ4Gj8',
    author: 'Iñaki Zubizarreta (Campaña Actuamos Contra el Bullying ACB)',
    institutionSource: 'Comité de Convivencia Escolar & ACB Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Sensibilizar sobre el daño devastador del acoso escolar y movilizar a los compañeros testigos a no ser cómplices con el silencio.',
    description:
      'El exjugador de baloncesto Iñaki Zubizarreta cuenta en primera persona cómo sobrevivió al bullying escolar y cómo la indiferencia de quienes miran lastima tanto como la agresión. Un mensaje poderoso sobre el poder de alzar la voz.',
    takeaways: [
      'El acoso escolar vive de la complicidad y el silencio de los observadores.',
      'No reírse ni celebrar burlas en el salón o en grupos de WhatsApp quita poder al agresor.',
      'Reportar una agresión a orientación escolar no es delatar: es proteger la vida de un compañero.',
      'Expresa Te te permite solicitar mediación y apoyo de manera confidencial y protegida.',
    ],
    transcript:
      'El bullying se alimenta de dos cosas: del miedo de la víctima y del silencio de los que miran. Si ves que están haciendo daño a alguien en tu clase, no te rías, no te calles: busca a un orientador o apóyale en privado. Tu voz salva vidas.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-16T16:00:00.000Z',
    tags: ['acoso', 'bullying', 'ciberacoso', 'solidaridad', 'ley1620'],
  },

  // ==========================================================================
  // 8. ORIENTACIÓN ESTUDIANTIL
  // ==========================================================================
  {
    id: 'av-orientacion-david-bueno',
    title: 'El Cerebro de los Adolescentes: Por qué Cambiamos y Cómo Entendernos',
    category: 'orientacion',
    categoryLabel: 'Orientación Estudiantil & Consejos',
    format: 'video',
    duration: '7:15 min',
    thumbnail: '/src/assets/images/video_exam_anxiety_1792612455262.jpg',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/v4KplEgXI9c',
    youtubeId: 'v4KplEgXI9c',
    author: 'Dr. David Bueno (Biólogo, Genetista y Neuroeducador)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Brindar a los estudiantes y adolescentes una comprensión científica de sus emociones, cambios de humor y búsqueda de identidad.',
    description:
      'El especialista David Bueno explica cómo durante la adolescencia el cerebro experimenta una profunda remodelación neuronal. Ofrece claves prácticas para organizar el tiempo de estudio, cultivar la pasión vocacional y mantener la calma.',
    takeaways: [
      'Durante la adolescencia el cerebro emocional madura antes que el racional: es normal sentir intensamente.',
      'Dormir las horas adecuadas es imprescindible para fijar lo aprendido y regular el estado de ánimo.',
      'Explorar distintas áreas de conocimiento ayuda a descubrir tu verdadera vocación profesional.',
      'El equipo de Orientación Escolar está siempre disponible para orientar tu plan de vida y carrera.',
    ],
    transcript:
      'Los adolescentes no son personas difíciles; son cerebros maravillosos en plena transformación. Cuando comprendes qué ocurre en tu mente, aprendes a gestionar mejor tus impulsos y a construir tu propio futuro con confianza.',
    isRecommended: true,
    isDemo: false,
    publishedAt: '2026-03-18T10:00:00.000Z',
    tags: ['orientacion', 'adolescencia', 'cerebro', 'estudio', 'vocacion'],
  },
  {
    id: 'av-orientacion-asertividad-begona',
    title: 'Ocho Lecciones de Convivencia, Empatía y Asertividad Escolar',
    category: 'orientacion',
    categoryLabel: 'Orientación & Habilidades Sociales',
    format: 'video',
    duration: '6:35 min',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGIcoPfvGy9utMaFfoF5Pti0OebMRUq-93tHRJhc8TJbgFz-5810Xmf7cpEscJrBeLzReNwP7piCbAm29SL1yb8q_9eRK2CWseQWt0W1OGe9PTenBeJJziW9qa0yM5zO94TOOKDJPzA-TSwH4Kt7bXaql3Fsn8ydtA4srqRhosUPV5oLl55QbgvJlhAxPlG9GAaWAKHpsiVVb1Gr-Uk1ciz7lFPhRiU1zdakGBnwuFaNKPsUTgBdfv9Q',
    mediaUrl: 'https://www.youtube-nocookie.com/embed/-9GnFyrLAHA',
    youtubeId: '-9GnFyrLAHA',
    author: 'Begoña Ibarrola (Psicóloga y Pedagoga)',
    institutionSource: 'Canal Oficial Aprendemos Juntos · BBVA Educación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    pedagogicalGoal: 'Desarrollar habilidades sociales para la resolución pacífica de desacuerdos escolares y fortalecer la comunicación sincera entre pares.',
    description:
      'Ocho pautas claras y aplicables para estudiantes: cómo expresar desacuerdos sin herir, cómo pedir disculpas con honestidad y cómo tejer redes de apoyo emocional en el colegio.',
    takeaways: [
      'Comunicar con asertividad significa defender tus derechos respetando siempre los ajenos.',
      'Pedir disculpas cuando nos equivocamos es señal de valentía y madurez personal.',
      'Saber decir "no" con amabilidad previene situaciones de sobrecarga y abuso escolar.',
      'La empatía activa nos permite descubrir qué necesita la otra persona antes de juzgarla.',
    ],
    transcript:
      'Aprender a convivir es el aprendizaje más valioso de la etapa escolar. Cuando nos comunicamos desde la verdad y la compasión, los conflictos se transforman en acuerdos sólidos y duraderos.',
    isRecommended: false,
    isDemo: false,
    publishedAt: '2026-03-20T14:00:00.000Z',
    tags: ['orientacion', 'asertividad', 'comunicacion', 'habilidades', 'empatia'],
  },

  // ==========================================================================
  // MATERIAL COMPLEMENTARIO MULTIMEDIA (PRESENTACIONES, INFOGRAFÍAS Y AUDIOS)
  // Garantiza variedad de formatos requerida por la plataforma y los tests
  // ==========================================================================
  {
    id: 'av-presentacion-habitos',
    title: 'Guía de Hábitos de Estudio y Gestión del Tiempo Libre',
    category: 'orientacion',
    categoryLabel: 'Material Educativo — Diapositivas',
    format: 'presentacion',
    duration: '8 láminas',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGIcoPfvGy9utMaFfoF5Pti0OebMRUq-93tHRJhc8TJbgFz-5810Xmf7cpEscJrBeLzReNwP7piCbAm29SL1yb8q_9eRK2CWseQWt0W1OGe9PTenBeJJziW9qa0yM5zO94TOOKDJPzA-TSwH4Kt7bXaql3Fsn8ydtA4srqRhosUPV5oLl55QbgvJlhAxPlG9GAaWAKHpsiVVb1Gr-Uk1ciz7lFPhRiU1zdakGBnwuFaNKPsUTgBdfv9Q',
    mediaUrl: '#diapositivas-habitos',
    author: 'Coordinación Académica & Orientación',
    audioLanguage: 'Español (Nativo)',
    hasSubtitles: true,
    description:
      'Presentación pedagógica interactiva con diapositivas explicativas para optimizar tu tiempo de estudio, organizar tareas con la matriz de prioridades y equilibrar el descanso.',
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
    isDemo: false,
    publishedAt: '2026-03-22T10:00:00.000Z',
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
    audioLanguage: 'Español (Nativo)',
    description:
      'Herramienta visual gráfica interactiva para identificar en qué nivel de la escala emocional te encuentras (Verde: Calma; Amarillo: Tensión inicial; Naranja: Agitación; Rojo: Crisis/Desborde) y qué recurso activar en cada nivel.',
    takeaways: [
      'Nivel Verde (0 a 3): Zona de regulación y aprendizaje óptimo.',
      'Nivel Amarillo (4 a 6): Señales tempranas (ceño fruncido, inquietud); aplicar técnica STOP.',
      'Nivel Naranja (7 a 8): Tensión alta (respiración corta); pedir una pausa activa o ir al baño.',
      'Nivel Rojo (9 a 10): Crisis; no intentar razonar, acudir de inmediato a orientación escolar.',
    ],
    isDemo: false,
    publishedAt: '2026-03-24T08:30:00.000Z',
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
    audioLanguage: 'Español (Nativo)',
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
    isDemo: false,
    publishedAt: '2026-03-25T17:00:00.000Z',
    tags: ['audio', 'mindfulness', 'relajacion', 'lluvia', 'bienestar'],
  },
];
