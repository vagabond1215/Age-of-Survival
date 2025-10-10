import { type BiomeId, type FeatureId } from '../game/constants';
import { composeAwakeningNarrative } from '../game/narrative';

interface AwakeningPromptProps {
  biome: BiomeId;
  features: FeatureId[];
  narrative?: string;
  onBegin: () => void;
}

export function AwakeningPrompt({ biome, features, narrative, onBegin }: AwakeningPromptProps) {
  const story = narrative ?? composeAwakeningNarrative(biome, features);
  return (
    <div className="awakening-backdrop">
      <div className="awakening-panel">
        <h2>The Awakening</h2>
        <p className="awakening-text">{story}</p>
        <button onClick={onBegin}>Gather Yourself</button>
      </div>
    </div>
  );
}

export default AwakeningPrompt;
