document.getElementById('year').textContent=new Date().getFullYear();
    const menu=document.getElementById('menu-toggle');const nav=document.getElementById('navigation');
    menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
    const filters=document.querySelectorAll('[data-filter]');const cards=document.querySelectorAll('[data-category]');
    filters.forEach(button=>button.addEventListener('click',()=>{const selection=button.dataset.filter;filters.forEach(f=>f.setAttribute('aria-pressed',String(f===button)));cards.forEach(card=>card.hidden=selection!=='all'&&card.dataset.category!==selection)}));

// Keep platform names visible even when external logo assets cannot load.
document.querySelectorAll('.market-orbit-logo img').forEach(img=>{const fallback=()=>img.parentElement.classList.add('logo-failed');img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback();});

// Brief visual feedback on click or tap; cards remain informational.
document.querySelectorAll('#expertise .service-card, #expertise .platform-card').forEach(card=>{card.addEventListener('click',()=>{card.classList.remove('expertise-tapped');void card.offsetWidth;card.classList.add('expertise-tapped');});card.addEventListener('animationend',event=>{if(event.animationName==='expertise-tap-feedback')card.classList.remove('expertise-tapped');});});

// Reveal the sharp portrait inside the logo orbit as the hero scrolls.
(()=>{
 const hero=document.querySelector('#home');
 if(!hero)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=window.matchMedia('(max-width:760px)');
 let pending=false;
 const paint=()=>{
  pending=false;
  if(reduce.matches){hero.style.removeProperty('--portrait-progress');hero.style.removeProperty('--portrait-background-opacity');return;}
  const rect=hero.getBoundingClientRect();
  const distance=Math.max(100,Math.min(260,rect.height*.33));
  const raw=Math.max(0,Math.min(1,(Math.max(0,window.scrollY))/distance));
  const p=raw*raw*(3-2*raw);
  hero.style.setProperty('--portrait-progress',String(p));
  hero.style.setProperty('--portrait-lift', (24*(1-p))+'px');
  hero.style.setProperty('--portrait-scale', String(.88+.12*p));
  hero.style.setProperty('--portrait-background-opacity',String((mobile.matches?.60:.76)*(1-.75*p)));
 };
 const request=()=>{if(!pending){pending=true;requestAnimationFrame(paint);}};
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request,{passive:true});reduce.addEventListener?.('change',request);paint();
})();
