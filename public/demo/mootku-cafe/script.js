(function(){
"use strict";
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MENU=[
{id:"pomfret",name:"Tandoori Pomfret",cat:"tandoor",label:"BESTSELLER",desc:"A signature tandoori favourite from the sea.",img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85"},
{id:"tandoori-chicken",name:"Tandoori Chicken",cat:"tandoor",label:"FROM THE TANDOOR",desc:"A classic, smoky favourite made for sharing.",img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85"},
{id:"paneer-lababdar",name:"Paneer Lababdar",cat:"indian",label:"VEG FAVOURITE",desc:"Paneer in a rich, creamy tomato gravy.",img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85"},
{id:"bbq-pizza",name:"BBQ Pizza",cat:"pizza",label:"PIZZA TIME",desc:"A crowd-pleasing pick for the whole table.",img:"https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85"},
{id:"chicken-dum-biryani",name:"Chicken Dum Biryani",cat:"biryani",label:"BESTSELLER",desc:"A proper meal, layered with fragrant flavour.",img:"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85"},
{id:"alaska-mojito",name:"Alaska Mojito",cat:"drinks",label:"COOL DOWN",desc:"A refreshing sip for a slower moment.",img:"https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85"},
{id:"tawa-fish",name:"Tawa Fish",cat:"indian",label:"SEAFOOD FAVOURITE",desc:"A flavour-packed pick from the sea.",img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85"},
{id:"chicken-biryani",name:"Chicken Biryani",cat:"biryani",label:"A TABLE CLASSIC",desc:"A comforting classic for lunch or dinner.",img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85"},
{id:"chilli-chicken",name:"Chilly Chicken",cat:"chinese",label:"CHINESE FAVOURITE",desc:"A spicy starter that brings everyone together.",img:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85"},
{id:"baby-corn",name:"Crispy Chilli Baby Corn",cat:"chinese",label:"VEG STARTER",desc:"Crisp, sweet and spicy — made for the middle of the table.",img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85"},
{id:"paneer-tikka",name:"Paneer Tikka Butter Masala",cat:"indian",label:"NORTH INDIAN",desc:"A creamy paneer favourite with a rich tomato base.",img:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85"},
{id:"pepper-chicken",name:"Pepper Onion Chicken",cat:"chinese",label:"CHEF'S PICK",desc:"A bold, savoury favourite from the Chinese menu.",img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85"}
];
let activeFilter="all";
function renderMenu(){
 const q=($("#menuSearch").value||"").trim().toLowerCase();
 const items=MENU.filter(x=>(activeFilter==="all"||x.cat===activeFilter)&&(!q||(x.name+" "+x.desc+" "+x.cat).toLowerCase().includes(q)));
 const grid=$("#menuGrid");
 grid.innerHTML=items.length?items.map(x=>'<article class="dish-card"><div class="dish-image"><img src="'+x.img+'" alt="'+x.name+'" loading="lazy"/><span class="dish-tag">'+x.label+'</span></div><h3>'+x.name+'</h3><p>'+x.desc+'</p><div class="dish-foot"><span class="dish-category">'+x.cat+'</span><a href="https://mootkucafe.com/menu" target="_blank" rel="noopener">VIEW MENU ↗</a></div></article>').join(""):'<div class="menu-empty">No favourites found. Try another search or category.</div>';
 if(!reduced) $$(".dish-card").forEach(card=>{
   card.addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform="perspective(700px) rotateX("+(-y*3)+"deg) rotateY("+(x*4)+"deg) translateY(-3px)";});
   card.addEventListener("pointerleave",()=>card.style.transform="");
 });
}
$("#menuTabs").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;$$(".tab").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-selected",String(x===b));});renderMenu();});
$("#menuSearch").addEventListener("input",renderMenu);
renderMenu();

const moods={
feast:{name:"Chicken Dum Biryani",desc:"A proper meal for a proper appetite.",img:"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85"},
share:{name:"Crispy Chilli Baby Corn",desc:"A crunchy, sweet-and-spicy centrepiece for the table.",img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85"},
comfort:{name:"Paneer Lababdar",desc:"Creamy, comforting and ready for a slow meal.",img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85"},
refresh:{name:"Alaska Mojito",desc:"A refreshing pick when you want something cool.",img:"https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85"}
};
$("#moodOptions").addEventListener("click",e=>{const b=e.target.closest("[data-mood]");if(!b)return;$$(".mood-option").forEach(x=>x.classList.toggle("active",x===b));const m=moods[b.dataset.mood],out=$("#moodResult");out.innerHTML='<div class="mood-result-img"><img src="'+m.img+'" alt="'+m.name+'" loading="lazy"/></div><div class="mood-result-copy"><span>THE PANDA\'S PICK</span><h3>'+m.name+'</h3><p>'+m.desc+'</p><a href="https://mootkucafe.com/menu" target="_blank" rel="noopener">Find it on the menu ↗</a></div>';});

const navToggle=$("#navToggle"),navLinks=$("#navLinks");
navToggle.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open));navToggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{navLinks.classList.remove("open");navToggle.setAttribute("aria-expanded","false");}));

const loader=$("#loader");
if(!reduced){window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("done"),450));setTimeout(()=>loader.classList.add("done"),2200);}else loader.remove();

if("IntersectionObserver"in window&&!reduced){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target);}}),{threshold:.12});$$(".section-top,.menu-heading,.story-copy,.story-art,.mood-intro,.mood-picker,.space-heading,.space-gallery figure,.celebrate,.visit-copy,.visit-card").forEach(x=>x.classList.add("reveal"));$$(".reveal").forEach(x=>io.observe(x));}else{$$(".reveal").forEach(x=>x.classList.add("visible"));}

