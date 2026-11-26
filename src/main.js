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

// Retry unavailable marketplace artwork with a real site icon, then hide broken images.
document.querySelectorAll('.platform-brand-image img').forEach(img=>{const recover=()=>{if(img.dataset.backup&&!img.dataset.retried){img.dataset.retried='1';img.src=img.dataset.backup;}else{img.parentElement.hidden=true;img.parentElement.style.display='none';}};img.addEventListener('error',recover);if(img.complete&&!img.naturalWidth)recover();});

// Auto-advance reference galleries; visitors can pause or navigate manually.
document.querySelectorAll('.work-slider').forEach(slider=>{const track=slider.querySelector('.work-slider-track'),slides=[...track.children],counter=slider.querySelector('.work-slider-count'),pause=slider.querySelector('[data-work-pause]'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let index=0,paused=reduce.matches,hover=false;const show=n=>{index=(n+slides.length)%slides.length;track.style.transform='translateX(-'+index*100+'%)';slides.forEach((s,i)=>{s.inert=i!==index;});counter.textContent=(index+1)+' / '+slides.length;};const sync=()=>{pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Play automatic slides':'Pause automatic slides');};slider.querySelector('[data-work-prev]').addEventListener('click',()=>show(index-1));slider.querySelector('[data-work-next]').addEventListener('click',()=>show(index+1));pause.addEventListener('click',()=>{paused=!paused;sync();});slider.addEventListener('mouseenter',()=>hover=true);slider.addEventListener('mouseleave',()=>hover=false);setInterval(()=>{if(!paused&&!hover&&!slider.contains(document.activeElement)&&!document.hidden)show(index+1);},5500);sync();show(0);});
