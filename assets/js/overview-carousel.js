/* Auto-advancing book overview carousels.
   Slides move with a CSS transform (no scroll container), so they work the same
   in iOS Safari, Android and desktop browsers. Autoplay pauses while a mouse
   hovers, while a control has keyboard focus, during a swipe, when the carousel
   is off screen or the tab is hidden, and never runs with reduced motion. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(car){
    var view = car.querySelector('.ov-view');
    var track = car.querySelector('.ov-track');
    var slides = track.children, n = slides.length;
    var ms = parseInt(car.getAttribute('data-interval'), 10) || 6000;
    var num = car.querySelector('.ov-n'), play = car.querySelector('.ov-play');
    var bar = car.querySelector('.ov-bar span');
    var idx = 0, timer = null, userPaused = reduce, hover = false, kbd = false, drag = false, visible = false, loaded = false;
    car.style.setProperty('--ov-ms', ms + 'ms');

    function place(px){
      track.style.transform = 'translate3d(' + (-idx * 100) + '%,0,0)' + (px ? ' translateX(' + px + 'px)' : '');
    }
    function mark(){
      num.textContent = idx + 1;
      for (var k = 0; k < n; k++) slides[k].setAttribute('aria-hidden', k === idx ? 'false' : 'true');
    }
    function go(i){ idx = (i + n) % n; place(0); mark(); }

    function stop(){ clearTimeout(timer); timer = null; car.classList.remove('is-running'); }
    function start(){
      stop();
      if (userPaused || hover || kbd || drag || !visible || document.hidden) return;
      car.classList.remove('is-running'); void bar.offsetWidth; car.classList.add('is-running');
      timer = setTimeout(function(){ go(idx + 1); start(); }, ms);
    }
    function setPaused(p){
      userPaused = p;
      car.classList.toggle('is-paused', p);
      play.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
      start();
    }
    function loadAll(){
      if (loaded) return; loaded = true;
      for (var k = 0; k < n; k++){ var im = slides[k].querySelector('img'); if (im) im.loading = 'eager'; }
    }

    car.querySelector('.ov-prev').addEventListener('click', function(){ go(idx - 1); start(); });
    car.querySelector('.ov-next').addEventListener('click', function(){ go(idx + 1); start(); });
    play.addEventListener('click', function(){ setPaused(!userPaused); });

    // Mouse hover pauses; touch "hover" (iOS emulated mouse events) is ignored.
    car.addEventListener('pointerenter', function(e){ if (e.pointerType === 'mouse'){ hover = true; stop(); } });
    car.addEventListener('pointerleave', function(e){ if (e.pointerType === 'mouse'){ hover = false; start(); } });

    // Keyboard focus pauses; a tap or click on a control does not.
    car.addEventListener('focusin', function(e){
      var fv = false; try { fv = e.target.matches(':focus-visible'); } catch (x) {}
      if (fv){ kbd = true; stop(); }
    });
    car.addEventListener('focusout', function(e){ if (!car.contains(e.relatedTarget)){ kbd = false; start(); } });
    view.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight'){ e.preventDefault(); go(idx + 1); }
      else if (e.key === 'ArrowLeft'){ e.preventDefault(); go(idx - 1); }
    });

    // Swipe / drag (touch-action: pan-y keeps vertical page scrolling native).
    var x0 = 0, y0 = 0, dx = 0, pid = null, horiz = null;
    view.addEventListener('pointerdown', function(e){
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pid = e.pointerId; x0 = e.clientX; y0 = e.clientY; dx = 0; horiz = null;
      drag = true; stop(); loadAll();
    });
    view.addEventListener('pointermove', function(e){
      if (e.pointerId !== pid) return;
      var mx = e.clientX - x0, my = e.clientY - y0;
      if (horiz === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)){
        horiz = Math.abs(mx) > Math.abs(my);
        if (horiz){ track.classList.add('is-dragging'); try { view.setPointerCapture(pid); } catch (x) {} }
      }
      if (horiz){ dx = mx; place(dx); }
    });
    function end(e){
      if (e.pointerId !== pid) return;
      pid = null; track.classList.remove('is-dragging');
      if (horiz && Math.abs(dx) > Math.min(60, view.clientWidth * 0.15)) go(idx + (dx < 0 ? 1 : -1));
      else place(0);
      drag = false; start();
    }
    view.addEventListener('pointerup', end);
    view.addEventListener('pointercancel', end);

    document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : start(); });

    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        var v = es[0].isIntersecting;
        if (v === visible) return;      // only react to real show/hide changes
        visible = v;
        if (visible) loadAll();
        start();
      }, { threshold: 0.15 }).observe(car);
    } else { visible = true; loadAll(); }

    view.setAttribute('tabindex', '0');
    place(0); mark(); setPaused(userPaused);
  }

  function boot(){ var cs = document.querySelectorAll('.ov-car'); for (var i = 0; i < cs.length; i++) init(cs[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
