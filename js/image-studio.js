/* Cấu hình đường dẫn Icons cho Image Studio (thay file trong assets/icons/) */
const ICONS = {
  crop: 'assets/icons/crop.png',
  cropApply: 'assets/icons/crop-apply.png',
  alignLeft: 'assets/icons/align-left.png',
  alignRight: 'assets/icons/align-right.png',
  alignCenter: 'assets/icons/align-center.png',
  alignInline: 'assets/icons/align-inline.png',
  rot: 'assets/icons/rotate.png'
};

/* ================= THẺ CÔNG THỨC (.fx) & IMAGE STUDIO (.iw) ================= */
let editingFxNode = null;
function openFxModal(fxNode=null){
  editingFxNode = fxNode; $('#fx_input').value = fxNode ? (fxNode.dataset.tex || '') : '';
  updateFxModalPreview(); $('#fx_modal').style.display = 'flex'; setTimeout(()=>$('#fx_input').focus(), 40);
}
function updateFxModalPreview(){
  const tex = $('#fx_input').value.trim();
  $('#fx_preview').innerHTML = tex ? renderKatexSafe(tex, true) : '<span class="hint">Gõ mã LaTeX hoặc \\ce{...} để xem trước...</span>';
}
$('#fx_input').addEventListener('input', updateFxModalPreview);
$('#fx_cancel').addEventListener('click', ()=>{ $('#fx_modal').style.display='none'; editingFxNode=null; });
$('#fx_modal').addEventListener('click', e=>{
  const b = e.target.closest('[data-fxins]');
  if(b){
    const inp = $('#fx_input'), s = inp.selectionStart || inp.value.length, ePos = inp.selectionEnd || inp.value.length;
    inp.value = inp.value.slice(0, s) + b.dataset.fxins + inp.value.slice(ePos); inp.focus(); updateFxModalPreview();
  }
});
function insertFxChip(tex){
  if(!tex || !tex.trim()) return;
  const cleanTex = tex.trim();
  if(editingFxNode && document.body.contains(editingFxNode)){
    editingFxNode.dataset.tex = cleanTex; editingFxNode.innerHTML = renderKatexSafe(cleanTex, false);
    const ed = editingFxNode.closest('.rt, #paper_preview[contenteditable="true"]');
    if(ed) ed.dispatchEvent(new Event('input', {bubbles:true}));
    editingFxNode = null; toast('✅ Đã cập nhật công thức'); return;
  }
  if(!restore()) return;
  document.execCommand('insertHTML', false, `<span class="fx" contenteditable="false" data-tex="${esc(cleanTex)}">${renderKatexSafe(cleanTex, false)}</span>&nbsp;`);
  last.ed.dispatchEvent(new Event('input', {bubbles:true}));
}
$('#fx_apply').addEventListener('click', ()=>{
  const tex = $('#fx_input').value.trim(); if(!tex) return toast('Hãy nhập mã công thức LaTeX');
  $('#fx_modal').style.display = 'none'; insertFxChip(tex);
});
function packDollarToFx(ed){
  if(!ed) return;
  let html = ed.innerHTML;
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex)=>{ const raw = tex.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim(); return `<span class="fx" contenteditable="false" data-tex="${esc(raw)}">${renderKatexSafe(raw, false)}</span>`; });
  html = html.replace(/\$([^\$\n]+?)\$/g, (_, tex)=>{ const raw = tex.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim(); return `<span class="fx" contenteditable="false" data-tex="${esc(raw)}">${renderKatexSafe(raw, false)}</span>`; });
  ed.innerHTML = html; ed.dispatchEvent(new Event('input', {bubbles:true})); toast('⚡ Đã đóng gói $...$ thành thẻ công thức');
}

