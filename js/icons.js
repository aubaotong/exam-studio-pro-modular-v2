/* ================= LUCIDE ICON HELPER (vanilla, same icons/strokes as lucide-react) ================= */
// Renders inline SVG strings identical in look to lucide-react.
// Usage: icon('pencil', 16) -> <svg ...>...</svg>  ; iconBtn('pencil','Sửa','data-a="x"')
const LUCIDE_ICONS = {
  plus:'M5 12h14M12 5v14', minus:'M5 12h14', x:'M18 6 6 18M6 6l12 12', check:'M20 6 9 17l-5-5',
  pencil:'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  copy:'M9 9h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  trash2:'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6',
  search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3',
  save:'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z M17 21v-8H7v8M7 3v5h8',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  fileJson:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6M10 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1M14 12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1',
  fileText:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6M16 13H8M16 17H8M10 9H8',
  fileSpreadsheet:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6M8 13h8M8 17h8M12 13v4',
  bookOpen:'M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z',
  library:'M16 6l4 14M12 6v14M8 8v12M4 4v16',
  shuffle:'M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5',
  clipboardCheck:'M9 14l2 2 4-4M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z',
  scanLine:'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M3 12h18',
  sparkles:'M9 2l1.5 4.5L15 8l-4.5 1.5L9 14l-1.5-4.5L3 8l4.5-1.5Z M19 13l.8 2.4L22 16l-2.2.6L19 19l-.8-2.4L16 16l2.2-.6Z',
  wand2:'M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M15 9h0M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5',
  eye:'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  eyeOff:'M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.11 9.11 0 0 0 5.39-1.61M14.12 14.12A3 3 0 1 1 9.88 9.88M2 2l20 20',
  chevronUp:'m18 15-6-6-6 6', chevronDown:'m6 9 6 6 6-6', chevronRight:'m9 18 6-6-6-6', chevronLeft:'m15 18-6-6 6-6',
  chevronsUpDown:'m7 15 5 5 5-5M7 9l5-5 5 5',
  info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4M12 8h.01',
  helpCircle:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
  image:'M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M21 15l-5-5L5 21',
  sigma:'M18 7V4H6l6 8-6 8h12v-3',
  table:'M3 11h18M3 15h18M3 7h18M3 19h18M9 3v18M3 3h18v18H3z',
  chartLine:'M3 3v18h18M7 16l4-4 3 3 5-6',
  keyboard:'M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10M2 4h20v16H2z',
  rotateCw:'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5',
  flipHorizontal2:'M3 12h18M9 5l-6 7 6 7M15 5l6 7-6 7',
  crop:'M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2',
  move:'M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20',
  alignLeft:'M17 10H3M21 6H3M21 14H3M17 18H3',
  alignRight:'M21 10H7M21 6H3M21 14H3M21 18H7',
  alignCenter:'M21 10H3M21 6H3M21 14H3M21 18H3',
  alignHorizontalJustifyStart:'M6 10H2M12 6H2M12 14H2M6 18H2M22 4v16',
  type:'M4 7V4h16v3M9 20h6M12 4v16',
  bold:'M6 12h8a4 4 0 0 0 0-8H6v16h8a4 4 0 0 0 0-8Z',
  italic:'M19 4h-9M14 20H5M15 4L9 20',
  underline:'M6 4v6a6 6 0 0 0 12 0V4M4 21h16',
  strikethrough:'M16 4A9 9 0 1 0 22 13M4 13h18',
  subscript:'M4 5l8 8M12 5l-8 8M20 19h-4v-2c0-1.5 4-2 4-5 0-1-1-2-2-2s-2 1-2 2',
  superscript:'M4 5l8 8M12 5l-8 8M20 9h-4V7c0-1.5 4-2 4-5 0-1-1-2-2-2s-2 1-2 2',
  eraser:'M7 21h10M16 21l5-5a2.83 2.83 0 0 0 0-4l-9-9a2.83 2.83 0 0 0-4 0L3 12a2.83 2.83 0 0 0 0 4l4 4M8 8l5 5',
  list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  undo2:'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11',
  redo2:'m15 14 5-5-5-5M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13',
  folderOpen:'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
  folderPlus:'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z M12 10v6M9 13h6',
  refreshCw:'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5',
  settings2:'M20 7h-9M14 17H5M17 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z M7 7a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z',
  wrench:'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z',
  checkSquare:'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  square:'M3 3h18v18H3z',
  layers:'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z M2.6 12.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83M2.6 18.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83',
  pin:'M12 17v5M9 10.76a6 6 0 0 1 1-2 2 2 0 0 0 1-1.5V5a2 2 0 0 1 4 0v2.26a2 2 0 0 0 1 1.5 6 6 0 0 1 1 2V11H9Z M5 11h14l-1.5 4H6.5Z',
  target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  rocket:'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z M9 12H4s.55-3.58 2-5c1.62-1.6 6-2 6-2M12 15v5s3.58-.55 5-2c1.6-1.62 2-6 2-6',
  database:'M12 7c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3Z M21 5c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3',
  flaskConical:'M10 2v7.31M14 9.3V1.99M8.5 2h7M5.52 16h12.96L14 9.3V2M14 9.3 8.27 20.6a1 1 0 0 0 .9 1.4h5.66a1 1 0 0 0 .9-1.4L14 9.3',
  atom:'M12 12v.01M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14',
  calculator:'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z M8 6h8M16 14l-2-2M8 14l2-2M8 18h.01M12 18h.01',
  alertTriangle:'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4M12 17h.01',
  checkCircle2:'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  xCircle:'m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z M9 9l6 6M15 9l-6 6',
  lightbulb:'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4',
  wrenchScrewdriver:'M9.5 14.5 3 21M16 4l2.5-2.5M14 6l2.5-2.5M14 6 9.5 10.5M16 8l1.5-1.5M8 8l-2 2M21.7 6.3a2.5 2.5 0 0 0-3.5 0L8.5 15.5l-.5 5 5-.5L21.7 9.8a2.5 2.5 0 0 0 0-3.5Z',
  archive:'M4 2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z M3 8v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M9 12h6',
  fileDown:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6M12 18v-6M9 15l3 3 3-3',
  package:'m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z M3.3 7 12 12l8.7-5M12 22V12',
  printer:'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6zM6 6V2h12v4',
  lock:'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z M8 11V7a4 4 0 0 1 8 0v4',
  unlock:'M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z M8 11V7a4 4 0 0 1 8 0M8 7H5a2 2 0 0 0-2 2v2',
  notePen:'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M12 12l3-3 5 5-3 3M12 12l-3 3v2h2l3-3M12 12l-3 3',
  border:'M6 3v18M18 3v18M3 6h18M3 18h18',
  star:'M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z',
  brain:'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z',
  dots:'M5 12h.01M12 12h.01M19 12h.01',
  gradCap:'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5',
  compass:'M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.03a6 6 0 0 1 0-8.46m11.38-2.91a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14M14.12 9.88 9.88 14.12M9.88 9.88l4.24 4.24',
  fileBox:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6M3 12h18M3 16h18'
};
function icon(name, size=16){
  const path = LUCIDE_ICONS[name] || LUCIDE_ICONS.info;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lc lc-${name}" aria-hidden="true">${path.split('M').filter(Boolean).map(p=>'M'+p).map(d=>`<path d="${d}"/>`).join('')}</svg>`;
}
// Icon button with tooltip: iconBtn('trash2','Xóa','data-a="del"','btn x')
function iconBtn(name, label, attrs, cls='btn'){
  const isIconOnly = !label;
  const tip = isIconOnly ? '' : label;
  const inner = isIconOnly ? icon(name,16) : `${icon(name,16)}<span>${label}</span>`;
  return `<button type="button" class="${cls}${isIconOnly?' ic-only':''}" ${attrs}${isIconOnly?` title="${tip||''}" aria-label="${tip||name}"`:` title="${tip}"`}>${inner}</button>`;
}
// Hydrate all <span class="lc-w" data-lc="name"> placeholders (static HTML + dynamic)
function lucideHydrate(root=document){
  $('.lc-w[data-lc]', root).forEach(el=>{ const name=el.getAttribute('data-lc'); if(name && LUCIDE_ICONS[name]){ el.innerHTML = icon(name, 15); el.removeAttribute('data-lc'); } });
  // also hydrate any [data-lc] on non-span elements (buttons etc.)
  $('[data-lc]:not(.lc-w)', root).forEach(el=>{ const name=el.getAttribute('data-lc'); if(name && LUCIDE_ICONS[name] && !el.querySelector('.lc')){ el.insertAdjacentHTML('afterbegin', icon(name,15)); el.removeAttribute('data-lc'); } });
}
document.addEventListener('DOMContentLoaded', ()=>lucideHydrate());
