/* ================= MODULE 1 (TIẾP): TẠO MÃ ĐỀ & LUỒNG XUẤT FILE 2 BƯỚC (WORD MATHML ➔ PDF KATEX) ================= */
function gen(n){
  const e=E(), sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
  e.codes=[];
  for(let c=0;c<n;c++){
    const p1=sh(e.p1.map((_,i)=>i)).map(q=>({q,perm:sh([0,1,2,3])})),
          p2=sh(e.p2.map((_,i)=>i)).map(q=>({q,perm:sh([0,1,2,3])})),
          tn=sh(e.tn.map((_,i)=>i)).map(q=>({q}));
    e.codes.push({
      code:String(101+c), p1, p2, tn, customHtml:null,
      key:{
        tn:tn.map(x=>e.tn[x.q].ans),
        pt3:tn.map(x=>e.tn[x.q].pt),
        p1:p1.map(x=>'ABCD'[x.perm.indexOf(e.p1[x.q].k)]),
        p2:p2.map(x=>x.perm.map(j=>e.p2[x.q].k[j])),
        pt1:p1.map(x=>e.p1[x.q].pt),
        pt2:p2.map(x=>e.p2[x.q].pt)
      }
    });
  }
  e.sig=sig(e);
  e.reviewedDocx=false;
  cc=e.codes[0]&&e.codes[0].code;
  gCode=cc;
  save();
}

function getFilteredLib(){
  return LIB.filter(q=>{
    if(libFilter.subj!=='ALL' && q.subj!==libFilter.subj) return false;
    if(libFilter.lesson!=='ALL' && q.lesson!==libFilter.lesson) return false;
    if(libFilter.level!=='ALL' && q.level!==libFilter.level) return false;
    if(libFilter.type!=='ALL' && q.type!==libFilter.type) return false;
    if(libFilter.hasImg==='YES' && !hasVisual(q.s)) return false;
    if(libFilter.hasImg==='MATH' && !hasMath(q.s+(q.o||[]).join('')+(q.st||[]).join(''))) return false;
    if(libFilter.q){
      const kw = libFilter.q.toLowerCase();
      const hay = `${q.s||''} ${q.lesson||''} ${q.yccd||''} ${q.goal||''} ${q.subj||''} ${q.guide||''}`.toLowerCase();
      if(!hay.includes(kw)) return false;
    }
    return true;
  });
}
function buildStandardExamHtml(e, c, forWord=false){
  const fmt = forWord ? formatMathForWord : (editPaper ? (s=>s) : formatMathDisplay);
  if(c.customHtml) return forWord ? formatMathForWord(c.customHtml) : (editPaper ? c.customHtml : formatMathDisplay(c.customHtml));
  let h = `<table class="exam-hdr"><tr>
    <td class="left-col"><div style="font-size:11pt;text-transform:uppercase">${esc(e.org)}</div><div style="font-size:11pt;font-weight:bold;text-transform:uppercase">${esc(e.school)}</div><div class="exam-line"></div><div style="font-size:11pt;font-weight:bold;margin-top:2px">${esc(e.examType)}</div></td>
    <td class="right-col"><div style="font-size:12pt;font-weight:bold;text-transform:uppercase">${esc(e.name)}</div><div style="font-size:11pt;font-weight:bold;text-transform:uppercase">${esc(e.year)}</div><div style="font-size:11.5pt;font-weight:bold;margin-top:2px">Môn: ${esc(e.subj)}</div><div style="font-size:11pt;font-style:italic">Thời gian làm bài: ${esc(e.time)} (không kể thời gian phát đề)</div></td>
  </tr></table>
  <div class="stu-bar"><div>Họ và tên thí sinh: ......................................................... Số báo danh: ....................</div><div class="code-box">Mã đề: ${esc(c.code)}</div></div>`;

  if(c.p1.length){
    h+=`<div class="sec-title">PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn.</div><div class="sec-desc">Thí sinh trả lời từ câu 1 đến câu ${c.p1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.</div>`
      +c.p1.map((x,i)=>{
        const q=e.p1[x.q], sideMode = /data-sideopt="1"/.test(q.s||'');
        return `<div class="q-item" style="${reqMinHeightStyle(q.s)}"><b>Câu ${i+1}.</b> ${fmt(q.s)}<div class="po" style="${sideMode?'grid-template-columns:1fr;max-width:58%':''}">${x.perm.map((j,k)=>`<div><b>${'ABCD'[k]}.</b> ${fmt(q.o[j])}</div>`).join('')}</div></div>`;
      }).join('');
  }
  if(c.p2.length){
    h+=`<div class="sec-title">PHẦN II. Câu trắc nghiệm đúng sai.</div><div class="sec-desc">Thí sinh trả lời từ câu 1 đến câu ${c.p2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.</div>`
      +c.p2.map((x,i)=>{
        const q=e.p2[x.q];
        return `<div class="q-item" style="${reqMinHeightStyle(q.s)}"><b>Câu ${i+1}.</b> ${fmt(q.s)}<div style="margin-left:16px">${x.perm.map((j,k)=>`<div><b>${'abcd'[k]})</b> ${fmt(q.st[j])}</div>`).join('')}</div></div>`;
      }).join('');
  }
  if((c.tn||[]).length){
    h+=`<div class="sec-title">PHẦN III. Câu trắc nghiệm trả lời ngắn.</div><div class="sec-desc">Thí sinh trả lời từ câu 1 đến câu ${c.tn.length}.</div>`
      +c.tn.map((x,i)=>{
        const q=e.tn[x.q];
        return `<div class="q-item" style="${reqMinHeightStyle(q.s)}"><b>Câu ${i+1}.</b> ${fmt(q.s)}</div>`;
      }).join('');
  }
  if(e.p3.length){
    const rom = (c.tn||[]).length ? 'IV' : 'III';
    h+=`<div class="sec-title">PHẦN ${rom}. Tự luận.</div>`+e.p3.map((q,i)=>`<div class="q-item" style="${reqMinHeightStyle(q.s)}"><b>Câu ${i+1}.</b> (${q.pt} điểm) ${fmt(q.s)}</div>`).join('');
  }
  h+=`<div style="text-align:center;font-weight:bold;margin-top:16px;clear:both">---------------- HẾT ----------------</div><div style="text-align:center;font-style:italic;font-size:10.5pt;margin-top:4px">- Thí sinh không được sử dụng tài liệu; Cán bộ coi thi không giải thích gì thêm.</div>`;
  return h;
}

