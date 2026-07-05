/* Shared behavior for the exam notes: theme toggle + TOC scroll-spy.
   Interactive visualizations ship their own <script> per figure. */
(function(){
  "use strict";
  // ---- theme ----
  var root=document.documentElement;
  try{ var saved=localStorage.getItem("note-theme"); if(saved) root.setAttribute("data-theme",saved); }catch(e){}
  window.toggleTheme=function(){
    var cur=root.getAttribute("data-theme");
    if(!cur){ cur = matchMedia("(prefers-color-scheme:dark)").matches ? "dark":"light"; }
    var next=cur==="dark"?"light":"dark";
    root.setAttribute("data-theme",next);
    try{ localStorage.setItem("note-theme",next); }catch(e){}
    document.dispatchEvent(new CustomEvent("themechange",{detail:next}));
  };
  // ---- TOC scroll-spy ----
  document.addEventListener("DOMContentLoaded",function(){
    var links=[].slice.call(document.querySelectorAll(".toc a[href^='#']"));
    if(!links.length) return;
    var map={};
    links.forEach(function(a){ var el=document.getElementById(a.getAttribute("href").slice(1)); if(el) map[a.getAttribute("href")]=el; });
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          links.forEach(function(a){ a.classList.toggle("active", map[a.getAttribute("href")]===en.target); });
        }
      });
    },{rootMargin:"-10% 0px -80% 0px",threshold:0});
    Object.keys(map).forEach(function(h){ io.observe(map[h]); });
  });
})();
