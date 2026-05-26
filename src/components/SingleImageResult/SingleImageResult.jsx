import { Copy, Download } from 'lucide-react';
import { getGanModelLabel } from '../../constants/config';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';

export default function SingleImageResult({
  result,
  truncationPsi,
  noiseMode,
  onCopySeed,
  onDownload,
}) {
  return (
    <GlassCard className="!mb-0 mt-6">
      <SectionHeading id="resultado-single">
        {result.model ? `${getGanModelLabel(result.model)} generado` : 'Resultado'}
      </SectionHeading>
      <div className="flex flex-col items-stretch gap-4 sm:items-center">
        <img
          src={`data:image/png;base64,${result.image}`}
          alt={
            result.model
              ? `${getGanModelLabel(result.model)} generado a partir del seed indicado`
              : 'Imagen generada a partir del seed indicado'
          }
          className="mb-1 mx-auto block w-full max-w-lg rounded-xl border border-cream-300/80 shadow-[0_12px_40px_rgba(44,40,37,0.12)]"
        />
        <div className="mx-auto flex w-full max-w-lg flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <div className="flex flex-col gap-2">
            <p className="rounded-xl border border-cream-300 bg-cream-200/60 px-4 py-2 text-center text-sm tabular-nums text-ink sm:text-base">
              Seed: {result.seed}
            </p>
            {result.model && (
              <p className="rounded-xl border border-cream-300 bg-cream-200/60 px-4 py-2 text-center text-sm text-ink sm:text-base">
                Tipo: {getGanModelLabel(result.model)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onCopySeed(result.seed)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-w-0"
          >
            <Copy className="size-4 shrink-0" aria-hidden />
            Copiar seed
          </button>
        </div>
        <button
          type="button"
          onClick={() => onDownload(result.image, result.seed, truncationPsi, noiseMode)}
          className="mx-auto inline-flex min-h-[44px] w-full max-w-lg items-center justify-center gap-2 rounded-xl border border-sage/30 bg-sage px-5 py-3 text-sm font-semibold text-cream-50 transition hover:bg-sage-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage sm:w-auto"
        >
          <Download className="size-4 shrink-0" aria-hidden />
          Descargar PNG
        </button>
      </div>
    </GlassCard>
  );
}
