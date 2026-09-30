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
window.addEventListener('scroll',()=>{
  let current='home';
  sections.forEach(s=>{if(window.scrollY>=s.offsetTop-140)current=s.id});
  nav.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));
},{passive:true});