let selIw = null, selEd = null, iwAct = null;
function syncIwToData(){
  if(!selEd) return;
  if(selIw && selIw.dataset.mode === 'free'){
    if(selIw.dataset.push !== '0'){
      const reqH = Math.round((parseFloat(selIw.style.top)||0) + selIw.offsetHeight + 14);
      selIw.dataset.reqh = reqH; selEd.style.minHeight = reqH + 'px';
    } else { delete selIw.dataset.reqh; selEd.style.minHeight = ''; }
  } else if(selIw) delete selIw.dataset.reqh;
  selEd.dispatchEvent(new Event('input', {bubbles:true}));
}
function updateIwOverlay(){
  const ov = $('#iw_ov'), bar = $('#iw_bar');
  if(!selIw || !document.body.contains(selIw)){ hideIwOverlay(); return; }
  const r = selIw.getBoundingClientRect();
  ov.style.display = 'block'; ov.style.left = r.left + 'px'; ov.style.top = r.top + 'px'; ov.style.width = r.width + 'px'; ov.style.height = r.height + 'px';
  bar.style.display = 'flex';
  const mode = selIw.dataset.mode || 'inline';
  $$('[data-iwm]', bar).forEach(b => b.classList.toggle('on', b.dataset.iwm === mode));
  const pushBtn = $('#iw_btn_push'); if(pushBtn){ pushBtn.style.display = mode === 'free' ? 'inline-flex' : 'none'; pushBtn.classList.toggle('on', selIw.dataset.push !== '0'); }
  const cropBtn = $('#iw_btn_crop'); if(cropBtn) cropBtn.style.display = $('img', selIw) ? 'inline-flex' : 'none';
  const bw = bar.offsetWidth || 520, bh = bar.offsetHeight || 38;
  let bx = Math.max(8, Math.min(window.innerWidth - bw - 8, r.left)), by = r.top - bh - 8;
  if(by < 8) by = r.bottom + 8;
  bar.style.left = bx + 'px'; bar.style.top = by + 'px';
}
function hideIwOverlay(){ selIw = null; selEd = null; $('#iw_ov').style.display = 'none'; $('#iw_bar').style.display = 'none'; }
function selectIw(iw, ed){ selIw = iw; selEd = ed; if(!selIw.dataset.mode) selIw.dataset.mode = 'fright'; if(selIw.dataset.mode === 'free' && !selIw.dataset.push) selIw.dataset.push = '1'; updateIwOverlay(); }
window.addEventListener('scroll', ()=>{if(selIw) updateIwOverlay()}, true);
window.addEventListener('resize', ()=>{if(selIw) updateIwOverlay()});

document.addEventListener('mousedown', e => {
  const bar = e.target.closest('#iw_bar'), ovHd = e.target.closest('#iw_ov .iw-hd'), ovMove = e.target.closest('#iw_drag_handle');
  if(bar || $('#crop_modal').style.display === 'flex' || $('#fx_modal').style.display === 'flex') return;
  const fxEl = e.target.closest('.rt .fx, #paper_preview[contenteditable="true"] .fx');
  if(fxEl){ e.preventDefault(); e.stopPropagation(); openFxModal(fxEl); return; }
  if(ovHd && selIw){
    e.preventDefault(); e.stopPropagation(); const r = selIw.getBoundingClientRect();
    iwAct = {type:'resize', dir:ovHd.dataset.dir, startX:e.clientX, startY:e.clientY, startW:r.width, startH:r.height, ratio:r.width/(r.height||1)}; return;
  }
  let targetIw = ovMove ? selIw : e.target.closest('.iw');
  if(!targetIw){
    const rawVisual = e.target.closest('.rt img, .rt svg, #paper_preview[contenteditable="true"] img, #paper_preview[contenteditable="true"] svg');
    if(rawVisual && !rawVisual.closest('.fx')){
      const ed = rawVisual.closest('[contenteditable="true"]'), sp = document.createElement('span');
      sp.className = 'iw'; sp.contentEditable = 'false'; sp.dataset.mode = 'fright'; sp.style.width = (rawVisual.getBoundingClientRect().width || 220) + 'px';
      rawVisual.parentNode.insertBefore(sp, rawVisual); sp.appendChild(rawVisual); targetIw = sp;
      if(ed) ed.dispatchEvent(new Event('input', {bubbles:true}));
    }
  }
  if(targetIw){
    const ed = targetIw.closest('[contenteditable="true"]'); if(!ed) return;
    selectIw(targetIw, ed); if(e.target.classList.contains('iw-cap')) return;
    e.preventDefault(); const edRect = ed.getBoundingClientRect(), iwRect = targetIw.getBoundingClientRect();
    iwAct = {type:'move', startX:e.clientX, startY:e.clientY, moved:false, edRect, origLeft:parseFloat(targetIw.style.left)??(iwRect.left-edRect.left), origTop:parseFloat(targetIw.style.top)??(iwRect.top-edRect.top), origTx:parseFloat(targetIw.dataset.tx)||0, origTy:parseFloat(targetIw.dataset.ty)||0}; return;
  }
  if(!e.target.closest('#iw_ov')) hideIwOverlay();
});

