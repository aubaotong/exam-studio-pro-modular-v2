/* ================= BỘ NHỚ INDEXEDDB DUNG LƯỢNG LỚN ================= */
const IDB_NAME = 'TaomaxEdTechDB_v6', IDB_STORE = 'kv';
function openIDB(){
  return new Promise((resolve, reject)=>{
    if(!window.indexedDB) return reject(new Error('No IDB'));
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = e => { const db = e.target.result; if(!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE); };
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
  });
}
async function idbSet(key, val){
  try{
    const db = await openIDB();
    await new Promise((res, rej)=>{ const tx = db.transaction(IDB_STORE, 'readwrite'); tx.objectStore(IDB_STORE).put(val, key); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
    db.close();
  }catch(e){}
}
async function idbGet(key){
  try{
    const db = await openIDB();
    const res = await new Promise((resolve, reject)=>{ const tx = db.transaction(IDB_STORE, 'readonly'); const r = tx.objectStore(IDB_STORE).get(key); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    db.close(); return res;
  }catch(e){ return undefined; }
}
function updateStorageStat(){
  try{
    const bytes = new Blob([JSON.stringify(LIB), JSON.stringify(DB)]).size;
    storageInfo = `IndexedDB: ${LIB.length} câu (${(bytes/(1024*1024)).toFixed(2)} MB)`;
  }catch(e){ storageInfo = `IndexedDB: ${LIB.length} câu`; }
}
function save(){ idbSet('exams_v1', DB); try{localStorage.setItem('exams_v1',JSON.stringify(DB))}catch(e){} updateStorageStat(); }
function saveLib(){ idbSet('qbank_v1', LIB); try{localStorage.setItem('qbank_v1',JSON.stringify(LIB))}catch(e){} updateStorageStat(); }

const mk={
  p1:()=>({s:'',o:['','','',''],k:0,pt:.25,guide:''}),
  p2:()=>({s:'',st:['','','',''],k:[true,false,true,false],pt:1,guide:''}),
  tn:()=>({s:'',ans:'',pt:.5,guide:''}),
  p3:()=>({s:'',pt:1,lines:5,guide:''})
};

function rt(p,h){
  const hasM = hasMath(h);
  return `<div class="rt-wrap"><div class="rt" contenteditable="true" spellcheck="false" data-p="${p}" style="${reqMinHeightStyle(h)}">${h||''}</div><div class="math-prev ${hasM?'show':''}"><div class="math-prev-hdr"><span>👁️ Xem trước công thức</span><button type="button" class="btn sm" data-a="packfx">⚡ Đóng gói $...$</button></div><div class="math-prev-body">${hasM?formatMathDisplay(h):''}</div></div></div>`;
}
function mrt(f,h,ph=''){
  const hasM = hasMath(h);
  return `<div class="rt-wrap"><div class="rt" contenteditable="true" spellcheck="false" data-mp="${f}" placeholder="${esc(ph)}" style="${reqMinHeightStyle(h)}">${h||''}</div><div class="math-prev ${hasM?'show':''}"><div class="math-prev-hdr"><span>👁️ Xem trước công thức</span><button type="button" class="btn sm" data-a="packfx">⚡ Đóng gói $...$</button></div><div class="math-prev-body">${hasM?formatMathDisplay(h):''}</div></div></div>`;
}
const num=(p,v,a)=>`<input type="number" step="any" min="${a||0}" data-v="${p}" data-t="n" value="${v}">`;
function total(e){return [...e.p1,...e.p2,...e.tn,...e.p3].reduce((s,q)=>s+(+q.pt||0),0)}

const MATH_PALETTE = {
  toan: [
    {l:'a/b', tex:'\\frac{a}{b}', t:'Phân số'},{l:'√x', tex:'\\sqrt{x}', t:'Căn bậc hai'},{l:'ⁿ√x', tex:'\\sqrt[n]{x}', t:'Căn bậc n'},
    {l:'xⁿ', tex:'x^{2}', t:'Lũy thừa'},{l:'xᵢ', tex:'x_{1}', t:'Chỉ số dưới'},{l:'∫f(x)dx', tex:'\\int_{a}^{b} f(x)\\,dx', t:'Tích phân'},
    {l:'lim', tex:'\\lim_{x \\to x_0} f(x)', t:'Giới hạn'},{l:'∑', tex:'\\sum_{i=1}^{n} a_i', t:'Tổng sigma'},
    {l:'Hệ PT', tex:'\\begin{cases} x + y = 2 \\\\ x - y = 0 \\end{cases}', t:'Hệ phương trình'},{l:'v⃗', tex:'\\vec{AB}', t:'Vector'},
    {l:'∠ABC', tex:'\\widehat{ABC}', t:'Góc'},{l:'logₐb', tex:'\\log_{a}{b}', t:'Logarit'},{l:'± ∞', tex:'\\pm\\infty', t:'Vô cực'},
    {l:'∈ ℝ', tex:'x \\in \\mathbb{R}', t:'Tập số thực'},{l:'≤ ≥ ≠', tex:'\\le, \\ge, \\ne, \\approx', t:'Bất đẳng thức'}
  ],
  ly: [
    {l:'x=Acos(ωt+φ)', tex:'x = A\\cos(\\omega t + \\varphi)', t:'PT dao động'},{l:'ω, φ, λ', tex:'\\omega, \\varphi, \\lambda', t:'Tần số góc, pha, bước sóng'},
    {l:'Δφ', tex:'\\Delta \\varphi = \\frac{2\\pi d}{\\lambda}', t:'Độ lệch pha'},{l:'T=2π√(m/k)', tex:'T = 2\\pi\\sqrt{\\frac{m}{k}}', t:'Chu kì con lắc lò xo'},
    {l:'F⃗=ma⃗', tex:'\\vec{F} = m\\vec{a}', t:'Định luật II Newton'},{l:'Ω (Ohm)', tex:'R = 100\\,\\Omega', t:'Điện trở'},
    {l:'μ, ε, ρ', tex:'\\mu, \\varepsilon, \\rho', t:'Hệ số vật lí'},{l:'°C / K', tex:'27^\\circ\\text{C} = 300\\,\\text{K}', t:'Nhiệt độ'},
    {l:'E=mc²', tex:'E = mc^{2}', t:'Năng lượng nghỉ'},{l:'ĐL Ohm', tex:'I = \\frac{\\mathcal{E}}{R + r}', t:'Định luật Ohm'}
  ],
  hoa: [
    {l:'H₂SO₄', tex:'\\ce{H2SO4}', t:'Công thức phân tử'},{l:'Phản ứng t°', tex:'\\ce{2H2 + O2 ->[t^\\circ] 2H2O}', t:'Phương trình có nhiệt độ'},
    {l:'Thuận nghịch ⇌', tex:'\\ce{N2 + 3H2 <=> 2NH3}', t:'Phản ứng thuận nghịch'},{l:'Kết tủa ↓', tex:'\\ce{Ag+ + Cl- -> AgCl v}', t:'Kết tủa'},
    {l:'Bay hơi ↑', tex:'\\ce{Zn + 2HCl -> ZnCl2 + H2 ^}', t:'Giải phóng khí'},{l:'Este hóa', tex:'\\ce{CH3COOH + C2H5OH <=>[H2SO4 đặc, t^\\circ] CH3COOC2H5 + H2O}', t:'Este hóa'},
    {l:'Oxi hóa-Khử', tex:'\\ce{Fe^{2+} -> Fe^{3+} + 1e}', t:'Nhường nhận e'},{l:'pH', tex:'\\text{pH} = -\\log[\\ce{H+}]', t:'Tính pH'},
    {l:'ΔH°₂₉₈', tex:'\\Delta_r H^\\circ_{298} = -890\\,\\text{kJ/mol}', t:'Enthalpy chuẩn'}
  ]
};

function richToolbar(hintText){
  const items = MATH_PALETTE[mathGroup] || [];
  return `<div class="tb">
    <div class="tb-main">
      <!-- Nhóm 1: Hoàn tác / Lịch sử -->
      <div class="tb-grp" title="Lịch sử thao tác">
        <button type="button" class="tb-btn" data-c="undo" title="Hoàn tác thao tác (Ctrl + Z)">↶ Hoàn tác</button>
        <button type="button" class="tb-btn" data-c="redo" title="Làm lại thao tác (Ctrl + Y)">↷ Làm lại</button>
      </div>

      <div class="tb-sep"></div>

      <!-- Nhóm 2: Định dạng chữ (Chuẩn Word Ribbon) -->
      <div class="tb-grp" title="Định dạng văn bản">
        <select data-f="fontName" style="border:none;background:transparent;font-size:13px;padding:3px 6px;cursor:pointer;outline:none">
          <option value="">Font chữ</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Segoe UI">Segoe UI</option>
          <option value="Roboto">Roboto</option>
        </select>
        <select data-f="fontSize" style="border:none;background:transparent;font-size:13px;padding:3px 4px;cursor:pointer;outline:none">
          <option value="">Cỡ</option>
          <option value="2">Nhỏ (10pt)</option>
          <option value="3">Chuẩn (12pt)</option>
          <option value="4">Vừa (14pt)</option>
          <option value="5">Lớn (16pt)</option>
        </select>
        <button type="button" class="tb-btn" data-c="bold" title="In đậm (Ctrl + B)"><b>B</b></button>
        <button type="button" class="tb-btn" data-c="italic" title="In nghiêng (Ctrl + I)"><i>I</i></button>
        <button type="button" class="tb-btn" data-c="underline" title="Gạch chân (Ctrl + U)"><u>U</u></button>
        <button type="button" class="tb-btn" data-c="strikeThrough" title="Gạch ngang"><s>S</s></button>
        <button type="button" class="tb-btn" data-c="subscript" title="Chỉ số dưới (Ví dụ: H₂O)">X₂</button>
        <button type="button" class="tb-btn" data-c="superscript" title="Chỉ số trên (Ví dụ: x²)">X²</button>
        <button type="button" class="tb-btn" data-c="removeFormat" title="Xóa định dạng (Clear Formatting)">🧹</button>
      </div>

      <div class="tb-sep"></div>

      <!-- Nhóm 3: Căn đoạn & Danh sách -->
      <div class="tb-grp" title="Căn lề đoạn văn">
        <button type="button" class="tb-btn" data-c="justifyLeft" title="Căn lề trái">≡</button>
        <button type="button" class="tb-btn" data-c="justifyCenter" title="Căn giữa">≢</button>
        <button type="button" class="tb-btn" data-c="justifyRight" title="Căn lề phải">≣</button>
        <button type="button" class="tb-btn" data-c="justifyFull" title="Căn đều hai bên">≡≡</button>
        <button type="button" class="tb-btn" data-c="insertUnorderedList" title="Danh sách dấu chấm">• Danh sách</button>
      </div>

      <div class="tb-sep"></div>

      <!-- Nhóm 4: Chèn đối tượng chuyên nghiệp (Bảng, Ảnh, Công thức, Đồ thị) -->
      <div class="tb-grp" title="Chèn nội dung nâng cao">
        <button type="button" class="tb-btn pri" data-a="open_tbl_modal" title="Chèn bảng số liệu (tùy chọn số dòng cột hoặc dán Excel)">📊 Bảng dữ liệu</button>
        <button type="button" class="tb-btn pri" data-a="img" title="Chèn ảnh minh họa">🖼 Ảnh</button>
        <button type="button" class="tb-btn pur" data-a="openfx" title="Mở trình biên soạn công thức Toán/Lý/Hóa LaTeX (∑)">∑ Công thức</button>
        <button type="button" class="tb-btn" data-a="ins_svg" title="Chèn đồ thị mẫu dao động / tọa độ">📈 Đồ thị</button>
      </div>

      <!-- Nhóm 5: Bộ môn & Ký hiệu nhanh -->
      <div class="row" style="margin-left:auto;gap:4px">
        <button type="button" class="btn sm ${mathGroup==='toan'?'pri':''}" data-a="mgrp" data-g="toan">📐 Toán</button>
        <button type="button" class="btn sm ${mathGroup==='ly'?'pri':''}" data-a="mgrp" data-g="ly">⚡ Vật lí</button>
        <button type="button" class="btn sm ${mathGroup==='hoa'?'pri':''}" data-a="mgrp" data-g="hoa">🧪 Hóa học</button>
        <button type="button" class="btn sm" data-a="mgrp" data-g="${mathGroup==='hide'?'toan':'hide'}">${mathGroup==='hide'?'▼ Ký hiệu':'▲ Thu gọn'}</button>
        <button type="button" class="btn sm" data-a="openshortcuts" title="Xem bảng phím tắt tiện dụng">⌨️ Phím tắt</button>
      </div>
    </div>
    ${mathGroup!=='hide'?`<div class="tb-math"><small style="color:var(--mut);font-weight:700;margin-right:4px">Ký hiệu nhanh:</small>${items.map(it=>`<button type="button" class="m-btn" data-a="insfx" data-tex="${esc(it.tex)}" title="${esc(it.t)}: ${esc(it.tex)}">${esc(it.l)}</button>`).join('')}</div>`:''}
  </div>`;
}

function head(e){
  const subjs = allSubjs();
  return `<div class="card">
    <div class="row sp">
      <input class="nm" data-v="name" value="${esc(e.name)}" placeholder="Tên kỳ thi (VD: KIỂM TRA GIỮA HỌC KỲ I)">
      <div class="row">
        <span class="hint">Tổng điểm: <b id="tot">${+total(e).toFixed(2)}</b></span>
        <button class="btn" data-a="cloneexam">📑 Nhân bản Đề</button>
        <button class="btn pri" data-a="pushalltolib">📥 Lưu vào Thư viện</button>
        <button class="btn" data-a="exp">⬇ JSON</button>
        <button class="btn x" data-a="delexam">🗑 Xóa đề</button>
      </div>
    </div>
    <div class="grid2">
      <div class="fg"><label>Cơ quan chủ quản ${II('Hiển thị ở góc trái trên của đề')}</label><input data-v="org" value="${esc(e.org)}"></div>
      <div class="fg"><label>Tên Trường / Đơn vị</label><input data-v="school" value="${esc(e.school)}"></div>
      <div class="fg"><label>Loại đề</label><input data-v="examType" value="${esc(e.examType)}"></div>
      <div class="fg"><label>Năm học</label><input data-v="year" value="${esc(e.year)}"></div>
      <div class="fg"><label>Môn học</label><select data-v="subj">${subjs.map(s=>`<option value="${esc(s)}" ${e.subj===s?'selected':''}>${esc(s)}</option>`).join('')}</select></div>
      <div class="fg"><label>Thời gian làm bài</label><input data-v="time" value="${esc(e.time)}"></div>
    </div>
    <div class="tabs">
      <button class="${tab==='edit'?'on':''}" data-a="tab" data-i="edit">✏️ Soạn đề (${e.p1.length+e.p2.length+e.tn.length+e.p3.length})</button>
      <button class="${tab==='lib'?'on':''}" data-a="tab" data-i="lib">📚 Thư viện (${LIB.length})</button>
      <button class="${tab==='codes'?'on':''}" data-a="tab" data-i="codes">🔀 Mã đề</button>
      <button class="${tab==='sheet'?'on':''}" data-a="tab" data-i="sheet">📝 OMR</button>
      <button class="${tab==='grade'?'on':''}" data-a="tab" data-i="grade">✅ Chấm</button>
    </div>
  </div>`;
}

function sec(e,s,title,body){
  return `<div class="card"><div class="row sp"><b>${title} (${e[s].length} câu)</b><div class="row"><button class="btn" data-a="openlib" data-s="${s}">📚 Từ Thư viện</button><button class="btn pri" data-a="add" data-s="${s}">+ Thêm câu</button></div></div>${e[s].length?'':'<p class="hint">∅ Trống '+II('Phần này sẽ được ẩn khỏi đề')+'</p>'}${e[s].map(body).join('')}</div>`;
}

let e0;
const qh=(s,i,extra)=>`<div class="qh"><b>Câu ${i+1}</b><label>Điểm ${num(`${s}.${i}.pt`,e0[s][i].pt)}</label>${extra||''}<button class="btn" data-a="tolib" data-s="${s}" data-i="${i}">📥 Thư viện</button><button class="btn x" data-a="del" data-s="${s}" data-i="${i}">Xóa</button></div>`;

function editor(e){
  e0=e;
  return richToolbar()
  +sec(e,'p1','Phần I · Trắc nghiệm ABCD',(q,i)=>`<div class="q">${qh('p1',i,`<label>Đáp án đúng <select data-v="p1.${i}.k" data-t="i">${'ABCD'.split('').map((c,j)=>`<option value="${j}" ${q.k===j?'selected':''}>${c}</option>`).join('')}</select></label>`)}${rt(`p1.${i}.s`,q.s)}<div class="opts">${q.o.map((o,j)=>`<div><b>${'ABCD'[j]}.</b>${rt(`p1.${i}.o.${j}`,o)}</div>`).join('')}</div></div>`)
  +sec(e,'p2',`Phần II · Đúng/Sai ${II('Mỗi câu có 4 ý a, b, c, d')}`,(q,i)=>`<div class="q">${qh('p2',i)}${rt(`p2.${i}.s`,q.s)}${q.st.map((o,j)=>`<div class="row" style="margin-top:8px;align-items:flex-start"><b>${'abcd'[j]})</b><div style="flex:1;min-width:200px">${rt(`p2.${i}.st.${j}`,o)}</div><select data-v="p2.${i}.k.${j}" data-t="b"><option value="1" ${q.k[j]?'selected':''}>Đúng</option><option value="0" ${q.k[j]?'':'selected'}>Sai</option></select></div>`).join('')}</div>`)
  +sec(e,'tn',`Phần III · Trả lời ngắn ${II('Tối đa 4 ký tự: dấu -, chữ số, dấu phẩy')}`,(q,i)=>`<div class="q">${qh('tn',i,`<label>Đáp án <input data-v="tn.${i}.ans" data-t="a" value="${esc(q.ans)}" maxlength="4" size="6" placeholder="VD -1,5"></label>`)}${rt(`tn.${i}.s`,q.s)}</div>`)
  +sec(e,'p3',`Phần IV · Tự luận ${II('Luôn nằm ở cuối đề')}`,(q,i)=>`<div class="q">${qh('p3',i,`<label>Số dòng kẻ (1–15) <input type="number" min="1" max="15" data-v="p3.${i}.lines" data-t="l" value="${q.lines}"></label>`)}${rt(`p3.${i}.s`,q.s)}</div>`);
}
