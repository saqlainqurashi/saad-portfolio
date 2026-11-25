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
