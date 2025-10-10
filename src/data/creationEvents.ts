import { type BiomeId } from '../game/constants';

export interface ThoughtOption {
  id: string;
  label: string;
  description: string;
  result: string;
}

export interface CreationEvent {
  id: string;
  title: string;
  description: string;
  hardship: string;
  biomes?: BiomeId[];
  thoughts: ThoughtOption[];
}

const BASE_THOUGHTS: ThoughtOption[] = [
  {
    id: 'warrior',
    label: '"A strong warrior would best this foe with ease... yet I..."',
    description: 'Imagine the poise of a warrior and meet the danger head-on.',
    result: 'You brace with a warrior\'s resolve, refusing to yield.'
  },
  {
    id: 'gatherer',
    label: '"A skilled gatherer would know which was poisonous or edible..."',
    description: 'Remember every lesson in caution, scavenging, and patience.',
    result: 'You catalogue the land like a careful gatherer, mindful of each step.'
  },
  {
    id: 'hunter',
    label: '"A true hunter could fell such game even from here..."',
    description: 'Envision the stillness of a hunter, ready to move with purpose.',
    result: 'You settle into a hunter\'s focus, letting instinct guide you.'
  },
  {
    id: 'herbalist',
    label: '"An herbalist would know how to craft a poultice for this wound..."',
    description: 'Call upon knowledge of roots, salves, and quiet resilience.',
    result: 'You gather yourself like an herbalist, intent on mending what is broken.'
  }
];

export const CREATION_EVENTS: CreationEvent[] = [
  {
    id: 'ravine_plunge',
    title: 'The Ravine\'s Edge',
    description:
      'Loose earth crumbles beneath your heel and the world lurches. Branches claw at you as you tumble toward a shadowed ravine.',
    hardship:
      'Jagged stone waits below and the roar of unseen water thunders up from the depths.',
    biomes: ['temperate_forest', 'taiga', 'alpine'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'labyrinth_grove',
    title: 'The Labyrinth Grove',
    description:
      'Mist thickens between towering trunks until every direction mirrors the last. The forest hums, alive with hidden whispers.',
    hardship:
      'Without a landmark you could wander for days, swallowed whole by the green.',
    biomes: ['temperate_forest', 'taiga', 'rainforest'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'shifting_dunes',
    title: 'Shifting Dunes',
    description:
      'A desert gale rises without warning, sheets of sand blotting out the sun as dunes collapse and reform around you.',
    hardship:
      'The storm steals your bearings, threatening to bury you beneath the drift.',
    biomes: ['desert'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'frozen_whiteout',
    title: 'Frozen Whiteout',
    description:
      'Needle-fine snow lashes your face as clouds swallow the tundra. Every breath crystallizes, every step sinks into crusted drifts.',
    hardship:
      'The wind keens like a beast, and frostbite nips at any exposed skin.',
    biomes: ['tundra', 'alpine'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'tidal_hunt',
    title: 'The Tidal Hunt',
    description:
      'Foam-flecked waves slam against slick rocks as a sea-beast hauls itself ashore, hunger burning in its eyes.',
    hardship:
      'The tide surges at your back while the creature snarls, blocking the only path to safety.',
    biomes: ['coast'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'savanna_wildfire',
    title: 'Savanna Wildfire',
    description:
      'Lightning splits a distant storm and, moments later, a wall of flame races through the tall grasses toward you.',
    hardship:
      'Smoke blinds you as sparks leap ahead of the blaze, threatening to engulf the lone path to shelter.',
    biomes: ['savanna'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'sinking_mire',
    title: 'The Sinking Mire',
    description:
      'A misstep sends you waist-deep into a peat bog while will-o\'-wisps flicker between the trees, luring you deeper.',
    hardship:
      'The muck grips your legs as insects swarm and unseen currents tug you sideways.',
    biomes: ['wetlands'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'steppe_tempest',
    title: 'Steppe Tempest',
    description:
      'Thunderheads collide above the plains, unleashing a stampede of startled beasts that thunder toward your position.',
    hardship:
      'Hooves shake the ground and debris turns the wind into a hail of splinters and stone.',
    biomes: ['steppe'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'volcanic_awakening',
    title: 'Volcanic Awakening',
    description:
      'The earth bucks as a fissure tears open, venting superheated steam while molten rock seeps toward your feet.',
    hardship:
      'Toxic fumes sting your lungs and the ground threatens to crumble into the magma below.',
    biomes: ['volcanic'],
    thoughts: BASE_THOUGHTS
  },
  {
    id: 'subterranean_glow',
    title: 'Subterranean Glow',
    description:
      'A sinkhole yawns underfoot and you spill into a cavern lit by ghostly fungi. The air pulses with distant growls.',
    hardship:
      'Passages twist in every direction, and you can sense something stirring in the dark.',
    thoughts: BASE_THOUGHTS
  }
];

export function getCreationEventsForBiome(biome: BiomeId): CreationEvent[] {
  return CREATION_EVENTS.filter((event) => {
    return !event.biomes || event.biomes.includes(biome);
  });
}

export function getCreationEventById(id: string | null | undefined): CreationEvent | undefined {
  if (!id) return undefined;
  return CREATION_EVENTS.find((event) => event.id === id);
}

export function getThoughtById(event: CreationEvent | undefined, thoughtId: string): ThoughtOption | undefined {
  if (!event) return undefined;
  return event.thoughts.find((thought) => thought.id === thoughtId);
}
