/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateInstitutionalEmail, normalizeEmail, INSTITUTIONAL_DOMAIN } from '../src/utils/institutionalValidator.ts';
import { institutionalEmailMiddleware } from '../server.ts';

async function runTests() {
  console.log('🧪 Iniciando pruebas de validación de correo institucional...\n');
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ PASÓ: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FALLÓ: ${name} - ${details || ''}`);
      failed++;
    }
  }

  // Caso 1: estudiante@colegio.edu.co - Dominio permitido
  const case1 = validateInstitutionalEmail('estudiante@colegio.edu.co');
  assert('estudiante@colegio.edu.co es aceptado', case1.isValid === true && case1.normalizedEmail === 'estudiante@colegio.edu.co');

  // Caso 2: estudiante@gmail.com - Dominio personal rechazado
  const case2 = validateInstitutionalEmail('estudiante@gmail.com');
  assert('estudiante@gmail.com es rechazado con mensaje específico de personal', case2.isValid === false && case2.errorCode === 'PERSONAL_EMAIL_REJECTED');

  // Caso 3: estudiante@hotmail.com - Dominio personal rechazado
  const case3 = validateInstitutionalEmail('estudiante@hotmail.com');
  assert('estudiante@hotmail.com es rechazado', case3.isValid === false && case3.errorCode === 'PERSONAL_EMAIL_REJECTED');

  // Caso 3b: otros dominios no autorizados (ej. outlook, yahoo, empresa.com)
  const case3b = validateInstitutionalEmail('juan@outlook.com');
  assert('juan@outlook.com es rechazado', case3b.isValid === false);

  const case3c = validateInstitutionalEmail('profesor@universidad.com');
  assert('profesor@universidad.com es rechazado como no autorizado', case3c.isValid === false && case3c.errorCode === 'UNAUTHORIZED_DOMAIN');

  // Caso 4: Correo vacío o con formato inválido
  const case4Empty = validateInstitutionalEmail('');
  assert('Correo vacío es rechazado', case4Empty.isValid === false && case4Empty.errorCode === 'EMPTY_EMAIL');

  const case4Null = validateInstitutionalEmail(null);
  assert('Correo null es rechazado', case4Null.isValid === false);

  const case4Invalid1 = validateInstitutionalEmail('correo-sin-arroba');
  assert('correo-sin-arroba es rechazado', case4Invalid1.isValid === false && case4Invalid1.errorCode === 'INVALID_FORMAT');

  const case4Invalid2 = validateInstitutionalEmail('@colegio.edu.co');
  assert('@colegio.edu.co sin usuario es rechazado', case4Invalid2.isValid === false && case4Invalid2.errorCode === 'INVALID_FORMAT');

  // Caso 5: Correo con espacios al inicio o al final: normalizado y validado
  const rawWithSpaces = '   Estudiante.Prueba@Colegio.Edu.Co   ';
  const case5 = validateInstitutionalEmail(rawWithSpaces);
  assert(
    'Correo con mayúsculas y espacios se normaliza a minúsculas y se valida',
    case5.isValid === true && case5.normalizedEmail === 'estudiante.prueba@colegio.edu.co'
  );

  // Caso 6: Middleware de autenticación (Express Request/Response mock)
  console.log('\n🔒 Comprobando Middleware de autenticación en backend:');

  let middlewareNextCalled: boolean = false;
  let statusSet: number | null = null;
  let jsonResponse: unknown = null;

  const mockRes = {
    status: (code: number) => {
      statusSet = code;
      return mockRes;
    },
    json: (data: unknown) => {
      jsonResponse = data;
      return mockRes;
    },
  };

  // 6a: Petición con Gmail debe ser bloqueada con HTTP 400
  const stateA = { nextCalled: false };
  institutionalEmailMiddleware(
    { body: { email: 'hacker@gmail.com' }, query: {} } as any,
    mockRes as any,
    () => {
      stateA.nextCalled = true;
    }
  );
  assert('Middleware bloquea hacker@gmail.com con HTTP 400', statusSet === 400 && stateA.nextCalled === false);

  // 6b: Petición con @colegio.edu.co debe continuar con next() y adjuntar normalizedEmail
  const stateB = { nextCalled: false };
  const mockReqValid = { body: { email: '  estudiante.prueba@COLEGIO.EDU.CO  ' }, query: {} };
  institutionalEmailMiddleware(
    mockReqValid as any,
    mockRes as any,
    () => {
      stateB.nextCalled = true;
    }
  );
  assert(
    'Middleware aprueba correo institucional y adjunta normalizedEmail',
    stateB.nextCalled === true && (mockReqValid.body as any).normalizedEmail === 'estudiante.prueba@colegio.edu.co'
  );

  // Caso 7: Verificación de dependencias legítimas con scripts (esbuild y protobufjs)
  try {
    const esbuild = await import('esbuild');
    assert('esbuild está instalado y operativo (versión ' + esbuild.version + ')', typeof esbuild.version === 'string');
  } catch (err: any) {
    assert('esbuild funciona sin errores', false, err?.message);
  }

  try {
    const protobuf = await import('protobufjs');
    assert('protobufjs funciona sin errores y expone clase Root', typeof protobuf.Root === 'function' || typeof (protobuf as any).default?.Root === 'function');
  } catch (err: any) {
    assert('protobufjs funciona sin errores', false, err?.message);
  }

  // Caso 8: Verificación del Catálogo de Audiovisuales Institucional
  console.log('\n🎬 Comprobando Catálogo y Recursos Audiovisuales:');
  const { INITIAL_AUDIOVISUAL_RESOURCES } = await import('../src/data/audiovisualData.ts');
  assert('Catálogo inicial de audiovisuales cargado', Array.isArray(INITIAL_AUDIOVISUAL_RESOURCES) && INITIAL_AUDIOVISUAL_RESOURCES.length >= 8);

  const hasEmotionalWellness = INITIAL_AUDIOVISUAL_RESOURCES.some((r) => r.category === 'emociones' || r.category === 'estres' || r.category === 'autoestima');
  assert('Incluye videos de bienestar emocional (estrés, autoestima, emociones)', hasEmotionalWellness);

  const hasSchoolGuidance = INITIAL_AUDIOVISUAL_RESOURCES.some((r) => r.category === 'convivencia' || r.category === 'conflictos' || r.category === 'acoso' || r.category === 'comunicacion');
  assert('Incluye recursos de orientación escolar (convivencia, acoso, resolución de conflictos)', hasSchoolGuidance);

  const hasMultipleFormats = ['video', 'presentacion', 'infografia', 'audio'].every((fmt) =>
    INITIAL_AUDIOVISUAL_RESOURCES.some((r) => r.format === fmt)
  );
  assert('Incluye variedad de formatos educativos (videos, presentaciones, infografías, audios)', hasMultipleFormats);

  const allHaveSafeUrls = INITIAL_AUDIOVISUAL_RESOURCES.every((r) => r.mediaUrl && r.title && r.categoryLabel);
  assert('Todos los recursos cuentan con enlaces seguros y títulos estructurados', allHaveSafeUrls);

  console.log(`\n========================================`);
  console.log(`RESULTADO: ${passed} pruebas pasaron, ${failed} fallaron.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
