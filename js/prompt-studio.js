/* ================= PROMPT STUDIO ĐA MÔN & NHÂN RỘNG BIẾN THỂ ================= */
function buildDynamicGemPrompt(){
  const g = gemCfg;
  const isStemSubj = ['Toán','Vật lí','Hóa học','Sinh học','Khoa học tự nhiên','Tin học','Công nghệ','Địa lí'].includes(g.subj);
  const isChem = g.subj === 'Hóa học' || g.subj === 'Khoa học tự nhiên';
  const varTechs = [
    g.var_num ? '- Đổi số liệu / thông số đầu vào nhưng giữ nguyên bản chất và phương pháp giải.' : '',
    g.var_ctx ? '- Đổi ngữ cảnh thực tế / tình huống ứng dụng mới mẻ gắn với đời sống.' : '',
    g.var_rev ? '- Hỏi ngược dữ kiện (cho kết quả / đại lượng cuối, yêu cầu tìm thông số ban đầu).' : '',
    g.var_fmt ? '- Chuyển đổi định dạng câu hỏi trên cùng đơn vị kiến thức (biến đổi qua lại giữa P1 ABCD, P2 Đúng/Sai, TN Trả lời ngắn).' : '',
    g.var_dis ? '- Giữ nguyên trọng tâm câu hỏi nhưng thiết kế lại các phương án nhiễu hợp lý dựa trên lỗi sai phổ biến.' : ''
  ].filter(Boolean).join('\n');

  const reqCounts = [
    g.p1_NB?`- Phần I (LOAI: P1 - ABCD): ${g.p1_NB} câu MUCDO: NB`:'', g.p1_TH?`- Phần I (LOAI: P1 - ABCD): ${g.p1_TH} câu MUCDO: TH`:'', g.p1_VD?`- Phần I (LOAI: P1 - ABCD): ${g.p1_VD} câu MUCDO: VD`:'', g.p1_VDC?`- Phần I (LOAI: P1 - ABCD): ${g.p1_VDC} câu MUCDO: VDC`:'',
    g.p2_NB?`- Phần II (LOAI: P2 - Đúng/Sai 4 ý a,b,c,d): ${g.p2_NB} câu MUCDO: NB`:'', g.p2_TH?`- Phần II (LOAI: P2 - Đúng/Sai 4 ý a,b,c,d): ${g.p2_TH} câu MUCDO: TH`:'', g.p2_VD?`- Phần II (LOAI: P2 - Đúng/Sai 4 ý a,b,c,d): ${g.p2_VD} câu MUCDO: VD`:'', g.p2_VDC?`- Phần II (LOAI: P2 - Đúng/Sai 4 ý a,b,c,d): ${g.p2_VDC} câu MUCDO: VDC`:'',
    g.tn_NB?`- Phần III (LOAI: TN - Trả lời ngắn <= 4 ký tự): ${g.tn_NB} câu MUCDO: NB`:'', g.tn_TH?`- Phần III (LOAI: TN - Trả lời ngắn <= 4 ký tự): ${g.tn_TH} câu MUCDO: TH`:'', g.tn_VD?`- Phần III (LOAI: TN - Trả lời ngắn <= 4 ký tự): ${g.tn_VD} câu MUCDO: VD`:'', g.tn_VDC?`- Phần III (LOAI: TN - Trả lời ngắn <= 4 ký tự): ${g.tn_VDC} câu MUCDO: VDC`:'',
    g.p3_NB?`- Phần IV (LOAI: TL - Tự luận): ${g.p3_NB} câu MUCDO: NB`:'', g.p3_TH?`- Phần IV (LOAI: TL - Tự luận): ${g.p3_TH} câu MUCDO: TH`:'', g.p3_VD?`- Phần IV (LOAI: TL - Tự luận): ${g.p3_VD} câu MUCDO: VD`:'', g.p3_VDC?`- Phần IV (LOAI: TL - Tự luận): ${g.p3_VDC} câu MUCDO: VDC`:''
  ].filter(Boolean).join('\n');

  return `Bạn là "Siêu Trợ Lý Khảo Thí & Xây Dựng Ngân Hàng Câu Hỏi Chuẩn GDPT 2018 (Pro v6)".
Hãy thiết kế bộ câu hỏi chất lượng cao, chính xác tuyệt đối theo khung đặc tả sau:

1. THÔNG TIN MÔN HỌC & MỤC ĐÍCH ĐÁNH GIÁ:
- Môn học: ${g.subj} (${g.grade})
- Bài học / Chủ đề: ${g.lesson}
- Mục đích đánh giá: ${g.purpose}
- Nội dung trọng tâm / Yêu cầu cần đạt (YCCĐ) / Ngữ liệu gốc:
${g.context || '(Bám sát chuẩn Yêu cầu cần đạt chương trình GDPT 2018 của bài học trên)'}

2. KHUNG MA TRẬN SỐ LƯỢNG CÂU HỎI GỐC CẦN TẠO:
${reqCounts || '- Tạo đầy đủ 4 phần: P1 (ABCD), P2 (Đúng/Sai), TN (Trả lời ngắn), TL (Tự luận) phân hóa từ NB, TH đến VD, VDC.'}

3. CHẾ ĐỘ NHÂN RỘNG NGÂN HÀNG ĐỀ (${g.variants > 1 ? `TẠO ${g.variants} BIẾN THỂ CHO MỖI ĐƠN VỊ KIẾN THỨC` : '1 CÂU / ĐƠN VỊ KIẾN THỨC'}):
${g.variants > 1 ? `Với mỗi câu hỏi / đơn vị kiến thức trong khung trên, hãy nhân rộng thành ${g.variants} câu hỏi biến thể độc lập bằng các kỹ thuật sau:\n${varTechs || '- Biến đổi số liệu và ngữ cảnh tương đương.'}` : '- Thiết kế câu hỏi chuẩn mực, độ nhiễu tốt, bám sát thực tiễn.'}

4. QUY TẮC CÔNG THỨC, HÌNH VẼ & KIỂM ĐỊNH ĐỘ CHÍNH XÁC:
${isStemSubj ? `- Mọi công thức Toán/Lý/Hóa bắt buộc bọc trong cặp dấu $...$ (ví dụ: $x = A\\cos(\\omega t + \\varphi)$, $\\int_{0}^{1} x^2\\,dx$).${isChem ? ' Phương trình và công thức Hóa học dùng cú pháp mhchem $\\ce{...}$ (ví dụ: $\\ce{Fe + 2HCl -> FeCl2 + H2 ^}$).' : ''}` : '- Trình bày văn phong chuẩn mực, ngữ liệu rõ ràng, chính xác.'}
${g.opt_svg && isStemSubj ? '- Với các câu hỏi có đồ thị, hình học, mạch điện, thí nghiệm hoặc sơ đồ: Hãy nhúng trực tiếp mã <svg width="300" height="160" viewBox="0 0 300 160" style="background:#fff">...</svg> rõ nét vào trong trường NOIDUNG.' : '- Không chèn mã <svg> nếu câu hỏi thuần văn bản/ngữ liệu không cần hình vẽ.'}
- Đối với LOAI: TN (Trả lời ngắn): Trường DAPAN chỉ chứa tối đa 4 ký tự gồm dấu trừ (-), chữ số và dấu phẩy thập phân (ví dụ: -1,5 hoặc 20,4).
${g.opt_solve ? '- BẮT BUỘC tự giải và kiểm tra lại từng bước tính toán trong trường LOIGIAI trước khi chốt DAPAN để đảm bảo không có sai sót số học.' : ''}
${g.opt_batch ? '- Nếu số lượng câu lớn, hãy xuất cuốn chiếu trọn vẹn từng đợt 10-15 câu chất lượng cao và nhắc gõ "Tiếp" ở cuối.' : ''}

5. ĐỊNH DẠNG ĐẦU RA BẮT BUỘC (KHÔNG BỌC TRONG MARKDOWN, MỖI THẺ TRÊN 1 DÒNG RIÊNG):
===QUESTION===
MON: ${g.subj}
BAI: ${g.lesson}
MUCDO: NB | TH | VD | VDC
MUCDICH: ${g.purpose}
YCCD: (Mô tả ngắn gọn yêu cầu cần đạt / kỹ năng cần đo của câu này)
LOAI: P1 | P2 | TN | TL
DIEM: 0.25 | 1.0 | 0.5 | 1.0
NOIDUNG: (Nội dung câu dẫn, công thức $...$ hoặc hình <svg> nếu có)
A: (Phương án A hoặc Mệnh đề a nếu là P1/P2; bỏ trống nếu là TN/TL)
B: (Phương án B hoặc Mệnh đề b)
C: (Phương án C hoặc Mệnh đề c)
D: (Phương án D hoặc Mệnh đề d)
DAPAN: (P1 ghi A/B/C/D; P2 ghi Đ,S,Đ,S; TN ghi số tối đa 4 ký tự như 12,5; TL ghi tóm tắt đáp án)
LOIGIAI: (Hướng dẫn giải chi tiết và kiểm chứng đáp án)
===END===`;
}

