# acttub web — Design Conventions

Single source of truth for how UI is built in `web/`. Follow this when implementing or
reviewing any component, page, or style. Extracted from the live codebase (`src/styles/globals.css`
and `src/components`), not invented — keep it in sync when the system evolves.

> Design language: **Toss-inspired mobile**. Single column, light page + white cards + dark text,
> sticky bottom CTA, safe-area aware.

## 1. Stack & file layout

- **Plain CSS**, no Tailwind / CSS-in-JS. Each component is a `Name.tsx` + `Name.css` pair in `src/components`.
- All component/view CSS is aggregated via `@import` in `src/app/globals.css`. **Add a new component → add its `@import` line there.**
- Design tokens live only in `src/styles/globals.css` `:root`. This is the token SSOT.

## 2. Tokens — use them, never hardcode

Never write raw colors, px spacing, radii, shadows, or font sizes in component CSS. Reference tokens.

| Group | Tokens |
|---|---|
| Neutral | `--gray-50` … `--gray-900`, `--white` |
| Brand | `--primary-100/300/500/600/700` (500 = `#FF7A5C` coral), `--success-500`, `--warn-500`, `--error-500` |
| 16-type signatures | `--type-00` … `--type-15` (+ `-dark`), applied via `[data-type="NN"]` |
| Semantic (prefer these) | `--bg-page`, `--bg-surface`, `--bg-subtle`, `--text-default`, `--text-secondary`, `--text-muted`, `--text-helper`, `--text-inverse`, `--text-link`, `--border-default/subtle/focus` |
| Spacing (4·8 base) | `--space-1` (4px) … `--space-20` (80px) |
| Radius | `--radius-xs` … `--radius-3xl`, `--radius-pill` |
| Shadow | `--shadow-1/2/3`, `--shadow-cta-top`, `--shadow-focus` |
| Typography | `--font-sans` (Pretendard), `--font-mono`; sizes `--text-xs` … `--text-4xl` each paired with `--lh-*`; weights `--fw-regular` … `--fw-extrabold` |
| Motion | `--duration-fast/base/slow`, `--ease-out`, `--ease-out-back` |
| Layout | `--container-max` (480px), `--container-gutter` (20px), `--safe-top`, `--safe-bottom` |

Prefer **semantic** tokens (`--text-default`) over raw scale (`--gray-900`) when one exists.

## 3. Component conventions

Pattern reference: `PrimaryButton.tsx`, `ChoiceCard.tsx`.

- **`export default function`**; props typed with a local `type Props = { … }` (not `interface`).
- Variants/sizes are **union string types** (`type Variant = 'fill' | 'weak'`), with sensible defaults in the signature.
- **Class naming = BEM**: block `.btn`, modifier `.btn--fill` / `.btn--md`, element `.choice__label`.
  Compose conditionally with `[ 'block', cond && 'block--mod' ].filter(Boolean).join(' ')`.
- **Icons: `lucide-react`** only. Pass explicit `size` and `strokeWidth`.
- **Accessibility is required, not optional**:
  - real semantic element (`<button type="button">`, `<a>`); polymorphic via an `as` prop when needed.
  - state to ARIA: `aria-pressed` (toggles), `aria-disabled` (+ `disabled`), `aria-hidden` on decorative icons.
  - never remove focus: rely on the global `:focus-visible` → `--shadow-focus` ring.
- **Interaction**:
  - put `:hover` styles inside `@media (hover: hover)` so touch devices don't get stuck states.
  - `:active` uses a subtle `transform: translateY(1px)`.
  - disabled = `opacity: 0.4; cursor: not-allowed`.
- **Motion** uses token durations/easings and must degrade under `prefers-reduced-motion` (handled globally — don't fight it).
- Layout: wrap page content in `.container` (480px / 20px gutter). Bottom actions use the `.bottom-cta` / `.bottom-cta--surface` pattern with safe-area padding.

## 4. Checklist before merging UI

- [ ] No hardcoded color / spacing / radius / shadow / font-size — tokens only.
- [ ] New component CSS `@import`ed in `src/app/globals.css`.
- [ ] BEM class names; semantic HTML element.
- [ ] ARIA state wired; focus ring intact.
- [ ] `:hover` gated by `@media (hover: hover)`.
- [ ] Icons from `lucide-react` with explicit size/strokeWidth.
- [ ] Reads cleanly on a 480px mobile column.