function prev(e,c){
  const k=c.key;
  let h = `<div class="paper" id="paper_preview" contenteditable="${editPaper?'true':'false'}">${buildStandardExamHtml(e,c,false)}</div>`;
  if(k.p1.length) h+=`<b>Bảng Đáp án Phần I (Mã đề ${c.code})</b><div style="overflow-x:auto"><table class="k"><tr><th>Câu</th>${k.p1.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>ĐA</th>${k.p1.map(a=>`<td><b>${a}</b></td>`).join('')}</tr></table></div>`;
  if(k.p2.length) h+=`<b>Bảng Đáp án Phần II (Mã đề ${c.code})</b><div style="overflow-x:auto"><table class="k"><tr><th>Câu</th><th>a)</th><th>b)</th><th>c)</th><th>d)</th></tr>${k.p2.map((r,i)=>`<tr><td><b>${i+1}</b></td>${r.map(v=>`<td>${v?'Đ':'S'}</td>`).join('')}</tr>`).join('')}</table></div>`;
  if((k.tn||[]).length) h+=`<b>Bảng Đáp án Phần III (Mã đề ${c.code})</b><div style="overflow-x:auto"><table class="k"><tr><th>Câu</th>${k.tn.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>ĐA</th>${k.tn.map(a=>`<td><b>${a}</b></td>`).join('')}</tr></table></div>`;
  return h;
}

function codesView(e){
  const c=e.codes.find(x=>x.code===cc)||e.codes[0];
  return `<div class="card">
    <div class="row sp">
      <div class="row"><label>Số mã đề <input type="number" id="nc" min="1" max="24" value="${e.codes.length||4}"></label><button class="btn pri" data-a="gen">🔀 Tạo mã đề</button></div>
      <span class="hint">🔀 ➔ 📝 (Word MathML) ➔ 🚀 (PDF KaTeX)</span>
    </div>
    ${e.codes.length&&e.sig!==sig(e)?'<div class="warn-box">⚠️ Đề gốc đã thay đổi sau khi tạo mã đề. Bấm “Tạo mã đề” để trộn lại.</div>':''}
    ${e.codes.length?`<div class="row" style="margin-top:12px;align-items:stretch">
      <div class="step-box active">
        <b>1 · 📝 Word (.doc chuẩn MathML) & Rà soát</b>
        <div class="row" style="margin-top:6px">
          <button class="btn pri" data-a="docde">📝 Đề .doc</button>
          <button class="btn" data-a="dockey">📝 Đáp án .doc</button>
          <button class="btn ${editPaper?'warn':''}" data-a="toggleedit">${editPaper?'💾 Lưu sửa':'✏️ Sửa'}</button>
        </div>
        <label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:13px;cursor:pointer"><input type="checkbox" data-a="chkreview" ${e.reviewedDocx?'checked':''}><span>✔ Đã rà soát xong</span></label>
      </div>
      <div class="step-box ${e.reviewedDocx?'active':''}">
        <b>2 · 🚀 PDF chốt (KaTeX sắc nét)</b>
        <p class="hint" style="margin:4px 0 8px">${e.reviewedDocx?'🔓 Đã mở khóa xuất PDF':'🔒 Hoàn thành Bước 1 để mở khóa'}</p>
        <div class="row">
          <button class="btn ok" data-a="pdfde" ${e.reviewedDocx?'':'disabled'}>⬇ Đề PDF</button>
          <button class="btn ok" data-a="pdfkey" ${e.reviewedDocx?'':'disabled'}>⬇ Đáp án PDF</button>
          <button class="btn" data-a="exp" ${e.reviewedDocx?'':'disabled'}>📦 JSON</button>
        </div>
      </div>
    </div>`:''}
  </div>`
  +(c?`<div class="card"><div class="row sp"><div class="tabs" style="margin:0">${e.codes.map(x=>`<button class="${x.code===c.code?'on':''}" data-a="code" data-i="${x.code}">Mã đề ${x.code}</button>`).join('')}</div>${c.customHtml?`<button class="btn x" data-a="resetcustom">↺ Khôi phục bố cục</button>`:''}</div>${prev(e,c)}</div>`:'<div class="empty">📭 Chưa có mã đề</div>');
}

