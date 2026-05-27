import { createElement } from 'react';
import { Wand2, Grid3x3, Paintbrush, RefreshCw, ScanSearch, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { MODE_LABELS } from '../../constants/navModes';
import { LOGO_SRC } from '../../constants/config';

const items = [
  { id: 'single', icon: Wand2 },
  { id: 'multiple', icon: Grid3x3 },
  { id: 'restoration', icon: Paintbrush },
  { id: 'reconstruction', icon: RefreshCw },
  { id: 'classification', icon: ScanSearch },
];

const linkClass =
  'text-amber-200/95 underline-offset-2 transition hover:text-cream-50 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-200';

export default function SidebarNav({
  mode,
  onModeChange,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
}) {
  const selectMode = (id) => {
    onModeChange(id);
    onMobileClose?.();
  };

  return (
    <aside
      id="app-sidebar"
      className={[
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-stone-600/40 bg-sidebar text-cream-100 shadow-2xl',
        'transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'w-[min(18rem,88vw)]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:shadow-none',
        collapsed ? 'lg:w-[4.5rem]' : 'lg:w-72',
      ].join(' ')}
      aria-label="Navegación principal"
    >
      <div
        className={[
          'flex shrink-0 items-center justify-between gap-2 border-b border-stone-600/50 px-4 py-4',
          collapsed && 'lg:px-2',
        ].join(' ')}
      >
        <div
          className={[
            'flex min-w-0 flex-1 items-center gap-3',
            collapsed ? 'lg:justify-center' : '',
          ].join(' ')}
        >
          <img
            src={LOGO_SRC}
            alt="Arte rupestre"
            width={96}
            height={96}
            className={[
              'shrink-0 object-contain drop-shadow-sm',
              collapsed ? 'size-10 lg:size-11' : 'size-11 sm:size-12',
            ].join(' ')}
            decoding="async"
          />
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="font-heading text-xl font-semibold leading-tight text-cream-50">Arte rupestre</p>
            <p className="mt-0.5 text-xs text-cream-200/90">Panel de herramientas</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          className="rounded-lg p-2 text-cream-200 transition hover:bg-sidebar-hover hover:text-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-200 lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`hidden rounded-lg p-2 text-cream-200 transition hover:bg-sidebar-hover hover:text-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream-200 lg:inline-flex ${collapsed ? '' : 'lg:ml-auto'}`}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir panel lateral' : 'Contraer panel lateral'}
        >
          {collapsed ? <ChevronsRight className="size-5" aria-hidden /> : <ChevronsLeft className="size-5" aria-hidden />}
        </button>
      </div>

      <nav
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-3"
        role="group"
        aria-label="Secciones"
      >
        {items.map(({ id, icon }) => {
          const selected = mode === id;
          const label = MODE_LABELS[id];
          return (
            <button
              key={id}
              type="button"
              aria-current={selected ? 'page' : undefined}
              aria-pressed={selected}
              title={collapsed ? label : undefined}
              onClick={() => selectMode(id)}
              className={[
                'group flex min-h-[48px] shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200',
                selected
                  ? 'bg-accent/25 text-cream-50 shadow-inner ring-1 ring-accent/40'
                  : 'text-cream-200/95 hover:bg-sidebar-hover hover:text-cream-50',
                collapsed && 'lg:justify-center lg:px-2',
              ].join(' ')}
            >
              <span
                className={[
                  'flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                  selected ? 'bg-accent text-cream-50' : 'bg-stone-600/50 text-cream-200 group-hover:bg-stone-600',
                ].join(' ')}
              >
                {createElement(icon, { className: 'size-5', 'aria-hidden': true })}
              </span>
              <span className={`min-w-0 flex-1 truncate ${collapsed ? 'lg:sr-only' : ''}`}>{label}</span>
              {selected && !collapsed && (
                <span className="hidden h-8 w-1 shrink-0 rounded-full bg-accent lg:block" aria-hidden />
              )}
            </button>
          );
        })}
      </nav>

      <footer
        className={`shrink-0 border-t border-stone-600/50 bg-sidebar-hover/30 px-3 py-4 ${collapsed ? 'lg:hidden' : ''}`}
      >
        <div className="max-h-[min(42vh,20rem)] space-y-4 overflow-y-auto overscroll-contain pr-1 text-xs leading-relaxed">
          <div>
            <h2 className="font-heading mb-2 text-sm font-semibold text-cream-50">Proyectos base</h2>
            <p className="text-cream-300/90">
              <a
                href="https://github.com/dvschultz/stylegan2-ada-pytorch"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                StyleGAN2-ADA-PyTorch
              </a>
              <span className="text-cream-400/70" aria-hidden>
                {' '}
                |{' '}
              </span>
              <a href="https://github.com/Sanster/IOPaint" target="_blank" rel="noopener noreferrer" className={linkClass}>
                IOPaint
              </a>
            </p>
          </div>

          <p className="border-t border-stone-600/40 pt-3 text-center text-[10px] leading-snug text-cream-400/85">
            © {new Date().getFullYear()} Proyecto de investigación — UPTC
          </p>
        </div>
      </footer>
    </aside>
  );
}