document.addEventListener('mousemove', e => {
  if(!iwAct || !selIw) return;
  const dx = e.clientX - iwAct.startX, dy = e.clientY - iwAct.startY;
  if(iwAct.type === 'resize'){
    let w = iwAct.startW, h = iwAct.startH, d = iwAct.dir;
    if(d.includes('e')) w = Math.max(40, iwAct.startW + dx); if(d.includes('w')) w = Math.max(40, iwAct.startW - dx);
    if(d.includes('s')) h = Math.max(30, iwAct.startH + dy); if(d.includes('n')) h = Math.max(30, iwAct.startH - dy);
    if(d.length === 2 && !e.altKey) h = Math.round(w / iwAct.ratio);
    selIw.style.width = Math.round(w) + 'px'; selIw.style.height = Math.round(h) + 'px'; updateIwOverlay();
  } else if(iwAct.type === 'move'){
    if(Math.abs(dx) > 3 || Math.abs(dy) > 3) iwAct.moved = true; if(!iwAct.moved) return;
    if(selIw.dataset.mode === 'free'){
      const nx = Math.max(0, Math.min(iwAct.edRect.width - 40, Math.round(iwAct.origLeft + dx))), ny = Math.max(0, Math.round(iwAct.origTop + dy));
      selIw.style.left = nx + 'px'; selIw.style.top = ny + 'px'; $('#iw_drag_handle').textContent = `✥ X:${nx} Y:${ny}`;
    } else {
      const tx = Math.round(iwAct.origTx + dx), ty = Math.round(iwAct.origTy + dy);
      selIw.dataset.tx = tx; selIw.dataset.ty = ty; applyIwTransform(selIw); $('#iw_drag_handle').textContent = `✥ Lệch X:${tx} Y:${ty}`;
    }
    updateIwOverlay();
  }
});
document.addEventListener('mouseup', () => { if(iwAct){ if(selIw){ $('#iw_drag_handle').textContent = '✥'; syncIwToData(); updateIwOverlay(); } iwAct = null; } });

function applyIwTransform(iw){
  const tx = parseFloat(iw.dataset.tx)||0, ty = parseFloat(iw.dataset.ty)||0, rot = parseInt(iw.dataset.rot)||0, flip = iw.dataset.flip==='1'?-1:1, parts = [];
  if(tx||ty) parts.push(`translate(${tx}px, ${ty}px)`); if(rot) parts.push(`rotate(${rot}deg)`); if(flip===-1) parts.push(`scaleX(-1)`);
  iw.style.transform = parts.join(' ');
}
function setIwMode(iw, mode){
  if(!iw || !selEd) return;
  const edRect = selEd.getBoundingClientRect(), iwRect = iw.getBoundingClientRect();
  iw.dataset.mode = mode; delete iw.dataset.sideopt;
  if(mode === 'free'){
    iw.style.left = Math.max(0, Math.round(iwRect.left - edRect.left)) + 'px'; iw.style.top = Math.max(0, Math.round(iwRect.top - edRect.top)) + 'px';
    if(!iw.dataset.push) iw.dataset.push = '1'; iw.dataset.tx = 0; iw.dataset.ty = 0;
  } else { iw.style.left = ''; iw.style.top = ''; iw.dataset.tx = 0; iw.dataset.ty = 0; delete iw.dataset.reqh; selEd.style.minHeight = ''; }
  applyIwTransform(iw); syncIwToData(); updateIwOverlay();
}

