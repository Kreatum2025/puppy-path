# Arkitektur

PuppyJourney byggs **contract-first**: frontend först, men med en tydlig framtida
datamodell och ett service-lager som redan beter sig som riktig backend. Målet
är att kunna byta mockdata mot Supabase **utan att röra UI**.

## Tre lager

```
UI  ──►  Service  ──►  Typer + (mock)data
```

1. **UI-lager** — `app/` (skärmar/routes), `src/components` (återanvändbara
   primitiver), `src/features/*` (domänkomponenter). Läser ALDRIG data direkt;
   alltid via services.
2. **Service-lager** — `src/services/*`. Varje funktion är `async` och returnerar
   en typad `Promise`. Idag returnerar de mockdata; senare byts bara funktionens
   innehåll mot ett Supabase-anrop.
3. **Typ-/datalager** — `src/types/*` (motsvarar framtida DB-tabeller),
   `src/data/*` (mockdata + redaktionellt innehåll), `src/lib/*` (ren logik:
   datum, veckoberäkning).

### Exempel på service-kontraktet

```ts
// nu (prototyp)
export async function getCurrentPuppy(): Promise<Puppy> {
  return mockPuppy;
}

// senare (samma signatur — UI ändras inte)
export async function getCurrentPuppy(): Promise<Puppy> {
  const { data, error } = await supabase.from('puppies').select('*').single();
  if (error) throw error;
  return data;
}
```

## Datamodell (framtida tabeller)

Definierad i `src/types`:

- `Puppy` — id, namn, ras, födelsedatum, foto
- `GrowthLog` — vikt (kg), mankhöjd (cm), mättidpunkt
- `Milestone` — milstolpe per vecka
- `Challenge` — veckans utmaning
- `MemoryPhoto` — veckobild (Storage senare)
- `WeeklyGuide` — redaktionellt veckoinnehåll (vecka 8–52)
- `WeeklyDigest` — AI-veckosammanfattning (placeholder; `generated: false` tills
  riktig backend-funktion finns)

## Tillstånd (prototyp)

`src/context/PuppyContext.tsx` håller in-memory-tillstånd: aktiv valp,
onboarding-utkast och veckans loggprogress (de fem "minnena"). Det driver
Today-skärmens gamification och delningskortet. När backend kopplas på blir det
ett tunt klientcache-lager och skrivningar går via services → Supabase istället
för att mutera lokalt tillstånd.

## Animationer

Reanimated är **enda** animationsbiblioteket (progress, kortövergångar,
success-feedback). Inget virrvarr av Animated/LayoutAnimation. Alla komponenter
renderar korrekt även om en animation förenklas (graceful fallback).

## Navigationskarta

```
/                         Welcome
/onboarding               intro → puppy-name → breed → birthdate → photo → measurements → done
/(tabs)                   today · puppy · journey · guide · offers
/modal/share-card         delningskorts-preview (modal)
```

## Regler

- Inga hårdkodade färger i komponenter — använd `src/theme`.
- Inga kund-/domännamn i källkod.
- Inga vet-påståenden; varje veckokort har en säkerhetsdisclaimer.
- Inga secrets/.env med riktiga nycklar i repo:t.
- Inga mock-/fejkdata direkt i skärmar — allt via services. Saknas data →
  ärligt empty state.
