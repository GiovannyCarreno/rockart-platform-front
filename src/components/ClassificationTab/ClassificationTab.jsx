import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, ScanSearch, Upload } from 'lucide-react';
import { classifyImage } from '../../api/imageApi';
import SectionHeading from '../ui/SectionHeading';

const inputLabelClass = 'text-sm font-semibold text-ink';

const CLASS_HINTS = {
  Pictograma: 'Pinturas rupestres: figuras y símbolos aplicados sobre la roca.',
  Petroglifo: 'Figuras grabadas o talladas en la superficie rocosa.',
};

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return '—';
  return `${(value * 100).toFixed(2)}%`;
}

function ProbabilityBar({ label, value, isWinner }) {
  const percent = Math.min(100, Math.max(0, (value ?? 0) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className={isWinner ? 'font-semibold text-ink' : 'text-ink-muted'}>{label}</span>
        <span className={`tabular-nums ${isWinner ? 'font-semibold text-accent' : 'text-ink-muted'}`}>
          {formatPercent(value)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-cream-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isWinner ? 'bg-gradient-to-r from-accent to-accent-hover' : 'bg-cream-400/80'
          }`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Probabilidad de ${label}`}
        />
      </div>
    </div>
  );
}

export default function ClassificationTab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const probabilityEntries = useMemo(() => {
    if (!result?.probabilidades) return [];
    const classes = result.clases ?? Object.keys(result.probabilidades);
    return classes.map((name) => ({
      name,
      value: result.probabilidades[name] ?? 0,
      isWinner: name === result.clase,
    }));
  }, [result]);

  const processFile = (file) => {
    setError(null);
    setResult(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const acceptedTypes = ['image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError('Selecciona una imagen válida (png, jpg, jpeg, bmp o webp).');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return URL.createObjectURL(file);
    });
  };

  const handleFileChange = (event) => {
    processFile(event.target.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  };

  const handleClassify = async () => {
    if (!selectedFile) {
      setError('Selecciona una imagen para continuar.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await classifyImage(selectedFile);
      setResult(data);
    } catch (err) {
      setError(err.message || 'No se pudo completar la clasificación.');
    } finally {
      setLoading(false);
    }
  };

  const dropzoneClass = `flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 py-6 text-center transition duration-200 ${
    isDragging
      ? 'border-accent bg-accent/10 scale-[1.01]'
      : 'border-cream-300 bg-cream-200/40 hover:border-accent/50 hover:bg-cream-200/70'
  }`;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-ink-muted">
        Sube una imagen de arte rupestre y el modelo indicará si corresponde a un{' '}
        <strong className="font-semibold text-ink">pictograma</strong> o a un{' '}
        <strong className="font-semibold text-ink">petroglifo</strong>, con el nivel de confianza
        asociado.
      </p>

      <div className="flex flex-col gap-2">
        <span className={inputLabelClass}>Imagen a clasificar</span>
        <label
          htmlFor="classification-image"
          className={dropzoneClass}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="size-7 text-accent" aria-hidden />
          <span className="font-semibold text-ink">Haz clic para seleccionar una imagen</span>
          <small className="text-sm text-ink-muted">También puedes arrastrar y soltarla aquí</small>
          {selectedFile && (
            <p className="mt-1 max-w-full truncate text-xs text-ink-muted" title={selectedFile.name}>
              {selectedFile.name}
            </p>
          )}
        </label>
        <input
          id="classification-image"
          type="file"
          accept=".png,.jpg,.jpeg,.bmp,.webp"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="button"
        className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-hover px-4 py-3.5 text-lg font-bold text-cream-50 shadow-lg shadow-ink/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={handleClassify}
        disabled={loading || !selectedFile}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Clasificando…
          </>
        ) : (
          <>
            <ScanSearch className="size-5" aria-hidden />
            Clasificar imagen
          </>
        )}
      </button>

      {error && (
        <div
          className="rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-ink"
          role="alert"
        >
          {error}
        </div>
      )}

      {previewUrl && !result && (
        <div className="flex flex-col gap-3">
          <p className={inputLabelClass}>Vista previa</p>
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-cream-300 bg-cream-100/80 p-4">
            <img
              src={previewUrl}
              alt="Vista previa del archivo seleccionado"
              className="max-h-[min(70vh,560px)] w-full object-contain"
            />
          </div>
        </div>
      )}

      {result && (
        <div className="mt-1 space-y-6">
          <SectionHeading as="h3">Resultado de la clasificación</SectionHeading>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {previewUrl && (
              <article className="rounded-xl border border-cream-300/80 bg-cream-50/90 p-4">
                <p className="mb-3 text-center text-sm font-medium text-ink-muted">Imagen analizada</p>
                <img
                  src={previewUrl}
                  alt={`Imagen clasificada como ${result.clase}`}
                  className="mx-auto max-h-[min(50vh,420px)] w-full object-contain"
                />
                {result.filename && (
                  <p className="mt-3 truncate text-center text-xs text-ink-muted" title={result.filename}>
                    {result.filename}
                  </p>
                )}
              </article>
            )}

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-cream-300 bg-cream-100/90 p-5 text-center">
                <p className="mb-1 text-sm text-ink-muted">Clase predicha</p>
                <p className="font-heading text-3xl font-bold text-ink sm:text-4xl">{result.clase}</p>
                {CLASS_HINTS[result.clase] && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{CLASS_HINTS[result.clase]}</p>
                )}
              </div>

              <div className="rounded-xl border border-cream-300 bg-cream-100/90 p-4">
                <p className="mb-1 text-sm text-ink-muted">Confianza</p>
                <p className="text-2xl font-bold tabular-nums text-ink">
                  {result.confianza_porcentaje != null
                    ? `${result.confianza_porcentaje}%`
                    : formatPercent(result.confianza)}
                </p>
              </div>

              <div
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                  result.alta_confianza
                    ? 'border-sage/40 bg-sage/10 text-ink'
                    : 'border-amber-500/40 bg-amber-500/10 text-ink'
                }`}
                role="status"
              >
                {result.alta_confianza ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sage" aria-hidden />
                ) : (
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
                )}
                <p>
                  {result.alta_confianza
                    ? 'Alta confianza: el modelo está muy seguro de esta clasificación (≥ 75%).'
                    : 'Confianza moderada: conviene revisar el resultado o probar con otra imagen.'}
                </p>
              </div>

              {probabilityEntries.length > 0 && (
                <div className="rounded-xl border border-cream-300/80 bg-cream-50/90 p-4">
                  <p className="mb-4 text-sm font-semibold text-ink">Probabilidades por clase</p>
                  <div className="space-y-4">
                    {probabilityEntries.map(({ name, value, isWinner }) => (
                      <ProbabilityBar key={name} label={name} value={value} isWinner={isWinner} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
