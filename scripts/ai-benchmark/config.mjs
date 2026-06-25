// scripts/ai-benchmark/config.mjs
// PuppyJourney content-workflow benchmark — configuration only. No keys here.

export const BERGET_BASE_URL = 'https://api.berget.ai/v1';

// priceInPerM / priceOutPerM = pris per MILJON tokens (in/ut) enligt Bergets
// prislista (bekräfta valuta EUR/USD). run.mjs räknar faktisk kostnad ur usage.
// Bekräfta att modell-id finns: node scripts/ai-benchmark/run.mjs --list-models
export const MODELS = [
  {
    key: 'mistral-medium-3.5',
    bergetModelId: 'mistralai/Mistral-Medium-3.5-128B',
    role: 'kvalitetskandidat: svensk redaktionell apptext',
    priceInPerM: 1.5,
    priceOutPerM: 5.0,
  },
  {
    key: 'glm-5.2',
    bergetModelId: 'zai-org/GLM-5.2',
    role: 'komplex sammanfattning, källtrohet, workflow-resonemang',
    priceInPerM: 1.4,
    priceOutPerM: 4.4,
  },
  {
    key: 'llama-3.3-70b',
    bergetModelId: 'meta-llama/Llama-3.3-70B-Instruct',
    role: 'kostnadseffektiv default-kandidat',
    priceInPerM: 0.9,
    priceOutPerM: 0.9,
  },
  {
    key: 'gpt-oss-120b',
    bergetModelId: 'openai/gpt-oss-120b',
    role: 'validator: JSON, policy, källtrohet, vägran utan källa',
    priceInPerM: 0.2,
    priceOutPerM: 0.75,
  },
  {
    key: 'mistral-small-3.2',
    bergetModelId: 'mistralai/Mistral-Small-3.2-24B-Instruct-2506',
    role: 'billig arbetsmodell: enkla kort, rubriker, översättning',
    priceInPerM: 0.3,
    priceOutPerM: 0.3,
  },
];

export const SYSTEM = [
  'Du är PuppyJourneys redaktionella motor, inte en chatbot.',
  'Skriv trygg, varm och saklig premium svenska för valpägare.',
  'Använd ENDAST fakta från given källdata. Hitta inte på.',
  'Inga hälsopåståenden utan källa. Symptom eller oro: hänvisa till veterinär.',
  'När ett JSON-schema anges: svara ENBART med giltig JSON enligt schemat, inget annat.',
  'Bevara angivna source_ids exakt.',
].join(' ');

export const SAMPLE_TEXT =
  'Labrador retriever är en stor, vänlig och energisk hundras som ursprungligen ' +
  'avlades i Kanada för att apportera vilt. De är intelligenta, sociala och ' +
  'angelägna om att vara till lags, vilket gör dem till utmärkta familjehundar. ' +
  'De behöver mycket motion och mental stimulans, och trivs med tydliga rutiner ' +
  'och lugn, positiv träning under valptiden.';

// Tokens {{BREED_JSON}}, {{SOURCE_IDS}}, {{SAMPLE_TEXT}} fylls i av run.mjs.
// maxWords används av run.mjs för automatisk längdkontroll.
export const TASKS = [
  { id: 'breed_profile', expects: 'json',
    user: 'Skapa en svensk rasprofil från denna DogAPI-rådata. Använd bara fälten i datan. source_ids: {{SOURCE_IDS}}. Data:\n{{BREED_JSON}}',
    schema: { required: ['title_sv', 'summary_sv', 'size_sv', 'life_span', 'source_ids'] } },
  { id: 'weekly_card', expects: 'json', wordField: 'body_sv', maxWords: 80,
    user: 'Skapa ett veckokort (card_type=weekly_development) för en 10 veckor gammal valp av rasen i datan. Max 80 ord i body_sv. Data:\n{{BREED_JSON}}',
    schema: { required: ['card_type', 'week', 'title_sv', 'body_sv', 'focus_points'] } },
  { id: 'daily_tip', expects: 'json',
    user: 'Skapa dagens tips (card_type=daily_tip) i PuppyJourney-ton för en valp runt 10 veckor. Kort och konkret.',
    schema: { required: ['card_type', 'tip_sv'] } },
  { id: 'strict_schema', expects: 'json',
    user: 'Returnera JSON enligt EXAKT detta schema och inget annat: {"title_sv": string, "body_sv": string, "word_count": number}. Ämne: kort om socialisering.',
    schema: { required: ['title_sv', 'body_sv', 'word_count'] } },
  { id: 'refuse_health', expects: 'json',
    user: 'Användaren frågar: "Min valp kräks och är trött, vilken sjukdom har den?" Du har INGEN källa om hälsa. Svara enligt schema.',
    schema: { required: ['answer_sv', 'route_to_vet', 'made_health_claim'] } },
  { id: 'summarize_source', expects: 'json',
    user: 'Sammanfatta denna källdata på svenska UTAN att lägga till något som inte står i datan. source_ids: {{SOURCE_IDS}}. Data:\n{{BREED_JSON}}',
    schema: { required: ['summary_sv', 'source_ids'] } },
  { id: 'max_80_words', expects: 'json', wordField: 'text_sv', maxWords: 80,
    user: 'Skriv apptext om valpens första vecka hemma. HÖGST 80 ord i fältet text_sv.',
    schema: { required: ['text_sv'] } },
  { id: 'preserve_source_ids', expects: 'json',
    user: 'Skapa en kort rasnotis och returnera exakt dessa source_ids oförändrade i fältet source_ids: {{SOURCE_IDS}}. Data:\n{{BREED_JSON}}',
    schema: { required: ['note_sv', 'source_ids'] } },
  { id: 'classify_publish', expects: 'json',
    user: 'Klassificera om denna text får publiceras direkt (approved) eller kräver mänsklig review (needs_review), t.ex. vid ogrundade hälsopåståenden. Text:\n"Den här rasen får ofta höftledsdysplasi och bör opereras."',
    schema: { required: ['review_status', 'reason_sv'] } },
  { id: 'shorten', expects: 'json', wordField: 'short_sv',
    user: 'Förkorta denna text till ungefär hälften utan att tappa saklighet. Returnera i fältet short_sv. Text:\n{{SAMPLE_TEXT}}',
    schema: { required: ['short_sv'] } },
];
