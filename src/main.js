document.getElementById('year').textContent=new Date().getFullYear();
    const menu=document.getElementById('menu-toggle');const nav=document.getElementById('navigation');
    menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded)});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
    const filters=document.querySelectorAll('[data-filter]');const cards=document.querySelectorAll('[data-category]');
    filters.forEach(button=>button.addEventListener('click',()=>{const selection=button.dataset.filter;filters.forEach(f=>f.setAttribute('aria-pressed',String(f===button)));cards.forEach(card=>card.hidden=selection!=='all'&&card.dataset.category!==selection)}));
