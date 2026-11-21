/* ================= CHẤM BÀI & OMR ================= */
const PW=1240,PH=1754,AN=[[60,60],[PW-60,60],[60,PH-60],[PW-60,PH-60]],BR=11,F=`'Times New Roman',serif`,G={rows:[],blob:null,files:[]};
const LAY=(()=>{const L={sbd:[],ma:[],p1:[],p2:[],tn:[]};for(let i=0;i<6;i++)for(let d=0;d<10;d++)L.sbd.push({i,d,x:770+i*32,y:215+d*27});for(let i=0;i<3;i++)for(let d=0;d<10;d++)L.ma.push({i,d,x:1050+i*32,y:215+d*27});for(let q=0;q<40;q++)for(let c=0;c<4;c++)L.p1.push({q,c,x:80+(q/10|0)*280+60+c*40,y:600+(q%10)*29});for(let q=0;q<8;q++)for(let r=0;r<4;r++)for(let v=0;v<2;v++)L.p2.push({q,r,v,x:80+(q>>1)*280+60+(q&1)*100+v*40,y:990+r*29});for(let q=0;q<6;q++){const X=c=>80+q*180+25+c*36;L.tn.push({q,c:0,k:'-',x:X(0),y:1215},{q,c:1,k:',',x:X(1),y:1244},{q,c:2,k:',',x:X(2),y:1244});for(let c=0;c<4;c++)for(let d=0;d<10;d++)L.tn.push({q,c,k:d,x:X(c),y:1273+d*29})}return L})();

async function dlBlob(nm,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nm;document.body.append(a);a.click();a.remove()}

function drawSheet(e,x){
  x.fillStyle='#fff';x.fillRect(0,0,PW,PH);x.fillStyle='#000';x.strokeStyle='#000';x.lineWidth=1.6;
  AN.forEach(([a,b])=>x.fillRect(a-22,b-22,44,44));
  for(let i=1;i<10;i++)x.fillRect(60+i*(PW-120)/10-6,PH-78,12,12);
  for(let i=1;i<20;i++)x.fillRect(42,60+i*(PH-120)/20-6,12,12);
  const T=(t,a,b,f,al)=>{x.font=f;x.textAlign=al||'left';x.fillText(t,a,b)},bub=(a,b)=>{x.beginPath();x.arc(a,b,BR,0,7);x.stroke()};
  T('PHIẾU TRẢ LỜI TRẮC NGHIỆM',PW/2,72,'bold 34px '+F,'center');T(`${e.name} – Môn: ${e.subj}`,PW/2,106,'22px '+F,'center');
  x.strokeRect(100,125,200,60);T('ĐIỂM',108,148,'bold 18px '+F);
  [['Họ và tên thí sinh:',240],['Lớp:',300],['Ngày sinh:',360],['Chữ kí của thí sinh:',420]].forEach(([t,y])=>{T(t,100,y,'22px '+F);const w=x.measureText(t).width;x.beginPath();x.moveTo(108+w,y+3);x.lineTo(700,y+3);x.stroke()});
  [[770,'Số báo danh',6,LAY.sbd],[1050,'Mã đề',3,LAY.ma]].forEach(([x0,t,n,L])=>{T(t,x0-14,160,'bold 20px '+F);for(let i=0;i<n;i++)x.strokeRect(x0+i*32-14,168,28,26);for(let d=0;d<10;d++)T(String(d),x0-24,215+d*27+6,'16px Arial','right');L.forEach(o=>bub(o.x,o.y))});
  const n1=e.p1.length,n2=e.p2.length;
  if(n1){T('PHẦN I. Trắc nghiệm nhiều phương án',80,545,'bold 24px '+F);for(let b=0;b*10<n1;b++)'ABCD'.split('').forEach((c,i)=>T(c,80+b*280+60+i*40,580,'bold 18px Arial','center'));LAY.p1.filter(o=>o.q<n1).forEach(o=>{bub(o.x,o.y);if(o.c===0)T(String(o.q+1),o.x-24,o.y+6,'16px Arial','right')})}
  if(n2){T('PHẦN II. Trắc nghiệm Đúng/Sai',80,915,'bold 24px '+F);for(let q=0;q<n2;q++){const bx=80+(q>>1)*280+60+(q&1)*100;T('Câu '+(q+1),bx+20,950,'bold 16px Arial','center');T('Đúng',bx,968,'13px Arial','center');T('Sai',bx+40,968,'13px Arial','center')}LAY.p2.filter(o=>o.q<n2).forEach(o=>{bub(o.x,o.y);if(o.v===0&&(o.q&1)===0)T('abcd'[o.r]+')',o.x-34,o.y+6,'16px Arial','right')})}
  const n3=e.tn.length;if(n3){T('PHẦN III. Trả lời ngắn',80,1120,'bold 24px '+F);for(let q=0;q<Math.min(n3,6);q++){const X0=80+q*180+25;T('Câu '+(q+1),X0+54,1150,'bold 16px Arial','center');for(let c=0;c<4;c++)x.strokeRect(X0+c*36-14,1158,28,26);T('-',X0-20,1221,'14px Arial','right');T(',',X0-20,1250,'14px Arial','right');for(let d=0;d<10;d++)T(String(d),X0-20,1273+d*29+5,'14px Arial','right');LAY.tn.filter(o=>o.q===q).forEach(o=>bub(o.x,o.y))}}
  T('Tô kín ô tròn bằng bút chì đen. Không gấp, làm rách phiếu.',80,1620,'italic 20px '+F);
  if(e.p3.length)T('Phần Tự luận làm ở các trang sau của phiếu này.',80,1650,'italic 20px '+F);
}