const SAMPLE_PASTE_V3 = `===QUESTION===
MON: Vật lí
BAI: Bài 1: Dao động điều hòa
MUCDO: NB
MUCDICH: Kiểm tra khái niệm & đại lượng cơ bản
YCCD: Nêu được định nghĩa dao động điều hòa và nhận diện các đại lượng trong phương trình li độ.
LOAI: P1
DIEM: 0.25
NOIDUNG: Một chất điểm dao động điều hòa có phương trình li độ $x = A\\cos(\\omega t + \\varphi)$ ($A > 0, \\omega > 0$). Đại lượng $\\omega$ được gọi là:
A: Biên độ dao động
B: Tần số góc của dao động
C: Pha ban đầu của dao động
D: Chu kì của dao động
DAPAN: B
LOIGIAI: Trong phương trình dao động điều hòa $x = A\\cos(\\omega t + \\varphi)$, $\\omega$ (đơn vị rad/s) là tần số góc của dao động.
===END===
===QUESTION===
MON: Vật lí
BAI: Bài 1: Dao động điều hòa
MUCDO: TH
MUCDICH: Đọc và phân tích đồ thị
YCCD: Xác định được biên độ và chu kì từ đồ thị li độ - thời gian của dao động điều hòa.
LOAI: P1
DIEM: 0.25
NOIDUNG: <span class="iw" contenteditable="false" data-mode="fright" data-bordered="1" style="width:260px"><svg width="320" height="160" viewBox="0 0 320 160" style="background:#fff"><line x1="30" y1="80" x2="300" y2="80" stroke="#334155" stroke-width="1.5"/><line x1="40" y1="15" x2="40" y2="145" stroke="#334155" stroke-width="1.5"/><path d="M 40 30 C 65 30, 75 130, 100 130 C 125 130, 135 30, 160 30 C 185 30, 195 130, 220 130 C 245 130, 255 30, 280 30" fill="none" stroke="#1d4ed8" stroke-width="2.5"/><line x1="160" y1="30" x2="160" y2="80" stroke="#dc2626" stroke-dasharray="4,3"/><text x="15" y="34" font-size="12" font-family="Arial" fill="#0f172a">6</text><text x="10" y="134" font-size="12" font-family="Arial" fill="#0f172a">-6</text><text x="28" y="95" font-size="12" font-family="Arial" fill="#0f172a">O</text><text x="150" y="96" font-size="12" font-family="Arial" fill="#dc2626">0,4</text><text x="282" y="96" font-size="12" font-family="Arial" fill="#0f172a">t (s)</text><text x="45" y="22" font-size="12" font-family="Arial" fill="#0f172a">x (cm)</text></svg></span>Quan sát đồ thị li độ – thời gian $x(t)$ của một vật dao động điều hòa như hình vẽ bên. Biên độ dao động $A$ và chu kì $T$ của vật lần lượt là:
A: $A = 6\\,\\text{cm};\\ T = 0,4\\,\\text{s}$
B: $A = 12\\,\\text{cm};\\ T = 0,4\\,\\text{s}$
C: $A = 6\\,\\text{cm};\\ T = 0,2\\,\\text{s}$
D: $A = 3\\,\\text{cm};\\ T = 0,8\\,\\text{s}$
DAPAN: A
LOIGIAI: Từ đồ thị, li độ cực đại là $A = 6\\,\\text{cm}$. Khoảng thời gian ngắn nhất giữa hai lần vật ở biên dương từ $t = 0$ đến $t = 0,4\\,\\text{s}$ là một chu kì $T = 0,4\\,\\text{s}$.
===END===
===QUESTION===
MON: Vật lí
BAI: Bài 2: Động năng và Thế năng. Con lắc lò xo
MUCDO: VD
MUCDICH: Tính toán vận dụng thực tế
YCCD: Vận dụng được công thức tần số góc và năng lượng con lắc lò xo để phân tích chuyển động.
LOAI: P2
DIEM: 1.0
NOIDUNG: Một con lắc lò xo nằm ngang gồm lò xo có độ cứng $k = 100\\,\\text{N/m}$ và vật nhỏ khối lượng $m = 250\\,\\text{g}$ dao động điều hòa không ma sát quanh vị trí cân bằng $O$ dọc theo trục $Ox$ với biên độ $A = 4\\,\\text{cm}$ như hình vẽ:
<span class="iw" contenteditable="false" data-mode="center" data-bordered="1" style="width:320px"><svg width="340" height="120" viewBox="0 0 340 120" style="background:#fff"><rect x="15" y="20" width="12" height="70" fill="#64748b"/><line x1="15" y1="90" x2="320" y2="90" stroke="#334155" stroke-width="2"/><polyline points="27,65 45,65 52,50 66,80 80,50 94,80 108,50 122,80 130,65 155,65" fill="none" stroke="#0f172a" stroke-width="2"/><rect x="155" y="45" width="44" height="40" rx="4" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1.5"/><text x="170" y="70" font-size="13" font-weight="bold" fill="#fff">m</text><line x1="177" y1="85" x2="177" y2="96" stroke="#dc2626" stroke-width="2"/><text x="172" y="110" font-size="12" font-weight="bold" fill="#dc2626">O</text><text x="115" y="110" font-size="12" fill="#0f172a">-A (-4cm)</text><text x="225" y="110" font-size="12" fill="#0f172a">+A (+4cm)</text><text x="305" y="108" font-size="12" font-weight="bold" fill="#0f172a">x</text></svg></span>
Xét tính đúng/sai của các mệnh đề dưới đây:
A: Tần số góc của con lắc lò xo là $\\omega = 20\\,\\text{rad/s}$.
B: Cơ năng dao động của con lắc bằng $0,08\\,\\text{J}$.
C: Khi vật ở vị trí có li độ $x = 2\\,\\text{cm}$ thì động năng của vật bằng $0,06\\,\\text{J}$.
D: Thời gian ngắn nhất để vật đi từ vị trí $x = 2\\,\\text{cm}$ đến vị trí biên $x = 4\\,\\text{cm}$ là $\\frac{\\pi}{40}\\,\\text{s}$.
DAPAN: Đ,Đ,Đ,S
LOIGIAI: a) Đúng vì $\\omega = \\sqrt{k/m} = \\sqrt{100/0,25} = 20\\,\\text{rad/s}$. b) Đúng vì $W = \\frac{1}{2}kA^2 = 0,08\\,\\text{J}$. c) Đúng vì $W_đ = W - W_t = 0,06\\,\\text{J}$. d) Sai vì từ $x = A/2$ đến $x = A$ hết $T/6 = \\frac{\\pi}{60}\\,\\text{s}$.
===END===
===QUESTION===
MON: Toán
BAI: Bài 1: Nguyên hàm và Tích phân
MUCDO: VD
MUCDICH: Tính toán tích phân xác định
YCCD: Tính được tích phân xác định của hàm đa thức cơ bản.
LOAI: TN
DIEM: 0.5
NOIDUNG: Biết giá trị của tích phân $I = \\int_{0}^{2} (3x^2 - 2x + 1)\\,dx$ bằng một số nguyên. Hãy tính giá trị của $I$.
DAPAN: 6
LOIGIAI: Ta có $I = \\left.(x^3 - x^2 + x)\\right|_{0}^{2} = (2^3 - 2^2 + 2) - 0 = 6$.
===END===
===QUESTION===
MON: Toán
BAI: Bài 2: Ứng dụng đạo hàm để khảo sát hàm số
MUCDO: TH
MUCDICH: Tìm cực trị hàm số
YCCD: Tìm được điểm cực đại, cực tiểu của hàm số bậc ba.
LOAI: P1
DIEM: 0.25
NOIDUNG: Cho hàm số $y = x^3 - 3x + 2$. Điểm cực đại của hàm số đã cho là:
A: $x = -1$
B: $x = 1$
C: $x = 2$
D: $x = 4$
DAPAN: A
LOIGIAI: Ta có $y' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Vì $y''(-1) = -6 < 0$ nên $x = -1$ là điểm cực đại.
===END===
===QUESTION===
MON: Hóa học
BAI: Bài 1: Ester – Lipid
MUCDO: TH
MUCDICH: Viết phương trình & đặc điểm phản ứng ester hóa
YCCD: Trình bày được phản ứng điều chế ethyl acetate và vai trò xúc tác.
LOAI: P1
DIEM: 0.25
NOIDUNG: Cho phản ứng điều chế ester trong phòng thí nghiệm: $\\ce{CH3COOH + C2H5OH <=>[H2SO4 đặc, t^\\circ] CH3COOC2H5 + H2O}$. Chất vừa đóng vai trò xúc tác, vừa hút nước để cân bằng chuyển dịch theo chiều thuận là:
A: $\\ce{H2SO4}$ đặc
B: $\\ce{NaOH}$ đặc
C: $\\ce{HCl}$ loãng
D: $\\ce{CaCO3}$
DAPAN: A
LOIGIAI: Phản ứng ester hóa thuận nghịch; $\\ce{H2SO4}$ đặc vừa làm xúc tác vừa hút nước làm cân bằng chuyển dịch theo chiều thuận.
===END===
===QUESTION===
MON: Tiếng Anh
BAI: Unit 1: Life Stories We Admire
MUCDO: TH
MUCDICH: Kiểm tra ngữ pháp (Past Continuous vs Past Simple)
YCCD: Phân biệt và sử dụng đúng thì Quá khứ đơn và Quá khứ tiếp diễn trong ngữ cảnh.
LOAI: P1
DIEM: 0.25
NOIDUNG: While Steve Jobs ______ in his parents' garage, he co-founded Apple Computer with Steve Wozniak.
A: was working
B: is working
C: has worked
D: works
DAPAN: A
LOIGIAI: Cấu trúc "While + S + V (Past Continuous), S + V (Past Simple)" diễn tả hành động đang diễn ra trong quá khứ thì hành động khác xen vào.
===END===`;

