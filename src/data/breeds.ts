import type { Breed } from '@/types';

/** Breed list for the MVP onboarding. */
export const breeds: Breed[] = [
  { id: 'labrador-retriever', name: 'Labrador Retriever' },
  { id: 'golden-retriever', name: 'Golden Retriever' },
  { id: 'german-shepherd', name: 'Schäfer' },
  { id: 'french-bulldog', name: 'Fransk bulldog' },
  { id: 'cocker-spaniel', name: 'Cocker Spaniel' },
  { id: 'border-collie', name: 'Border Collie' },
  { id: 'dachshund', name: 'Tax' },
  { id: 'poodle', name: 'Pudel' },
  { id: 'cavalier-king-charles-spaniel', name: 'Cavalier King Charles Spaniel' },
  { id: 'mixed', name: 'Blandras' },
];

export function breedNameById(id: string): string {
  return breeds.find((b) => b.id === id)?.name ?? 'Blandras';
}