function sheetView(e){
  const ok=(e.p1.length||e.p2.length||e.tn.length)&&e.p1.length<=40&&e.p2.length<=8&&e.tn.length<=6;
  let im=''; if(ok){const c=document.createElement('canvas');c.width=PW;c.height=PH;drawSheet(e,c.getContext('2d'));im=`<img src='${c.toDataURL('image/png')}' style='max-width:440px;width:100%;border:1px solid var(--bd);margin-top:10px'>`}
  return `<div class='card'><div class='row'><button class='btn pri' data-a='pdf'>⬇ Phiếu PDF</button> ${II('Trang 1: phiếu tô OMR. Trang sau: phần tự luận')}</div>${ok?'':`<div class='warn-box'>⚠️ Giới hạn OMR: tối đa 40 câu Phần I, 8 câu Phần II, 6 câu Phần III</div>`}${im}</div>`;
}

async function makePdf(){
  const e=E(); if(!(e.p1.length||e.p2.length||e.tn.length))return toast('Cần có câu ở Phần I, II hoặc III.');
  toast('Đang tạo PDF phiếu làm bài…');
  try{
    const pdf=new jspdf.jsPDF({unit:'mm',format:'a4'}),c=document.createElement('canvas');c.width=PW;c.height=PH;drawSheet(e,c.getContext('2d'));
    pdf.addImage(c.toDataURL('image/png'),'PNG',0,0,210,297);
    if(e.p3.length&&window.html2canvas){
      const st=document.createElement('div');st.style.cssText='position:fixed;left:-9999px;top:0;width:794px';document.body.append(st);
      const pages=[];let pg;const np=()=>{pg=document.createElement('div');pg.style.cssText=`width:794px;height:1123px;padding:50px 60px;box-sizing:border-box;background:#fff;color:#000;font:16px/1.5 ${F};overflow:hidden`;pg.innerHTML=`<div style='text-align:center;font-weight:bold'>${esc(e.name)} – PHẦN TỰ LUẬN</div>`;st.append(pg);pages.push(pg)};np();
      e.p3.forEach((q,i)=>{const d=document.createElement('div');d.style.marginTop='14px';d.innerHTML=`<div class="q-item" style="${reqMinHeightStyle(q.s)}"><b>Câu ${i+1}.</b> (${q.pt} điểm) ${formatMathDisplay(q.s)}</div>`+`<div style='border-bottom:1px solid #000;height:34px;clear:both'></div>`.repeat(q.lines);pg.append(d);if(pg.scrollHeight>pg.clientHeight&&pg.children.length>2){d.remove();np();pg.append(d)}});
      for(const p of pages){const cv=await html2canvas(p,{scale:2,backgroundColor:'#fff'});pdf.addPage();pdf.addImage(cv.toDataURL('image/jpeg',.9),'JPEG',0,0,210,297)}
      st.remove();
    }
    await dlBlob('phieu-lam-bai-'+e.id+'.pdf',pdf.output('blob'));
  }catch(er){toast('Lỗi tạo PDF: '+er.message)}
}

