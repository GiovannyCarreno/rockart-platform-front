import { useEffect, useState } from 'react';
import AppTopBar from './components/AppTopBar/AppTopBar';
import SidebarNav from './components/SidebarNav/SidebarNav';
import GenerationControls from './components/GenerationControls/GenerationControls';
import SingleImageResult from './components/SingleImageResult/SingleImageResult';
import MultipleImagesResult from './components/MultipleImagesResult/MultipleImagesResult';
import RestorationEditor from './components/RestorationEditor/RestorationEditor';
import ReconstructionTab from './components/ReconstructionTab/ReconstructionTab';
import GlassCard from './components/ui/GlassCard';
import TabInstructions from './components/TabInstructions/TabInstructions';
import { useImageGenerator } from './hooks/useImageGenerator';

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    mode,
    setMode,
    loading,
    seed,
    seedInput,
    truncationPsi,
    setTruncationPsi,
    noiseMode,
    setNoiseMode,
    ganModel,
    setGanModel,
    numberOfImages,
    setNumberOfImages,
    singleResult,
    multipleResults,
    error,
    handleGenerateSingle,
    handleGenerateMultiple,
    handleSeedInputChange,
    handleSeedBlur,
    handleRandomizeSeed,
    downloadImage,
    copySeed,
  } = useImageGenerator();

  const cardVariant = mode === 'restoration' ? 'restoration' : 'default';

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileNavOpen]);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200 text-ink">
      <div
        className={[
          'fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out lg:hidden',
          mobileNavOpen ? 'pointer-events-auto opacity-100 animate-backdrop-in' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={() => setMobileNavOpen(false)}
        role="presentation"
        aria-hidden={!mobileNavOpen}
      />

      <SidebarNav
        mode={mode}
        onModeChange={setMode}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div
        className={[
          'relative flex min-h-screen min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          sidebarCollapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-72',
        ].join(' ')}
      >
        <AppTopBar mode={mode} onOpenSidebar={() => setMobileNavOpen(true)} sidebarOpen={mobileNavOpen} />

        <div className="flex flex-1 flex-col px-3 py-5 sm:px-4 md:px-6 lg:px-8 xl:px-10 md:py-8">
          <div className="mx-auto w-full max-w-7xl flex-1 xl:max-w-[min(100%,88rem)]">
            <div key={mode} className="animate-main-enter mb-6 sm:mb-8 md:mb-10">
              <TabInstructions mode={mode} />
              <GlassCard variant={cardVariant}>
                {mode !== 'restoration' && mode !== 'reconstruction' && (
                  <GenerationControls
                    mode={mode}
                    seedInput={seedInput}
                    onSeedInputChange={handleSeedInputChange}
                    onSeedBlur={(e) => handleSeedBlur(e, seed)}
                    onRandomizeSeed={handleRandomizeSeed}
                    numberOfImages={numberOfImages}
                    onNumberOfImagesChange={setNumberOfImages}
                    truncationPsi={truncationPsi}
                    onTruncationPsiChange={setTruncationPsi}
                    noiseMode={noiseMode}
                    onNoiseModeChange={setNoiseMode}
                    ganModel={ganModel}
                    onGanModelChange={setGanModel}
                    onGenerate={mode === 'single' ? handleGenerateSingle : handleGenerateMultiple}
                    loading={loading}
                    error={error}
                  />
                )}

                {mode === 'restoration' && <RestorationEditor />}
                {mode === 'reconstruction' && <ReconstructionTab />}
              </GlassCard>
            </div>

            {mode !== 'restoration' && mode !== 'reconstruction' && singleResult && (
              <div key={`single-${singleResult.seed}`} className="animate-main-enter">
                <SingleImageResult
                  result={singleResult}
                  truncationPsi={truncationPsi}
                  noiseMode={noiseMode}
                  onCopySeed={copySeed}
                  onDownload={downloadImage}
                />
              </div>
            )}

            {mode !== 'restoration' && mode !== 'reconstruction' && multipleResults && (
              <div key={`multi-${multipleResults.images?.length}`} className="animate-main-enter">
                <MultipleImagesResult
                  results={multipleResults}
                  truncationPsi={truncationPsi}
                  noiseMode={noiseMode}
                  onCopySeed={copySeed}
                  onDownload={downloadImage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
