import { type BiomeId, type FeatureId } from '../game/constants';
import { composeAwakeningNarrative } from '../game/narrative';
import { BIOME_LIST, getBiomeDetail } from '../data/biomes';
import { getCreationEventById, getCreationEventsForBiome } from '../data/creationEvents';
import { type CreationState } from '../game/state';

interface CharacterCreationProps {
  creation: CreationState;
  currentBiome: BiomeId;
  features: FeatureId[];
  onSelectBiome: (biome: BiomeId) => void;
  onGather: () => void;
  onResolveThought: (thoughtId: string) => void;
}

export function CharacterCreation({
  creation,
  currentBiome,
  features,
  onSelectBiome,
  onGather,
  onResolveThought
}: CharacterCreationProps) {
  const selectedDetail = creation.selectedBiome ? getBiomeDetail(creation.selectedBiome) : null;

  if (creation.stage === 'event') {
    const event = getCreationEventById(creation.eventId) ?? getCreationEventsForBiome(currentBiome)[0];
    const intro = 'All of a sudden you find yourself thinking...';

    return (
      <div className="creation-backdrop">
        <div className="creation-panel">
          <h2>{event?.title ?? 'An Unexpected Trial'}</h2>
          {event ? (
            <>
              <p className="creation-narrative">{event.description}</p>
              <p className="creation-hardship">{event.hardship}</p>
              <p className="creation-thought-intro">{intro}</p>
              <div className="thought-grid">
                {event.thoughts.map((thought) => (
                  <button
                    key={thought.id}
                    className="thought-card"
                    onClick={() => onResolveThought(thought.id)}
                  >
                    <span className="thought-label">{thought.label}</span>
                    <span className="thought-description">{thought.description}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="creation-narrative">
              The world holds its breath, awaiting the choice that will define your next step.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (creation.stage === 'awaiting_focus' && selectedDetail) {
    const narrative = composeAwakeningNarrative(selectedDetail.id, features);
    return (
      <div className="creation-backdrop">
        <div className="creation-panel">
          <h2>First Breath</h2>
          <p className="creation-narrative">{narrative}</p>
          <div className="selected-biome-callout" style={{ borderColor: selectedDetail.color }}>
            <h3>{selectedDetail.name}</h3>
            <p>{selectedDetail.weather}</p>
            <p>{selectedDetail.geography}</p>
            <p>{selectedDetail.resources}</p>
          </div>
          <button className="gather-button" onClick={onGather}>
            Gather Yourself
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="creation-backdrop">
      <div className="creation-panel">
        <h2>The First Choice</h2>
        <p className="creation-narrative">
          You find yourself suspended between moments, senses reaching outward for the land that will cradle your fate. Which
          realm calls to you?
        </p>
        <div className="biome-grid">
          {BIOME_LIST.map((detail) => {
            const isSelected = detail.id === creation.selectedBiome;
            return (
              <button
                key={detail.id}
                className={`biome-card${isSelected ? ' biome-card--selected' : ''}`}
                style={{ borderColor: detail.color, background: `${detail.color}22` }}
                onClick={() => onSelectBiome(detail.id)}
              >
                <span className="biome-name">{detail.name}</span>
                <span className="biome-weather">{detail.weather}</span>
                <span className="biome-geography">{detail.geography}</span>
                <span className="biome-resources">{detail.resources}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CharacterCreation;
