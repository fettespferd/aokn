import type { LifeStage } from '../types/page';

export const defaultLifeStages: LifeStage[] = [
  { id: 'ls-0-3', label: '0.-3. Lebensmonat', type: 'months', from: 0, to: 3, sortOrder: 0 },
  { id: 'ls-4-6', label: '4.-6. Lebensmonat', type: 'months', from: 4, to: 6, sortOrder: 1 },
  { id: 'ls-7-9', label: '7.-9. Lebensmonat', type: 'months', from: 7, to: 9, sortOrder: 2 },
  { id: 'ls-10-12', label: '10.-12. Lebensmonat', type: 'months', from: 10, to: 12, sortOrder: 3 },
  { id: 'ls-13-18', label: '13.-18. Lebensmonat', type: 'months', from: 13, to: 18, sortOrder: 4 },
  { id: 'ls-19-24', label: '19.-24. Lebensmonat', type: 'months', from: 19, to: 24, sortOrder: 5 },
  { id: 'ls-y2', label: '2. Lebensjahr', type: 'years', from: 2, to: 2, sortOrder: 6 },
  { id: 'ls-y3', label: '3. Lebensjahr', type: 'years', from: 3, to: 3, sortOrder: 7 },
  { id: 'ls-y4', label: '4. Lebensjahr', type: 'years', from: 4, to: 4, sortOrder: 8 },
  { id: 'ls-y5', label: '5. Lebensjahr', type: 'years', from: 5, to: 5, sortOrder: 9 },
];
