const root=document.documentElement;
const toggle=document.getElementById('theme-toggle');
function renderTheme(theme){
  root.setAttribute('data-theme',theme);
  const dark=theme==='dark';
  toggle.querySelector('i').className=dark?'fas fa-sun':'fas fa-moon';
  toggle.querySelector('span').textContent=dark?'Light':'Dark';
}
renderTheme(root.getAttribute('data-theme')||'light');
toggle.addEventListener('click',()=>{
  const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
  localStorage.setItem('v15-theme',next); renderTheme(next);
});
const menu=document.querySelector('.menu-toggle'), links=document.querySelector('.nav-links');
menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const sections=[...document.querySelectorAll('main section[id]')], nav=[...document.querySelectorAll('.nav-links a[href^="#"]')];
nav[0]?.classList.add('active');

// V18.3 TEST: a single liquid-glass pill glides between active nav links.
// It lives inside .topnav (not .nav-links), so it cannot alter flex layout.
const topnav=document.querySelector('.topnav');
const liquidIndicator=document.createElement('span');
liquidIndicator.className='liquid-nav-indicator';
liquidIndicator.setAttribute('aria-hidden','true');
topnav?.appendChild(liquidIndicator);

let indicatorReady=false;
function positionLiquidIndicator(link, instant=false){
  if(!topnav || !link || window.innerWidth<=900){
    liquidIndicator.classList.remove('is-visible');
    topnav?.classList.remove('nav-indicator-ready');
    indicatorReady=false;
    return;
  }

  const navRect=topnav.getBoundingClientRect();
  const linkRect=link.getBoundingClientRect();

  if(instant) liquidIndicator.classList.add('no-motion');

  liquidIndicator.style.setProperty('--indicator-x', `${linkRect.left-navRect.left}px`);
  liquidIndicator.style.setProperty('--indicator-y', `${linkRect.top-navRect.top}px`);
  liquidIndicator.style.width=`${linkRect.width}px`;
  liquidIndicator.style.height=`${linkRect.height}px`;
  liquidIndicator.classList.add('is-visible');

  // Only suppress V18.1's static active background AFTER the moving pill
  // has a valid size/position. If this ever fails, V18.1 remains visible.
  if(linkRect.width>0 && linkRect.height>0){
    topnav.classList.add('nav-indicator-ready');
    indicatorReady=true;
  }

  if(instant){
    requestAnimationFrame(()=>requestAnimationFrame(()=>
      liquidIndicator.classList.remove('no-motion')
    ));
  }
}
function updateActiveNav(){
  let current='home';

  // At the bottom of the page, force the final section active.
  // This fixes Contact never becoming active when the viewport is
  // taller than the remaining Contact/footer content.
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 8;

  if (nearBottom && sections.length) {
    current = sections[sections.length - 1].id;
  } else {
    sections.forEach(s=>{
      if(window.scrollY >= s.offsetTop - 140) current=s.id;
    });
  }

  let activeLink=null;
  nav.forEach(a=>{
    const active=a.getAttribute('href')==='#'+current;
    a.classList.toggle('active',active);
    if(active) activeLink=a;
  });
  positionLiquidIndicator(activeLink);
}

window.addEventListener('scroll',updateActiveNav,{passive:true});
window.addEventListener('resize',()=>{
  updateActiveNav();
  const activeLink=nav.find(a=>a.classList.contains('active'));
  positionLiquidIndicator(activeLink,true);
},{passive:true});
updateActiveNav();
requestAnimationFrame(()=>{
  const activeLink=nav.find(a=>a.classList.contains('active'));
  positionLiquidIndicator(activeLink,true);
});

// V18.5 TEST — accessible expandable project cards
document.querySelectorAll('.expandable-project').forEach(card=>{const panel=card.querySelector('.project-repo-panel'),hintText=card.querySelector('.project-expand-hint span'),githubLink=card.querySelector('.project-github-btn');const setExpanded=expanded=>{card.classList.toggle('is-expanded',expanded);card.setAttribute('aria-expanded',String(expanded));panel?.setAttribute('aria-hidden',String(!expanded));if(hintText)hintText.textContent=expanded?'Hide project link':'View project'};const toggleCard=()=>setExpanded(card.getAttribute('aria-expanded')!=='true');card.addEventListener('click',event=>{if(event.target.closest('a,button'))return;toggleCard()});card.addEventListener('keydown',event=>{if(event.target.closest('a,button'))return;if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleCard()}});githubLink?.addEventListener('click',event=>event.stopPropagation())});
