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

  // ================================================================
  // Progress tracker — mark each section learned; persist in browser.
  //   state 0 ○ nietknięte · 1 ◐ do powtórki · 2 ● opanowane
  //   storage: localStorage["exam-progress"] = { "html/xx.html#id": {s,t} }
  //   (state 0 is never stored — absence means untouched)
  // ================================================================
  var PKEY="exam-progress", DAY=86400000, STALE=5;
  var GLYPH=["○","◐","●"];               // ○ ◐ ●
  var LABEL=["nietknięte","do powtórki","opanowane"];

  function load(){ try{ return JSON.parse(localStorage.getItem(PKEY))||{}; }catch(e){ return {}; } }
  function save(o){ try{ localStorage.setItem(PKEY,JSON.stringify(o)); }catch(e){} }
  function notePath(){                                    // "html/xx.html" for a note page, else null
    var b=location.pathname.split("/").pop();
    return (/^\d+_.*\.html$/.test(b)) ? "html/"+b : null;
  }
  function stateOf(store,key){ var e=store[key]; return e?e.s:0; }

  // counts per note path from the store, for the index aggregates
  function tallies(store){
    var m={};
    Object.keys(store).forEach(function(k){
      var i=k.indexOf("#"); if(i<0) return;
      var p=k.slice(0,i), e=store[k]; if(!e||!e.s) return;
      var t=m[p]||(m[p]={lrn:0,rev:0,stale:false});
      if(e.s===2) t.lrn++; else if(e.s===1){ t.rev++; if(e.t && (Date.now()-e.t)/DAY>=STALE) t.stale=true; }
    });
    return m;
  }
  function pct(n,d){ return d?Math.round(n/d*100):0; }

  // ---- note page: inject markers + a progress strip ----
  function initNote(path){
    var main=document.querySelector("main.wrap:not(.wrap-index)"); if(!main) return;
    var heads=[].slice.call(main.querySelectorAll("h2[id],h3[id]"));
    if(!heads.length) return;
    var store=load();

    function frac(){ var l=0,r=0; heads.forEach(function(h){ var s=stateOf(store,path+"#"+h.id); if(s===2)l++;else if(s===1)r++; }); return {l:l,r:r,n:heads.length}; }

    var strip=document.createElement("div");
    strip.className="note-progress";
    strip.innerHTML='<div class="meter"><i class="rev"></i><i class="lrn"></i></div>'+
                    '<span class="np-frac"></span>';
    var meterRev=strip.querySelector("i.rev"), meterLrn=strip.querySelector("i.lrn"), fracEl=strip.querySelector(".np-frac");
    function renderStrip(){ var f=frac();
      meterLrn.style.width=pct(f.l,f.n)+"%";
      meterRev.style.width=pct(f.l+f.r,f.n)+"%";          // rev drawn behind lrn as a lighter lead
      fracEl.innerHTML="opanowane <b>"+f.l+"</b> / "+f.n+" sekcji";
    }
    var anchor=main.querySelector(".subtitle")||main.querySelector("h1");
    if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(strip,anchor.nextSibling);

    heads.forEach(function(h){
      var key=path+"#"+h.id;
      var btn=document.createElement("button");
      btn.className="mark"; btn.type="button";
      function paint(){ var s=stateOf(store,key); btn.dataset.s=s; btn.textContent=GLYPH[s];
        btn.setAttribute("aria-label",(h.textContent||"sekcja").trim()+" — "+LABEL[s]+" (kliknij, aby zmienić)"); }
      btn.addEventListener("click",function(ev){
        ev.preventDefault(); ev.stopPropagation();
        var s=(stateOf(store,key)+1)%3;
        if(s===0) delete store[key]; else store[key]={s:s,t:Date.now()};
        save(store); paint(); renderStrip();
      });
      paint();
      h.style.position="relative";                       // anchor the gutter marker (no :has() reliance)
      h.insertBefore(btn,h.firstChild);
    });
    renderStrip();
  }

  // ---- index page: dashboard + card meters + group tallies ----
  function initIndex(){
    var wrap=document.querySelector(".wrap-index"); if(!wrap) return;
    var mount=document.getElementById("dash"); if(!mount) return;

    fetch("assets/sections.json").then(function(r){ return r.json(); }).then(function(data){
      var notes=data.notes||{}, store=load(), tal=tallies(store);
      // per-note figures keyed by path
      var info={};
      Object.keys(notes).forEach(function(p){
        var n=(notes[p].sections||[]).length, t=tal[p]||{lrn:0,rev:0,stale:false};
        info[p]={title:notes[p].title,n:n,lrn:t.lrn,rev:Math.min(t.rev,n-t.lrn),stale:t.stale};
      });

      // ---- card meters + fractions (only cards present on the page) ----
      [].slice.call(wrap.querySelectorAll(".ncard")).forEach(function(a){
        var href=a.getAttribute("href"); if(!href||!info[href]) return;
        var d=info[href];
        var bar=document.createElement("div"); bar.className="ncard-meter meter";
        bar.innerHTML='<i class="rev"></i><i class="lrn"></i>';
        bar.querySelector("i.lrn").style.width=pct(d.lrn,d.n)+"%";
        bar.querySelector("i.rev").style.width=pct(d.lrn+d.rev,d.n)+"%";
        a.appendChild(bar);
        var body=a.querySelector(".ncard-body")||a;
        var fr=document.createElement("span");
        fr.className="ncard-frac"+(d.n&&d.lrn===d.n?" full":"");
        fr.textContent=d.lrn+"/"+d.n; a.insertBefore(fr,bar);
      });

      // ---- group tallies (aggregate the cards inside each group) ----
      [].slice.call(wrap.querySelectorAll(".group")).forEach(function(g){
        var l=0,n=0;
        [].slice.call(g.querySelectorAll(".ncard")).forEach(function(a){ var d=info[a.getAttribute("href")]; if(d){ l+=d.lrn; n+=d.n; } });
        var h=g.querySelector("h2"); if(h&&n){ var c=document.createElement("span"); c.className="group-count"; c.innerHTML="<b>"+l+"</b>/"+n; h.appendChild(c); }
      });

      // ---- totals ----
      var LRN=0,REV=0,TOT=0;
      Object.keys(info).forEach(function(p){ LRN+=info[p].lrn; REV+=info[p].rev; TOT+=info[p].n; });
      var NON=TOT-LRN-REV, P=pct(LRN,TOT);

      // ---- weakest / to-review list: incomplete notes, least-learned first ----
      var rows=Object.keys(info).map(function(p){ return {p:p,d:info[p],f:info[p].n?info[p].lrn/info[p].n:1}; })
        .filter(function(x){ return x.d.n && x.f<1; })
        .sort(function(a,b){ return a.f-b.f || b.d.n-a.d.n; }).slice(0,6);

      // ---- ring geometry ----
      var R=44, C=2*Math.PI*R, lF=TOT?LRN/TOT:0, rF=TOT?REV/TOT:0;
      var ring='<svg viewBox="0 0 104 104" aria-hidden="true">'+
        '<circle cx="52" cy="52" r="'+R+'" fill="none" stroke="var(--rule)" stroke-width="9"/>'+
        '<circle cx="52" cy="52" r="'+R+'" fill="none" stroke="var(--ink2)" stroke-opacity=".32" stroke-width="9" stroke-linecap="butt" transform="rotate(-90 52 52)" stroke-dasharray="'+(rF*C)+' '+C+'" stroke-dashoffset="'+(-lF*C)+'"/>'+
        '<circle cx="52" cy="52" r="'+R+'" fill="none" stroke="var(--key)" stroke-width="9" stroke-linecap="butt" transform="rotate(-90 52 52)" stroke-dasharray="'+(lF*C)+' '+C+'"/></svg>';

      var listHtml;
      if(rows.length){
        listHtml=rows.map(function(x){
          var d=x.d, gs=d.lrn===0?0:(d.lrn===d.n?2:1);
          var stale=d.stale?' <span class="stale">powtórz</span>':"";
          return '<div class="dash-row"><span class="g" data-s="'+gs+'">'+GLYPH[gs]+'</span>'+
            '<a href="'+x.p+'">'+d.title+'</a>'+
            '<span class="rf"><span class="meter" style="width:56px"><i class="lrn" style="width:'+pct(d.lrn,d.n)+'%"></i></span>'+
            '<span class="fr">'+d.lrn+"/"+d.n+'</span>'+stale+'</span></div>';
        }).join("");
        listHtml='<p class="dl-h">Do powtórki · najsłabsze tematy</p>'+listHtml;
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
    }).catch(function(){ /* manifest unavailable (e.g. file://) — leave the page as-is */ });
  }

  document.addEventListener("DOMContentLoaded",function(){
    var p=notePath();
    if(p) initNote(p); else initIndex();
  });
})();
