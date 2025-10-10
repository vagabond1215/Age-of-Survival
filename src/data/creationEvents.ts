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
    id: 'fisher',
    label: '"A seasoned fisher would read the currents and cast with patience..."',
    description: 'Feel the tug of tide and time, trusting the waters to reveal their rhythm.',
    result: 'You breathe with a fisher\'s patience, letting the moment carry you to safety.'
  },
  {
    id: 'farmer',
    label: '"A devoted farmer would know how to tend even the harshest soil..."',
    description: 'Recall the seasons of toil, coaxing life where none wished to grow.',
    result: 'You steady yourself like a farmer, cultivating resolve from barren fear.'
  },
  {
    id: 'miner',
    label: '"A seasoned miner would read the stone for hidden strength..."',
    description: 'Hear the groan of the earth and chart a path through shadowed veins.',
    result: 'You test each hold like a miner, trusting the bedrock to bear your weight.'
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
  },
  {
    id: 'rogue',
    label: '"A cunning rogue would find a foothold where others fall..."',
    description: 'Picture nimble hands and quick wit, ever seeking the unseen path.',
    result: 'You slip into a rogue\'s mindset, finding holds where none should exist.'
  },
  {
    id: 'cleric',
    label: '"A devoted cleric would pray, and the light itself would lend them strength..."',
    description: 'Summon faith like fire in your chest and let it drive back despair.',
    result: 'You let a cleric\'s prayer kindle strength, warmth flooding your limbs.'
  },
  {
    id: 'mage',
    label: '"A disciplined mage would speak the words to bend the elements themselves..."',
    description: 'Feel the arcane currents stir, whispering for control and focus.',
    result: 'You draw on a mage\'s discipline, shaping raw power into a shield of intent.'
  },
  {
    id: 'paladin',
    label: '"A steadfast paladin would raise shield and vow never to yield..."',
    description: 'Swear silently to stand firm against the abyss, as light and oath entwine.',
    result: 'You raise an unseen shield, a paladin\'s oath holding the darkness at bay.'
  },
  {
    id: 'bard',
    label: '"A wandering bard would turn fear into song, weaving courage from melody..."',
    description: 'Hear the rhythm of your heartbeat — your own tale refusing to end here.',
    result: 'You weave dread into cadence, a bard\'s song steadying every breath.'
  },
  {
    id: 'ranger',
    label: '"A practiced ranger would find the path that others miss..."',
    description: 'Trust the land itself to guide you, your instincts sharp as the fletching of an arrow.',
    result: 'You move like a ranger on the trail, guided by the whispers of the wilds.'
  },
  {
    id: 'blacksmith',
    label: '"A tireless blacksmith would see strength in what can be reforged..."',
    description: 'Feel the grit in your palms, the will to shape ruin into something enduring.',
    result: 'You channel a blacksmith\'s grit, forging resolve from the raw ore of fear.'
  },
  {
    id: 'alchemist',
    label: '"A learned alchemist would know how to transmute danger into opportunity..."',
    description: 'Let reason temper fear, and the impossible might just yield to you.',
    result: 'You calculate like an alchemist, transmuting peril into a plan.'
  },
  {
    id: 'monk',
    label: '"A quiet monk would breathe deeply, and fall like water, not stone..."',
    description: 'Center yourself — the fall may be long, but serenity knows no bottom.',
    result: 'You flow with a monk\'s grace, letting calm turn the fall into a glide.'
  },
  {
    id: 'merchant',
    label: '"A shrewd merchant would weigh every risk, and find the profit even in peril..."',
    description: 'See value where others see loss, and your wits will buy your survival.',
    result: 'You bargain with fate itself, a merchant\'s cunning buying precious moments.'
  },
  {
    id: 'carpenter',
    label: '"A careful carpenter would measure twice before daring a leap..."',
    description: 'Picture steady hands shaping beams, aligning each choice with precision.',
    result: 'You gauge angles like a carpenter, fashioning a path plank by plank.'
  },
  {
    id: 'cook',
    label: '"A resourceful cook would make do with whatever the wilds provide..."',
    description: 'Imagine a hearth conjured anywhere, every scrap turned toward survival.',
    result: 'You improvise like a cook, blending scarce chances into sustaining hope.'
  },
  {
    id: 'berserker',
    label: '"A relentless berserker would greet the fall as a challenge, not a curse..."',
    description: 'Welcome the rush, the chaos — for only through fury does one rise again.',
    result: 'You welcome the plunge as a berserker, turning terror into driving force.'
  },
  {
    id: 'druid',
    label: '"A faithful druid would call upon root and branch to cradle their descent..."',
    description: 'Feel the whisper of the wild, life itself answering your unspoken plea.',
    result: 'You attune like a druid, senses entwining with root and leaf for aid.'
  },
  {
    id: 'scholar',
    label: '"A wise scholar would recall the stories of those who survived before..."',
    description: 'In memory lies knowledge — in knowledge, the faint light of hope.',
    result: 'You recall a scholar\'s lore, letting past lessons chart your escape.'
  },
  {
    id: 'artisan',
    label: '"A steadfast artisan would trust in craft and ingenuity to find a way out..."',
    description: 'See not the drop, but the problem to be solved — and make it so.',
    result: 'You improvise like an artisan, shaping adversity into workable design.'
  },
  {
    id: 'peasant',
    label: '"A humble peasant would pray to live another day... and sometimes, that\'s enough."',
    description: 'For courage is not only might — it is the will to keep breathing, even now.',
    result: 'You cling to quiet hope, a peasant\'s prayer keeping your heart steady.'
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
