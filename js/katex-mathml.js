/* ================= RENDER KATEX & MATHML CHO WORD ================= */
function renderKatexSafe(tex, displayMode=false){
  if(!tex) return '';
  if(window.katex){
    try{ return katex.renderToString(tex.trim(), {displayMode, throwOnError:false, trust:true, strict:false}); }
    catch(e){ return `<code>${esc(tex)}</code>`; }
  }
  return `<code>${esc(tex)}</code>`;
}
function renderKatexMathML(tex, displayMode=false){
  if(!tex) return '';
  if(window.katex){
    try{
      const mml = katex.renderToString(tex.trim(), {output:'mathml', displayMode, throwOnError:false, trust:true, strict:false});
      const m = mml.match(/<math[\s\S]*?<\/math>/i);
      return m ? m[0] : mml;
    }catch(e){ return esc(tex); }
  }
  return esc(tex);
}
function formatMathDisplay(html){
  if(!html) return '';
  let out = String(html);
  out = out.replace(/<span\b[^>]*class="fx"[^>]*data-tex="([^"]*)"[^>]*>[\s\S]*?<\/span>/gi, (_, tex)=>{
    const raw = tex.replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
    return `<span class="fx" contenteditable="false" data-tex="${esc(raw)}">${renderKatexSafe(raw, false)}</span>`;
  });
  out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex)=>renderKatexSafe(tex.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'), true));
  out = out.replace(/\$([^\$\n]+?)\$/g, (_, tex)=>renderKatexSafe(tex.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'), false));
  return out;
}
function formatMathForWord(html){
  if(!html) return '';
  let out = String(html);
  out = out.replace(/<span\b[^>]*class="fx"[^>]*data-tex="([^"]*)"[^>]*>[\s\S]*?<\/span>/gi, (_, tex)=>{
    const raw = tex.replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
    return renderKatexMathML(raw, false);
  });
  out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex)=>renderKatexMathML(tex.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'), true));
  out = out.replace(/\$([^\$\n]+?)\$/g, (_, tex)=>renderKatexMathML(tex.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'), false));
  return out;
}
function normPlainText(html){
  if(!html) return '';
  const d = document.createElement('div'); d.innerHTML = html;
  $$('.fx', d).forEach(el => { el.textContent = el.dataset.tex || el.textContent; });
  return (d.textContent||'').toLowerCase().replace(/\s+/g,' ').trim();
}
function reqMinHeightStyle(html){
  if(!html) return '';
  let maxH = 0, re = /data-reqh="(\d+)"/g, m;
  while((m = re.exec(html)) !== null){ const v = parseInt(m[1]) || 0; if(v > maxH) maxH = v; }
  return maxH > 0 ? `min-height:${maxH}px;` : '';
}

const defaultDraft = (subj='Vật lí') => ({
  editId:null, subj, lesson:'Bài 1: Dao động điều hòa', level:'NB', type:'p1', pt:0.25,
  goal:'Kiểm tra khái niệm & công thức', yccd:'', s:'', o:['','','',''], k1:0,
  st:['','','',''], k2:[true,false,true,false], ans:'', lines:6, guide:''
});
let M = defaultDraft();

function allSubjs(){ return [...new Set([...DEFAULT_SUBJS, ...DB.map(x=>x.subj), ...LIB.map(x=>x.subj)].filter(Boolean))]; }
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(tm);tm=setTimeout(()=>t.style.display='none',4000)}
function ensureExamMeta(z){
  z.tn=z.tn||[]; z.p1=z.p1||[]; z.p2=z.p2||[]; z.p3=z.p3||[]; z.codes=z.codes||[];
  z.org=z.org??'SỞ GD&ĐT VĨNH LONG'; z.school=z.school??'TRƯỜNG THPT CHUYÊN';
  z.examType=z.examType??'ĐỀ CHÍNH THỨC'; z.year=z.year??'NĂM HỌC 2026 - 2027';
  z.subj=z.subj??'Vật lí'; z.time=z.time??'45 phút'; z.reviewedDocx=!!z.reviewedDocx;
  return z;
}