function normalizeVisuals(html){
  if(!html) return '';
  const d = document.createElement('div'); d.innerHTML = html;
  $$('svg', d).forEach(svg => {
    if(!svg.closest('.iw')){
      const w = svg.getAttribute('width') || 280, sp = document.createElement('span');
      sp.className = 'iw'; sp.contentEditable = 'false'; sp.dataset.mode = 'fright'; sp.dataset.bordered = '1'; sp.style.width = w + 'px';
      svg.parentNode.insertBefore(sp, svg); sp.appendChild(svg);
    }
  });
  return d.innerHTML;
}

function parseGemInput(raw, defaultSubj){
  raw = (raw||'').trim();
  if(!raw) return {items:[], added:0, dupCount:0, errCount:0, errors:[]};
  raw = raw.replace(/^```[a-zA-Z]*\s*\n?/gm, '').replace(/```$/gm, '').trim();
  if(raw.startsWith('[') || raw.startsWith('{')){
    try{
      const arr = JSON.parse(raw), items = (Array.isArray(arr)?arr:[arr]).map(x=>({...x, id:uid()}));
      return {items, added:items.length, dupCount:0, errCount:0, errors:[]};
    }catch(e){}
  }
  const existingNorms = new Set(LIB.map(q=>normPlainText(q.s)));
  const blocks = raw.split(/===QUESTION===/i).map(x=>x.split(/===END===/i)[0].trim()).filter(Boolean);
  const out = [], errors = []; let dupCount = 0;
  const TAGS = 'MON|BAI|MUCDO|MUCDICH|YCCD|LOAI|DIEM|NOIDUNG|A|B|C|D|DAPAN|LOIGIAI|HUONGDAN';
  blocks.forEach((b, idx) => {
    const get = (tag) => {
      const re = new RegExp(`(?:^|\\n)\\s*${tag}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${TAGS})\\s*:|$)`, 'i');
      const m = b.match(re); return m ? m[1].trim() : '';
    };
    const subj = get('MON') || defaultSubj || 'Vật lí';
    const lesson = get('BAI') || 'Chưa phân loại bài';
    const levelRaw = (get('MUCDO')||'NB').toUpperCase().split(/[|\s]/)[0];
    const level = ['NB','TH','VD','VDC'].includes(levelRaw) ? levelRaw : 'NB';
    const goal = get('MUCDICH') || '', yccd = get('YCCD') || '';
    const typeRaw = (get('LOAI')||'P1').toUpperCase().split(/[|\s]/)[0];
    const type = ({'P1':'p1','P2':'p2','TN':'tn','P3':'p3','TL':'p3'})[typeRaw] || 'p1';
    const pt = parseFloat((get('DIEM')||'').replace(',','.')) || (type==='p1'?0.25:type==='p2'?1:type==='tn'?0.5:1);
    const s = normalizeVisuals(get('NOIDUNG'));
    if(!s){ errors.push(`Block #${idx+1}: Thiếu NOIDUNG`); return; }
    const norm = normPlainText(s);
    if(norm && existingNorms.has(norm)){ dupCount++; return; }
    if(norm) existingNorms.add(norm);
    const oA = get('A'), oB = get('B'), oC = get('C'), oD = get('D'), ansRaw = get('DAPAN'), guide = get('LOIGIAI') || get('HUONGDAN') || '';
    const item = {id:uid(), subj, lesson, level, goal, yccd, type, pt, s, guide};
    if(type==='p1'){
      item.o = [oA, oB, oC, oD];
      const mAns = (ansRaw||'A').toUpperCase().match(/[ABCD]/);
      item.k = mAns ? 'ABCD'.indexOf(mAns[0]) : 0;
    } else if(type==='p2'){
      item.st = [oA, oB, oC, oD];
      const parts = ansRaw.split(/[,;\s|]+/).filter(Boolean);
      item.k = [0,1,2,3].map(i=>{ const v = (parts[i]||'Đ').toUpperCase(); return v.startsWith('Đ') || v.startsWith('D') || v==='TRUE' || v==='1'; });
    } else if(type==='tn'){
      item.ans = ansRaw.replace(/\./g,',').replace(/\s/g,'').slice(0,4);
    } else { item.lines = 6; if(!item.guide && ansRaw) item.guide = ansRaw; }
    out.push(item);
  });
  return {items:out, added:out.length, dupCount, errCount:errors.length, errors};
}

