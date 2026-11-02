/* Last Light Courier — original game, MIT license. */
(function(root){
'use strict';
const levels = [
 {name:'First delivery',battery:10,map:['#######','#S.*.E#','#.#.#.#','#..C..#','#######']},
 {name:'The detour',battery:8,map:['########','#S..#E.#','#.#.*..#','#*..#..#','#..C...#','########']},
 {name:'One last charge',battery:10,map:['#########','#S..#..E#','#.#.*.#.#','#*..C...#','#...#.*.#','#########']}
];
const dirs={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const key=(x,y)=>x+','+y;
function start(index){
 const l=levels[index]; if(!l) throw new Error('Unknown level');
 let pos; const parcels=[];
 l.map.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='S')pos=[x,y];if(c==='*')parcels.push(key(x,y));}));
 return {level:index,x:pos[0],y:pos[1],energy:l.battery,parcels,charged:[],moves:0,status:'playing'};
}
function move(s,d){
 if(s.status!=='playing'||!dirs[d]) return s;
 const l=levels[s.level], [dx,dy]=dirs[d], x=s.x+dx,y=s.y+dy;
 const tile=l.map[y]?.[x];if(!tile||tile==='#')return s;
 const n={...s,x,y,energy:s.energy-1,parcels:s.parcels.filter(p=>p!==key(x,y)),charged:[...s.charged],moves:s.moves+1};
 if(tile==='C'&&!n.charged.includes(key(x,y))){n.energy=l.battery;n.charged.push(key(x,y));}
 if(tile==='E'&&n.parcels.length===0)n.status='won';
 else if(n.energy<=0)n.status='empty';
 return n;
}
const api={levels,start,move,dirs};
if(typeof module!=='undefined'&&module.exports)module.exports=api; else root.Courier=api;
})(typeof window!=='undefined'?window:globalThis);
