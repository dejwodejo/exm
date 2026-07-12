/* Shared behavior for the exam notes: theme toggle + TOC scroll-spy + whole-note progress.
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

  // ================================================================
  // Progress tracker — per WHOLE NOTE (not per section); persist in browser.
  //   state 0 ○ nietknięte · 1 ◐ do powtórki · 2 ● opanowane
  //   storage: localStorage["exam-progress"] = { "html/xx.html": {s,t} }
  //   (state 0 is never stored — absence means untouched)
  // ================================================================
  var PKEY="exam-progress", DAY=86400000, STALE=5;
  var GLYPH=["○","◐","●"];
  var LABEL=["Nietknięte","Do powtórki","Opanowane"];

  function load(){ try{ return JSON.parse(localStorage.getItem(PKEY))||{}; }catch(e){ return {}; } }
  function save(o){ try{ localStorage.setItem(PKEY,JSON.stringify(o)); }catch(e){} }
  function notePath(){                                    // "html/xx.html" for a note page, else null
    var b=location.pathname.split("/").pop();
    return (/^\d+_.*\.html$/.test(b)) ? "html/"+b : null;
  }
  function stateOf(store,key){ var e=store[key]; return e?e.s:0; }
  function isStale(e){ return !!(e && e.s===1 && e.t && (Date.now()-e.t)/DAY>=STALE); }

  // ---- note page: one whole-note status toggle (cycles ○ → ◐ → ●) ----
  function initNote(path){
    var main=document.querySelector("main.wrap:not(.wrap-index)"); if(!main) return;
    var store=load();
    var btn=document.createElement("button");
    btn.className="note-state"; btn.type="button";
    btn.innerHTML='<span class="g"></span><span class="t"></span>';
    var gEl=btn.querySelector(".g"), tEl=btn.querySelector(".t");
    function paint(){ var s=stateOf(store,path); btn.dataset.s=s; gEl.textContent=GLYPH[s]; tEl.textContent=LABEL[s];
      btn.setAttribute("aria-label","Status notatki: "+LABEL[s]+" (kliknij, aby zmienić)"); }
    btn.addEventListener("click",function(){
      var s=(stateOf(store,path)+1)%3;
      if(s===0) delete store[path]; else store[path]={s:s,t:Date.now()};
      save(store); paint();
    });
    paint();
    var anchor=main.querySelector(".subtitle")||main.querySelector("h1");
    if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(btn,anchor.nextSibling);
  }

  // ---- index page: dashboard + per-card state, computed straight from the DOM ----
  function initIndex(){
    var wrap=document.querySelector(".wrap-index"); if(!wrap) return;
    var mount=document.getElementById("dash");
    var store=load();

    // one item per card on the page (no external manifest needed)
    var items=[].slice.call(wrap.querySelectorAll(".ncard")).map(function(a){
      var href=a.getAttribute("href"), e=store[href], t=a.querySelector(".ncard-title");
      return { a:a, href:href, title:t?t.textContent:href, s:e?e.s:0, stale:isStale(e) };
    });

    // per-card state glyph + data attribute
    items.forEach(function(it){
      it.a.dataset.s=it.s;
      var g=document.createElement("span"); g.className="ncard-state"; g.textContent=GLYPH[it.s];
      it.a.appendChild(g);
    });

    // group tallies (opanowane / total per group)
    [].slice.call(wrap.querySelectorAll(".group")).forEach(function(g){
      var l=0,n=0;
      [].slice.call(g.querySelectorAll(".ncard")).forEach(function(a){ n++; if(a.dataset.s==="2") l++; });
      var h=g.querySelector("h2"); if(h&&n){ var c=document.createElement("span"); c.className="group-count"; c.innerHTML="<b>"+l+"</b>/"+n; h.appendChild(c); }
    });

    if(!mount) return;
    var TOT=items.length;
    var LRN=items.filter(function(x){return x.s===2;}).length;
    var REV=items.filter(function(x){return x.s===1;}).length;
    var NON=TOT-LRN-REV, P=TOT?Math.round(LRN/TOT*100):0;

    // still-to-do list: not-opanowane, nietknięte first, then do-powtórki
    var rows=items.filter(function(x){return x.s<2;}).sort(function(a,b){ return a.s-b.s; }).slice(0,8);

    var R=44, C=2*Math.PI*R, lF=TOT?LRN/TOT:0, rF=TOT?REV/TOT:0;
    var ring='<svg viewBox="0 0 104 104" aria-hidden="true">'+
      '<circle cx="52" cy="52" r="'+R+'" fill="none" stroke="var(--rule)" stroke-width="9"/>'+
      '<circle cx="52" cy="52" r="'+R+'" fill="none" stroke="var(--ink2)" stroke-opacity=".32" stroke-width="9" stroke-linecap="butt" transform="rotate(-90 52 52)" stroke-dasharray="'+(rF*C)+' '+C+'" stroke-dashoffset="'+(-lF*C)+'"/>'+
      '<circle cx="52" cy="52" r="'+R+'" fill="none" stroke="var(--key)" stroke-width="9" stroke-linecap="butt" transform="rotate(-90 52 52)" stroke-dasharray="'+(lF*C)+' '+C+'"/></svg>';

    var listHtml;
    if(rows.length){
      listHtml=rows.map(function(x){
        var stale=x.stale?' <span class="stale">powtórz</span>':"";
        return '<div class="dash-row"><span class="g" data-s="'+x.s+'">'+GLYPH[x.s]+'</span>'+
          '<a href="'+x.href+'">'+x.title+'</a>'+
          '<span class="rf"><span class="fr">'+LABEL[x.s]+'</span>'+stale+'</span></div>';
      }).join("");
      listHtml='<p class="dl-h">Do nauki · pozostałe notatki</p>'+listHtml;
    } else {
      listHtml='<p class="dash-done">● Cały materiał opanowany — powodzenia na egzaminie.</p>';
    }

    mount.className="dash"; mount.hidden=false;
    mount.innerHTML=
      '<p class="dash-eyebrow">Twój postęp</p>'+
      '<div class="dash-ring">'+ring+'<div class="ring-pct"><b>'+P+'%</b><span>opanowane</span></div></div>'+
      '<div class="dash-side">'+
        '<div class="dash-legend">'+
          '<span><i class="dot lrn"></i>opanowane <b>'+LRN+'</b></span>'+
          '<span><i class="dot rev"></i>do powtórki <b>'+REV+'</b></span>'+
          '<span><i class="dot non"></i>nietknięte <b>'+NON+'</b></span>'+
        '</div>'+
        '<div class="dash-list">'+listHtml+'</div>'+
        '<button class="dash-reset" type="button">Wyczyść postęp</button>'+
      '</div>';

    mount.querySelector(".dash-reset").addEventListener("click",function(){
      if(confirm("Wyczyścić cały zapisany postęp nauki?")){ save({}); location.reload(); }
    });
  }

  // ---- viz partials: inject external figure+script blocks at runtime ----
  //   <div class="viz-mount" data-viz="ID"></div>  ->  visual/<note>/ID.html
  //   The partial holds the <figure> and its drawing <script>; innerHTML never
  //   runs scripts, so we recreate each <script> element to execute it after
  //   the figure is in the DOM (the IIFEs grab their SVG synchronously).
  function loadViz(){
    var mounts=[].slice.call(document.querySelectorAll(".viz-mount[data-viz]"));
    if(!mounts.length) return;
    var base=location.pathname.split("/").pop().replace(/\.html$/,"");
    mounts.forEach(function(mount){
      var id=mount.getAttribute("data-viz");
      fetch("../visual/"+base+"/"+id+".html").then(function(r){
        if(!r.ok) throw new Error(r.status); return r.text();
      }).then(function(html){
        var tpl=document.createElement("template"); tpl.innerHTML=html;
        var scripts=[].slice.call(tpl.content.querySelectorAll("script"));
        scripts.forEach(function(s){ s.parentNode.removeChild(s); });
        mount.replaceWith(tpl.content);                 // figure(s) into the DOM
        var fig=document.getElementById(id);
        if(fig&&window.renderMathInElement){            // any math inside the viz
          try{ renderMathInElement(fig,{delimiters:[{left:"\\[",right:"\\]",display:true},{left:"\\(",right:"\\)",display:false}],throwOnError:false}); }catch(e){}
        }
        scripts.forEach(function(old){                  // execute drawing scripts
          var sc=document.createElement("script");
          if(old.src) sc.src=old.src; else sc.textContent=old.textContent;
          document.body.appendChild(sc);
        });
      }).catch(function(){ /* file:// or missing partial — leave placeholder empty */ });
    });
  }

  document.addEventListener("DOMContentLoaded",function(){
    var p=notePath();
    if(p) initNote(p); else initIndex();
  });
})();