function answerKeyEditor(e){
  if(!e.codes.length) return `<div class="warn-box">⚠️ Chưa có mã đề — sang tab <b>🔀 Mã đề</b></div>`;
  const c = e.codes.find(x=>x.code===gCode) || e.codes[0]; gCode = c.code; const k = c.key;
  return `<div class="card" style="border:1.5px solid var(--pri)">
    <div class="row sp"><b>🛠️ Sửa đáp án mã đề</b><button class="btn" data-a="resetkey" data-code="${c.code}">↺ Khôi phục gốc</button></div>
    <div class="tabs" style="margin:8px 0">${e.codes.map(x=>`<button class="${x.code===c.code?'on':''}" data-a="gcode" data-i="${x.code}">Mã đề ${x.code} ${x.keyEdited?'✏️':''}</button>`).join('')}</div>
    ${k.p1.length?`<div style="margin-top:8px"><b>Phần I (Mã ${c.code}):</b><div style="overflow-x:auto"><table class="k"><tr><th>Câu</th>${k.p1.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>ĐA</th>${k.p1.map((ans,i)=>`<td><select data-ek="p1" data-q="${i}" style="font-weight:bold;padding:3px">${['A','B','C','D','*'].map(opt=>`<option value="${opt}" ${ans===opt?'selected':''}>${opt==='*'?'* (Tặng điểm)':opt}</option>`).join('')}</select></td>`).join('')}</tr></table></div></div>`:''}
    ${k.p2.length?`<div style="margin-top:8px"><b>Phần II (Mã ${c.code}):</b><div style="overflow-x:auto"><table class="k"><tr><th>Câu</th><th>a)</th><th>b)</th><th>c)</th><th>d)</th></tr>${k.p2.map((row,i)=>`<tr><td><b>Câu ${i+1}</b></td>${row.map((val,r)=>`<td><select data-ek="p2" data-q="${i}" data-r="${r}" style="font-weight:bold;color:${val?'var(--ok)':'var(--bad)'}"><option value="1" ${val?'selected':''}>Đúng</option><option value="0" ${!val?'selected':''}>Sai</option></select></td>`).join('')}</tr>`).join('')}</table></div></div>`:''}
    ${(k.tn||[]).length?`<div style="margin-top:8px"><b>Phần III (Mã ${c.code}):</b><div style="overflow-x:auto"><table class="k"><tr><th>Câu</th>${k.tn.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>ĐA</th>${k.tn.map((ans,i)=>`<td><input data-ek="tn" data-q="${i}" value="${esc(ans)}" maxlength="4" style="width:68px;text-align:center;font-weight:bold"></td>`).join('')}</tr></table></div></div>`:''}
  </div>`;
}