$('#iw_bar').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b || !selIw) return;
  e.preventDefault(); e.stopPropagation();
  if(b.dataset.iwm){ setIwMode(selIw, b.dataset.iwm); return; }
  if(b.dataset.iws){ selIw.style.width = b.dataset.iws + 'px'; selIw.style.height = 'auto'; syncIwToData(); updateIwOverlay(); return; }
  switch(b.dataset.iwa){
    case 'togglepush': selIw.dataset.push = selIw.dataset.push === '0' ? '1' : '0'; syncIwToData(); updateIwOverlay(); break;
    case 'sideopt':{
      if(!selEd) break; const edW = selEd.clientWidth || 680, w = Math.min(240, Math.round(edW * 0.36));
      selIw.dataset.mode = 'free'; selIw.dataset.push = '0'; selIw.dataset.sideopt = '1'; selIw.style.width = w + 'px'; selIw.style.height = 'auto';
      selIw.style.left = Math.max(0, edW - w - 12) + 'px'; selIw.style.top = '4px'; selIw.dataset.tx = 0; selIw.dataset.ty = 0;
      applyIwTransform(selIw); syncIwToData(); updateIwOverlay(); break;
    }
    case 'ratio':{
      const im = $('img, svg', selIw);
      if(im && im.tagName === 'IMG' && im.naturalWidth) selIw.style.height = Math.round(selIw.offsetWidth * im.naturalHeight / im.naturalWidth) + 'px';
      else selIw.style.height = 'auto';
      syncIwToData(); updateIwOverlay(); break;
    }
    case 'rot': selIw.dataset.rot = ((parseInt(selIw.dataset.rot)||0) + 90) % 360; applyIwTransform(selIw); syncIwToData(); updateIwOverlay(); break;
    case 'flip': selIw.dataset.flip = selIw.dataset.flip === '1' ? '0' : '1'; applyIwTransform(selIw); syncIwToData(); updateIwOverlay(); break;
    case 'border': selIw.dataset.bordered = selIw.dataset.bordered === '1' ? '0' : '1'; syncIwToData(); updateIwOverlay(); break;
    case 'cap':{
      let cap = $('.iw-cap', selIw); const txt = prompt('Chú thích dưới hình:', cap ? cap.textContent : 'Hình 1.');
      if(txt === null) break;
      if(txt.trim()){ if(!cap){ cap = document.createElement('span'); cap.className = 'iw-cap'; selIw.appendChild(cap); } cap.textContent = txt.trim(); }
      else if(cap) cap.remove();
      syncIwToData(); updateIwOverlay(); break;
    }
    case 'crop': openCropModal(); break;
    case 'dup':{
      const clone = selIw.cloneNode(true);
      if(clone.dataset.mode === 'free'){ clone.style.left = ((parseFloat(clone.style.left)||0)+24)+'px'; clone.style.top = ((parseFloat(clone.style.top)||0)+24)+'px'; }
      selIw.after(clone); selectIw(clone, selEd); syncIwToData(); break;
    }
    case 'del':{ const ed = selEd; selIw.remove(); hideIwOverlay(); if(ed) ed.dispatchEvent(new Event('input', {bubbles:true})); break; }
  }
});

