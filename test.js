'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {levels,start,move,dirs}=require('./game.js');
function solve(i){
 const q=[[start(i),'']],seen=new Set();
 for(let a=0;a<q.length;a++){
  const [s,path]=q[a];if(s.status==='won')return {path,visited:a+1};
  for(const d of Object.keys(dirs)){
   const n=move(s,d);if(n===s||n.status==='empty')continue;
   const k=JSON.stringify([n.x,n.y,n.energy,n.parcels,n.charged]);
   if(!seen.has(k)){seen.add(k);q.push([n,path+d[0]]);}
  }
  assert(q.length<250000,'bounded solver queue exceeded');
 }
 throw new Error('No solution for route '+i);
}
const solutions=levels.map((_,i)=>solve(i));
let s=start(0);assert.equal(move(s,'up'),s);assert.equal(move(s,'bad'),s);
const untouched=JSON.stringify(s);const n=move(s,'right');assert.equal(n.energy,9);assert.equal(JSON.stringify(s),untouched);
s=move(n,'right');assert.equal(s.parcels.length,0);
// A depleted courier can finish on the last step, but stops otherwise.
assert.equal(move({...s,x:4,y:1,energy:1},'right').status,'won');
assert.equal(move({...s,x:2,y:1,energy:1},'left').status,'empty');
assert.equal(move({...s,status:'empty'},'right').status,'empty');
let c=move({...start(0),x:2,y:3,energy:1},'right');assert.equal(c.energy,10);assert.equal(c.charged.length,1);
c=move(move(c,'left'),'right');assert.equal(c.energy,8);assert.equal(c.charged.length,1);
assert.equal(move({...start(0),x:4,y:1,energy:2},'right').status,'playing');
assert.throws(()=>start(99));
// Synthetic DOM harness: exercises actual UI handlers, not browser rendering.
class Element{
 constructor(){this.children=[];this.style={};this.listeners={};this.value='0';this.dataset={};this.tagName='DIV';}
 append(c){this.children.push(c);} replaceChildren(){this.children=[];}
 setAttribute(k,v){this[k]=v;} addEventListener(k,fn){this.listeners[k]=fn;}
}
const ids=Object.fromEntries(['board','level','reset','undo','stats','status'].map(x=>[x,new Element()]));
const buttons=Object.keys(dirs).map(d=>{let e=new Element();e.dataset.dir=d;return e;});
const doc={getElementById:id=>ids[id],createElement:()=>new Element(),querySelectorAll:()=>buttons,listeners:{},addEventListener(k,v){this.listeners[k]=v;}};
const ctx={document:doc,Courier:require('./game.js')};vm.createContext(ctx);vm.runInContext(fs.readFileSync('ui.js','utf8'),ctx);
// Every cell, including walls and empty floor, must be represented spatially.
for(let i=0;i<levels.length;i++){
 ids.level.value=String(i);ids.level.listeners.change();
 const label=ids.board['aria-label'],l=levels[i];
 assert.match(label,new RegExp(`^${l.map[0].length} columns, ${l.map.length} rows\\.`));
 l.map.forEach((row,y)=>[...row].forEach((tile,x)=>{
  const type=tile==='#'?'wall':tile==='S'?'courier':tile==='E'?'exit':tile==='C'?'charger':tile==='*'?'parcel':'floor';
  assert(label.includes(`column ${x+1}, row ${y+1}: ${type}`),`missing ${i}:${x},${y}:${type}`);
 }));
}
ids.level.value='0';ids.level.listeners.change();
const initialLabel=ids.board['aria-label'];
buttons.find(b=>b.dataset.dir==='right').onclick();
assert.match(ids.board['aria-label'],/column 3, row 2: courier/);
assert.match(ids.board['aria-label'],/column 2, row 2: floor/);
ids.undo.onclick();assert.equal(ids.board['aria-label'],initialLabel);
const initial=ids.stats.textContent;buttons.find(b=>b.dataset.dir==='right').onclick();assert.notEqual(ids.stats.textContent,initial);
ids.undo.onclick();assert.equal(ids.stats.textContent,initial);
buttons[0].onclick();ids.reset.onclick();assert.equal(ids.stats.textContent,initial);
ids.level.value='1';ids.level.listeners.change();assert.equal(ids.board.children.length,48);
ids.level.value='0';ids.level.listeners.change();
const words={u:'up',d:'down',l:'left',r:'right'};
for(const d of solutions[0].path)buttons.find(b=>b.dataset.dir===words[d]).onclick();
assert.match(ids.status.textContent,/Delivered/);
ids.undo.onclick();assert.doesNotMatch(ids.status.textContent,/Delivered/);
let prevented=false;doc.listeners.keydown({key:'r',target:{tagName:'DIV'},preventDefault(){prevented=true;}});assert.equal(ids.stats.textContent,initial);
doc.listeners.keydown({key:'ArrowRight',target:{tagName:'DIV'},preventDefault(){prevented=true;}});assert(prevented);
console.log(JSON.stringify({runtime:process.version,platform:process.platform,rule_checks:'passed',synthetic_ui_handlers:'passed',solutions,interactive_browser_test:'NOT_PERFORMED'},null,2));