function otsu(g){const h=new Array(256).fill(0);for(let i=0;i<g.length;i++)h[g[i]]++;let s=0;for(let i=0;i<256;i++)s+=i*h[i];let sb=0,wb=0,mx=0,t=128;const n=g.length;for(let i=0;i<256;i++){wb+=h[i];if(!wb)continue;const wf=n-wb;if(!wf)break;sb+=i*h[i];const m1=sb/wb,m2=(s-sb)/wf,v=wb*wf*(m1-m2)*(m1-m2);if(v>mx){mx=v;t=i}}return t}
function findAnch(B,W,H){const out=[],rw=W*.3|0,rh=H*.25|0,seen=new Uint8Array(W*H),regs=[[0,0],[W-rw,0],[0,H-rh],[W-rw,H-rh]],cn=[[0,0],[W,0],[0,H],[W,H]];
for(let k=0;k<4;k++){const[x0,y0]=regs[k];let best=null,bd=1e18;for(let y=y0;y<y0+rh;y++)for(let x=x0;x<x0+rw;x++){const p=y*W+x;if(!B[p]||seen[p])continue;let st=[p],a=0,mnx=x,mxx=x,mny=y,mxy=y,sx=0,sy=0;seen[p]=1;
while(st.length){const q=st.pop(),qx=q%W,qy=(q/W)|0;a++;sx+=qx;sy+=qy;if(qx<mnx)mnx=qx;if(qx>mxx)mxx=qx;if(qy<mny)mny=qy;if(qy>mxy)mxy=qy;for(const n of [q-1,q+1,q-W,q+W]){if(n<0||n>=W*H||seen[n]||!B[n])continue;const nx=n%W,ny=(n/W)|0;if(Math.abs(nx-qx)>1||nx<x0||nx>=x0+rw||ny<y0||ny>=y0+rh)continue;seen[n]=1;st.push(n)}}
const bw=mxx-mnx+1,bh=mxy-mny+1;if(bw>W*.012&&bw<W*.07&&bh>W*.012&&bh<W*.07&&bw/bh>.7&&bw/bh<1.4&&a/(bw*bh)>.8){const cx=sx/a,cy=sy/a,d=(cx-cn[k][0])**2+(cy-cn[k][1])**2;if(d<bd){bd=d;best=[cx,cy]}}}
if(!best)return null;out.push(best)}return out}
function homog(s,d){const A=[],b=[];for(let i=0;i<4;i++){const[x,y]=s[i],[u,v]=d[i];A.push([x,y,1,0,0,0,-u*x,-u*y]);b.push(u);A.push([0,0,0,x,y,1,-v*x,-v*y]);b.push(v)}const n=8;for(let i=0;i<n;i++){let m=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[m][i]))m=r;[A[i],A[m]]=[A[m],A[i]];[b[i],b[m]]=[b[m],b[i]];for(let r=i+1;r<n;r++){const f=A[r][i]/A[i][i];for(let c=i;c<n;c++)A[r][c]-=f*A[i][c];b[r]-=f*b[i]}}const h=Array(n);for(let i=n-1;i>=0;i--){let t=b[i];for(let c=i+1;c<n;c++)t-=A[i][c]*h[c];h[i]=t/A[i][i]}return h}
const ap=(h,x,y)=>{const w=h[6]*x+h[7]*y+1;return[(h[0]*x+h[1]*y+h[2])/w,(h[3]*x+h[4]*y+h[5])/w]};
function dark(B,W,H,cx,cy,r){let n=0,t=0;const R=Math.ceil(r);for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){if(x*x+y*y>r*r)continue;const px=Math.round(cx+x),py=Math.round(cy+y);if(px<0||py<0||px>=W||py>=H)continue;t++;n+=B[py*W+px]}return t?n/t:0}

