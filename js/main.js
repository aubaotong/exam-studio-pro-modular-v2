/* ================= RENDER & SỰ KIỆN CHUNG ================= */
function render(){
  hideIwOverlay(); const e=E(),y=scrollY;
  $('#app').innerHTML=`<aside class="side">
    <button class="btn pri" data-a="new">${icon('plus',16)}<span>Đề mới</span></button>
    <button class="btn ${tab==='lib'?'ok':''}" data-a="tab" data-i="lib">${icon('library',16)}<span>Thư viện (${LIB.length})</span></button>
    <hr style="border:0;border-top:1px solid var(--bd);width:100%">
    <small style="color:var(--mut);font-weight:700;padding:0 4px">DANH SÁCH ĐỀ (${DB.length})</small>
    ${DB.map(x=>`<button class="it ${x.id===cur?'on':''}" data-a="pick" data-i="${x.id}"><b>${esc(x.name)}</b><small>${esc(x.subj)} · ${x.p1.length+x.p2.length+x.tn.length+x.p3.length} câu (${+total(x).toFixed(2)}đ)</small></button>`).join('')}
  </aside>
  <main>${e?head(e)+(tab==='edit'?editor(e):tab==='lib'?libView(e):tab==='codes'?codesView(e):tab==='sheet'?sheetView(e):gradeView(e)):`<div class="empty">${icon('file-text',32)}<p style="margin-top:10px">Bấm <b>+ Đề mới</b> để bắt đầu</p></div>`}</main>`;
  lucideHydrate($('#app'));
  scrollTo(0,y);
}

function restore(){if(!last)return toast('👆 Hãy bấm con trỏ vào ô nội dung câu hỏi trước'),false;last.ed.focus();const s=getSelection();s.removeAllRanges();s.addRange(last.r);return true}
function small(f,cb){const i=new Image();i.onload=()=>{const m=1000,r=Math.min(1,m/i.width),c=document.createElement('canvas');c.width=i.width*r;c.height=i.height*r;c.getContext('2d').drawImage(i,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.88))};i.src=URL.createObjectURL(f)}
function putImg(f){
  if(!f||!f.type.startsWith('image/'))return;
  small(f,u=>{
    if(restore()){
      const id = 'iw_' + uid();
      document.execCommand('insertHTML',false,`<span class="iw" id="${id}" contenteditable="false" data-mode="fright" style="width:220px"><img src="${u}" alt=""></span>`);
      const ed = last.ed; ed.dispatchEvent(new Event('input',{bubbles:true}));
      const inserted = $('#'+id, ed); if(inserted){ inserted.removeAttribute('id'); setTimeout(()=>selectIw(inserted, ed), 50); }
      toast('✅ Đã chèn ảnh');
    }
  });
}

document.addEventListener('selectionchange',()=>{const s=getSelection();if(!s.rangeCount)return;const n=s.anchorNode,ed=n&&(n.nodeType===1?n:n.parentElement).closest('.rt, #paper_preview[contenteditable="true"]');if(ed)last={ed,r:s.getRangeAt(0).cloneRange()}});

document.addEventListener('input',e=>{
  const t=e.target, x=E();
  if(t.classList.contains('rt')){
    if(t.dataset.p && x){sp(x,t.dataset.p,t.innerHTML);save()}
    if(t.dataset.mp){sp(M,t.dataset.mp,t.innerHTML)}
    const wrap = t.closest('.rt-wrap');
    if(wrap){
      const prevBox = $('.math-prev', wrap), prevBody = $('.math-prev-body', wrap);
      if(prevBox && prevBody){
        if(hasMath(t.innerHTML)){ prevBox.classList.add('show'); prevBody.innerHTML = formatMathDisplay(t.innerHTML); }
        else prevBox.classList.remove('show');
      }
    }
  }
  if(t.dataset.lf==='q'){libFilter.q=t.value;render()}
  if(t.dataset.gf==='customPrompt'){gemCfg.customPrompt=t.value}
  if(t.id==='paper_preview' && x){ const c=x.codes.find(z=>z.code===cc)||x.codes[0]; if(c){c.customHtml=t.innerHTML;save()} }
});

