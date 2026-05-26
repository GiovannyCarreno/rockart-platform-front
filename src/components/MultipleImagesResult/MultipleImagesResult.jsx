import { getGanModelResultHeading } from '../../constants/config';
import ImageCard from '../ImageCard/ImageCard';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';

export default function MultipleImagesResult({
  results,
  truncationPsi,
  noiseMode,
  onCopySeed,
  onDownload,
}) {
  return (
    <GlassCard className="!mb-0 mt-6">
      <SectionHeading id="resultado-multiple">
        {getGanModelResultHeading(results.number, results.model)}
      </SectionHeading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.images.map((img, idx) => (
          <ImageCard
            key={idx}
            image={img}
            seed={results.seeds[idx]}
            truncationPsi={truncationPsi}
            noiseMode={noiseMode}
            onCopySeed={onCopySeed}
            onDownload={onDownload}
          />
        ))}
      </div>
    </GlassCard>
  );
}