let heroSceneControls=null;
const heroChips=$("#heroChips");
if(heroChips)heroChips.addEventListener("click",e=>{
 const b=e.target.closest("button[data-title]");if(!b)return;
 heroChips.querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b));
 $("#heroDish").textContent=b.dataset.title;$("#heroDishType").textContent=b.dataset.kind;
 if(heroSceneControls){
  heroSceneControls.rimRing.material.color.set(b.dataset.color||"#ff6a13");
  heroSceneControls.table.rotation.y+=Math.PI*.62;heroSceneControls.panda.rotation.z=.12;
  if(!reduced)setTimeout(()=>{if(heroSceneControls)heroSceneControls.panda.rotation.z=0;},260);
 }
});
function init3D(){
 const stage=$("#heroStage"),canvas=$("#heroCanvas"),fallback=$("#stageFallback");
 if(!window.THREE||!canvas||!stage){if(fallback)fallback.style.display="flex";return;}
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power"});}catch(e){fallback.style.display="flex";return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));renderer.setClearColor(0x000000,0);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,80);camera.position.set(0,4.2,8.8);camera.lookAt(0,1.05,0);
 scene.add(new THREE.HemisphereLight(0xfff4e8,0x8e3d12,1.3));
 const key=new THREE.DirectionalLight(0xffffff,1.45);key.position.set(4,7,6);scene.add(key);
 const rim=new THREE.PointLight(0xffd3a7,1.2,22);rim.position.set(-4,3,-3);scene.add(rim);
 const fill=new THREE.PointLight(0xff6a13,.6,18);fill.position.set(3,1,4);scene.add(fill);
 const mat=(color,roughness=.6,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const white=mat(0xfffaf4,.32),black=mat(0x17110e,.5),orange=mat(0xff6a13,.42),gold=mat(0xf5b34c,.42),green=mat(0x42633d,.8),riceA=mat(0xfff0d4,.95),riceB=mat(0xe6a34b,.9),chicken=mat(0x9e3c1e,.72),curry=mat(0xc85a1b,.38),paneer=mat(0xf4d69a,.6);
 const sphere=new THREE.SphereGeometry(1,20,16);
 function ball(parent,m,x,y,z,sx,sy,sz){const o=new THREE.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
 const table=new THREE.Group();scene.add(table);
 // Raised ceramic serving platter with a warm orange rim.
 const points=[[0,0],[1.15,0],[1.42,.07],[1.55,.16],[1.48,.22],[1.24,.16],[.9,.13],[0,.13]].map(p=>new THREE.Vector2(p[0],p[1]));
 const plate=new THREE.Mesh(new THREE.LatheGeometry(points,64),white);plate.position.y=.15;table.add(plate);
 const rimRing=new THREE.Mesh(new THREE.TorusGeometry(1.42,.035,10,64),orange);rimRing.rotation.x=Math.PI/2;rimRing.position.y=.34;table.add(rimRing);
 const food=new THREE.Group();food.position.y=.38;table.add(food);
 // Biryani mound: rice grains, caramelised pieces and fresh herbs.
 ball(food,riceA,0,.22,0,.72,.28,.55);
 for(let i=0;i<115;i++){const a=Math.random()*Math.PI*2,r=.12+Math.random()*.68,x=Math.cos(a)*r,z=Math.sin(a)*r*.75;ball(food,Math.random()<.18?riceB:riceA,x,.32+Math.random()*.18,z,.035,.025,.09).rotation.y=Math.random()*Math.PI;}
 for(let i=0;i<8;i++){const a=i*Math.PI*.25;const p=ball(food,chicken,Math.cos(a)*(.32+Math.random()*.18),.43,Math.sin(a)*(.28+Math.random()*.12),.16,.09,.22);p.rotation.y=a;}
 for(let i=0;i<10;i++){const a=i*2.4;const leaf=ball(food,green,Math.cos(a)*(.18+Math.random()*.48),.53,Math.sin(a)*(.16+Math.random()*.4),.035,.012,.12);leaf.rotation.y=a;leaf.rotation.z=.35;}
 // Small curry katori on the side of the platter.
 const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.34,.25,.18,32),mat(0xfff6e8,.3));bowl.position.set(.92,.3,.18);food.add(bowl);
 const sauce=new THREE.Mesh(new THREE.CircleGeometry(.28,32),curry);sauce.rotation.x=-Math.PI/2;sauce.position.set(.92,.397,.18);food.add(sauce);
 for(let i=0;i<4;i++)ball(food,paneer,.82+(i%2)*.12,.43,.1+Math.floor(i/2)*.12,.055,.045,.055);
 table.position.y=-.45;table.rotation.y=-.25;scene.add(table);
 // Panda chef, modelled from simple 3D forms to keep it lightweight and playful.
 const panda=new THREE.Group();panda.position.set(0,1.65,-.55);scene.add(panda);
 ball(panda,white,0,0,0,.85,.75,.62);
 [-1,1].forEach(side=>{ball(panda,black,side*.66,.58,-.03,.25,.27,.24);const patch=ball(panda,black,side*.32,.05,.53,.2,.28,.1);patch.rotation.z=side*.35;ball(panda,white,side*.32,.08,.62,.085,.09,.035);ball(panda,black,side*.32,.08,.655,.045,.055,.02);ball(panda,mat(0xffa78c,.9),side*.52,-.18,.48,.11,.07,.035);});
 ball(panda,black,0,-.17,.62,.09,.065,.045);
 // tiny smile
 const smile=new THREE.Mesh(new THREE.TorusGeometry(.11,.012,6,24,Math.PI),black);smile.position.set(0,-.28,.61);smile.rotation.z=Math.PI; panda.add(smile);
 const ears=[-1,1];ears.forEach(side=>ball(panda,black,side*.83,.83,-.04,.28,.29,.23));
 const hat=new THREE.Group();hat.position.set(0,.78,0);panda.add(hat);ball(hat,white,0,.15,0,.62,.17,.46);const hatTop=new THREE.Mesh(new THREE.CylinderGeometry(.37,.48,.42,32),orange);hatTop.position.y=.44;hat.add(hatTop);ball(hat,gold,0,.67,0,.36,.09,.38);
 // Tiny arms peeking around the plate.
 const armL=ball(panda,white,-.76,-.38,.05,.19,.4,.18),armR=ball(panda,white,.76,-.38,.05,.19,.4,.18);armL.rotation.z=-.5;armR.rotation.z=.5;
 // Floating menu ingredients around the hero.
 const floaters=[];[0,1,2,3,4,5,6,7].forEach(i=>{const m=[orange,gold,green,riceA][i%4],o=ball(scene,m,Math.cos(i*Math.PI/4)*2.6,1.3+(i%3)*.48,Math.sin(i*Math.PI/4)*1.2,.08+(i%3)*.025,.06,.11);o.userData={base:o.position.y,phase:i*.8};floaters.push(o);});
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(2.15,48),new THREE.MeshBasicMaterial({color:0x8c300d,transparent:true,opacity:.12,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.22;scene.add(shadow);heroSceneControls={rimRing,table,panda};
 let yaw=-.35,pitch=0,drag=false,lastX=0,lastY=0,vx=0,vy=0,pointerX=0,pointerY=0,visible=true,raf=0,clock=0;
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w<500?9.9:8.8;camera.updateProjectionMatrix();};
 if(window.ResizeObserver){new ResizeObserver(resize).observe(stage);}else{window.addEventListener("resize",resize,{passive:true});}resize();
 canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener("pointermove",e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*2;if(drag){const dx=e.clientX-lastX,dy=e.clientY-lastY;yaw+=dx*.009;pitch=Math.max(-.3,Math.min(.3,pitch+dy*.005));vx=dx*.001;lastX=e.clientX;lastY=e.clientY;}});
 canvas.addEventListener("pointerup",()=>drag=false);canvas.addEventListener("pointercancel",()=>drag=false);
 canvas.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")yaw-=.2;if(e.key==="ArrowRight")yaw+=.2;});

 if("IntersectionObserver"in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf)animate();}).observe(stage);
 function animate(){if(!visible||document.hidden){raf=0;return;}raf=requestAnimationFrame(animate);clock+=.016;if(!drag&&!reduced){yaw+=vx;vx*=.94;yaw+=.0025;}table.rotation.y=yaw;table.rotation.x=pitch*.5;table.position.y=-.45+(reduced?0:Math.sin(clock*1.4)*.035);panda.rotation.y=Math.sin(clock*.7)*.08+pointerX*.18;panda.rotation.x=pointerY*.06;panda.position.y=1.65+(reduced?0:Math.sin(clock*1.7)*.055);if(!reduced)floaters.forEach(o=>{o.rotation.y+=.006;o.position.y=o.userData.base+Math.sin(clock+o.userData.phase)*.12;});renderer.render(scene,camera);}
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&visible&&!raf)animate();});animate();
}
init3D();
})();