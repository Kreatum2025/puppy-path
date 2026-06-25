// scripts/ai-benchmark/run.mjs
// Local benchmark runner. Reads BERGET_API_KEY from env or repo .env.local.
// Never logs the key. No app/DB integration. Run manually:
//   node scripts/ai-benchmark/run.mjs --list-models
//   node scripts/ai-benchmark/run.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { BERGET_BASE_URL, MODELS, TASKS, SYSTEM, SAMPLE_TEXT } from './config.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');
const args = process.argv.slice(2);

function loadKey() {
  if (process.env.BERGET_API_KEY) return process.env.BERGET_API_KEY;
  const envPath = join(repoRoot, '.env.local');
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .find((l) => l.startsWith('BERGET_API_KEY='));
    if (line) return line.slice('BERGET_API_KEY='.length).trim();
  }
  return null;
}
const KEY = loadKey();
if (!KEY) {
  console.error('BERGET_API_KEY saknas (env eller .env.local). Avbryter.');
  process.exit(1);
}

async function listModels() {
  const r = await fetch(`${BERGET_BASE_URL}/models`, {
    headers: { Authorization: `Bearer ${KEY}` },
  });
  if (!r.ok) {
    console.error(`Kunde inte lista modeller: HTTP ${r.status}`);
    return;
  }
  const j = await r.json();
  const list = j.data || j;
  console.log('Tillgängliga modeller hos Berget:');
  list.forEach((m) => console.log('  ' + (m.id || m)));
}

if (args.includes('--list-models')) {
  await listModels();
  process.exit(0);
}

const breeds = JSON.parse(
  readFileSync(join(here, 'fixtures', 'breeds.sample.json'), 'utf8'),
);
const labrador = breeds.find((b) => /labrador/i.test(b.attributes.name)) || breeds[0];
const SOURCE_IDS = JSON.stringify([`dogapi.dog:${labrador.source_id}`]);
const BREED_JSON = JSON.stringify(labrador.attributes);

const fill = (t) =>
  t
    .replace('{{BREED_JSON}}', BREED_JSON)
    .replace('{{SOURCE_IDS}}', SOURCE_IDS)
    .replace('{{SAMPLE_TEXT}}', SAMPLE_TEXT);

async function call(model, user) {
  const t0 = Date.now();
  try {
    const r = await fetch(`${BERGET_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: user },
        ],
      }),
    });
    const ms = Date.now() - t0;
    if (!r.ok) return { ok: false, ms, error: `HTTP ${r.status}` };
    const j = await r.json();
    return {
      ok: true,
      ms,
      content: j.choices?.[0]?.message?.content ?? '',
      usage: j.usage ?? null,
    };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, error: String(e.message || e) };
  }
}

function checkJson(content, schema) {
  try {
    const o = JSON.parse(content);
    const missing = (schema.required || []).filter((k) => !(k in o));
    return { json_valid: missing.length === 0, missing, obj: o };
  } catch {
    return { json_valid: false, missing: schema.required || [], obj: null };
  }
}

function estCost(model, usage) {
  if (!usage || model.priceInPerM == null || model.priceOutPerM == null) return null;
  const inTok = usage.prompt_tokens ?? usage.input_tokens ?? 0;
  const outTok = usage.completion_tokens ?? usage.output_tokens ?? 0;
  return (inTok / 1e6) * model.priceInPerM + (outTok / 1e6) * model.priceOutPerM;
}

const results = [];
for (const m of MODELS) {
  if (m.bergetModelId === 'TODO-confirm') {
    console.log(`(hoppar ${m.key}: bergetModelId ej satt)`);
    continue;
  }
  for (const task of TASKS) {
    const res = await call(m.bergetModelId, fill(task.user));
    const v =
      res.ok && task.expects === 'json'
        ? checkJson(res.content, task.schema)
        : { json_valid: null, obj: null };
    // automatisk längdkontroll
    let words = null;
    let length_ok = null;
    if (v.obj && task.wordField && typeof v.obj[task.wordField] === 'string') {
      words = v.obj[task.wordField].trim().split(/\s+/).filter(Boolean).length;
      if (task.maxWords) length_ok = words <= task.maxWords;
    }
    results.push({
      model: m.key,
      task: task.id,
      ok: res.ok,
      ms: res.ms,
      error: res.error || null,
      json_valid: v.json_valid,
      words,
      length_ok,
      usage: res.usage || null,
      est_cost: estCost(m, res.usage),
      output: res.content || null,
    });
    console.log(
      `${m.key} / ${task.id}: ok=${res.ok} json=${v.json_valid} ${res.ms}ms` +
        (words != null ? ` words=${words}${length_ok === false ? ' (ÖVER)' : ''}` : ''),
    );
  }
}

const outDir = join(here, 'results');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const file = join(outDir, `run-${Date.now()}.json`);
writeFileSync(file, JSON.stringify(results, null, 2));
console.log('\nResultat sparat:', file);
console.log('Fyll i subjektiv scoring i scoring.md. (est_cost kräver priser i config.mjs.)');