function gradePage(cv,e){
  const W=cv.width,H=cv.height,ctx=cv.getContext('2d'),im=ctx.getImageData(0,0,W,H).data,g=new Uint8Array(W*H);
  for(let i=0;i<g.length;i++)g[i]=(im[i*4]*.3+im[i*4+1]*.59+im[i*4+2]*.11)|0;
  const t=otsu(g),B=new Uint8Array(W*H);for(let i=0;i<g.length;i++)B[i]=g[i]<=t?1:0;
  const an=findAnch(B,W,H);if(!an)return{err:'Không tìm thấy đủ 4 ô vuông định vị góc'};
  const h=homog(AN,an),s=(Math.hypot(an[1][0]-an[0][0],an[1][1]-an[0][1])/(PW-120)+Math.hypot(an[2][0]-an[0][0],an[2][1]-an[0][1])/(PH-120))/2,r=BR*s*.62,rd=o=>{const[x,y]=ap(h,o.x,o.y);return dark(B,W,H,x,y,r)};
  const dig=(L,n)=>{let o='';for(let i=0;i<n;i++){let m=-1,mv=.5;for(const b of L.filter(b=>b.i===i)){const v=rd(b);if(v>mv){mv=v;m=b.d}}o+=m<0?'?':m}return o};
  const sbd=dig(LAY.sbd,6),ma=dig(LAY.ma,3),c=e.codes.find(x=>x.code===ma);
  if(!c)return{err:'Mã đề không hợp lệ ('+ma+')',sbd,ma};
  const mark=(o,ok)=>{if(!o)return;const[x,y]=ap(h,o.x,o.y);ctx.beginPath();ctx.arc(x,y,(BR+2)*s,0,7);ctx.fillStyle=ok?'rgba(22,163,74,.5)':'rgba(220,38,38,.55)';ctx.fill();ctx.lineWidth=3*s;ctx.strokeStyle=ok?'#16a34a':'#dc2626';ctx.stroke()};
  let sc=0,mx=0;
  c.key.p1.forEach((a,q)=>{mx+=c.key.pt1[q];const os=LAY.p1.filter(o=>o.q===q),m=os.filter(o=>rd(o)>=.5);if(a==='*'){sc+=c.key.pt1[q];mark(m[0]||os[0],true);return}const k=os['ABCD'.indexOf(a)];if(m.length===1&&m[0]===k){sc+=c.key.pt1[q];mark(k,true)}else mark(k,false)});
  c.key.p2.forEach((row,q)=>{mx+=c.key.pt2[q];let n=0;row.forEach((tv,r2)=>{const os=LAY.p2.filter(o=>o.q===q&&o.r===r2),m=os.filter(o=>rd(o)>=.5),k=os[tv?0:1];if(m.length===1&&m[0]===k){n++;mark(k,true)}else mark(k,false)});sc+=c.key.pt2[q]*[0,.1,.25,.5,1][n]});
  (c.key.tn||[]).forEach((ans,q)=>{mx+=c.key.pt3[q];const os=LAY.tn.filter(o=>o.q===q);let s2='';for(let cc=0;cc<4;cc++){const m=os.filter(o=>o.c===cc&&rd(o)>=.5);if(m.length===1)s2+=m[0].k;else if(m.length>1)s2+='#'}const ok=s2===ans;if(ok)sc+=c.key.pt3[q];[...ans].forEach((ch,i)=>{const o=os.find(o=>o.c===i&&o.k===(isNaN(ch)?ch:+ch));if(o)mark(o,ok)})});
  sc=Math.round(sc*100)/100;mx=Math.round(mx*100)/100;
  const[tx,ty]=ap(h,110,172);ctx.fillStyle='#dc2626';ctx.font='bold '+(44*s)+'px Arial';ctx.textAlign='left';ctx.fillText(sc+'/'+mx,tx,ty);
  return{sbd,ma,sc,mx};
}