async function exportWord(kind){
  const e=E(); if(!e||!e.codes.length) return toast('Hãy tạo mã đề trước.');
  const styles = `<style>@page{size:21cm 29.7cm;margin:1.8cm 1.8cm 1.8cm 2cm}body{font-family:'Times New Roman',Times,serif;font-size:12pt;line-height:1.4;color:#000}table.exam-hdr{width:100%;border-collapse:collapse;margin-bottom:10px}table.exam-hdr td{text-align:center;vertical-align:top;border:none}.stu-bar{border-top:1px solid #000;border-bottom:1px solid #000;padding:6px 0;margin:8px 0 12px}.code-box{border:1.5pt solid #000;padding:2px 8px;font-weight:bold}.sec-title{font-weight:bold;margin-top:10px;clear:both}.sec-desc{font-style:italic;margin-bottom:6px;clear:both}.q-item{position:relative;margin:8px 0;text-align:justify;clear:both}.iw[data-mode="fright"]{float:right;margin:4px 0 8px 14px}.iw[data-mode="fleft"]{float:left;margin:4px 14px 8px 0}.iw[data-mode="center"]{display:table;margin:8px auto}.iw[data-mode="inline"]{display:inline-block;vertical-align:middle}.iw[data-mode="free"]{position:absolute}table.k{border-collapse:collapse;width:100%;margin:8px 0}table.k th,table.k td{border:1px solid #000;padding:4px;text-align:center}</style>`;
  let bodyHtml = '';
  e.codes.forEach((c, idx) => {
    if(kind==='de') bodyHtml += `<div>${buildStandardExamHtml(e, c, true)}</div>`;
    else {
      const k=c.key;
      bodyHtml += `<h3 style="text-align:center">${esc(e.name)} – BẢNG ĐÁP ÁN MÃ ĐỀ ${c.code}</h3>`;
      if(k.p1.length) bodyHtml+=`<p><b>Phần I:</b></p><table class="k"><tr><th>Câu</th>${k.p1.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>Đáp án</th>${k.p1.map(a=>`<td><b>${a}</b></td>`).join('')}</tr></table>`;
      if(k.p2.length) bodyHtml+=`<p><b>Phần II:</b></p><table class="k"><tr><th>Câu</th><th>a)</th><th>b)</th><th>c)</th><th>d)</th></tr>${k.p2.map((r,i)=>`<tr><td><b>${i+1}</b></td>${r.map(v=>`<td>${v?'Đ':'S'}</td>`).join('')}</tr>`).join('')}</table>`;
      if((k.tn||[]).length) bodyHtml+=`<p><b>Phần III:</b></p><table class="k"><tr><th>Câu</th>${k.tn.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>Đáp án</th>${k.tn.map(a=>`<td><b>${a}</b></td>`).join('')}</tr></table>`;
    }
    if(idx < e.codes.length - 1) bodyHtml += `<br clear="all" style="page-break-before:always">`;
  });
  const fullDoc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">${styles}</head><body>${bodyHtml}</body></html>`;
  e.reviewedDocx = true; save(); render();
  await dlBlob((kind==='de'?'De-thi-MathML-':'Dap-an-')+e.id+'.doc', new Blob(['\ufeff', fullDoc], {type: 'application/msword'}));
  toast('✅ Đã xuất Word (.doc kèm MathML) · mở khóa PDF chốt');
}
