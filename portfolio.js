(() => {
  'use strict';
  const $=s=>document.querySelector(s),menu=$('#menu-toggle'),nav=$('#main-nav');
  $('#profile-intro').textContent=window.PORTFOLIO.profile.intro;
  // 旧案例地址不再挂接任何作品或媒体。
  if(/^#case\//.test(location.hash)||['#process','#results','#more'].includes(location.hash))history.replaceState(null,'','#works');
  function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  document.querySelectorAll('.navlinks a,.brand').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  const ids=['intro','works','about','contact'];let pending=false;
  function sync(){pending=false;let active='intro';ids.forEach(id=>{if($('#'+id).getBoundingClientRect().top<=innerHeight*.35)active=id;});if(scrollY+innerHeight>=document.documentElement.scrollHeight-3)active='contact';document.querySelectorAll('.navlinks a').forEach(a=>{if(a.hash==='#'+active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});const d=document.documentElement.scrollHeight-innerHeight;$('.page-progress i').style.transform='scaleX('+(d>0?Math.min(1,scrollY/d):0)+')';}
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(sync);}},{passive:true});
  addEventListener('resize',()=>{if(innerWidth>700)closeMenu();sync();});sync();
})();
