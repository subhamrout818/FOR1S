(()=>{
"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const data=[
["Tandoori Pomfret","tandoor","BESTSELLER","A signature tandoori favourite from the sea.","https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85"],
["Tandoori Chicken","tandoor","FROM THE TANDOOR","A classic, smoky favourite made for sharing.","https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85"],
["Paneer Lababdar","indian","VEG FAVOURITE","Paneer in a rich, creamy tomato gravy.","https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85"],
["BBQ Pizza","pizza","PIZZA TIME","A crowd-pleasing pick for the whole table.","https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85"],
["Chicken Dum Biryani","biryani","BESTSELLER","A proper meal, layered with fragrant flavour.","https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85"],
["Alaska Mojito","drinks","COOL DOWN","A refreshing sip for a slower moment.","https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85"],
["Tawa Fish","indian","SEAFOOD FAVOURITE","A flavour-packed pick from the sea.","https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85"],
["Chicken Biryani","biryani","A TABLE CLASSIC","A comforting classic for lunch or dinner.","https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85"],
["Chilly Chicken","chinese","CHINESE FAVOURITE","A spicy starter that brings everyone together.","https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85"],
["Crispy Chilli Baby Corn","chinese","VEG STARTER","Crisp, sweet and spicy, made for sharing.","https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85"],
["Paneer Tikka Butter Masala","indian","NORTH INDIAN","A creamy paneer favourite with a rich tomato base.","https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85"],
["Pepper Onion Chicken","chinese","CHEF PICK","A bold, savoury favourite from the Chinese menu.","https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85"]];
let filter="all";
const grid=$("#menuGrid"),search=$("#menuSearch");
function render(){
 if(!grid)return;
 const q=(search?.value||"").toLowerCase().trim();
 const items=data.filter(d=>(filter==="all"||d[1]===filter)&&d.slice(0,4).join(" ").toLowerCase().includes(q));
 grid.innerHTML=items.map(d=>'<article class="dish-card"><div class="dish-image"><img src="'+d[4]+'" alt="'+d[0]+'" loading="lazy"><span class="dish-tag">'+d[2]+'</span></div><h3>'+d[0]+'</h3><p>'+d[3]+'</p><div class="dish-foot"><span class="dish-category">'+d[1]+'</span><a href="https://mootkucafe.com/menu" target="_blank" rel="noopener">VIEW MENU ↗</a></div></article>').join("")||'<div class="menu-empty">No favourites found. Try another search.</div>';
}
render();
$("#menuTabs")?.addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;filter=b.dataset.filter;$$(".tab").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-selected",String(x===b));});render();});
search?.addEventListener("input",render);
const moodData={feast:["Chicken Dum Biryani","A proper meal for a proper appetite.","https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85"],share:["Crispy Chilli Baby Corn","A crunchy, sweet-and-spicy centrepiece for the table.","https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85"],comfort:["Paneer Lababdar","Creamy, comforting and ready for a slow meal.","https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85"],refresh:["Alaska Mojito","A refreshing pick when you want something cool.","https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85"]};
$("#moodOptions")?.addEventListener("click",e=>{const b=e.target.closest("[data-mood]");if(!b)return;$$(".mood-option").forEach(x=>x.classList.toggle("active",x===b));const m=moodData[b.dataset.mood],out=$("#moodResult");if(!m||!out)return;out.innerHTML='<div class="mood-result-img"><img src="'+m[2]+'" alt="'+m[0]+'"></div><div class="mood-result-copy"><span>THE PANDA PICK</span><h3>'+m[0]+'</h3><p>'+m[1]+'</p><a href="https://mootkucafe.com/menu" target="_blank" rel="noopener">Find it on the menu ↗</a></div>';});
$("#heroChips")?.addEventListener("click",e=>{const b=e.target.closest("button[data-title]");if(!b)return;$$(".hero-chips button").forEach(x=>x.classList.toggle("active",x===b));if($("#heroDish"))$("#heroDish").textContent=b.dataset.title;if($("#heroDishType"))$("#heroDishType").textContent=b.dataset.kind;});
const toggle=$("#navToggle"),links=$("#navLinks");
toggle?.addEventListener("click",()=>{const open=links.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{links.classList.remove("open");toggle?.setAttribute("aria-expanded","false");}));
const stage=$("#heroStage"),fallback=$("#stageFallback"),img=fallback?.querySelector("img");
if(stage&&img){let down=false,lx=0,ly=0,rx=0,ry=0;stage.addEventListener("pointerdown",e=>{if(e.target.closest("button,a"))return;down=true;lx=e.clientX;ly=e.clientY;try{stage.setPointerCapture(e.pointerId)}catch{}});stage.addEventListener("pointermove",e=>{if(!down)return;ry+=(e.clientX-lx)*.5;rx=Math.max(-20,Math.min(20,rx+(e.clientY-ly)*-.2));lx=e.clientX;ly=e.clientY;img.style.transform="perspective(700px) rotateX("+rx+"deg) rotateY("+ry+"deg) scale(1.05)";});["pointerup","pointercancel","lostpointercapture"].forEach(ev=>stage.addEventListener(ev,()=>down=false));if(!window.THREE)fallback.style.display="flex";}
const loader=$("#loader");if(loader){const hide=()=>loader.classList.add("done");addEventListener("load",hide,{once:true});setTimeout(hide,1800);}
const progress=document.createElement("div");progress.className="scroll-progress";progress.innerHTML="<span></span>";document.body.append(progress);const bar=progress.firstElementChild;
addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform="scaleX("+(max?scrollY/max:0)+")";},{passive:true});
if(matchMedia("(hover:hover) and (pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.body.classList.add("js-cursor");const dot=document.createElement("i"),ring=document.createElement("i"),tag=document.createElement("b");dot.className="cursor-dot";ring.className="cursor-ring";tag.className="cursor-label";document.body.append(dot,ring,tag);addEventListener("pointermove",e=>{dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";ring.style.left=e.clientX+"px";ring.style.top=e.clientY+"px";});document.addEventListener("pointerover",e=>{const t=e.target.closest("a,button,.dish-card,canvas");ring.classList.toggle("is-active",!!t);tag.textContent=t?.matches(".dish-card")?"DISCOVER":t?.matches("canvas")?"DRAG":t?"EXPLORE":"";tag.classList.toggle("is-active",!!t);});}
document.documentElement.classList.add("mootku-interactions-ready");
})();