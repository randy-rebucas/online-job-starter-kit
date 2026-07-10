// Shared Tailwind utility classes for text-entry form controls. Colors reference
// the app's existing CSS custom properties (see app/globals.css) so inputs keep
// following the light/dark theme toggle instead of a separate Tailwind palette.

const base =
  "w-full rounded-[9px] border px-3 py-2.5 text-[13.5px] font-inherit " +
  "border-[var(--border)] bg-[var(--bg)] text-[var(--text)] " +
  "placeholder:text-[var(--text-dim)] " +
  "transition-colors duration-150 " +
  "focus:outline-none focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/30";

export const inputClass = base;
export const textareaClass = `${base} resize-y min-h-[70px]`;
export const selectClass = `${base} cursor-pointer`;
