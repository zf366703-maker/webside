
// Year
document.getElementById('year').textContent=new Date().getFullYear();

// Open/Closed status: Mon-Thu 9:30-21, Fri-Sun 9-22
function computeStatus(){
  const d=new Date(),day=d.getDay(),h=d.getHours(),m=d.getMinutes(),mins=h*60+m;
  // 0 sun,1 mon..6 sat
  let open,close;
  if(day>=1 && day<=4){open=9*60+30;close=21*60;}
  else{open=9*60;close=22*60;}
  return mins>=open && mins<close;
}
function renderStatus(){
  const el=document.getElementById('status-banner');if(!el)return;
  const open=computeStatus();
  const lang=localStorage.getItem('lang')||'es';
  if(open){el.className='status-banner status-open';el.textContent=lang==='es'?'⬤ ABIERTO AHORA':'⬤ OPEN NOW';}
  else{el.className='status-banner status-closed';el.textContent=lang==='es'?'⬤ CERRADO':'⬤ CLOSED';}
}
renderStatus();setInterval(renderStatus,30000);

// i18n toggle
function applyLang(lang){
  localStorage.setItem('lang',lang);
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-es]').forEach(el=>{
    const v=el.getAttribute('data-'+lang);if(v)el.textContent=v;
  });
  document.querySelectorAll('.lang-switch button').forEach(b=>{
    b.classList.toggle('active',b.dataset.lang===lang);
  });
  renderStatus();
}
document.querySelectorAll('.lang-switch button').forEach(b=>{
  b.addEventListener('click',()=>applyLang(b.dataset.lang));
});
applyLang(localStorage.getItem('lang')||'es');


// Reviews stored in localStorage (single shared key)
const RKEY='dsbs_reviews_v1';
function loadReviews(){try{return JSON.parse(localStorage.getItem(RKEY)||'[]')}catch(e){return[]}}
function saveReviews(r){localStorage.setItem(RKEY,JSON.stringify(r))}
function seedReviews(){
  if(loadReviews().length)return;
  saveReviews([
    {name:'Luis M.',rating:5,text:'Mejor fade del Bronx, sin duda. Atención top.',date:'2026-04-18'},
    {name:'Carlos R.',rating:5,text:'Llevo años cortándome aquí. Profesionales y rápidos.',date:'2026-03-22'},
    {name:'Anthony D.',rating:5,text:'Excelente trato, ambiente y resultado. 100% recomendado.',date:'2026-02-10'},
  ]);
}
function renderReviews(){
  const list=document.getElementById('reviews-list');if(!list)return;
  const items=loadReviews().slice().reverse();
  list.innerHTML=items.map(r=>`
    <div class="review-card">
      <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <p>${r.text.replace(/</g,'&lt;')}</p>
      <div class="name">${r.name.replace(/</g,'&lt;')}</div>
      <div class="date">${r.date}</div>
    </div>`).join('') || '<p class="muted text-center">Sé el primero en dejar una reseña.</p>';
}
function setupReviewForm(){
  seedReviews();renderReviews();
  let rating=5;
  const stars=document.querySelectorAll('#star-input span');
  stars.forEach((s,i)=>{
    s.addEventListener('click',()=>{rating=i+1;stars.forEach((x,j)=>x.classList.toggle('on',j<rating))});
  });
  const form=document.getElementById('review-form');if(!form)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.name.value.trim(),text=form.text.value.trim();
    if(name.length<2||text.length<5)return alert('Por favor completa tu nombre y reseña.');
    const all=loadReviews();
    all.push({name,rating,text,date:new Date().toISOString().slice(0,10)});
    saveReviews(all);form.reset();rating=5;stars.forEach((x,j)=>x.classList.toggle('on',j<5));
    renderReviews();
  });
}
document.addEventListener('DOMContentLoaded',setupReviewForm);
