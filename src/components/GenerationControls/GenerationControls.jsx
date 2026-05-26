import { Loader2, Wand2, RefreshCw } from 'lucide-react';
import { GAN_MODELS, getGanModelDescription, getGanModelGenerateLabel } from '../../constants/config';

const inputBase =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-base text-ink shadow-inner shadow-cream-200/50 placeholder:text-ink-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25';

export default function GenerationControls({
  mode,
  seedInput,
  onSeedInputChange,
  onSeedBlur,
  onRandomizeSeed,
  numberOfImages,
  onNumberOfImagesChange,
  truncationPsi,
  onTruncationPsiChange,
  noiseMode,
  onNoiseModeChange,
  ganModel,
  onGanModelChange,
  onGenerate,
  loading,
  error,
}) {
  return (
    <div className="space-y-6">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6">
        {mode === 'single' && (
          <div className="flex min-w-0 w-full flex-col gap-2">
            <label htmlFor="seed-input" className="text-sm font-semibold text-ink">
              Seed
            </label>
            <div className="flex w-full min-w-0 gap-2">
              <input
                id="seed-input"
                type="number"
                value={seedInput}
                onChange={onSeedInputChange}
                onBlur={onSeedBlur}
                className={`${inputBase} min-w-0 flex-1`}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={onRandomizeSeed}
                className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-cream-300 bg-cream-200 text-ink transition hover:border-accent/40 hover:bg-cream-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Aleatorizar seed"
              >
                <RefreshCw className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {mode === 'multiple' && (
          <div className="flex min-w-0 w-full flex-col gap-2">
            <label htmlFor="num-images" className="text-sm font-semibold text-ink">
              Número de imágenes
            </label>
            <input
              id="num-images"
              type="number"
              min="1"
              max="10"
              value={numberOfImages}
              onChange={(e) => onNumberOfImagesChange(Number(e.target.value))}
              className={`${inputBase} w-full min-w-0`}
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
        )}

        <div className="flex min-w-0 w-full flex-col gap-2">
          <label htmlFor="truncation-psi" className="text-sm font-semibold text-ink">
            Truncation PSI:{' '}
            <span className="tabular-nums text-ink-muted">{truncationPsi.toFixed(2)}</span>
          </label>
          <input
            id="truncation-psi"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={truncationPsi}
            onChange={(e) => onTruncationPsiChange(Number(e.target.value))}
            className="range-input mt-1 w-full min-w-0"
          />
        </div>

        <div className="flex min-w-0 w-full flex-col gap-2">
          <label htmlFor="noise-mode" className="text-sm font-semibold text-ink">
            Noise mode
          </label>
          <select
            id="noise-mode"
            value={noiseMode}
            onChange={(e) => onNoiseModeChange(e.target.value)}
            className={`${inputBase} w-full min-w-0 cursor-pointer`}
          >
            <option value="random">Random</option>
            <option value="const">Const</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="flex min-w-0 w-full flex-col gap-2 sm:col-span-2 lg:col-span-1">
          <label htmlFor="gan-model" className="text-sm font-semibold text-ink">
            ¿Qué quieres generar?
          </label>
          <select
            id="gan-model"
            value={ganModel}
            onChange={(e) => onGanModelChange(e.target.value)}
            className={`${inputBase} w-full min-w-0 cursor-pointer`}
          >
            {GAN_MODELS.map(({ value, optionLabel }) => (
              <option key={value} value={value}>
                {optionLabel}
              </option>
            ))}
          </select>
          <p className="text-xs leading-relaxed text-ink-muted">{getGanModelDescription(ganModel)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        aria-busy={loading}
        className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-hover px-4 py-3.5 text-lg font-bold text-cream-50 shadow-lg shadow-ink/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Generando…
          </>
        ) : (
          <>
            <Wand2 className="size-5" aria-hidden />
            {getGanModelGenerateLabel(ganModel, mode)}
          </>
        )}
      </button>

      {error && (
        <div
          className="rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-ink"
          role="alert"
        >
          <strong className="font-semibold text-terracotta">Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
