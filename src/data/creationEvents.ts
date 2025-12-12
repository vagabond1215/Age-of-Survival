import { type BiomeId } from '../game/constants';

export interface HelperProfile {
  name: string;
  jobId: string;
  efficiency: number;
  skills: string[];
  summary: string;
}

export interface ThoughtOption {
  id: string;
  label: string;
  description: string;
  arrival: string;
  result: string;
  villager: HelperProfile;
}

export interface CreationEvent {
  id: string;
  title: string;
  description: string;
  hardship: string;
  biomes?: BiomeId[];
  thoughts: ThoughtOption[];
}

export const CREATION_EVENTS: CreationEvent[] = [
  {
    id: 'ravine_plunge',
    title: "The Ravine's Edge",
    description:
      'The ground shears open beneath you and you skid toward a ragged ravine. Cold spray rises from the torrent below while needles of shale and pine bark rattle down the slope.',
    hardship:
      'A narrow ledge and a tangle of roots are all that slow your fall. A blink too long and the next rockslide will finish what the drop began.',
    biomes: ['temperate_forest', 'taiga', 'alpine'],
    thoughts: [
      {
        id: 'ravine_builder_anchor',
        label: 'Signal Lysa, the rope-slinging builder, before the ledge splinters.',
        description:
          'She braces a piton between slick roots, ready to swing a knotted line past you if she can reach you before the gravel gives way.',
          arrival:
            'Lysa barrels out of the fog with a fistful of iron spikes. The line hisses past your ear, catches, and she hauls you up while shards cascade into the ravine. She steadies you on the ledge, waiting for your next call rather than building anything on her own.',
          result:
            'Lysa pulls you clear of the ravine and holds position until you decide the next move.',
        villager: {
          name: 'Lysa',
          jobId: 'builder',
          efficiency: 1.05,
          skills: ['Ropework', 'Improvised scaffolding', 'Quick repairs'],
          summary: 'A wiry builder who trusts knots more than luck.'
        }
      },
      {
        id: 'ravine_hunter_ledges',
        label: 'Wave to Rusk, the cliff-runner hunter tracking shaggy goats.',
        description:
          'He dances along the ledges with a hooked spear, able to snag you or distract whatever claws its way up toward you.',
          arrival:
            'Rusk vaults from rock to root, planting his spear and giving you a handhold that drags you out of the slide. He keeps watch on the ravine lip, ready for instructions instead of throwing up his own camp.',
          result: 'Rusk steadies the ledge, hauls you free, and waits for orders beside you.',
        villager: {
          name: 'Rusk',
          jobId: 'hunter',
          efficiency: 1,
          skills: ['Tracking', 'Climbing', 'Spearwork'],
          summary: 'A cliff-runner who reads stone like a trail map.'
        }
      },
      {
        id: 'ravine_mason_steps',
        label: 'Flag Tor, the stone mason, before the shale wall peels away.',
        description:
          'He carries chisels and wedges, able to carve shallow steps or shore the roots holding you in place.',
          arrival:
            'Tor sets his chisel without a word, hammering quick steps that let you clamber back to solid ground. Once you are steady, he plants himself nearby, tools ready for whatever work you direct next.',
          result: 'Tor carves footholds, guides you up, and stands by for your direction.',
        villager: {
          name: 'Tor',
          jobId: 'mason',
          efficiency: 0.95,
          skills: ['Stonecutting', 'Shoring', 'Load-bearing sense'],
          summary: 'A stoic mason who trusts weight and angle over luck.'
        }
      }
    ]
  },
  {
    id: 'labyrinth_grove',
    title: 'The Labyrinth Grove',
    description:
      'Mist swallows the trunks until every path looks the same. Wet bark glistens, and low shapes prowl between ferns as if daring you to choose wrong.',
    hardship:
      'Whispers echo through the undergrowth and tangled briars hide sinkholes. Stay in place and you starve; pick wrong and the forest closes around you.',
    biomes: ['temperate_forest', 'taiga', 'rainforest'],
    thoughts: [
      {
        id: 'grove_forager_mark',
        label: 'Trust Iri the forager to mark a trail through the whispering trees.',
        description:
          'She carries resin and chalk, able to scar trunks and read the subtle tilt of moss that hints at safe footing.',
          arrival:
            'Iri appears with soft steps, daubing resin on bark to steer you between the prowling silhouettes. She leads you out of the maze and settles you on firmer ground, waiting for your direction before doing anything more.',
          result: 'Iri guides you past lurking shapes and pauses for your orders once you are safe.',
        villager: {
          name: 'Iri',
          jobId: 'forager',
          efficiency: 1.1,
          skills: ['Trail marking', 'Herbal lore', 'Silent movement'],
          summary: 'A patient forager who paints safe paths on living bark.'
        }
      },
      {
        id: 'grove_hunter_decoy',
        label: 'Let Kael the hunter draw the shadow-cat away from your route.',
        description:
          'A shadow cat stalks the mist ahead. Kael carries scent-lures and a shortbow, willing to taunt the predator while you slip by.',
          arrival:
            'Kael whistles sharply, luring glowing eyes toward him before vanishing into the fog. Moments later he ushers you along a safer trail and posts up nearby, watching the mist until you choose the next task.',
          result: 'Kael distracts a stalking cat, leads you clear, and stands guard awaiting your lead.',
        villager: {
          name: 'Kael',
          jobId: 'hunter',
          efficiency: 1,
          skills: ['Luring prey', 'Bowmanship', 'Silent steps'],
          summary: 'A hunter who turns predators into decoys.'
        }
      },
      {
        id: 'grove_tailor_lines',
        label: 'Ask Sena the tailor to weave a guide line through the briars.',
        description:
          'She threads cord between trunks, keeping you tethered as the mist churns and the forest shifts around you.',
          arrival:
            'Sena tosses you a length of braided cord, knotting it around her waist as she threads through the thorns. Her lines keep you from straying, and she holds the tether while you regain footing, awaiting your instructions.',
          result: 'Sena’s woven lines keep you steady and she waits, still tethered, for your command.',
        villager: {
          name: 'Sena',
          jobId: 'tailor',
          efficiency: 0.9,
          skills: ['Weaving', 'Field repairs', 'Knotwork'],
          summary: 'A tailor who treats paths like seams to be stitched.'
        }
      }
    ]
  },
  {
    id: 'shifting_dunes',
    title: 'Shifting Dunes',
    description:
      'Sand roars up like surf, erasing the horizon. Glassy scorpions skitter for shade while a distant dune ripples with something burrowing beneath.',
    hardship:
      'Every breath is grit and static. Stay still and you will be buried; move blindly and the dune beast may surface beneath you.',
    biomes: ['desert'],
    thoughts: [
      {
        id: 'dunes_quartermaster_charts',
        label: 'Unfurl Sel the quartermaster’s wind charts before the storm shifts.',
        description:
          'Sel tracks the pull of the gale and knows where the sand will thin. Her canvas and poles could become both signal and shelter.',
          arrival:
            'Sel shoves a compass into your palm and angles a wide tarp against the gusts, guiding you along the lee of a dune away from the burrowing threat. She keeps the tarp ready as a shield, looking to you for the next order instead of pitching a camp.',
        result: 'Sel plots a lee-side escape and stays nearby with supplies until you decide your course.',
        villager: {
          name: 'Sel',
          jobId: 'quartermaster',
          efficiency: 1,
          skills: ['Navigation', 'Rationing', 'Camp logistics'],
          summary: 'A quartermaster who reads storms like ledgers.'
        }
      },
      {
        id: 'dunes_hunter_bolas',
        label: 'Let Nima the hunter snare the dune wyrm if it surfaces.',
        description:
          'Nima carries weighted bolas and scent-dousing resin, ready to trip the sand-stirring beast long enough to sprint for cover.',
          arrival:
            'Nima hurls her bolas as the sand bulges, tangling the wyrm’s rise and buying you moments to follow her into a rocky hollow. She plants herself between you and the dunes, ready for your direction rather than building ahead.',
        result: 'Nima tangles the dune threat, leads you to cover, and waits on your signal.',
        villager: {
          name: 'Nima',
          jobId: 'hunter',
          efficiency: 1.05,
          skills: ['Bolas', 'Camouflage', 'Quick strikes'],
          summary: 'A hunter who trips monsters before they can surge.'
        }
      },
      {
        id: 'dunes_builder_screen',
        label: 'Let Jace the builder rig a sled-screen against the flying grit.',
        description:
          'He lugs salvaged planks and sailcloth, able to create a moving barrier while you angle away from the storm eye.',
          arrival:
            'Jace plants his planks into the sand, turning them into a rolling shield that shepherds you toward calmer ground. He sets the planks aside once you are safe, waiting for your instruction before repurposing a single board.',
        result: 'Jace shields you from the gale, guides you clear, and holds his materials until you choose their use.',
        villager: {
          name: 'Jace',
          jobId: 'builder',
          efficiency: 0.95,
          skills: ['Framing', 'Bracing', 'Desert survival'],
          summary: 'A builder who can turn scrap into a moving wall.'
        }
      }
    ]
  },
  {
    id: 'frozen_whiteout',
    title: 'Frozen Whiteout',
    description:
      'Snow needles your skin as slate clouds whirl overhead. White wolves pace the edge of your vision, their eyes the only color in the blizzard.',
    hardship:
      'The wind howls like a thing alive, stealing heat and hiding the crevasses that could swallow you. The pack grows bolder with every staggered step.',
    biomes: ['tundra', 'alpine'],
    thoughts: [
      {
        id: 'whiteout_hunter_flare',
        label: 'Have Eryk the hunter loose a flare arrow between the circling wolves.',
        description:
          'Eryk carries pitch-soaked shafts and knows how to fire blind by sound alone, buying you room to breathe.',
          arrival:
            'A red streak hisses through the snow, and the wolves scatter. Eryk reaches you with a rough cloak, guiding you into a shallow drift and keeping lookout until you tell him what comes next.',
          result: 'Eryk scatters the wolves with firelight, gets you under cover, and awaits direction.',
        villager: {
          name: 'Eryk',
          jobId: 'hunter',
          efficiency: 1,
          skills: ['Archery', 'Frost tracking', 'Firecraft'],
          summary: 'A hunter who reads wind and howls alike.'
        }
      },
      {
        id: 'whiteout_mason_cave',
        label: 'Let Brida the mason carve a snow cave before the frostbite sets in.',
        description:
          'Brida knows where the ice crust is thickest and how to vent it before the drift collapses, even with wolves nearby.',
          arrival:
            'Brida’s pick bites into the drift, carving a hollow that muffles the wind. She holds the opening while you catch your breath, waiting on your orders rather than shaping anything permanent.',
          result: 'Brida cuts you free of the wind, then holds position for your next command.',
        villager: {
          name: 'Brida',
          jobId: 'mason',
          efficiency: 1.05,
          skills: ['Snow carving', 'Stone sense', 'Cold endurance'],
          summary: 'A mason who sculpts refuge out of ice and silence.'
        }
      },
      {
        id: 'whiteout_forager_paths',
        label: 'Follow Una the forager along the wind-sheltered lichen ridge.',
        description:
          'Una reads the way the snow drifts around low rock, keeping you off cracking ice and away from the hungriest wolves.',
          arrival:
            'Una appears wrapped in furs, tapping the snow with a staff to reveal a narrow ridge. She ushers you along it to a nook between boulders and stays there with you, waiting for your direction before rearranging a single branch.',
          result: 'Una threads you past the wolves and waits with you at the ridge for your instructions.',
        villager: {
          name: 'Una',
          jobId: 'forager',
          efficiency: 0.95,
          skills: ['Snow reading', 'Foraged fuels', 'Pack keeping'],
          summary: 'A forager who follows lichen and wind-scour alike.'
        }
      }
    ]
  },
  {
    id: 'tidal_hunt',
    title: 'The Tidal Hunt',
    description:
      'Foam-flecked waves slam against black rock. A razortoothed sea-beast drags itself ashore, gulls scattering as it blocks the only safe climb.',
    hardship:
      'The tide surges behind you and slick stones pitch underfoot. The beast’s tail sweeps wide, ready to drag you back into the surf.',
    biomes: ['coast'],
    thoughts: [
      {
        id: 'tidal_woodcutter_wedge',
        label: 'Have Mara the woodcutter wedge driftwood under the beast’s bulk.',
        description:
          'She eyes a fallen spar that could jam the creature’s advance long enough to slip past.',
          arrival:
            'Mara charges with a sun-bleached spar, ramming it beneath the beast’s jaw to pry space open. She hauls you up the rocks and keeps the spar ready as leverage, waiting for your command on what to do next.',
          result: 'Mara jacks the beast aside, gets you to higher ground, and waits for orders.',
        villager: {
          name: 'Mara',
          jobId: 'woodcutter',
          efficiency: 1.05,
          skills: ['Felling', 'Lever work', 'Drift salvage'],
          summary: 'A woodcutter who treats driftwood like levers and beams.'
        }
      },
      {
        id: 'tidal_smith_brand',
        label: 'Let Tomas the smith brand the beast with a heated spearhead.',
        description:
          'He keeps an ember-pot and can sear the creature’s snout, buying you seconds before the tide closes in.',
          arrival:
            'Tomas plunges his spear into the ember-pot, then slams the glowing tip into the beast. The thing recoils and he yanks you toward higher ground. He braces his shield nearby and looks to you for direction rather than raising a shelter on his own.',
          result: 'Tomas scorches the sea-beast, pulls you up the rocks, and stands by for instruction.',
        villager: {
          name: 'Tomas',
          jobId: 'smith',
          efficiency: 0.95,
          skills: ['Forgecraft', 'Tool upkeep', 'Close-quarters'],
          summary: 'A smith who keeps heat even in salt wind.'
        }
      },
      {
        id: 'tidal_builder_reef',
        label: 'Ask Cal the builder to turn the reef into a trap.',
        description:
          'He sees where the barnacled rocks pinch together and can lash spars across them to bar the creature’s path.',
          arrival:
            'Cal splashes into the shallows, wedging spars and rope between reef teeth until the beast thrashes itself still. He guides you past and waits beside the reef tools in hand, asking for your next directive.',
          result: 'Cal cages the beast between rocks, escorts you through, and awaits your lead.',
        villager: {
          name: 'Cal',
          jobId: 'builder',
          efficiency: 1,
          skills: ['Rigging', 'Bracing', 'Coastal footing'],
          summary: 'A builder who knows how to lash a reef into a wall.'
        }
      }
    ]
  },
  {
    id: 'savanna_wildfire',
    title: 'Savanna Wildfire',
    description:
      'Lightning splits the anvil clouds and a wall of flame races through waist-high grass. A spooked herd of sable antelope stampedes alongside the fire line.',
    hardship:
      'Heat scorches your lungs while embers leap ahead of the blaze. A wrong sprint could put you between hooves and flame.',
    biomes: ['savanna'],
    thoughts: [
      {
        id: 'savanna_woodcutter_break',
        label: 'Have Garran the woodcutter fell an acacia to carve a firebreak.',
        description:
          'Garran’s axe can drop a green-limbed tree to slow the grass-fire, if he moves before the herd reaches you.',
          arrival:
            'Garran swings once, twice, and the acacia crashes down, splitting the flame front. He guides you along the blackened strip and halts with you in the cleared space, waiting for your say before using the fallen trunk.',
          result: 'Garran splits the fireline, pulls you through the gap, and awaits your instruction.',
        villager: {
          name: 'Garran',
          jobId: 'woodcutter',
          efficiency: 1.05,
          skills: ['Felling', 'Firebreaks', 'Axe work'],
          summary: 'A woodcutter who thinks in wind and grain.'
        }
      },
      {
        id: 'savanna_forager_low',
        label: 'Let Ayo the forager lead you into a damp reed gully.',
        description:
          'Ayo knows the low places where the fire thins and the herd will not trample.',
          arrival:
            'Ayo whistles and cuts through the smoke toward a damp gully, yanking you into the mud as flames roar overhead. She crouches beside you in the wet reeds, asking what you need before she starts any work.',
          result: 'Ayo shelters you in a damp gully and waits there for your direction.',
        villager: {
          name: 'Ayo',
          jobId: 'forager',
          efficiency: 1,
          skills: ['Herbcraft', 'Waterfinding', 'Quick weaving'],
          summary: 'A forager who reads the land for cool breath.'
        }
      },
      {
        id: 'savanna_hunter_drive',
        label: 'Ask Isi the hunter to turn the stampede back on itself.',
        description:
          'Isi carries signal whistles and a sling; with luck she can bend the herd away from you and toward the rocky rise.',
          arrival:
            'Isi’s whistles scatter the front-runners, and a snapped slingstone starts the herd curving away. She pulls you toward the rocks and kneels there with you, waiting to hear your orders now that the stampede has passed.',
          result: 'Isi redirects the herd, gets you to the rocks, and pauses for your command.',
        villager: {
          name: 'Isi',
          jobId: 'hunter',
          efficiency: 0.95,
          skills: ['Whistling signals', 'Slingstones', 'Herd sense'],
          summary: 'A hunter who reads hooves like weather.'
        }
      }
    ]
  },
  {
    id: 'sinking_mire',
    title: 'The Sinking Mire',
    description:
      "Brown water gurgles around your waist as reeds sway with unseen movement. Leeches cling to your boots while bubbles hint at something larger stirring beneath.",
    hardship:
      'Each struggle drags you deeper. Mangrove roots loom nearby, but one wrong pull could snap them and dump you under.',
    biomes: ['wetlands'],
    thoughts: [
      {
        id: 'mire_builder_planks',
        label: 'Let Kesh the builder lay salvaged planks toward you.',
        description:
          'Kesh carries a bundle of split boards and knows how to float them on the mire without sinking with you.',
          arrival:
            'Kesh slides planks ahead of him like stepping stones, his weight spreading across the mire. He drags you onto the boards and keeps them close, waiting for your call before turning them into anything else.',
        result: 'Kesh bridges the mire with planks, pulls you free, and waits for orders.',
        villager: {
          name: 'Kesh',
          jobId: 'builder',
          efficiency: 1,
          skills: ['Stiltwork', 'Weight spreading', 'Rapid framing'],
          summary: 'A builder who knows how to float lumber over mud.'
        }
      },
      {
        id: 'mire_forager_tussock',
        label: 'Follow Lin the forager across the hidden tussocks.',
        description:
          'Lin reads the tremor of reeds and the shimmer that betrays firm ground in the swamp.',
          arrival:
            'Lin taps the surface with a willow pole, finds the path of firmer tussocks, and hauls you along it. She steadies you on the tussock and looks to you for the next step instead of weaving anything yet.',
        result: 'Lin guides you over reed hummocks and pauses for your direction.',
        villager: {
          name: 'Lin',
          jobId: 'forager',
          efficiency: 1.05,
          skills: ['Swamp lore', 'Pole probing', 'Reed weaving'],
          summary: 'A forager who hears the swamp breathe.'
        }
      },
      {
        id: 'mire_hunter_hook',
        label: 'Reach for Pavel the hunter’s barbed hook before the mire claims you.',
        description:
          'He hunts river eels and keeps a barbed gaff; with it he can snag you or the croc-eyes rising nearby.',
          arrival:
            'Pavel sets his feet against a root, plants the gaff, and yanks you free as bubbles erupt. He keeps the hook set as a brace while he waits for your direction on where to head next.',
        result: 'Pavel hauls you out with his gaff and holds the line while awaiting orders.',
        villager: {
          name: 'Pavel',
          jobId: 'hunter',
          efficiency: 0.95,
          skills: ['River hunting', 'Hooks and lines', 'Patient strikes'],
          summary: 'A hunter who keeps his footing in sucking mud.'
        }
      }
    ]
  },
  {
    id: 'steppe_tempest',
    title: 'Steppe Tempest',
    description:
      'Thunderheads collide above the plains, spooking shaggy aurochs and stone-helmed boar into a wild stampede. Lightning pries trenches in the soil as the herd bears down.',
    hardship:
      'Hooves shake the ground and shards of ice ride the wind like blades. One slip and the herd or the hail will break you.',
    biomes: ['steppe'],
    thoughts: [
      {
        id: 'steppe_hunter_outrider',
        label: 'Flag down Olek the outrider before the aurochs close.',
        description:
          'He heels his pony through storms, carrying signal banners and a horn to swing the herd aside.',
          arrival:
            'Olek wheels his pony between you and the stampede, horn blaring until the lead bulls veer. He hauls you up behind him and circles to safety, holding the cloak at the ready while waiting for your orders.',
          result: 'Olek diverts the herd, carries you clear, and waits in the lee for instruction.',
        villager: {
          name: 'Olek',
          jobId: 'hunter',
          efficiency: 1.05,
          skills: ['Mounted hunting', 'Signal horns', 'Herding'],
          summary: 'An outrider who reads hooves and lightning alike.'
        }
      },
      {
        id: 'steppe_forager_smoke',
        label: 'Wave to Mira the steppe forager with her smoke pots.',
        description:
          'Mira mixes pungent herbs that beast herds hate; one toss could split the charge around you.',
          arrival:
            'Mira dashes upwind and hurls smoking pots that peel the boars away. She keeps the tarps bundled under her arm, looking to you for the next move instead of pitching camp.',
          result: 'Mira’s smoke parts the herd and she lingers beside you, tarps in hand, awaiting direction.',
        villager: {
          name: 'Mira',
          jobId: 'forager',
          efficiency: 1,
          skills: ['Herbal smoke', 'Steppe lore', 'Quick knots'],
          summary: 'A forager who turns scent into safety.'
        }
      },
      {
        id: 'steppe_quartermaster_shield',
        label: 'Call Dagan the quartermaster to brace a shield wall against the hail.',
        description:
          'He hauls a folding sled and spare shields, able to dig in and weather both ice shards and stray hooves.',
          arrival:
            'Dagan slams his sled into the dirt and stacks shields into a low wall, catching the hail as the herd splits around you. When the ground stills he keeps the shields close, waiting for your direction before reshaping anything.',
          result: 'Dagan walls you off from hail, steadies the shields, and looks to you for orders.',
        villager: {
          name: 'Dagan',
          jobId: 'quartermaster',
          efficiency: 0.95,
          skills: ['Logistics', 'Shield drills', 'Digging in'],
          summary: 'A quartermaster who fortifies even open plains.'
        }
      }
    ]
  },
  {
    id: 'volcanic_awakening',
    title: 'Volcanic Awakening',
    description:
      'The earth bucks as a fissure yawns wide, coughing ash and fireflies of magma. Ash hounds slink from the smoke, their eyes bright as coals.',
    hardship:
      'Hot cinders rain down while sulfur claws at your lungs. The ground trembles, threatening to drop you into the newborn vent.',
    biomes: ['volcanic'],
    thoughts: [
      {
        id: 'volcanic_mason_ridge',
        label: 'Follow Vera the mason along the cooling basalt ridge.',
        description:
          'She knows which black stone will hold and which will crumble, even with ash hounds prowling.',
          arrival:
            'Vera taps the basalt with her hammer, steering you across the solid ridges and batting aside an ash hound with her chisel. Once you reach steady ground she posts up beside you, waiting for your direction before shaping anything else.',
          result: 'Vera guides you over cooling stone and holds her tools ready for your orders.',
        villager: {
          name: 'Vera',
          jobId: 'mason',
          efficiency: 1,
          skills: ['Basalt reading', 'Heat tolerance', 'Stacking'],
          summary: 'A mason who works where the world still glows.'
        }
      },
      {
        id: 'volcanic_smith_quench',
        label: 'Let Kato the smith raise his quenched shield against the ash.',
        description:
          'Kato carries a metal shield soaked in water and a hammer that can ring the ash hounds back.',
          arrival:
            'Kato slams his quenched shield over your head as ash hisses down, driving the hounds away with ringing blows. He keeps the shield raised beside you and waits for your command on how to use his gear next.',
          result: 'Kato wards off ash and beasts, then remains at your side awaiting instruction.',
        villager: {
          name: 'Kato',
          jobId: 'smith',
          efficiency: 1.05,
          skills: ['Metalwork', 'Heat management', 'Close defense'],
          summary: 'A smith who carries the forge into the field.'
        }
      },
      {
        id: 'volcanic_builder_route',
        label: 'Ask Nessa the builder to rig a path over the fissure.',
        description:
          'She carries planks and hooks to bridge the crack before it widens and belches more fumes.',
          arrival:
            'Nessa tosses hooked planks across the fissure, snatching you across before the next tremor. She gathers the boards once you are safe and looks to you to decide the next use for them.',
          result: 'Nessa bridges the fissure, collects her planks, and waits for your direction.',
        villager: {
          name: 'Nessa',
          jobId: 'builder',
          efficiency: 0.95,
          skills: ['Bridging', 'Tool improvisation', 'Steady hands'],
          summary: 'A builder who spans cracks faster than they widen.'
        }
      }
    ]
  },
  {
    id: 'subterranean_glow',
    title: 'Subterranean Glow',
    description:
      'A sinkhole swallows you into a cavern lit by ghostly fungi. The light pulses with every distant growl, and slick tunnels branch in all directions.',
    hardship:
      'The footing is wet and the air vibrates with unseen movement. Choose the wrong tunnel and whatever is growling will find you first.',
    thoughts: [
      {
        id: 'glow_mason_shore',
        label: 'Let Niall the mason shore the nearest tunnel before it collapses.',
        description:
          'He can wedge stone and fungus logs to keep the ceiling from shedding shards as you escape.',
          arrival:
            'Niall slides down beside you, jamming braces into the ceiling and waving you toward a steadier tunnel. He stays near the bracing, waiting on your orders before shaping anything more.',
          result: 'Niall shores the tunnel, steadies the braces, and looks to you for the next move.',
        villager: {
          name: 'Niall',
          jobId: 'mason',
          efficiency: 1,
          skills: ['Bracing', 'Stone wedges', 'Calm focus'],
          summary: 'A mason who steadies stone even in the dark.'
        }
      },
      {
        id: 'glow_hunter_echo',
        label: 'Let Sive the hunter track the growl by echo and scent.',
        description:
          'She listens for airflow and knows which tunnel breathes fresh air instead of predator musk.',
          arrival:
            'Sive sniffs, tilts her head, and pulls you toward a tunnel that exhales cool air. She keeps her cloak ready but holds position with you, waiting for your lead.',
          result: 'Sive guides you by echo to a safe passage and stands by for your command.',
        villager: {
          name: 'Sive',
          jobId: 'hunter',
          efficiency: 0.95,
          skills: ['Echolocation', 'Scent reading', 'Knife work'],
          summary: 'A hunter who hears what the dark hides.'
        }
      },
      {
        id: 'glow_forager_fungi',
        label: 'Ask Pree the forager which fungi lead to surface drafts.',
        description:
          'She knows which glow-moss grows only where wind creeps through cracks, hinting at the exit route.',
          arrival:
            'Pree points out pale fungi bending toward a hidden draft and guides you that way. She keeps the broad caps at her side, asking what you need before arranging anything.',
          result: 'Pree follows the glow-moss draft, brings you to the airflow, and awaits direction.',
        villager: {
          name: 'Pree',
          jobId: 'forager',
          efficiency: 1.05,
          skills: ['Fungus lore', 'Draft finding', 'Campcraft'],
          summary: 'A forager who reads fungi like a compass.'
        }
      }
    ]
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
