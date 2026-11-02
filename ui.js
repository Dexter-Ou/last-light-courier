'use strict';
const {levels,start,move}=Courier;
const board=document.getElementById('board'),select=document.getElementById('level');
let state=start(0),history=[];
levels.forEach((l,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+l.name;select.append(o);});
function render(){
 const l=levels[state.level];board.replaceChildren();board.style.gridTemplateColumns=`repeat(${l.map[0].length},1fr)`;
 const descriptions=[];
 l.map.forEach((row,y)=>[...row].forEach((t,x)=>{
 const cell=document.createElement('span'),p=x+','+y;let text='',type='floor';
 if(t==='#')type='wall';if(t==='E')text='E';
 if(t==='C'&&!state.charged.includes(p)){text='+';type='charger';}
 if(state.parcels.includes(p)){text='◆';type='parcel';}
 if(x===state.x&&y===state.y){text='●';type='player';}
 cell.className='cell '+type;cell.textContent=text;board.append(cell);
 descriptions.push(`column ${x+1}, row ${y+1}: ${type==='player'?'courier':text==='E'?'exit':type}`);
 }));
 board.setAttribute('aria-label',`${l.map[0].length} columns, ${l.map.length} rows. `+descriptions.join('; '));
 document.getElementById('stats').textContent=`Battery ${state.energy}/${l.battery} · Parcels left ${state.parcels.length} · Steps ${state.moves}`;
 document.getElementById('status').textContent=state.status==='won'?'Delivered! Choose another route, or try fewer steps.':state.status==='empty'?'Battery empty. Undo a step or restart to plan another route.':'Collect the parcels and reach E. The charger works once.';
 document.getElementById('undo').disabled=!history.length;
}
function go(d){const n=move(state,d);if(n!==state){history.push(state);state=n;render();}}
function reset(){state=start(Number(select.value));history=[];render();}
function undo(){if(history.length){state=history.pop();render();}}
select.addEventListener('change',reset);document.getElementById('reset').onclick=reset;document.getElementById('undo').onclick=undo;
for(const b of document.querySelectorAll('[data-dir]'))b.onclick=()=>go(b.dataset.dir);
document.addEventListener('keydown',e=>{if(['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;
const d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'}[e.key];if(d){e.preventDefault();go(d);}else if(e.key==='u')undo();else if(e.key==='r')reset();});
render();