document.addEventListener('mousedown',e=>{if(e.target.closest('[data-c],[data-a="img"],[data-a="ins_svg"],[data-a="ins_tbl"],[data-a="insfx"],[data-a="openfx"]'))e.preventDefault()});
document.addEventListener('paste', e => {
  const ed = e.target.closest('.rt, #paper_preview[contenteditable="true"]');
  if(!ed) return;
  const clip = e.clipboardData;
  if(!clip) return;

  // 1. Kiểm tra nếu có dán file ảnh
  const f = [...clip.files].find(x => x.type.startsWith('image/'));
  if(f){
    e.preventDefault();
    putImg(f);
    return;
  }

  // 2. Kiểm tra nếu dán bảng từ Word hoặc Excel (định dạng text/html có chứa <table>)
  const htmlData = clip.getData('text/html');
  if(htmlData && /<table[\s\S]*?>/i.test(htmlData)){
    e.preventDefault();
    // Chuẩn hóa bảng thành định dạng edu-tbl
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');
    const tbl = doc.querySelector('table');
    if(tbl){
      tbl.className = 'edu-tbl';
      tbl.removeAttribute('style');
      tbl.removeAttribute('width');
      tbl.setAttribute('border', '1');
      // Xóa các thuộc tính rác của mso Word
      tbl.querySelectorAll('*').forEach(el => {
        el.removeAttribute('class');
        el.removeAttribute('style');
        el.removeAttribute('width');
        el.removeAttribute('height');
      });
      document.execCommand('insertHTML', false, tbl.outerHTML + '&nbsp;');
      ed.dispatchEvent(new Event('input', {bubbles:true}));
      toast('📋 Đã dán bảng dữ liệu từ Word / Excel');
      return;
    }
  }

  // 3. Kiểm tra nếu dán vùng dữ liệu copy từ Excel dạng Text có chứa dấu Tab (\t) và dòng mới (\n)
  const textData = clip.getData('text/plain');
  if(textData && textData.includes('\t') && textData.includes('\n')){
    const lines = textData.trim().split(/\r?\n/).map(l => l.split('\t'));
    if(lines.length >= 2 && lines[0].length >= 2){
      e.preventDefault();
      let tableHtml = '<table class="edu-tbl" border="1">';
      lines.forEach((row, rIdx) => {
        tableHtml += '<tr>';
        row.forEach(cell => {
          if(rIdx === 0) tableHtml += `<th>${esc(cell.trim())}</th>`;
          else tableHtml += `<td>${esc(cell.trim())}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table>&nbsp;';
      document.execCommand('insertHTML', false, tableHtml);
      ed.dispatchEvent(new Event('input', {bubbles:true}));
      toast('📊 Đã chuyển đổi vùng dữ liệu Excel thành Bảng chuẩn');
      return;
    }
  }
});
document.addEventListener('dragover',e=>{if(e.target.closest&&e.target.closest('.rt, #paper_preview[contenteditable="true"]'))e.preventDefault()});
document.addEventListener('drop',e=>{const f=[...e.dataTransfer.files].find(x=>x.type.startsWith('image/'));if(f&&e.target.closest('.rt, #paper_preview[contenteditable="true"]')){e.preventDefault();putImg(f)}});

document.addEventListener('change',async e=>{
  const t=e.target,x=E();
  if(t.id==='fi'){putImg(t.files[0]);t.value='';return}
  if(t.id==='gf'){runGrade([...t.files]);t.value='';return}
  if(t.id==='libf'){
    const f=t.files[0];if(!f)return;
    try{const arr=JSON.parse(await f.text());if(Array.isArray(arr)){LIB.push(...arr);saveLib();render();toast(`✅ Đã nhập ${arr.length} câu`)}}catch(er){toast('File JSON không hợp lệ.')}
    t.value='';return;
  }
  if(t.dataset.gf){
    const k = t.dataset.gf; gemCfg[k] = t.type==='number' ? (parseInt(t.value)||0) : t.value;
    if(k!=='customPrompt') gemCfg.customPrompt = ''; render(); return;
  }
  if(t.dataset.gchk){ gemCfg[t.dataset.gchk] = t.checked; gemCfg.customPrompt = ''; render(); return; }
  if(t.dataset.mf){
    const path = t.dataset.mf; let val = t.value;
    if(path==='type'){ M.type = val; M.pt = val==='p1'?0.25 : val==='p2'?1.0 : val==='tn'?0.5 : 1.0; render(); return; }
    if(path.startsWith('k2.')){ M.k2[+path.split('.')[1]] = (val==='1'); render(); return; }
    sp(M, path, val); if(path==='subj') render(); return;
  }
  if(t.dataset.lf && t.dataset.lf!=='q'){
    libFilter[t.dataset.lf]=t.value; if(t.dataset.lf==='subj') libFilter.lesson='ALL'; render(); return;
  }
  if(t.dataset.mx){
    const k = t.dataset.mx;
    if(k==='subj'){ mxCfg.subj = t.value; mxCfg.lesson = 'ALL'; render(); return; }
    if(k==='lesson'){ mxCfg.lesson = t.value; render(); return; }
    mxCfg[k]=Math.max(0,parseInt(t.value)||0); render(); return;
  }
  if(t.dataset.libchk){ const id=t.dataset.libchk; t.checked?libSel.add(id):libSel.delete(id); render(); return; }
  if(t.dataset.a==='chkreview' && x){ x.reviewedDocx = t.checked; save(); render(); return; }
  if(t.dataset.ek && x){
    const c = x.codes.find(z=>z.code===gCode)||x.codes[0]; if(!c)return;
    const q = +t.dataset.q;
    if(t.dataset.ek==='p1') c.key.p1[q] = t.value;
    else if(t.dataset.ek==='p2') c.key.p2[q][+t.dataset.r] = (t.value==='1');
    else if(t.dataset.ek==='tn') c.key.tn[q] = t.value.replace(/\./g,',').trim();
    c.keyEdited = true; save(); render(); toast(`Đã cập nhật đáp án Câu ${q+1} (Mã ${c.code})`); return;
  }
  if(t.dataset.f){if(restore()){document.execCommand(t.dataset.f,false,t.value);last.ed.dispatchEvent(new Event('input',{bubbles:true}))}t.value='';return}
  const p=t.dataset.v;if(!p||!x)return;
  let v=t.value;const k=t.dataset.t;
  if(k==='n')v=parseFloat(v)||0; if(k==='i')v=parseInt(v); if(k==='b')v=v==='1'; if(k==='l')v=Math.min(15,Math.max(1,parseInt(v)||1));
  if(k==='a'){v=v.replace(/\./g,',').replace(/\s/g,'');if(!/^-?\d+(,\d+)?$/.test(v)||v.length>4){if(v)toast('Đáp án trả lời ngắn tối đa 4 ký tự');v='';t.value=''}else t.value=v}
  sp(x,p,v);save();
  if(['name','org','school','examType','year','subj','time'].includes(p))render();
  else{const o=$('#tot');if(o)o.textContent=+total(x).toFixed(2)}
});

document.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b || ((b.closest('#iw_bar') || b.closest('#crop_modal') || b.closest('#fx_modal')) && b.dataset.a!=='info'))return;
  const x=E(),d=b.dataset;
  if(d.c){if(restore()){document.execCommand(d.c);last.ed.dispatchEvent(new Event('input',{bubbles:true}))}return}
  switch(d.a){
    case 'open_tbl_modal':{
      if(!restore()) return;
      $('#tbl_modal').style.display = 'flex';
      setTimeout(()=>$('#tbl_rows').focus(), 40);
      break;
    }
    case 'openshortcuts':{
      $('#shortcut_modal').style.display = 'flex';
      break;
    }

    case 'info': toast(d.t); break;
    case 'mgrp': mathGroup=d.g; render(); break;
    case 'openfx': openFxModal(null); break;
    case 'insfx': insertFxChip(d.tex); break;
    case 'packfx':{ const wrap = b.closest('.rt-wrap'); if(wrap) packDollarToFx($('.rt', wrap)); break; }
    case 'setsubj': libFilter.subj=d.v; libFilter.lesson='ALL'; render(); break;
    case 'setlesson': libFilter.lesson=d.v; render(); break;
    case 'addsubj':{
      const s = prompt('Nhập tên Môn học mới:');
      if(s && s.trim()){
        const name = s.trim();
        if(!DEFAULT_SUBJS.includes(name)) DEFAULT_SUBJS.push(name);
        libFilter.subj = name; libFilter.lesson = 'ALL'; M.subj = name; gemCfg.subj = name;
        render(); toast(`✅ Đã thêm môn ${name}`);
      }
      break;
    }
    case 'quickcreate':{
      const targetS = libFilter.subj!=='ALL' ? libFilter.subj : (x?x.subj:'Vật lí');
      const targetL = libFilter.lesson!=='ALL' ? libFilter.lesson : 'Bài 1';
      M = { ...defaultDraft(targetS), lesson:targetL, type:d.type, level:d.level, pt:d.type==='p1'?0.25:d.type==='p2'?1:d.type==='tn'?0.5:1 };
      checkReport = null; libMode = 'manual'; render(); scrollTo({top:0, behavior:'smooth'});
      toast(`✍️ Soạn câu ${TYPES_SHORT[d.type]} mức ${d.level}`); break;
    }
    case 'checkmanual':{
      const issues = inspectDraftQuality();
      checkReport = issues.length ? issues : ['✅ Câu hỏi đạt chuẩn 100% (đầy đủ phương án, công thức hợp lệ, không trùng lặp)!'];
      render(); break;
    }
    case 'new':{
      const n=ensureExamMeta({id:uid(),name:'KIỂM TRA GIỮA HỌC KỲ '+(DB.length+1),subj:x?x.subj:'Vật lí',p1:[],p2:[],tn:[],p3:[],codes:[],sig:0});
      DB.push(n);cur=n.id;tab='edit';save();render();break;
    }
    case 'cloneexam':{
      if(!x)break;
      const copy = JSON.parse(JSON.stringify(x)); copy.id = uid(); copy.name = x.name + ' (Bản sao)'; copy.reviewedDocx = false;
      DB.push(copy); cur = copy.id; save(); render(); toast('Đã nhân bản đề thi!'); break;
    }
    case 'pushalltolib':{
      if(!x)break;
      const totalQ = x.p1.length + x.p2.length + x.tn.length + x.p3.length;
      if(!totalQ) return toast('Đề chưa có câu nào');
      const lesson = prompt('Bài học / Chủ đề cho các câu này:', x.name) || x.name;
      let added = 0;
      ['p1','p2','tn','p3'].forEach(type=>{ x[type].forEach(q=>{ LIB.unshift({id:uid(), subj:x.subj, lesson, level:'TH', goal:'', yccd:'', type, ...JSON.parse(JSON.stringify(q))}); added++; }); });
      saveLib(); render(); toast(`✅ Đã lưu ${added} câu vào Thư viện`); break;
    }
    case 'pick':cur=d.i;cc=null;render();break;
    case 'tab':tab=d.i;render();break;
    case 'libmode':libMode=d.m;render();break;
    case 'openlib':libFilter.subj=x.subj;libFilter.lesson='ALL';libFilter.type=d.s;tab='lib';render();break;
    case 'add':x[d.s].push(mk[d.s]());save();render();break;
    case 'tolib':{
      const q=x[d.s][+d.i];
      loadLibItemToManual({id:null, subj:x.subj, lesson:'Bài 1', level:'NB', type:d.s, ...JSON.parse(JSON.stringify(q))}, true);
      tab='lib'; render(); toast('✏️ Đã nạp câu vào trình soạn Thư viện'); break;
    }
    case 'saveasnew':{
      const item = buildLibItemFromManual(true); if(!item) break;
      LIB.unshift(item); saveLib(); checkReport = null; render();
      toast('📋 Đã lưu thành 1 câu hỏi biến thể mới vào Thư viện!'); break;
    }
    case 'savemanual':{
      const issues = inspectDraftQuality(), fatal = issues.filter(s=>s.startsWith('❌'));
      if(fatal.length){ checkReport = issues; render(); return toast(fatal[0]); }
      const item = buildLibItemFromManual(false); if(!item) break;
      const isEdit = !!M.editId;
      if(isEdit){ const idx = LIB.findIndex(z=>z.id===M.editId); if(idx>=0) LIB[idx] = item; else LIB.unshift(item); }
      else LIB.unshift(item);
      if(d.both==='1' && x){ pushLibItemToExam(item, x); save(); }
      saveLib(); checkReport = null;
      M = { ...defaultDraft(item.subj), lesson:item.lesson, level:item.level, type:item.type, pt:item.pt, goal:item.goal, yccd:item.yccd };
      render(); toast(isEdit ? '✅ Đã cập nhật câu hỏi' : '✅ Đã lưu vào Thư viện'); break;
    }
    case 'clonelib':{
      const q = LIB.find(z=>z.id===d.id);
      if(q){ loadLibItemToManual(q, true); toast('📋 Đã nạp bản sao — hãy đổi số liệu/dữ kiện rồi bấm Lưu'); }
      break;
    }
    case 'editlib':{ const q = LIB.find(z=>z.id===d.id); if(q) loadLibItemToManual(q, false); break; }
    case 'cancelmedit': M = defaultDraft(x?x.subj:'Vật lí'); checkReport = null; render(); break;
    case 'ins_svg':{
      const id = 'iw_' + uid();
      const svgSample = `<span class="iw" id="${id}" contenteditable="false" data-mode="fright" data-bordered="1" style="width:240px"><svg width="280" height="140" viewBox="0 0 280 140" style="background:#fff"><line x1="25" y1="70" x2="260" y2="70" stroke="#0f172a" stroke-width="1.5"/><line x1="35" y1="15" x2="35" y2="125" stroke="#0f172a" stroke-width="1.5"/><path d="M 35 70 Q 65 15, 95 70 T 155 70 T 215 70" fill="none" stroke="#1d4ed8" stroke-width="2"/><text x="24" y="85" font-size="11">O</text><text x="245" y="85" font-size="11">x</text><text x="40" y="22" font-size="11">y</text></svg></span>`;
      if(restore()){ document.execCommand('insertHTML',false,svgSample); const ed = last.ed; ed.dispatchEvent(new Event('input',{bubbles:true})); const el = $('#'+id, ed); if(el){ el.removeAttribute('id'); setTimeout(()=>selectIw(el, ed), 50); } }
      break;
    }
    case 'ins_tbl':{
      const tblSample = `<table style="border-collapse:collapse;margin:6px 0;font-size:13px" border="1" cellpadding="5"><tr><th>Đại lượng</th><th>Giá trị 1</th><th>Giá trị 2</th><th>Giá trị 3</th></tr><tr><td>Thời gian t (s)</td><td>0</td><td>1,0</td><td>2,0</td></tr><tr><td>Kết quả</td><td>...</td><td>...</td><td>...</td></tr></table>&nbsp;`;
      if(restore()){document.execCommand('insertHTML',false,tblSample);last.ed.dispatchEvent(new Event('input',{bubbles:true}))}
      break;
    }
    case 'del':if(confirm('Xóa câu hỏi này?')){x[d.s].splice(+d.i,1);save();render()}break;
    case 'delexam':if(confirm('Xóa toàn bộ đề kiểm tra này?')){DB=DB.filter(z=>z.id!==cur);cur=DB[0]&&DB[0].id;save();render()}break;
    case 'img':$('#fi').click();break;
    case 'togglegem':showGemPrompt=!showGemPrompt;render();break;
    case 'resetgemprompt':gemCfg.customPrompt='';render();toast('Đã làm mới Prompt theo khung');break;
    case 'copygem':{
      const pText = gemCfg.customPrompt || buildDynamicGemPrompt();
      navigator.clipboard.writeText(pText); toast('📋 Đã copy Prompt cho Gem AI!'); break;
    }
    case 'samplegem':$('#gem_in').value=SAMPLE_PASTE_V3;toast('✨ Đã dán bộ mẫu đa môn — bấm ⚡ Phân tích & Lưu');break;
    case 'parselib':{
      const raw=$('#gem_in').value, res=parseGemInput(raw, gemCfg.subj||(x?x.subj:'Vật lí'));
      gemReport = res;
      if(!res.items.length){ render(); return toast(res.dupCount ? `⚠️ Cả ${res.dupCount} câu đều đã tồn tại trong Thư viện` : '❌ Không tìm thấy câu hỏi hợp lệ'); }
      LIB.unshift(...res.items); saveLib(); render();
      toast(`✅ Đã thêm ${res.added} câu mới (Bỏ qua ${res.dupCount} câu trùng)`); break;
    }
    case 'runmatrix':{
      const targetSubj = mxCfg.subj==='CURRENT' ? (libFilter.subj!=='ALL'?libFilter.subj:x.subj) : mxCfg.subj;
      const pool = LIB.filter(q=>(targetSubj==='ALL'||q.subj===targetSubj) && (mxCfg.lesson==='ALL'||q.lesson===mxCfg.lesson));
      const chosen = [], shortages = [];
      Object.keys(TYPES).forEach(tk=>{
        Object.keys(LEVELS).forEach(lv=>{
          const req = +mxCfg[`${tk}_${lv}`]||0;
          if(req > 0){
            const subPool = pool.filter(q=>q.type===tk && q.level===lv);
            if(subPool.length < req) shortages.push(`${TYPES_SHORT[tk]} (${lv}): cần ${req}, chỉ có ${subPool.length}`);
            chosen.push(...pickRandom(subPool, req));
          }
        });
      });
      if(!chosen.length) return toast('⚠️ Kho câu hỏi chưa có câu nào khớp với ma trận.');
      if(shortages.length && !confirm(`⚠️ Cảnh báo thiếu câu hỏi trong kho:\n- ${shortages.join('\n- ')}\n\nBạn có muốn rút tạm ${chosen.length} câu hiện có vào đề không?`)) return;
      chosen.forEach(q=>pushLibItemToExam(q,x));
      save(); tab='edit'; render(); toast(`✅ Đã rút ${chosen.length} câu theo ma trận vào đề`); break;
    }
    case 'selalllib':{
      const curList = getFilteredLib(); curList.forEach(q=>libSel.add(q.id));
      render(); toast(`☑ Đã chọn ${curList.length} câu đang hiển thị`); break;
    }
    case 'unselalllib':libSel.clear();render();break;
    case 'delsellib':{
      if(!libSel.size) break;
      if(confirm(`Xóa vĩnh viễn ${libSel.size} câu hỏi đã chọn khỏi Thư viện?`)){
        const cnt = libSel.size; LIB = LIB.filter(q=>!libSel.has(q.id)); libSel.clear(); saveLib(); render();
        toast(`🗑 Đã xóa ${cnt} câu khỏi Thư viện`);
      }
      break;
    }
    case 'add1toexam':{ const q=LIB.find(i=>i.id===d.id); if(q&&x){pushLibItemToExam(q,x);save();render();toast(`✅ Đã đưa vào đề`)} break; }
    case 'addseltoexam':{
      let cnt=0; LIB.forEach(q=>{if(libSel.has(q.id)){pushLibItemToExam(q,x);cnt++}});
      libSel.clear();save();tab='edit';render();toast(`✅ Đã đưa ${cnt} câu vào đề`);break;
    }
    case 'dellib':LIB=LIB.filter(i=>i.id!==d.id);libSel.delete(d.id);saveLib();render();break;
    case 'explib':await dlBlob('thu-vien-dung-chung.json',new Blob([JSON.stringify(LIB,null,2)],{type:'application/json'}));break;
    case 'implib':$('#libf').click();break;
    case 'gen':{
      if(!x.p1.length&&!x.p2.length&&!x.tn.length&&!x.p3.length)return toast('Đề thi chưa có câu hỏi nào.');
      gen(Math.min(24,Math.max(1,parseInt($('#nc').value)||1)));render();break;
    }
    case 'code':cc=d.i;render();break;
    case 'toggleedit':
      editPaper=!editPaper;
      if(!editPaper){x.reviewedDocx=true;save();toast('✅ Đã lưu · mở khóa Bước 2')}
      render();break;
    case 'resetcustom':{ const c=x.codes.find(z=>z.code===cc)||x.codes[0]; if(c){c.customHtml=null;save();render();toast('Đã khôi phục bố cục chuẩn.')} break; }
    case 'docde':exportWord('de');break;
    case 'dockey':exportWord('key');break;
    case 'pdf':makePdf();break;
    case 'pdfde':printPdf('de');break;
    case 'pdfkey':printPdf('key');break;
    case 'gcode':gCode=d.i;render();break;
    case 'resetkey':{
      const c=x.codes.find(z=>z.code===d.code);
      if(c){
        c.key={
          tn:c.tn.map(it=>x.tn[it.q].ans), pt3:c.tn.map(it=>x.tn[it.q].pt),
          p1:c.p1.map(it=>'ABCD'[it.perm.indexOf(x.p1[it.q].k)]),
          p2:c.p2.map(it=>it.perm.map(j=>x.p2[it.q].k[j])),
          pt1:c.p1.map(it=>x.p1[it.q].pt), pt2:c.p2.map(it=>x.p2[it.q].pt)
        };
        c.keyEdited=false;save();render();toast('Đã khôi phục đáp án gốc Mã đề '+c.code);
      }break;
    }
    case 'gopen':$('#gf').click();break;
    case 'regrade':if(G.files.length)runGrade(G.files);break;
    case 'gdl':G.blob?dlBlob('bai-da-cham-'+x.id+'.pdf',G.blob):toast('Chưa có bài đã chấm.');break;
    case 'exp':await dlBlob('goi-de-thi-'+x.id+'.json',new Blob([JSON.stringify(x,null,2)],{type:'application/json'}));break;
  }
});

async function load(){
  try{DB=JSON.parse(localStorage.getItem('exams_v1')||'[]')}catch(e){DB=[]}
  try{LIB=JSON.parse(localStorage.getItem('qbank_v1')||'[]')}catch(e){LIB=[]}
  const [idbExams, idbLib] = await Promise.all([idbGet('exams_v1'), idbGet('qbank_v1')]);
  if(Array.isArray(idbExams) && idbExams.length >= DB.length) DB = idbExams;
  else if(DB.length) idbSet('exams_v1', DB);
  if(Array.isArray(idbLib) && idbLib.length >= LIB.length) LIB = idbLib;
  else if(LIB.length) idbSet('qbank_v1', LIB);
  DB.forEach(ensureExamMeta);
  if(!DB.length){
    const n=ensureExamMeta({id:uid(),name:'KIỂM TRA GIỮA HỌC KỲ I',p1:[],p2:[],tn:[],p3:[],codes:[],sig:0});
    DB.push(n);
  }
  if(!LIB.length){
    const res = parseGemInput(SAMPLE_PASTE_V3, 'Vật lí');
    if(res.items.length){ LIB = res.items; saveLib(); }
  }
  cur=DB[0]&&DB[0].id;
  M = defaultDraft(DB[0]?DB[0].subj:'Vật lí');
  updateStorageStat();
  render();
}

load();


// ================= HỆ THỐNG PHÍM TẮT TIỆN DỤNG TOÀN CỤC =================
document.addEventListener('keydown', e => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? e.metaKey : e.ctrlKey;
  const active = document.activeElement;
  const inEditor = active && active.closest && active.closest('.rt, #paper_preview[contenteditable="true"]');

  // Phím Esc: đóng các popup / modal
  if(e.key === 'Escape'){
    if($('#tbl_modal') && $('#tbl_modal').style.display === 'flex'){
      $('#tbl_modal').style.display = 'none'; return;
    }
    if($('#shortcut_modal') && $('#shortcut_modal').style.display === 'flex'){
      $('#shortcut_modal').style.display = 'none'; return;
    }
    if($('#fx_modal') && $('#fx_modal').style.display === 'flex'){
      $('#fx_modal').style.display = 'none'; return;
    }
    if($('#crop_modal') && $('#crop_modal').style.display === 'flex'){
      $('#crop_modal').style.display = 'none'; return;
    }
    if(typeof hideIwOverlay === 'function') hideIwOverlay();
  }

  // Phím Delete hoặc Backspace khi đang chọn ảnh Image Studio (.iw)
  if((e.key === 'Delete' || e.key === 'Backspace') && typeof selIw !== 'undefined' && selIw && !inEditor){
    e.preventDefault();
    const ed = selEd;
    selIw.remove();
    if(typeof hideIwOverlay === 'function') hideIwOverlay();
    if(ed) ed.dispatchEvent(new Event('input', {bubbles:true}));
    toast('🗑 Đã xóa hình ảnh');
    return;
  }

  // Phím tắt Ctrl + B / I / U / Z / Y trong vùng soạn thảo
  if(modKey && inEditor){
    const k = e.key.toLowerCase();
    if(k === 'b'){
      e.preventDefault();
      document.execCommand('bold');
      inEditor.dispatchEvent(new Event('input', {bubbles:true}));
    } else if(k === 'i'){
      e.preventDefault();
      document.execCommand('italic');
      inEditor.dispatchEvent(new Event('input', {bubbles:true}));
    } else if(k === 'u'){
      e.preventDefault();
      document.execCommand('underline');
      inEditor.dispatchEvent(new Event('input', {bubbles:true}));
    } else if(k === 'z' && !e.shiftKey){
      e.preventDefault();
      document.execCommand('undo');
      inEditor.dispatchEvent(new Event('input', {bubbles:true}));
    } else if((k === 'y') || (k === 'z' && e.shiftKey)){
      e.preventDefault();
      document.execCommand('redo');
      inEditor.dispatchEvent(new Event('input', {bubbles:true}));
    }
  }
});


// ================= SỰ KIỆN HỘP THOẠI TẠO BẢNG & PHÍM TẮT =================
document.addEventListener('click', e => {
  if(e.target.id === 'tbl_cancel' || e.target.id === 'tbl_modal'){
    $('#tbl_modal').style.display = 'none';
  }
  if(e.target.id === 'shortcut_close' || e.target.id === 'shortcut_modal'){
    $('#shortcut_modal').style.display = 'none';
  }
  if(e.target.id === 'tbl_clear_paste'){
    $('#tbl_paste_input').value = '';
  }
  if(e.target.id === 'tbl_apply_grid'){
    const rows = Math.max(1, Math.min(50, parseInt($('#tbl_rows').value) || 3));
    const cols = Math.max(1, Math.min(20, parseInt($('#tbl_cols').value) || 4));
    const hasHdr = $('#tbl_has_hdr').checked;
    let html = '<table class="edu-tbl" border="1">';
    for(let r = 0; r < rows; r++){
      html += '<tr>';
      for(let c = 0; c < cols; c++){
        if(r === 0 && hasHdr){
          html += `<th>Tiêu đề ${c + 1}</th>`;
        } else {
          html += `<td>...</td>`;
        }
      }
      html += '</tr>';
    }
    html += '</table>&nbsp;';
    $('#tbl_modal').style.display = 'none';
    if(restore()){
      document.execCommand('insertHTML', false, html);
      last.ed.dispatchEvent(new Event('input', {bubbles:true}));
      toast(`✅ Đã chèn bảng ${rows} dòng × ${cols} cột`);
    }
  }
  if(e.target.id === 'tbl_apply_paste'){
    const raw = ($('#tbl_paste_input').value || '').trim();
    if(!raw) return toast('⚠️ Chưa có dữ liệu để tạo bảng');
    const lines = raw.split(/\r?\n/).map(l => l.includes('\t') ? l.split('\t') : l.split(','));
    let html = '<table class="edu-tbl" border="1">';
    lines.forEach((row, rIdx) => {
      html += '<tr>';
      row.forEach((cell, cIdx) => {
        if(rIdx === 0) html += `<th>${esc(cell.trim() || `Cột ${cIdx+1}`)}</th>`;
        else html += `<td>${esc(cell.trim() || '...')}</td>`;
      });
      html += '</tr>';
    });
    html += '</table>&nbsp;';
    $('#tbl_modal').style.display = 'none';
    $('#tbl_paste_input').value = '';
    if(restore()){
      document.execCommand('insertHTML', false, html);
      last.ed.dispatchEvent(new Event('input', {bubbles:true}));
      toast(`✅ Đã tạo bảng từ ${lines.length} dòng dữ liệu`);
    }
  }
});
