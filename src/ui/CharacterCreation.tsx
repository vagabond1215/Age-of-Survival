import { useEffect, useRef, useState } from 'react';
import { type BiomeId, type FeatureId } from '../game/constants';
import { composeAwakeningNarrative } from '../game/narrative';
import { BIOME_LIST, getBiomeDetail } from '../data/biomes';
import { getCreationEventById, getCreationEventsForBiome, getThoughtById } from '../data/creationEvents';
import { type CreationState } from '../game/state';

interface CharacterCreationProps {
  creation: CreationState;
  currentBiome: BiomeId;
  features: FeatureId[];
  onSelectBiome: (biome: BiomeId) => void;
  onGather: () => void;
  onResolveThought: (thoughtId: string) => void;
  onConfirmArrival: () => void;
}

export function CharacterCreation({
  creation,
  currentBiome,
  features,
  onSelectBiome,
  onGather,
  onResolveThought,
  onConfirmArrival
}: CharacterCreationProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [thoughtListHeight, setThoughtListHeight] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateThoughtListHeight = () => {
      const panel = panelRef.current;
      if (!panel || creation.stage !== 'event') {
        setThoughtListHeight(null);
        return;
      }

      const availableHeight = window.innerHeight - 64; // account for backdrop padding (2rem top/bottom)
      const panelRect = panel.getBoundingClientRect();

      if (panelRect.height <= availableHeight) {
        setThoughtListHeight(null);
        return;
      }

      const thoughtGrid = panel.querySelector('.thought-grid') as HTMLElement | null;
      if (!thoughtGrid) {
        setThoughtListHeight(null);
        return;
      }

      const thoughtRect = thoughtGrid.getBoundingClientRect();
      const distanceFromPanelTop = thoughtRect.top - panelRect.top;
      const maxHeight = Math.max(120, availableHeight - distanceFromPanelTop);
      setThoughtListHeight(maxHeight);
    };

    updateThoughtListHeight();
    window.addEventListener('resize', updateThoughtListHeight);
    return () => window.removeEventListener('resize', updateThoughtListHeight);
  }, [creation.stage, creation.eventId]);

  const selectedDetail = creation.selectedBiome ? getBiomeDetail(creation.selectedBiome) : null;

  if (creation.stage === 'event') {
    const event = getCreationEventById(creation.eventId) ?? getCreationEventsForBiome(currentBiome)[0];
    const intro = 'Who will brave this dilemma at your side? Choose the first to answer your call.';

    return (
      <div className="creation-backdrop">
        <div className="creation-panel" ref={panelRef}>
          <h2>{event?.title ?? 'An Unexpected Trial'}</h2>
          {event ? (
            <>
              <p className="creation-narrative">{event.description}</p>
              <p className="creation-hardship">{event.hardship}</p>
              <p className="creation-thought-intro">{intro}</p>
              <div
                className={`thought-grid${thoughtListHeight ? ' thought-grid--scrollable' : ''}`}
                style={thoughtListHeight ? { maxHeight: `${thoughtListHeight}px` } : undefined}
              >
                {event.thoughts.map((thought) => (
                  <button
                    key={thought.id}
                    className="thought-card"
                    onClick={() => onResolveThought(thought.id)}
                  >
                    <span className="thought-label">{thought.label}</span>
                    <span className="thought-description">{thought.description}</span>
                    <div className="thought-helper">
                      <div className="thought-helper__name">{thought.villager.name}</div>
                      <div className="thought-helper__role">{thought.villager.jobId}</div>
                      <div className="thought-helper__summary">{thought.villager.summary}</div>
                      <div className="thought-helper__skills">
                        {thought.villager.skills.join(' · ')}
                      </div>
                    </div>
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

  if (creation.stage === 'arrival') {
    const event = getCreationEventById(creation.eventId);
    const thought = getThoughtById(event, creation.chosenThought ?? '');
    const helper = thought?.villager;
    return (
      <div className="creation-backdrop">
        <div className="creation-panel">
          <h2>First Ally</h2>
          <p className="creation-narrative">{thought?.arrival ?? 'Aid arrives just as the danger peaks.'}</p>
          {helper && (
            <div className="helper-card">
              <div className="helper-header">
                <span className="helper-name">{helper.name}</span>
                <span className="helper-role">{helper.jobId}</span>
              </div>
              <p className="helper-summary">{helper.summary}</p>
              <div className="helper-skills" aria-label="Helper skills">
                {helper.skills.map((skill) => (
                  <span key={skill} className="helper-skill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="creation-hardship">
            Together you push past the crisis, throwing up a rough shelter to catch your breath. A true town center will have to
            wait until you gather enough hands and resources.
          </p>
          <button className="gather-button" onClick={onConfirmArrival}>
            Begin Shelter
          </button>
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
