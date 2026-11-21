const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let DB=[], LIB=[], cur=null, tab='edit', cc=null, gCode=null, editPaper=false, last=null, tm;
let libFilter={subj:'ALL',lesson:'ALL',level:'ALL',type:'ALL',hasImg:'ALL',q:''}, libSel=new Set();
let libMode='manual', showGemPrompt=false, mathGroup='toan', checkReport=null, gemReport=null, storageInfo='Đang tính...';

let mxCfg={
  subj:'CURRENT', lesson:'ALL',
  p1_NB:4, p1_TH:4, p1_VD:2, p1_VDC:0,
  p2_NB:0, p2_TH:1, p2_VD:1, p2_VDC:0,
  tn_NB:0, tn_TH:0, tn_VD:1, tn_VDC:1,
  p3_NB:0, p3_TH:0, p3_VD:0, p3_VDC:1
};

let gemCfg={
  subj:'Vật lí', grade:'Lớp 12', lesson:'Bài 1: Dao động điều hòa', purpose:'Kiểm tra Giữa kỳ / Cuối kỳ',
  context:'Xác định biên độ, chu kì, tần số, pha ban đầu; đọc đồ thị li độ - thời gian và vận dụng công thức động năng, thế năng con lắc lò xo.',
  p1_NB:3, p1_TH:3, p1_VD:2, p1_VDC:0,
  p2_NB:0, p2_TH:1, p2_VD:1, p2_VDC:0,
  tn_NB:0, tn_TH:0, tn_VD:1, tn_VDC:1,
  p3_NB:0, p3_TH:0, p3_VD:1, p3_VDC:0,
  variants:2, var_num:true, var_ctx:true, var_rev:false, var_fmt:false, var_dis:true,
  opt_svg:true, opt_solve:true, opt_batch:true, customPrompt:''
};

const DEFAULT_SUBJS=['Toán','Vật lí','Hóa học','Sinh học','Khoa học tự nhiên','Tin học','Công nghệ','Ngữ văn','Tiếng Anh','Lịch sử','Địa lí','GDKT&PL'];
const LEVELS={NB:'Nhận biết',TH:'Thông hiểu',VD:'Vận dụng',VDC:'Vận dụng cao'};
const TYPES={p1:'Phần I (ABCD)',p2:'Phần II (Đúng/Sai)',tn:'Phần III (Trả lời ngắn)',p3:'Phần IV (Tự luận)'};
const TYPES_SHORT={p1:'P1 · ABCD',p2:'P2 · Đúng/Sai',tn:'P3 · Trả lời ngắn',p3:'P4 · Tự luận'};

const uid=()=>Math.random().toString(36).slice(2,9), E=()=>DB.find(x=>x.id===cur);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sp=(o,p,v)=>{const k=p.split('.'),l=k.pop();k.reduce((a,x)=>a[x],o)[l]=v};
const hash=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h};
const sig=e=>hash(JSON.stringify([e.p1,e.p2,e.tn]));
const hasVisual=s=>/<(svg|img|table)\b/i.test(s||'');
const hasMath=s=>/class="fx"|\$[^\$]+\$|\\ce\{|\\frac\{|\\sqrt\{|\\int\b|\\lim\b/i.test(s||'');
const II=t=>`<button type="button" class="ii" data-a="info" data-t="${esc(t)}" title="${esc(t)}" aria-label="${esc(t)}">ⓘ</button>`;
