(function(){
  "use strict";
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var loader=document.getElementById("loader");
  if(!document.documentElement.classList.contains("no-loader")&&!reduced){
    window.addEventListener("load",function(){setTimeout(function(){if(loader)loader.classList.add("done");},650);});
    setTimeout(function(){if(loader)loader.classList.add("done");},2600);
  }else if(loader){loader.remove();}

  var revealItems=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window&&!reduced){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});
    },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
    revealItems.forEach(function(item){observer.observe(item);});
  }else{revealItems.forEach(function(item){item.classList.add("visible");});}

  var toggle=document.getElementById("menuToggle");
  var nav=document.querySelector(".nav");
  if(toggle&&nav){
    toggle.addEventListener("click",function(){
      var open=nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded",String(open));
      toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
    });
    nav.querySelectorAll("a").forEach(function(link){link.addEventListener("click",function(){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");});});
  }

  var cursor=document.getElementById("cursor");
  if(cursor&&window.matchMedia("(hover:hover) and (pointer:fine)").matches&&!reduced){
    var cx=0,cy=0,tx=0,ty=0;
    window.addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;cursor.classList.add("active");});
    document.addEventListener("mouseleave",function(){cursor.classList.remove("active");});
    function move(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;cursor.style.left=cx+"px";cursor.style.top=cy+"px";requestAnimationFrame(move);}
    move();
  }

  if(!reduced&&window.matchMedia("(hover:hover)").matches){
    document.querySelectorAll(".dish-card,.hero-photo,.moment").forEach(function(el){
      el.addEventListener("mouseenter",function(){if(cursor){cursor.querySelector("span").textContent="FEEL IT";}});
      el.addEventListener("mouseleave",function(){if(cursor){cursor.querySelector("span").textContent="LOOK";}});
    });
  }

  var parallax=document.querySelector("[data-parallax]");
  if(parallax&&!reduced&&window.innerWidth>900){
    var ticking=false;
    window.addEventListener("scroll",function(){
      if(!ticking){window.requestAnimationFrame(function(){
        var rect=parallax.getBoundingClientRect();
        var offset=(rect.top-window.innerHeight/2)*-.035;
        parallax.style.transform="translate3d(0,"+offset+"px,0)";
        ticking=false;
      });ticking=true;}
    },{passive:true});
  }
})();