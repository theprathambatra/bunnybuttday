(() => {
  const cfg = window.BIRTHDAY_CONFIG;
  const gate = window.BirthdayGate;
  const els = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    celebrate: document.getElementById('celebrateButton'),
    message: document.getElementById('countdownMessage'),
    lockNote: document.getElementById('lockNote'),
    music: document.getElementById('musicButton'),
    musicText: document.getElementById('musicButtonText'),
  };

  document.getElementById('pageTitle').textContent = cfg.landingHeadline;

  let unlockedOnce = false;

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function updateCountdown() {
    const remaining = gate.targetDate().getTime() - Date.now();
    const unlocked = gate.isUnlocked();

    if (unlocked) {
      els.days.textContent = '00';
      els.hours.textContent = '00';
      els.minutes.textContent = '00';
      els.seconds.textContent = '00';
      els.celebrate.disabled = false;
      els.celebrate.classList.add('is-live');
      els.message.textContent = 'MIDNIGHT. The doors are open. You may now cause a birthday-level disturbance.';
      els.lockNote.innerHTML = '<span class="live-dot"></span> Celebration unlocked in your timezone.';

      if (!unlockedOnce) {
        unlockedOnce = true;
        burstAmbient(90);
      }

      if (cfg.skipCountdownPageAfterUnlock) {
        window.location.replace('celebration.html');
      }
      return;
    }

    const totalSeconds = Math.floor(Math.max(0, remaining) / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  els.celebrate.addEventListener('click', () => {
    if (gate.isUnlocked()) window.location.href = 'celebration.html';
    else {
      els.celebrate.classList.add('locked-shake');
      setTimeout(() => els.celebrate.classList.remove('locked-shake'), 450);
    }
  });

  els.music.addEventListener('click', () => {
    const playing = window.birthdayMusic.toggle();
    els.music.classList.toggle('music-on', playing);
    els.musicText.textContent = playing ? 'Pause birthday music' : 'Play birthday music';
  });

  // Interactive ambient canvas: geometric paper confetti drifts toward the cursor.
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  let particles = [];

  const palette = ['#ffcf4d','#ff6d8a','#7f6cff','#45dfc4','#f7f0ff'];

  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }

  function makeParticle(x = Math.random()*innerWidth, y = -20) {
    return {
      x, y,
      vx: (Math.random()-.5)*.7,
      vy: .4 + Math.random()*1.1,
      size: 3 + Math.random()*7,
      rot: Math.random()*Math.PI,
      vr: (Math.random()-.5)*.05,
      color: palette[Math.floor(Math.random()*palette.length)],
      shape: Math.random() > .55 ? 'rect' : 'circle',
      life: 1,
    };
  }

  function burstAmbient(count = 50) {
    for (let i=0; i<count; i++) {
      const p = makeParticle(mouse.x + (Math.random()-.5)*220, mouse.y + (Math.random()-.5)*80);
      p.vx = (Math.random()-.5)*5;
      p.vy = -1 - Math.random()*5;
      particles.push(p);
    }
  }
  window.burstAmbient = burstAmbient;

  function draw() {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    if (particles.length < 65 && Math.random() > .83) particles.push(makeParticle());

    particles.forEach(p => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const d = Math.hypot(dx,dy);
      if (d < 120) {
        p.vx -= dx * .00015;
        p.vy -= dy * .00008;
      }
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = .75;
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);
      else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    particles = particles.filter(p => p.y < innerHeight + 50 && p.x > -80 && p.x < innerWidth + 80);
    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', resize);
  resize();
  draw();
  updateCountdown();
  setInterval(updateCountdown, 250);
})();
