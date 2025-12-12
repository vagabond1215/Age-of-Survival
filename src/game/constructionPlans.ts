import { DEFAULT_BED_CAPACITY } from './constants';
import {
  computeRenovationDelta,
  computeReplacementDelta,
  type EnqueueOptions
} from './systems/construction';

export interface ConstructionPlan extends EnqueueOptions {
  label: string;
  description: string;
}

export const CONSTRUCTION_PLANS: ConstructionPlan[] = [
  {
    label: 'Makeshift Shelter',
    description: 'Quick shelters to add more bedding for newcomers.',
    type: 'new',
    targetSlug: 'makeshift_shelter',
    location: [1, 0],
    baseDays: 2,
    replacementOf: null,
    capacityDelta: DEFAULT_BED_CAPACITY
  },
  {
    label: 'Log Cabin',
    description: 'Sturdier housing with a modest capacity boost.',
    type: 'new',
    targetSlug: 'log_cabin',
    location: [1, 1],
    baseDays: 3,
    replacementOf: null,
    capacityDelta: 3
  },
  {
    label: 'Stone Hall',
    description: 'Replace the camp shelter with a proper stone hall.',
    type: 'replacement',
    targetSlug: 'stone_hall',
    location: [0, 0],
    baseDays: 4,
    replacementOf: 'camp',
    capacityDelta: computeReplacementDelta(DEFAULT_BED_CAPACITY, 6)
  },
  {
    label: 'Town Hall Renovation',
    description: 'Expand the hall and refine its interior.',
    type: 'renovation',
    targetSlug: 'town_hall',
    location: [0, 0],
    baseDays: 3,
    replacementOf: 'camp',
    capacityDelta: computeRenovationDelta(6, 8)
  }
];