function inspectDraftQuality(){
  const issues = [], plainStem = normPlainText(M.s);
  if(!plainStem) issues.push('❌ Chưa nhập nội dung đề bài (câu dẫn).');
  const checkDollar = (txt, label) => {
    const cnt = ((txt||'').replace(/\$\$/g,'').match(/\$/g)||[]).length;
    if(cnt % 2 !== 0) issues.push(`⚠️ ${label}: Số dấu $ công thức LaTeX đang bị lẻ (${cnt} dấu $) — hãy đóng đủ cặp $...$.`);
  };
  checkDollar(M.s, 'Đề bài');
  if(M.type==='p1'){
    const opts = M.o.map(x=>normPlainText(x));
    opts.forEach((o,i)=>{ if(!o) issues.push(`❌ Phương án ${'ABCD'[i]} đang để trống.`); checkDollar(M.o[i], `Phương án ${'ABCD'[i]}`); });
    const nonEmpty = opts.filter(Boolean);
    if(new Set(nonEmpty).size !== nonEmpty.length) issues.push('⚠️ Có ít nhất 2 phương án A, B, C, D bị trùng nội dung.');
  } else if(M.type==='p2'){
    M.st.forEach((st,i)=>{ if(!normPlainText(st)) issues.push(`❌ Mệnh đề ${'abcd'[i]}) đang để trống.`); checkDollar(st, `Mệnh đề ${'abcd'[i]})`); });
  } else if(M.type==='tn'){
    const a = (M.ans||'').replace(/\./g,',').trim();
    if(!a) issues.push('❌ Chưa nhập đáp án số cho câu Trả lời ngắn.');
    else if(a.length > 4 || !/^-?\d+(,\d+)?$/.test(a)) issues.push(`❌ Đáp án trả lời ngắn "${a}" sai định dạng OMR (chỉ dùng -, chữ số, dấu phẩy và <= 4 ký tự).`);
  }
  if((M.level==='VD' || M.level==='VDC') && !M.yccd.trim()) issues.push('⚠️ Câu mức Vận dụng / Vận dụng cao nên điền rõ Yêu cầu cần đạt (YCCĐ).');
  if(!M.guide || !normPlainText(M.guide)) issues.push('💡 Gợi ý: Nên bổ sung Lời giải / Giải thích đáp án để kiểm chứng độ chính xác.');
  if(plainStem){
    const dup = LIB.find(q => q.id !== M.editId && normPlainText(q.s) === plainStem);
    if(dup) issues.push(`⚠️ Nội dung đề bài trùng với 1 câu đã có trong Thư viện (${dup.subj} · ${dup.lesson}).`);
  }
  return issues;
}

