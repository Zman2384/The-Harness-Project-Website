
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function selectTab(t,focus){
    var list=t.closest('[role="tablist"]');var scope=list.parentNode;
    list.querySelectorAll('[role="tab"]').forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on?'true':'false');x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on;});
    if(focus)t.focus();
  }
  document.addEventListener('click',function(e){
    var tg=e.target;if(!tg||!tg.closest)return;
    var n=tg.closest('.pv-node');
    if(n){var pv=n.closest('.pv');var id=n.getAttribute('aria-controls');
      pv.querySelectorAll('.pv-node').forEach(function(b){b.setAttribute('aria-pressed',b===n?'true':'false');});
      pv.querySelectorAll('.pv-lesson').forEach(function(a){a.hidden=(a.id!==id);});
      var a=document.getElementById(id);if(a){var r=a.getBoundingClientRect();if(r.top<0||r.top>window.innerHeight*0.6){a.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}}
      return;}
    var t=tg.closest('.pv-tab');if(t){selectTab(t,false);return;}
    var d=tg.closest('.pv-dl');
    if(d){var card=d.closest('.pv-handout');var title=card.querySelector('h4').textContent;var body=card.querySelector('.pv-pre').textContent;
      var blob=new Blob([title+'\r\n\r\n'+body.replace(/\n/g,'\r\n')+'\r\n'],{type:'text/plain;charset=utf-8'});
      var u=URL.createObjectURL(blob);var l=document.createElement('a');l.href=u;l.download=d.getAttribute('data-file')||'handout.txt';document.body.appendChild(l);l.click();document.body.removeChild(l);setTimeout(function(){URL.revokeObjectURL(u);},1500);return;}
    var c=tg.closest('.pv-copy');
    if(c){var base=/^https?:/.test(location.href)?location.href.split('#')[0]:'https://theharnessproject.org/';var url=base+c.getAttribute('data-hash');var st=c.parentNode.querySelector('.pv-status');
      function ok(){if(st)st.textContent='Link copied.';}function fail(){if(st)st.textContent=url;}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(ok,fail);}else{fail();}
      return;}
  });
  /* Same-document navigation: in sandboxed/srcdoc previews, "/route" links would otherwise resolve against the parent URL and navigate away. */
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target&&e.target.closest?e.target.closest('a[href^="/"]'):null;if(!a)return;
    e.preventDefault();var h=a.getAttribute('href');
    if(location.hash===h){window.dispatchEvent(new HashChangeEvent('hashchange'));}else{location.hash=h;}
  },true);
  document.addEventListener('keydown',function(e){
    var t=e.target;if(!t||!t.getAttribute||t.getAttribute('role')!=='tab')return;
    var tabs=[].slice.call(t.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));var i=tabs.indexOf(t);var j=-1;
    if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;
    if(j>=0){e.preventDefault();selectTab(tabs[j],true);}
  });
})();