document.addEventListener('keydown', e => {
  if(selIw && (e.key === 'Delete' || e.key === 'Backspace') && document.activeElement !== selEd){
    e.preventDefault(); const ed = selEd; selIw.remove(); hideIwOverlay(); if(ed) ed.dispatchEvent(new Event('input', {bubbles:true}));
  }
});

let cropState = null;
function openCropModal(){
  const img = selIw && $('img', selIw); if(!img) return toast('Chỉ cắt được ảnh bitmap.');
  const modal = $('#crop_modal'), cv = $('#crop_cv'), im = new Image();
  im.onload = () => {
    cv.width = im.width; cv.height = im.height;
    cropState = {im, x1:Math.round(im.width*.08), y1:Math.round(im.height*.08), x2:Math.round(im.width*.92), y2:Math.round(im.height*.92), dragging:false};
    drawCropCanvas(); modal.style.display = 'flex';
  };
  im.src = img.src;
}
function drawCropCanvas(){
  if(!cropState) return;
  const cv = $('#crop_cv'), ctx = cv.getContext('2d'), {im, x1, y1, x2, y2} = cropState;
  ctx.clearRect(0,0,cv.width,cv.height); ctx.drawImage(im, 0, 0); ctx.fillStyle = 'rgba(15,23,42,0.55)';
  const rx = Math.min(x1,x2), ry = Math.min(y1,y2), rw = Math.abs(x2-x1), rh = Math.abs(y2-y1);
  ctx.fillRect(0,0,cv.width,ry); ctx.fillRect(0,ry+rh,cv.width,cv.height-(ry+rh)); ctx.fillRect(0,ry,rx,rh); ctx.fillRect(rx+rw,ry,cv.width-(rx+rw),rh);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = Math.max(2, cv.width/250); ctx.setLineDash([6,4]); ctx.strokeRect(rx,ry,rw,rh); ctx.setLineDash([]);
}
$('#crop_cv').addEventListener('mousedown', e => {
  if(!cropState) return; const r = e.target.getBoundingClientRect(), sx = e.target.width/r.width, sy = e.target.height/r.height;
  cropState.x1 = cropState.x2 = Math.round((e.clientX-r.left)*sx); cropState.y1 = cropState.y2 = Math.round((e.clientY-r.top)*sy); cropState.dragging = true; drawCropCanvas();
});
$('#crop_cv').addEventListener('mousemove', e => {
  if(!cropState || !cropState.dragging) return; const r = e.target.getBoundingClientRect(), sx = e.target.width/r.width, sy = e.target.height/r.height;
  cropState.x2 = Math.max(0, Math.min(e.target.width, Math.round((e.clientX-r.left)*sx))); cropState.y2 = Math.max(0, Math.min(e.target.height, Math.round((e.clientY-r.top)*sy))); drawCropCanvas();
});
window.addEventListener('mouseup', () => {if(cropState) cropState.dragging = false});
$('#crop_apply').addEventListener('click', () => {
  if(!cropState || !selIw) return;
  const {im, x1, y1, x2, y2} = cropState, rx = Math.min(x1,x2), ry = Math.min(y1,y2), rw = Math.abs(x2-x1), rh = Math.abs(y2-y1);
  if(rw < 15 || rh < 15) return toast('Vùng cắt quá nhỏ!');
  const out = document.createElement('canvas'); out.width = rw; out.height = rh; out.getContext('2d').drawImage(im, rx, ry, rw, rh, 0, 0, rw, rh);
  const targetImg = $('img', selIw);
  if(targetImg){ targetImg.src = out.toDataURL('image/jpeg', 0.92); selIw.style.height = 'auto'; syncIwToData(); setTimeout(updateIwOverlay, 60); }
  $('#crop_modal').style.display = 'none'; cropState = null; toast('Đã cắt ảnh!');
});
$('#crop_cancel').addEventListener('click', () => { $('#crop_modal').style.display = 'none'; cropState = null; });