function manualBuilderHtml(e){
  const subjs = allSubjs(), knownLessons = [...new Set(LIB.filter(q=>q.subj===M.subj).map(q=>q.lesson))];
  const knownGoals = ['Kiểm tra khái niệm & công thức','Thông hiểu bản chất / hiện tượng','Đọc và phân tích đồ thị / bảng biểu','Tính toán vận dụng','Vận dụng thực tiễn / Liên môn','Đọc hiểu ngữ liệu','Ngữ pháp & Từ vựng'];
  return `<div class="card" style="border:2px solid var(--pri)">
    <div class="row sp" style="margin-bottom:8px">
      <b>✍️ ${M.editId ? 'CHỈNH SỬA CÂU HỎI TRONG THƯ VIỆN' : 'SOẠN CÂU HỎI MỚI VÀO NGÂN HÀNG ĐỀ'}</b>
      <div class="row">
        <button class="btn" data-a="checkmanual">🔍 Kiểm định chất lượng</button>
        ${M.editId ? `<button class="btn x" data-a="cancelmedit">✕ Hủy sửa</button>` : ''}
        <button class="btn" data-a="libmode" data-m="none">Thu gọn ▲</button>
      </div>
    </div>
    ${checkReport ? `<div class="${checkReport.some(x=>x.startsWith('❌'))?'warn-box':'ok-box'}"><b>Kết quả kiểm định:</b><ul style="margin:4px 0 0 18px;padding:0">${checkReport.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
    ${richToolbar()}
    <div class="grid3">
      <div class="fg"><label>Môn học</label><input list="subj_list" data-mf="subj" value="${esc(M.subj)}"><datalist id="subj_list">${subjs.map(s=>`<option value="${esc(s)}">`).join('')}</datalist></div>
      <div class="fg"><label>Bài học / Chủ đề</label><input list="lesson_list" data-mf="lesson" value="${esc(M.lesson)}"><datalist id="lesson_list">${knownLessons.map(l=>`<option value="${esc(l)}">`).join('')}</datalist></div>
      <div class="fg"><label>Loại câu hỏi</label><select data-mf="type">${Object.entries(TYPES).map(([k,v])=>`<option value="${k}" ${M.type===k?'selected':''}>${v}</option>`).join('')}</select></div>
      <div class="fg"><label>Cấp độ nhận thức</label><select data-mf="level">${Object.entries(LEVELS).map(([k,v])=>`<option value="${k}" ${M.level===k?'selected':''}>${k} - ${v}</option>`).join('')}</select></div>
      <div class="fg"><label>Điểm mặc định</label><input type="number" step="any" min="0" data-mf="pt" value="${M.pt}"></div>
      <div class="fg"><label>Mục đích / Dạng bài</label><input list="goal_list" data-mf="goal" value="${esc(M.goal||'')}"><datalist id="goal_list">${knownGoals.map(g=>`<option value="${esc(g)}">`).join('')}</datalist></div>
    </div>
    <div class="fg" style="margin-top:8px"><label>Yêu cầu cần đạt (YCCĐ)</label><input data-mf="yccd" value="${esc(M.yccd)}" placeholder="VD: Vận dụng được công thức tính..."></div>
    <div style="margin-top:10px"><label style="font-size:12px;font-weight:600;color:var(--mut)">Nội dung câu dẫn / Đề bài ${II('Hỗ trợ gõ công thức $...$, \\ce{...}, dán ảnh Ctrl+V hoặc bấm vào ảnh để kéo thả')}</label>${mrt('s', M.s)}</div>
    ${M.type==='p1' ? `<div style="margin-top:10px"><div class="row sp"><label style="font-size:12px;font-weight:600;color:var(--mut)">4 phương án A–D:</label><label style="font-weight:bold;color:var(--ok)">Đáp án đúng: <select data-mf="k1" style="font-weight:bold">${'ABCD'.split('').map((c,j)=>`<option value="${j}" ${+M.k1===j?'selected':''}>${c}</option>`).join('')}</select></label></div><div class="opts">${[0,1,2,3].map(j=>`<div><b>${'ABCD'[j]}.</b>${mrt('o.'+j, M.o[j])}</div>`).join('')}</div></div>` : ''}
    ${M.type==='p2' ? `<div style="margin-top:10px"><label style="font-size:12px;font-weight:600;color:var(--mut)">4 mệnh đề a–d và đáp án Đúng/Sai:</label>${[0,1,2,3].map(j=>`<div class="row" style="margin-top:6px;align-items:flex-start"><b style="width:22px">${'abcd'[j]})</b><div style="flex:1;min-width:200px">${mrt('st.'+j, M.st[j])}</div><select data-mf="k2.${j}" style="font-weight:bold;color:${M.k2[j]?'var(--ok)':'var(--bad)'}"><option value="1" ${M.k2[j]?'selected':''}>Đúng (Đ)</option><option value="0" ${!M.k2[j]?'selected':''}>Sai (S)</option></select></div>`).join('')}</div>` : ''}
    ${M.type==='tn' ? `<div class="row" style="margin-top:10px"><label style="font-weight:bold">Đáp án số chuẩn OMR (<= 4 ký tự): <input data-mf="ans" value="${esc(M.ans)}" maxlength="4" size="8" placeholder="VD: -1,5" style="font-weight:bold;color:var(--pri)"></label></div>` : ''}
    ${M.type==='p3' ? `<div class="row" style="margin-top:10px"><label style="font-size:12px;font-weight:600;color:var(--mut)">Số dòng kẻ giấy làm bài (1–15): <input type="number" min="1" max="15" data-mf="lines" value="${M.lines}"></label></div>` : ''}
    <div style="margin-top:10px"><label style="font-size:12px;font-weight:600;color:var(--mut)">💡 Lời giải chi tiết / Giải thích đáp án / Hướng dẫn chấm:</label>${mrt('guide', M.guide, 'Nhập lời giải chi tiết...')}</div>
    <div class="row sp" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--bd)">
      <div class="row"><button class="btn" data-a="checkmanual">🔍 Kiểm định</button>${M.editId ? `<button class="btn pur" data-a="saveasnew">📋 Lưu thành câu mới</button>` : ''}</div>
      <div class="row"><button class="btn pri" data-a="savemanual" data-both="0">💾 ${M.editId ? 'Cập nhật câu hỏi' : 'Lưu vào Thư viện'}</button>${!M.editId ? `<button class="btn ok" data-a="savemanual" data-both="1">➕ Lưu & đưa vào đề</button>` : ''}</div>
    </div>
  </div>`;
}

/* Giao diện Thiết Kế Biến Thể (Đa môn + Nhân rộng N biến thể) */
function gemStudioHtml(e){
  const subjs = allSubjs();
  const g = gemCfg;
  const promptText = g.customPrompt || buildDynamicGemPrompt();
  return `<div class="card" style="border:2px solid var(--pur)">
    <div class="row sp">
      <div>
        <b>🤖 Trình Cấu Hình Thiết Kế Khung Đề & Nhân Rộng Biến Thể (Chuyên Nghiệp)</b>
        ${II('Tự động tạo System Prompt đa môn, quy định rõ số câu theo từng cấp độ và nhân rộng N biến thể từ cùng 1 nội dung')}
      </div>
      <div class="row">
        <button class="btn" data-a="togglegem">${showGemPrompt?'🔼 Ẩn Prompt':'👁️ Xem/Sửa Prompt'}</button>
        <button class="btn pur" data-a="copygem">📋 Copy Prompt cho Gem</button>
        <button class="btn pri" data-a="samplegem">✨ Nạp dữ liệu mẫu đa môn</button>
        <button class="btn" data-a="libmode" data-m="none">Thu gọn ▲</button>
      </div>
    </div>

    <div class="grid3" style="margin-top:10px">
      <div class="fg">
        <label>1. Môn học</label>
        <input list="gem_subj_list" data-gf="subj" value="${esc(g.subj)}" placeholder="Chọn hoặc gõ môn học...">
        <datalist id="gem_subj_list">${subjs.map(s=>`<option value="${esc(s)}">`).join('')}</datalist>
      </div>
      <div class="fg">
        <label>Khối lớp / Cấp học</label>
        <select data-gf="grade">
          ${['Lớp 12','Lớp 11','Lớp 10','Lớp 9','Lớp 8','Lớp 7','Lớp 6','Ôn thi Tốt nghiệp THPT','Bồi dưỡng HSG'].map(gr=>`<option value="${gr}" ${g.grade===gr?'selected':''}>${gr}</option>`).join('')}
        </select>
      </div>
      <div class="fg">
        <label>Mục đích đánh giá</label>
        <select data-gf="purpose">
          ${['Kiểm tra thường xuyên (15 phút)','Kiểm tra Giữa kỳ / Cuối kỳ','Ôn thi Tốt nghiệp THPT','Phân hóa Học sinh giỏi','Xây dựng ngân hàng câu hỏi theo bài'].map(p=>`<option value="${p}" ${g.purpose===p?'selected':''}>${p}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="grid2" style="margin-top:8px">
      <div class="fg">
        <label>2. Tên Bài học / Chủ đề cần tạo</label>
        <input data-gf="lesson" value="${esc(g.lesson)}" placeholder="VD: Bài 1: Dao động điều hòa / Unit 1: Life Stories...">
      </div>
      <div class="fg">
        <label>3. Nhân rộng: Số biến thể (N) trên mỗi đơn vị kiến thức</label>
        <select data-gf="variants" style="font-weight:bold;color:var(--pur)">
          ${[1,2,3,5,10].map(n=>`<option value="${n}" ${+g.variants===n?'selected':''}>${n===1?'1 câu / đơn vị kiến thức (Mặc định)':`Nhân rộng ${n} biến thể / mỗi đơn vị kiến thức`}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="fg" style="margin-top:8px">
      <label>Nội dung trọng tâm / Yêu cầu cần đạt (YCCĐ) / Dán đoạn SGK hoặc tài liệu nguồn:</label>
      <textarea data-gf="context" rows="2" placeholder="Dán Yêu cầu cần đạt, công thức trọng tâm hoặc đoạn văn bản ngữ liệu...">${esc(g.context)}</textarea>
    </div>

    <div style="margin-top:10px;padding:10px;border:1px solid var(--bd);border-radius:10px;background:var(--bg)">
      <div class="row sp" style="margin-bottom:6px">
        <b style="font-size:13px">4. Khung số lượng câu hỏi gốc theo Loại câu × Cấp độ:</b>
        <small class="hint">Tổng số câu Gem sẽ sinh = (Tổng khung) × (${g.variants} biến thể)</small>
      </div>
      <div style="overflow-x:auto">
        <table class="k" style="margin:0">
          <tr><th>Loại câu hỏi</th><th>NB (Nhận biết)</th><th>TH (Thông hiểu)</th><th>VD (Vận dụng)</th><th>VDC (Vận dụng cao)</th></tr>
          ${[['p1','Phần I (ABCD)'],['p2','Phần II (Đúng/Sai)'],['tn','Phần III (Trả lời ngắn)'],['p3','Phần IV (Tự luận)']].map(([tk,tl])=>`
            <tr>
              <td style="text-align:left"><b>${tl}</b></td>
              ${['NB','TH','VD','VDC'].map(lv=>`<td><input type="number" min="0" max="50" data-gf="${tk}_${lv}" value="${g[tk+'_'+lv]||0}" style="width:60px;text-align:center"></td>`).join('')}
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="row" style="margin-top:8px;gap:12px;font-size:12.5px">
        <b>Kỹ thuật biến đổi khi nhân rộng:</b>
        <label><input type="checkbox" data-gchk="var_num" ${g.var_num?'checked':''}> Đổi số liệu</label>
        <label><input type="checkbox" data-gchk="var_ctx" ${g.var_ctx?'checked':''}> Đổi ngữ cảnh thực tế</label>
        <label><input type="checkbox" data-gchk="var_rev" ${g.var_rev?'checked':''}> Hỏi ngược dữ kiện</label>
        <label><input type="checkbox" data-gchk="var_fmt" ${g.var_fmt?'checked':''}> Chuyển định dạng (P1↔P2↔TN)</label>
        <label><input type="checkbox" data-gchk="var_dis" ${g.var_dis?'checked':''}> Đổi phương án nhiễu</label>
      </div>
      <div class="row" style="margin-top:6px;gap:12px;font-size:12.5px">
        <b>Tùy chọn chất lượng:</b>
        <label><input type="checkbox" data-gchk="opt_svg" ${g.opt_svg?'checked':''}> Vẽ hình &lt;svg&gt; minh họa (nếu phù hợp môn)</label>
        <label><input type="checkbox" data-gchk="opt_solve" ${g.opt_solve?'checked':''}> Bắt buộc kèm Lời giải & tự kiểm tra phép tính</label>
        <label><input type="checkbox" data-gchk="opt_batch" ${g.opt_batch?'checked':''}> Chế độ cuốn chiếu</label>
      </div>
    </div>

    ${showGemPrompt?`<div class="warn-box" style="margin-top:8px">
      <div class="row sp">
        <b>System Prompt đã tổng hợp theo cấu hình trên (Có thể sửa trực tiếp):</b>
        <div class="row">
          <button class="btn sm" data-a="resetgemprompt">↺ Làm mới theo khung</button>
          <button class="btn sm pur" data-a="copygem">📋 Copy Prompt</button>
        </div>
      </div>
      <textarea id="gem_prompt_box" data-gf="customPrompt" rows="8" style="width:100%;margin-top:6px;font-family:monospace;font-size:12px">${esc(promptText)}</textarea>
    </div>`:''}

    <div style="margin-top:10px">
      <label style="font-size:12.5px;font-weight:700">5. Dán dữ liệu câu hỏi vào đây để nạp vào Thư viện:</label>
      <textarea id="gem_in" rows="6" style="width:100%;margin-top:4px;font-family:monospace;font-size:13px" placeholder="Dán nội dung câu hỏi chuẩn hóa (===QUESTION=== ... ===END===) hoặc bấm '✨ Nạp dữ liệu mẫu đa môn' ở góc trên..."></textarea>
    </div>

    ${gemReport ? `<div class="${gemReport.errCount?'warn-box':'ok-box'}" style="margin-top:8px">
      <b>📊 Báo cáo phân tích dữ liệu câu hỏi:</b>
      Đã thêm mới: <b style="color:var(--ok)">${gemReport.added} câu</b> ·
      Bỏ qua câu trùng lặp: <b>${gemReport.dupCount} câu</b> ·
      Lỗi định dạng: <b style="color:var(--bad)">${gemReport.errCount} block</b>
      ${gemReport.errors.length?`<div style="font-size:12px;margin-top:4px">${gemReport.errors.map(er=>esc(er)).join(' | ')}</div>`:''}
    </div>` : ''}

    <div class="row sp" style="margin-top:8px">
      <span class="hint">Tự động lọc bỏ markdown, nhận diện công thức $...$, \\ce{...}, đóng gói hình &lt;svg&gt; và lọc câu trùng lặp.</span>
      <button class="btn pri" data-a="parselib">⚡ Phân tích & Lưu vào Thư viện</button>
    </div>
  </div>`;
}

/* Giao diện Ma trận 4x4 nâng cấp (lọc theo Môn + Bài học, hiển thị số câu khả dụng trong kho) */
function matrixStudioHtml(e){
  const subjs = allSubjs();
  const targetSubj = mxCfg.subj==='CURRENT' ? (libFilter.subj!=='ALL'?libFilter.subj:e.subj) : mxCfg.subj;
  const lessons = [...new Set(LIB.filter(q=>targetSubj==='ALL'||q.subj===targetSubj).map(q=>q.lesson))];
  const pool = LIB.filter(q=>{
    if(targetSubj!=='ALL' && q.subj!==targetSubj) return false;
    if(mxCfg.lesson!=='ALL' && q.lesson!==mxCfg.lesson) return false;
    return true;
  });

  const avail = (t, lv) => pool.filter(q=>q.type===t && q.level===lv).length;

  return `<div class="card" style="border:2px solid var(--warn)">
    <div class="row sp">
      <div>
        <b>🎲 Rút Đề Tự Động Theo Ma Trận Đặc Tả (4 Loại Câu × 4 Cấp Độ)</b>
        ${II('Hệ thống đối chiếu số câu yêu cầu với số câu hiện có trong kho và cảnh báo ngay nếu thiếu')}
      </div>
      <div class="row">
        <button class="btn ok" data-a="runmatrix">🚀 Rút ngẫu nhiên vào đề</button>
        <button class="btn" data-a="libmode" data-m="none">Thu gọn ▲</button>
      </div>
    </div>

    <div class="grid2" style="margin-top:8px">
      <div class="fg">
        <label>Môn học áp dụng ma trận</label>
        <select data-mx="subj">
          <option value="CURRENT" ${mxCfg.subj==='CURRENT'?'selected':''}>Theo môn đang chọn (${esc(targetSubj)})</option>
          <option value="ALL" ${mxCfg.subj==='ALL'?'selected':''}>-- Tất cả môn học --</option>
          ${subjs.map(s=>`<option value="${esc(s)}" ${mxCfg.subj===s?'selected':''}>${esc(s)}</option>`).join('')}
        </select>
      </div>
      <div class="fg">
        <label>Phạm vi Bài học / Chủ đề</label>
        <select data-mx="lesson">
          <option value="ALL">-- Tất cả bài học của môn (${pool.length} câu) --</option>
          ${lessons.map(l=>`<option value="${esc(l)}" ${mxCfg.lesson===l?'selected':''}>${esc(l)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div style="overflow-x:auto;margin-top:10px">
      <table class="k">
        <tr>
          <th>Loại câu hỏi</th>
          ${Object.entries(LEVELS).map(([k,v])=>`<th>${k} - ${v}</th>`).join('')}
        </tr>
        ${Object.entries(TYPES).map(([tk,tv])=>`
          <tr>
            <td style="text-align:left"><b>${tv}</b></td>
            ${Object.keys(LEVELS).map(lv=>{
              const av = avail(tk, lv);
              const req = +mxCfg[`${tk}_${lv}`]||0;
              const lack = req > av;
              return `<td>
                <div class="row" style="justify-content:center;gap:4px">
                  <input type="number" min="0" max="50" data-mx="${tk}_${lv}" value="${req}" style="width:58px;text-align:center;border-color:${lack?'var(--bad)':'var(--bd)'}">
                  <small style="color:${lack?'var(--bad)':'var(--mut)'};font-weight:${lack?'700':'400'}">/ ${av} có</small>
                </div>
              </td>`;
            }).join('')}
          </tr>
        `).join('')}
      </table>
    </div>
  </div>`;
}

/* Bảng Thống kê độ phủ Ngân hàng đề theo Môn / Bài đang chọn */
function coverageTableHtml(pool, curSubj, curLesson){
  const count = (t, lv) => pool.filter(q=>q.type===t && q.level===lv).length;
  return `<div style="margin:10px 0;padding:10px;border:1px solid var(--bd);border-radius:10px;background:var(--bg)">
    <div class="row sp" style="margin-bottom:6px">
      <span style="font-size:12.5px;font-weight:700">📊 Độ phủ Ngân hàng câu hỏi (${curSubj==='ALL'?'Tất cả môn':esc(curSubj)} · ${curLesson==='ALL'?'Tất cả bài':esc(curLesson)} — Tổng: ${pool.length} câu)</span>
      <small class="hint">Bấm nút <b>+</b> ở ô bất kỳ để soạn bổ sung đúng Loại câu & Cấp độ đang thiếu</small>
    </div>
    <div style="overflow-x:auto">
      <table class="k" style="margin:0;font-size:12.5px">
        <tr>
          <th>Phần / Loại câu</th>
          <th>NB (Nhận biết)</th>
          <th>TH (Thông hiểu)</th>
          <th>VD (Vận dụng)</th>
          <th>VDC (Vận dụng cao)</th>
          <th>Tổng loại</th>
        </tr>
        ${Object.entries(TYPES_SHORT).map(([tk,tl])=>{
          const rowTot = Object.keys(LEVELS).reduce((s,lv)=>s+count(tk,lv),0);
          return `<tr>
            <td style="text-align:left"><b>${tl}</b></td>
            ${Object.keys(LEVELS).map(lv=>{
              const c = count(tk, lv);
              return `<td>
                <div class="cov-cell">
                  <span class="${c===0?'cov-zero':'cov-ok'}">${c} câu</span>
                  <button type="button" class="btn sm" data-a="quickcreate" data-type="${tk}" data-level="${lv}" title="Tạo nhanh câu ${tl} mức ${lv}">+</button>
                </div>
              </td>`;
            }).join('')}
            <td><b>${rowTot}</b></td>
          </tr>`;
        }).join('')}
      </table>
    </div>
  </div>`;
}

function libView(e){
  const allS = allSubjs();
  // Đếm số câu theo từng môn & sắp xếp ưu tiên môn đã có câu hỏi lên trước
  const subjCounts = {};
  allS.forEach(s => subjCounts[s] = 0);
  LIB.forEach(q => { subjCounts[q.subj] = (subjCounts[q.subj]||0) + 1; });
  const sortedSubjs = [...allS].sort((a,b)=>(subjCounts[b]||0)-(subjCounts[a]||0));

  // Danh sách câu theo môn đang chọn
  const subjPool = LIB.filter(q => libFilter.subj==='ALL' || q.subj===libFilter.subj);
  const lessonCounts = {};
  subjPool.forEach(q => {
    const l = q.lesson || 'Chưa phân loại bài';
    lessonCounts[l] = (lessonCounts[l]||0) + 1;
  });
  const lessons = Object.keys(lessonCounts);

  // Danh sách câu theo Môn + Bài (để tính bảng Độ phủ)
  const subjLessonPool = subjPool.filter(q => libFilter.lesson==='ALL' || q.lesson===libFilter.lesson);

  // Danh sách câu sau khi áp dụng toàn bộ bộ lọc
  const filtered = subjLessonPool.filter(q=>{
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

  const statImg = LIB.filter(q=>hasVisual(q.s)).length;
  const statMath = LIB.filter(q=>hasMath(q.s+(q.o||[]).join('')+(q.st||[]).join(''))).length;

  return `
  <div class="card">
    <div class="row sp">
      <div class="row">
        <button class="btn ${libMode==='manual'?'pri':''}" data-a="libmode" data-m="manual">✍️ Soạn tay</button>
        <button class="btn ${libMode==='gem'?'pur':''}" data-a="libmode" data-m="gem">📑 Sinh Đề & Biến Thể (Đa môn)</button>
        <button class="btn ${libMode==='matrix'?'warn':''}" data-a="libmode" data-m="matrix">🎲 Ma trận 4×4</button>
      </div>
      <div class="row">
        <span class="badge" title="Bộ nhớ IndexedDB dung lượng lớn">💾 ${esc(storageInfo)}</span>
        <button class="btn" data-a="explib" title="Xuất File Thư viện (.json)">⬇ Xuất .json</button>
        <button class="btn" data-a="implib" title="Nhập File Thư viện (.json)">⬆ Nhập .json</button>
      </div>
    </div>
  </div>

  ${libMode==='manual' ? manualBuilderHtml(e) : ''}
  ${libMode==='gem' ? gemStudioHtml(e) : ''}
  ${libMode==='matrix' ? matrixStudioHtml(e) : ''}

  <div class="card">
    <div class="row sp">
      <div class="row">
        <b>🌐 Ngân hàng câu hỏi (${filtered.length}/${LIB.length} câu)</b>
        <span class="badge IMG" title="Số câu có hình hoặc bảng">🖼 ${statImg} hình</span>
        <span class="badge MATH" title="Số câu có công thức Toán/Lý/Hóa">∑ ${statMath} công thức</span>
      </div>
      <div class="row">
        <button class="btn" data-a="selalllib" title="Chỉ chọn ${filtered.length} câu đang hiển thị theo bộ lọc">☑ Chọn ${filtered.length} câu đang lọc</button>
        <button class="btn" data-a="unselalllib" ${libSel.size?'':'disabled'}>☐ Bỏ chọn</button>
        <button class="btn ok" data-a="addseltoexam" title="Đưa các câu đã chọn vào đề này" ${libSel.size?'':'disabled'}>➕ Đưa ${libSel.size} câu vào đề</button>
        <button class="btn x" data-a="delsellib" title="Xóa các câu đã chọn khỏi Thư viện" ${libSel.size?'':'disabled'}>🗑 Xóa (${libSel.size})</button>
      </div>
    </div>

    <!-- HÀNG 1: THẺ NGANG MÔN HỌC (HORIZONTAL PILLS) -->
    <div class="pill-wrap" style="margin-top:10px">
      <div class="pill-lbl">
        <span>1. Chọn Môn học (Bấm đổi môn tự động đặt lại Bài học)</span>
        <button type="button" class="btn sm" data-a="addsubj">+ Thêm môn mới</button>
      </div>
      <div class="pill-row">
        <button type="button" class="pill has-q ${libFilter.subj==='ALL'?'on':''}" data-a="setsubj" data-v="ALL">
          <span>Tất cả môn</span><span class="cnt">${LIB.length}</span>
        </button>
        ${sortedSubjs.map(s=>{
          const c = subjCounts[s]||0;
          return `<button type="button" class="pill ${c?'has-q':''} ${libFilter.subj===s?'on':''}" data-a="setsubj" data-v="${esc(s)}">
            <span>${esc(s)}</span><span class="cnt">${c}</span>
          </button>`;
        }).join('')}
      </div>
    </div>

    <!-- HÀNG 2: THẺ NGANG BÀI HỌC / CHỦ ĐỀ THUỘC MÔN ĐANG CHỌN -->
    <div class="pill-wrap">
      <div class="pill-lbl">
        <span>2. Chọn Bài học / Chủ đề (${libFilter.subj==='ALL'?'Tất cả môn':esc(libFilter.subj)})</span>
      </div>
      <div class="pill-row">
        <button type="button" class="pill has-q ${libFilter.lesson==='ALL'?'on':''}" data-a="setlesson" data-v="ALL">
          <span>Tất cả bài học</span><span class="cnt">${subjPool.length}</span>
        </button>
        ${lessons.length ? lessons.map(l=>`
          <button type="button" class="pill has-q ${libFilter.lesson===l?'on':''}" data-a="setlesson" data-v="${esc(l)}">
            <span>${esc(l)}</span><span class="cnt">${lessonCounts[l]}</span>
          </button>
        `).join('') : `<span class="hint" style="padding:4px 8px">Môn này chưa có bài học nào — hãy bấm "+ Tạo câu hỏi" hoặc nạp dữ liệu tự động.</span>`}
      </div>
    </div>

    <!-- THANH LỌC PHỤ NHỎ GỌN -->
    <div class="grid2" style="margin:8px 0;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
      <div class="fg">
        <label>Tìm kiếm từ khóa / YCCĐ / Dạng bài</label>
        <input data-lf="q" value="${esc(libFilter.q)}" placeholder="Gõ nội dung, công thức, YCCĐ...">
      </div>
      <div class="fg">
        <label>Cấp độ nhận thức</label>
        <select data-lf="level">
          <option value="ALL">-- Mọi cấp độ --</option>
          ${Object.entries(LEVELS).map(([k,v])=>`<option value="${k}" ${libFilter.level===k?'selected':''}>${k} - ${v}</option>`).join('')}
        </select>
      </div>
      <div class="fg">
        <label>Phần / Loại câu hỏi</label>
        <select data-lf="type">
          <option value="ALL">-- Mọi loại câu --</option>
          ${Object.entries(TYPES).map(([k,v])=>`<option value="${k}" ${libFilter.type===k?'selected':''}>${v}</option>`).join('')}
        </select>
      </div>
      <div class="fg">
        <label>Lọc Hình vẽ / Công thức</label>
        <select data-lf="hasImg">
          <option value="ALL" ${libFilter.hasImg==='ALL'?'selected':''}>-- Tất cả câu hỏi --</option>
          <option value="YES" ${libFilter.hasImg==='YES'?'selected':''}>🖼 Chỉ câu có Hình / Bảng</option>
          <option value="MATH" ${libFilter.hasImg==='MATH'?'selected':''}>∑ Chỉ câu có Công thức</option>
        </select>
      </div>
    </div>

    ${coverageTableHtml(subjLessonPool, libFilter.subj, libFilter.lesson)}

    ${filtered.length ? filtered.map(q=>`
      <div class="q" style="border-left:4px solid ${M.editId===q.id?'var(--warn)':'var(--pri)'}">
        <div class="row sp">
          <div class="row">
            <input type="checkbox" data-libchk="${q.id}" ${libSel.has(q.id)?'checked':''}>
            <span class="badge">${esc(q.subj)}</span>
            <span class="badge">${esc(q.lesson)}</span>
            <span class="badge ${q.level}">${q.level} - ${LEVELS[q.level]||q.level}</span>
            <span class="badge">${TYPES[q.type]} (${q.pt}đ)</span>
            ${q.goal?`<span class="badge GOAL" title="Mục đích / Dạng bài">📌 ${esc(q.goal)}</span>`:''}
            ${hasVisual(q.s)?`<span class="badge IMG" title="Có hình/bảng">🖼</span>`:''}
            ${hasMath(q.s+(q.o||[]).join('')+(q.st||[]).join(''))?`<span class="badge MATH" title="Có công thức">∑</span>`:''}
          </div>
          <div class="row">
            <button class="btn" data-a="clonelib" data-id="${q.id}" title="Nhân bản câu này lên trình soạn tay để đổi số liệu / biến tấu thành câu mới">📋 Nhân bản & Biến tấu</button>
            <button class="btn" data-a="editlib" data-id="${q.id}">✏️ Sửa</button>
            <button class="btn pri" data-a="add1toexam" data-id="${q.id}" title="Đưa câu này vào đề">+ Đưa vào đề</button>
            <button class="btn x" data-a="dellib" data-id="${q.id}">Xóa</button>
          </div>
        </div>
        ${q.yccd?`<div style="font-size:12px;color:var(--warn);margin:4px 0">🎯 <b>YCCĐ:</b> ${esc(q.yccd)}</div>`:''}
        <div class="q-body-preview" style="position:relative;margin-top:6px;${reqMinHeightStyle(q.s)}"><b>Đề bài:</b> ${formatMathDisplay(q.s)}</div>
        ${q.type==='p1'?`<div class="opts" style="font-size:13px">${(q.o||[]).map((o,j)=>`<div style="${q.k===j?'color:var(--ok);font-weight:700':''}">${'ABCD'[j]}. ${formatMathDisplay(o)} ${q.k===j?'✓':''}</div>`).join('')}</div>`:''}
        ${q.type==='p2'?`<div style="font-size:13px;margin-top:4px">${(q.st||[]).map((st,j)=>`<div><b>${'abcd'[j]})</b> ${formatMathDisplay(st)} ➔ <b style="color:${q.k[j]?'var(--ok)':'var(--bad)'}">${q.k[j]?'Đúng':'Sai'}</b></div>`).join('')}</div>`:''}
        ${q.type==='tn'?`<div style="font-size:13px;margin-top:4px"><b>Đáp án trả lời ngắn:</b> <span class="badge">${esc(q.ans)}</span></div>`:''}
        ${q.guide?`<div style="font-size:12.5px;color:var(--mut);margin-top:6px;padding:6px 10px;background:var(--bg);border-radius:6px;border-left:3px solid var(--ok)">💡 <b>Lời giải / Giải thích:</b> ${formatMathDisplay(q.guide)}</div>`:''}
      </div>
    `).join('') : `<div class="empty">∅ Không có câu hỏi nào khớp với bộ lọc hiện tại. Bấm nút <b>+</b> trên bảng Độ phủ để tạo ngay!</div>`}
  </div>`;
}

function pushLibItemToExam(q, e){
  if(q.type==='p1') e.p1.push({s:q.s, o:[...(q.o||['','','',''])], k:q.k||0, pt:q.pt||0.25, guide:q.guide||''});
  else if(q.type==='p2') e.p2.push({s:q.s, st:[...(q.st||['','','',''])], k:[...(q.k||[true,false,true,false])], pt:q.pt||1, guide:q.guide||''});
  else if(q.type==='tn') e.tn.push({s:q.s, ans:q.ans||'', pt:q.pt||0.5, guide:q.guide||''});
  else e.p3.push({s:q.s, pt:q.pt||1, lines:q.lines||5, guide:q.guide||''});
}

function buildLibItemFromManual(forceNew=false){
  if(!M.s || !normPlainText(M.s)){
    toast('⚠️ Chưa có nội dung đề bài');
    return null;
  }
  const item = {
    id: (forceNew || !M.editId) ? uid() : M.editId,
    subj: (M.subj||'Vật lí').trim(),
    lesson: (M.lesson||'Bài 1').trim(),
    level: M.level||'NB',
    goal: (M.goal||'').trim(),
    yccd: (M.yccd||'').trim(),
    type: M.type||'p1',
    pt: parseFloat(M.pt)||0.25,
    s: M.s,
    guide: M.guide||''
  };
  if(item.type==='p1'){
    item.o = [...M.o];
    item.k = parseInt(M.k1)||0;
  } else if(item.type==='p2'){
    item.st = [...M.st];
    item.k = M.k2.map(Boolean);
  } else if(item.type==='tn'){
    item.ans = (M.ans||'').replace(/\./g,',').trim().slice(0,4);
  } else {
    item.lines = Math.min(15, Math.max(1, parseInt(M.lines)||6));
  }
  return item;
}

function loadLibItemToManual(q, isClone=false){
  M = {
    editId: isClone ? null : q.id,
    subj: q.subj||'Vật lí',
    lesson: q.lesson||'Bài 1',
    level: q.level||'NB',
    type: q.type||'p1',
    pt: q.pt||0.25,
    goal: q.goal||'',
    yccd: q.yccd||'',
    s: q.s||'',
    o: q.o ? [...q.o] : ['','','',''],
    k1: q.k||0,
    st: q.st ? [...q.st] : ['','','',''],
    k2: Array.isArray(q.k) ? [...q.k] : [true,false,true,false],
    ans: q.ans||'',
    lines: q.lines||6,
    guide: q.guide||''
  };
  checkReport = null;
  libMode = 'manual';
  render();
  scrollTo({top:0, behavior:'smooth'});
}

function pickRandom(arr, n){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}
  return a.slice(0, n);
}
