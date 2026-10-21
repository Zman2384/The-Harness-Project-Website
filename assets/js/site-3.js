
(function(){
  var dlP=null,cache={};
  function getDL(){
    if(!dlP){dlP=(window.claude&&typeof window.claude.use==='function')?Promise.resolve(window.claude.use('downloads')).catch(function(){return null;}):Promise.resolve(null);}
    return dlP;
  }
  if(document.readyState!=='loading'){getDL();}else{document.addEventListener('DOMContentLoaded',getDL);}
  function pdfBlob(name){
    if(cache[name])return cache[name];
    var map=JSON.parse(document.getElementById('kit-pdf-data').textContent);
    var b64=map[name];if(!b64)return null;
    var bin=atob(b64),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    return cache[name]=new Blob([u],{type:'application/pdf'});
  }
  function fallback(blob,name){
    var u=URL.createObjectURL(blob),l=document.createElement('a');l.href=u;l.download=name;document.body.appendChild(l);l.click();document.body.removeChild(l);setTimeout(function(){URL.revokeObjectURL(u);},2000);
  }
  function say(el,msg){if(el)el.textContent=msg;}
  function save(name,blob,st){
    var timeout=new Promise(function(r){setTimeout(function(){r(null);},900);});
    Promise.race([getDL(),timeout]).then(function(dl){
      if(!dl){fallback(blob,name);say(st,'Downloading '+name+'.');return;}
      dl.save({filename:name,data:blob}).then(function(){say(st,'Saved '+name+'.');},function(err){
        var c=err&&err.code;
        if(c==='declined'){say(st,'Download cancelled.');}
        else if(c==='rate_limited'){say(st,'Another download prompt is open. Try again in a moment.');}
        else{fallback(blob,name);say(st,'Downloading '+name+'.');}
      });
    });
  }
  document.addEventListener('click',function(e){
    var t=e.target;if(!t||!t.closest)return;
    var k=t.closest('.kit-dl');
    if(k){e.preventDefault();e.stopPropagation();
      var name=k.getAttribute('data-pdf');var l=document.createElement('a');l.href='/assets/kits/'+name;l.download=name;document.body.appendChild(l);l.click();l.remove();return;}
    var d=t.closest('.pv-dl');
    if(d){e.preventDefault();e.stopPropagation();
      var card=d.closest('.pv-handout');var title=card.querySelector('h4').textContent;var body=card.querySelector('.pv-pre').textContent;
      var blob2=new Blob([title+'\r\n\r\n'+body.replace(/\n/g,'\r\n')+'\r\n'],{type:'text/plain;charset=utf-8'});
      var st2=card.querySelector('.pv-status');if(!st2){st2=document.createElement('p');st2.className='pv-status';st2.setAttribute('role','status');card.appendChild(st2);}
      save(d.getAttribute('data-file')||'handout.txt',blob2,st2);}
  },true);
})();
