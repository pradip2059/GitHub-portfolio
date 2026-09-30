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

  nav.forEach(a=>
    a.classList.toggle('active',a.getAttribute('href')==='#'+current)
  );
}

window.addEventListener('scroll',updateActiveNav,{passive:true});
window.addEventListener('resize',updateActiveNav,{passive:true});
updateActiveNav();
