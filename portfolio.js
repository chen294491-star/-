(() => {
'use strict';
const data=window.PORTFOLIO,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pad=n=>String(n).padStart(2,'0');
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function reveal(n){if(!reduced.matches&&n.animate)n.animate([{opacity:.3,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});}
$('#profile-intro').textContent=data.profile.intro;
// 展示位只说明资料待补，不创建虚构作品或播放入口。
function videoSlot(type,index){
 const card=el('article','video-card'),live=type==='live',game=type==='game';
 const label=game?'游戏账号代表内容':live?'真人影视 AI 作品':'动画类 AI 作品';
 const poster=el('div','video-placeholder'+(live?' live':''));
 poster.setAttribute('aria-label',label+'展示位'+pad(index+1)+'，成片待补');
 poster.append(el('span','slot-number',pad(index+1)+' / '+(game?'GAMING':live?'LIVE ACTION':'ANIMATION')),el('span','slot-mark',game?'↗':live?'◇':'✦'),el('strong','',label+'展示位'),el('small','','成片 / 封面待补充'));
 const meta=el('div','slot-meta');meta.append(el('span','',game?'内容制作与账号实践':'AI VIDEO / 作品预留'),el('span','','资料待补'));
 card.append(poster,meta,el('h3','','作品名称待补'),el('p','',game?'选题思路、制作内容与阶段表现待补充。':'创意主题、个人职责与制作亮点待补充。'));return card;
}
for(let i=0;i<data.layout.animationSlots;i++)$('#animation-slots').append(videoSlot('animation',i));
for(let i=0;i<data.layout.liveActionSlots;i++)$('#live-slots').append(videoSlot('live',i));
for(let i=0;i<data.layout.gameContentSlots;i++)$('#game-content-slots').append(videoSlot('game',i));
function renderMetrics(container,list){list.forEach(m=>{const n=el('div','metric');n.append(el('span','metric-label',m.label),el('strong','metric-value',m.value===null?'—':String(m.value)),el('span','metric-detail',m.detail));container.append(n);});}
renderMetrics($('#ai-metrics'),data.metrics.ai);renderMetrics($('#game-metrics'),data.metrics.game);
for(let i=0;i<data.layout.internshipSlots;i++){
 const card=el('article','experience-card'),top=el('div','experience-top');top.append(el('span','mono','PROJECT / '+pad(i+1)),el('span','','待补充'));
 const fields=el('dl','project-outline');[['项目背景','平台、岗位与时间待补'],['个人贡献','职责、执行与作品待补'],['阶段成果','结果、周期与复盘待补']].forEach(([a,b])=>{const row=el('div');row.append(el('dt','',a),el('dd','',b));fields.append(row);});
 const metric=el('div','experience-data');metric.append(el('span','','核心成果数据'),el('strong','','—'),el('small','','指标与统计周期待补'));
 card.append(top,el('h3','','实习 / 项目展示位 '+pad(i+1)),el('p','','围绕具体工作，展示项目背景、个人执行与可核对的结果。'),fields,metric,el('div','experience-screenshot','作品 / 成果截图待补'));$('#experience-slots').append(card);
}
function wireTabs(container,selector,key,panelFor){
 const buttons=[...container.querySelectorAll(selector)];
 const activate=b=>{buttons.forEach(n=>{const active=n===b;n.setAttribute('aria-selected',String(active));n.tabIndex=active?0:-1;$(panelFor(n.dataset[key])).hidden=!active;});reveal($(panelFor(b.dataset[key])));};
 buttons.forEach(b=>b.addEventListener('click',()=>activate(b)));
 container.addEventListener('keydown',e=>{const i=buttons.indexOf(e.target);if(i<0)return;let next;if(e.key==='ArrowRight')next=(i+1)%buttons.length;if(e.key==='ArrowLeft')next=(i-1+buttons.length)%buttons.length;if(e.key==='Home')next=0;if(e.key==='End')next=buttons.length-1;if(next!==undefined){e.preventDefault();activate(buttons[next]);buttons[next].focus({preventScroll:true});}});
}
wireTabs($('.video-tabs'),'[data-ai-tab]','aiTab',id=>'#ai-panel-'+id);
wireTabs($('.evidence-tabs'),'[data-evidence-tab]','evidenceTab',id=>'#evidence-'+id);
const menu=$('#menu-toggle'),nav=$('#main-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
$$('.main-nav a,.brand').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus({preventScroll:true});}});
// 工具按流程用途组织；不显示熟练度评分或能力百分比。
const toolMap=new Map(data.tools.map(t=>[t.id,t])),steps=$('#workflow-steps');
let currentStage=0,playing=false,timer=null;
data.workflow.forEach((s,i)=>{
 const b=el('button','workflow-step');b.type='button';b.id='workflow-tab-'+s.id;b.dataset.stage=String(i);b.setAttribute('role','tab');b.setAttribute('aria-controls','workflow-panel');b.setAttribute('aria-selected','false');b.tabIndex=-1;
 b.append(el('span','step-icon',s.symbol),el('span','step-label',s.name),el('span','step-count',pad(i+1)));b.addEventListener('click',()=>{stopPlayback();setStage(i);});steps.append(b);
});
function selectTool(id){
 const t=toolMap.get(id);if(!t)return;$('#tool-name').textContent=t.name;$('#tool-description').textContent=t.description;$('#tool-purpose').textContent=t.purpose;$('#tool-detail-icon').textContent=t.symbol;$('#tool-detail-category').textContent=data.workflow[currentStage].name;
 $$('#tool-grid button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===id)));
}
function setStage(index){
 currentStage=index;const s=data.workflow[index];
 $('#stage-kicker').textContent=s.kicker;$('#stage-title').textContent=s.title;$('#stage-description').textContent=s.description;$('#stage-input').textContent=s.input;$('#stage-output').textContent=s.output;
 $('#workflow-panel').setAttribute('aria-labelledby','workflow-tab-'+s.id);steps.style.setProperty('--flow-progress',(index/(data.workflow.length-1)*100)+'%');
 $$('.workflow-step').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});
 $('#tool-grid').replaceChildren();s.tools.forEach(id=>{const t=toolMap.get(id),b=el('button','tool-chip');b.type='button';b.dataset.tool=id;b.setAttribute('aria-pressed','false');b.append(el('span','tool-symbol',t.symbol),el('span','tool-label',t.name));b.addEventListener('click',()=>{stopPlayback();selectTool(id);});$('#tool-grid').append(b);});
 selectTool(s.tools[0]);$('#workflow-position').textContent=pad(index+1)+' / '+pad(data.workflow.length)+' · '+s.name;reveal($('#workflow-panel'));
}
function stopPlayback(){clearTimeout(timer);timer=null;playing=false;$('.tool-workbench').classList.remove('is-playing');$('#play-workflow').setAttribute('aria-pressed','false');$('#play-label').textContent='演示工作流';$('#play-workflow').firstElementChild.textContent='▷';}
function advance(){if(!playing)return;if(currentStage===data.workflow.length-1){stopPlayback();return;}setStage(currentStage+1);timer=setTimeout(advance,1700);}
$('#play-workflow').addEventListener('click',()=>{
 if(playing){stopPlayback();return;}playing=true;$('.tool-workbench').classList.add('is-playing');$('#play-workflow').setAttribute('aria-pressed','true');$('#play-label').textContent='暂停演示';$('#play-workflow').firstElementChild.textContent='Ⅱ';setStage(0);timer=setTimeout(advance,1700);
});
steps.addEventListener('keydown',e=>{const tabs=$$('.workflow-step'),i=tabs.indexOf(e.target);if(i<0)return;let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();stopPlayback();setStage(next);tabs[next].focus({preventScroll:true});}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback();});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&playing)stopPlayback();});observer.observe($('.tool-workbench'));}
setStage(0);
const chapterIds=['intro',...data.sectionOrder];let scheduled=false;
function syncNavigation(){scheduled=false;let current='intro';chapterIds.forEach(id=>{if($('#'+id).getBoundingClientRect().top<=innerHeight*.34)current=id;});if(scrollY+innerHeight>=document.documentElement.scrollHeight-4)current='skills';$$('.main-nav a').forEach(a=>{if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});const distance=document.documentElement.scrollHeight-innerHeight;$('.reading-progress span').style.transform='scaleX('+(distance>0?Math.min(1,scrollY/distance):0)+')';}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(syncNavigation);}},{passive:true});addEventListener('resize',()=>{if(innerWidth>1000)closeMenu();syncNavigation();});
if(/^#case\//.test(location.hash))history.replaceState(null,'','#ai');
syncNavigation();
})();
