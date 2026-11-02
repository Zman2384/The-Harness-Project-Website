/* Auto-advancing book overview carousels. Pauses on hover, focus, touch,
   when off screen or when the tab is hidden; no autoplay with reduced motion. */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.ov-car').forEach(function(car){
    var track = car.querySelector('.ov-track');
    var slides = track.children, n = slides.length;
    var ms = parseInt(car.dataset.interval, 10) || 6000;
    var num = car.querySelector('.ov-n'), play = car.querySelector('.ov-play');
    var bar = car.querySelector('.ov-bar span');
    var idx = 0, timer = null, userPaused = reduce, hold = false, visible = false;
    car.style.setProperty('--ov-ms', ms + 'ms');

    function current(){ return Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); }
    function go(i){
      idx = (i + n) % n;
      track.scrollTo({ left: idx * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      mark();
    }
    function mark(){
      num.textContent = idx + 1;
      for (var k = 0; k < n; k++) slides[k].setAttribute('aria-hidden', k === idx ? 'false' : 'true');
    }
    function stop(){
      clearTimeout(timer); timer = null;
      car.classList.remove('is-running');
    }
    function start(){
      stop();
      if (userPaused || hold || !visible || document.hidden) return;
      void bar.offsetWidth;            // restart the progress bar
      car.classList.add('is-running');
      timer = setTimeout(function(){ go(idx + 1); start(); }, ms);
    }
    function setPaused(p){
      userPaused = p;
      car.classList.toggle('is-paused', p);
      play.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
      p ? stop() : start();
    }

    car.querySelector('.ov-prev').addEventListener('click', function(){ go(idx - 1); start(); });
    car.querySelector('.ov-next').addEventListener('click', function(){ go(idx + 1); start(); });
    play.addEventListener('click', function(){ setPaused(!userPaused); });

    // Manual swipe/scroll: follow the slide the reader lands on.
    var st;
    track.addEventListener('scroll', function(){
      clearTimeout(st);
      st = setTimeout(function(){ var c = current(); if (c !== idx){ idx = c; mark(); start(); } }, 120);
    }, { passive: true });

    function holdOn(){ hold = true; stop(); }
    function holdOff(){ hold = false; start(); }
    car.addEventListener('mouseenter', holdOn);
    car.addEventListener('mouseleave', holdOff);
    // Keyboard focus pauses; a tap or click on a control does not.
    car.addEventListener('focusin', function(e){ try { if (e.target.matches(':focus-visible')) holdOn(); } catch (x) { holdOn(); } });
    car.addEventListener('focusout', function(e){ if (!car.contains(e.relatedTarget)) holdOff(); });
    track.addEventListener('touchstart', holdOn, { passive: true });
    track.addEventListener('touchend', function(){ setTimeout(holdOff, 1500); }, { passive: true });

    car.addEventListener('keydown', function(e){
      if (e.key === 'ArrowRight'){ e.preventDefault(); go(idx + 1); }
      else if (e.key === 'ArrowLeft'){ e.preventDefault(); go(idx - 1); }
    });
    window.addEventListener('resize', function(){ track.scrollLeft = idx * track.clientWidth; });
    document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : start(); });

    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.4 }).observe(car);
    } else { visible = true; }

    track.setAttribute('tabindex', '0');
    mark();
    setPaused(userPaused);
  });
})();