function gtable(){return G.rows.length?`<div style='overflow-x:auto'><table class='k'><tr><th>#</th><th>File / Trang</th><th>SBD</th><th>Mã đề</th><th>Điểm số</th><th>Trạng thái</th></tr>${G.rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.name)}</td><td><b>${r.sbd||''}</b></td><td><span class="badge">${r.ma||''}</span></td><td><b style="color:var(--ok)">${r.err?'—':r.sc+' / '+r.mx}</b></td><td>${r.err?`<span style="color:var(--bad)">${esc(r.err)}</span>`:'✅'}</td></tr>`).join('')}</table></div>`:`<p class='hint'>Chưa có bài chấm nào.</p>`}
const gView=()=>{const o=$('#gres');if(o)o.innerHTML=gtable()};
function gradeView(e){return answerKeyEditor(e) + `<div class='card'><div class='row sp'><div class='row'><button class='btn pri' data-a='gopen'>📂 Chọn bài</button>${G.files.length?`<button class='btn warn' data-a='regrade'>🔄 Chấm lại</button>`:''}<button class='btn ok' data-a='gdl' ${G.blob?'':'disabled'}>⬇ PDF</button></div></div><div id='gres'>${gtable()}</div></div>`}

async function runGrade(fs){
  const e=E();if(!e||!e.codes.length)return toast('Hãy tạo mã đề trước.');
  G.files = fs; G.rows=[]; G.blob=null;
  const pdf=new jspdf.jsPDF({unit:'mm',format:'a4'});let first=true;
  const push=async(cv,name)=>{
    const r=gradePage(cv,e);G.rows.push(Object.assign({name},r));
    if(r.err){const x=cv.getContext('2d');x.fillStyle='#dc2626';x.font='bold 44px Arial';x.fillText('LỖI: '+r.err,30,70)}
    if(!first)pdf.addPage();first=false;
    pdf.addImage(cv.toDataURL('image/jpeg',.85),'JPEG',0,0,210,Math.min(297,210*cv.height/cv.width));
    gView();await new Promise(k=>setTimeout(k));
  };
  try{
    toast('Đang chấm tự động…');
    for(const f of fs){
      if(/pdf$/i.test(f.name)||f.type==='application/pdf'){
        pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const d=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
        for(let p=1;p<=d.numPages;p++){
          const pg=await d.getPage(p),v0=pg.getViewport({scale:1}),vp=pg.getViewport({scale:1600/v0.width}),cv=document.createElement('canvas');
          cv.width=vp.width|0;cv.height=vp.height|0;await pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
          await push(cv,f.name+' – tr.'+p);
        }
      } else {
        const im=new Image();await new Promise(ok=>{im.onload=ok;im.src=URL.createObjectURL(f)});
        const r=Math.min(1,1600/im.width),cv=document.createElement('canvas');cv.width=im.width*r|0;cv.height=im.height*r|0;
        cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);await push(cv,f.name);
      }
    }
    if(first)return toast('Không có trang nào để chấm.');
    G.blob=pdf.output('blob');render();toast('Đã chấm xong '+G.rows.length+' bài!');
  }catch(er){toast('Lỗi khi chấm: '+er.message)}
}

async function printPdf(kind){
  const e=E();if(!e.codes.length)return toast('Hãy tạo mã đề trước.');
  if(!e.reviewedDocx)return toast('🔒 Hoàn thành Bước 1 trước');
  hideIwOverlay(); toast('Đang kết xuất PDF chốt cuối (KaTeX sắc nét)…');
  try{
    const st=document.createElement('div');st.style.cssText='position:fixed;left:-9999px;top:0;width:794px';document.body.append(st);
    const prevEdit = editPaper; editPaper = false;
    for(const c of e.codes){
      const pdf=new jspdf.jsPDF({unit:'mm',format:'a4'}), pg=document.createElement('div');
      pg.className='paper'; pg.style.cssText=`width:794px;min-height:1123px;padding:45px 55px;box-sizing:border-box;background:#fff;color:#000;font:13pt/1.45 ${F};border:none;box-shadow:none;margin:0`;
      if(kind==='de') pg.innerHTML = buildStandardExamHtml(e, c, false);
      else {
        const k=c.key;
        pg.innerHTML = `<h3 style="text-align:center">${esc(e.name)} – ĐÁP ÁN MÃ ĐỀ ${c.code}</h3>`
          +(k.p1.length?`<b>Phần I:</b><table class="k"><tr><th>Câu</th>${k.p1.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>ĐA</th>${k.p1.map(a=>`<td>${a}</td>`).join('')}</tr></table>`:'')
          +(k.p2.length?`<br><b>Phần II:</b><table class="k"><tr><th>Câu</th><th>a</th><th>b</th><th>c</th><th>d</th></tr>${k.p2.map((r,i)=>`<tr><td>${i+1}</td>${r.map(v=>`<td>${v?'Đ':'S'}</td>`).join('')}</tr>`).join('')}</table>`:'')
          +((k.tn||[]).length?`<br><b>Phần III:</b><table class="k"><tr><th>Câu</th>${k.tn.map((_,i)=>`<th>${i+1}</th>`).join('')}</tr><tr><th>ĐA</th>${k.tn.map(a=>`<td>${a}</td>`).join('')}</tr></table>`:'');
      }
      st.append(pg);
      const cv=await html2canvas(pg,{scale:2,backgroundColor:'#fff'}), imgH = cv.height * 210 / cv.width;
      let heightLeft = imgH, pos = 0;
      pdf.addImage(cv.toDataURL('image/jpeg',.95),'JPEG',0,pos,210,imgH); heightLeft -= 297;
      while(heightLeft > 5){ pos = heightLeft - imgH; pdf.addPage(); pdf.addImage(cv.toDataURL('image/jpeg',.95),'JPEG',0,pos,210,imgH); heightLeft -= 297; }
      st.textContent=''; await dlBlob((kind==='key'?'Dap-an-chot-ma-':'De-chot-ma-')+c.code+'.pdf',pdf.output('blob'));
      await new Promise(r=>setTimeout(r,450));
    }
    editPaper = prevEdit; st.remove(); toast('Đã xuất '+e.codes.length+' file PDF chốt!');
  }catch(er){toast('Lỗi tạo PDF: '+er.message)}
}
