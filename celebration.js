(() => {
  const cfg = window.BIRTHDAY_CONFIG;
  const gate = window.BirthdayGate;

  // Gate page 2. This prevents normal/direct access before the birthday.
  if (cfg.lockCelebrationBeforeBirthday && !gate.isUnlocked()) {
    window.location.replace('index.html');
    return;
  }

  // Curtain reveal.
  const curtain = document.getElementById('curtain');
  document.body.classList.add('no-scroll');
  setTimeout(() => curtain.classList.add('open'), 450);
  setTimeout(() => {
    curtain.remove();
    document.body.classList.remove('no-scroll');
  }, 2000);

  // Party music toggle.
  const musicBtn = document.getElementById('partyMusicButton');
  musicBtn.addEventListener('click', () => {
    const playing = window.birthdayMusic.toggle();
    musicBtn.textContent = `Music: ${playing ? 'on' : 'off'}`;
    musicBtn.classList.toggle('active', playing);
  });

  // Confetti engine (paper shapes, no emoji assets).
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let pieces = [];
  let finaleMode = false;
  const colors = ['#ffcf4d','#ff557f','#845ef7','#26d9b7','#ffffff','#ff8c42'];

  function resizeCanvas() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }

  function addBurst(x = innerWidth/2, y = innerHeight*.2, amount = 120, power = 8) {
    for (let i=0;i<amount;i++) {
      const angle = Math.random()*Math.PI*2;
      const speed = 1.5 + Math.random()*power;
      pieces.push({
        x,y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed - 2.5,
        g: .08 + Math.random()*.08,
        w: 3 + Math.random()*8,
        h: 2 + Math.random()*5,
        r: Math.random()*Math.PI,
        vr: (Math.random()-.5)*.22,
        color: colors[Math.floor(Math.random()*colors.length)],
        life: 1,
        shape: Math.random() > .7 ? 'circle' : 'rect'
      });
    }
  }

  function animateConfetti() {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    pieces.forEach(p => {
      p.vy += p.g;
      p.vx *= .998;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.life -= .0025;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0,p.life);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0,0,p.w/2,0,Math.PI*2); ctx.fill();
      } else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    });
    pieces = pieces.filter(p => p.life > 0 && p.y < innerHeight + 80);

    if (finaleMode && Math.random() > .8) {
      addBurst(Math.random()*innerWidth, innerHeight*(.08 + Math.random()*.35), 20, 4);
    }
    requestAnimationFrame(animateConfetti);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateConfetti();

  document.getElementById('heroConfettiButton').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    addBurst(r.left+r.width/2,r.top+r.height/2,120,7);
  });

  // Interactive candles.
  const candles = [...document.querySelectorAll('.interactive-candle')];
  const candleStatus = document.getElementById('candleStatus');
  const wishButton = document.getElementById('wishButton');

  function litCount() { return candles.filter(c => c.classList.contains('lit')).length; }
  function updateCandleUI() {
    const n = litCount();
    candleStatus.textContent = `${n} / ${candles.length} candles lit`;
    wishButton.disabled = n !== candles.length;
    if (n === candles.length) candleStatus.textContent = 'Blowwww timeeee ahhh';
  }

  candles.forEach(c => c.addEventListener('click', () => {
    c.classList.toggle('lit');
    updateCandleUI();
  }));

  wishButton.addEventListener('click', () => {
    candles.forEach((c, i) => setTimeout(() => c.classList.remove('lit'), i*100));
    wishButton.disabled = true;
    candleStatus.textContent = 'Wish deployed after the attack on titan';
    addBurst(innerWidth/2, Math.min(innerHeight*.55, wishButton.getBoundingClientRect().top), 180, 9);
  });

  // Gift reveals.
  const giftMessage = document.getElementById('giftMessage');
  document.querySelectorAll('.reveal-gift').forEach(gift => {
    gift.addEventListener('click', () => {
      const wasOpen = gift.classList.contains('open');
      document.querySelectorAll('.reveal-gift').forEach(g => g.classList.remove('open'));
      if (!wasOpen) {
        gift.classList.add('open');
        giftMessage.textContent = gift.dataset.message;
        giftMessage.classList.remove('message-pop');
        void giftMessage.offsetWidth;
        giftMessage.classList.add('message-pop');
      } else giftMessage.textContent = 'Pick another box. There are no wrong answers.';
    });
  });

  // Balloon-pop mini game.
  const arena = document.getElementById('balloonArena');
  const counter = document.getElementById('popCounter');
  const reset = document.getElementById('resetBalloons');
  let popped = 0;

  function buildBalloons() {
    arena.innerHTML = '';
    popped = 0;
    counter.textContent = '0 / 12';
    for (let i=0;i<12;i++) {
      const b = document.createElement('button');
      b.className = 'game-balloon';
      b.setAttribute('aria-label', `Pop balloon ${i+1}`);
      b.style.setProperty('--x', `${5 + Math.random()*82}%`);
      b.style.setProperty('--y', `${4 + Math.random()*65}%`);
      b.style.setProperty('--delay', `${Math.random()*-4}s`);
      b.style.setProperty('--hue', `${Math.floor(Math.random()*330)}deg`);
      b.innerHTML = '<span></span>';
      b.addEventListener('click', () => {
        if (b.classList.contains('popped')) return;
        b.classList.add('popped');
        popped++;
        counter.textContent = `${popped} / 12`;
        const r = b.getBoundingClientRect();
        addBurst(r.left+r.width/2,r.top+r.height/2,18,3);
        if (popped === 12) {
          counter.textContent = '12 / 12 — demolished.';
          addBurst(innerWidth/2,innerHeight*.35,260,10);
        }
      });
      arena.appendChild(b);
    }
  }
  reset.addEventListener('click', buildBalloons);
  buildBalloons();

  // Interactive memory desk: developing photos, desktop dragging and fullscreen flip cards.
  const memoryCards = [...document.querySelectorAll('.memory-card')];
  const memoryDesk = document.getElementById('memoryDesk');
  const memoryModal = document.getElementById('memoryModal');
  const memoryFlip = document.getElementById('memoryFlip');
  const memoryClose = document.getElementById('memoryClose');
  const memoryModalImage = document.getElementById('memoryModalImage');
  const memoryModalCaption = document.getElementById('memoryModalCaption');
  const memoryModalNote = document.getElementById('memoryModalNote');
  let memoryZ = 30;

  const developObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      memoryCards.forEach((card, i) => setTimeout(() => card.classList.add('is-developed'), i * 170));
      developObserver.disconnect();
    });
  }, { threshold: .18 });
  if (memoryDesk) developObserver.observe(memoryDesk);

  function openMemory(card) {
    memoryModalImage.src = card.dataset.photo;
    memoryModalCaption.textContent = card.dataset.caption;
    memoryModalNote.textContent = card.dataset.note;
    memoryFlip.classList.remove('is-flipped');
    memoryModal.classList.add('is-open');
    memoryModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('memory-modal-open');
  }
  function closeMemory() {
    memoryModal.classList.remove('is-open');
    memoryModal.setAttribute('aria-hidden', 'true');
    memoryFlip.classList.remove('is-flipped');
    document.body.classList.remove('memory-modal-open');
  }
  function flipMemory() { memoryFlip.classList.toggle('is-flipped'); }

  memoryCards.forEach(card => {
    let dragging = false;
    let moved = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    card.addEventListener('pointerdown', e => {
      if (innerWidth <= 760) return;
      const deskRect = memoryDesk.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      dragging = true; moved = false;
      startX = e.clientX; startY = e.clientY;
      startLeft = cardRect.left - deskRect.left;
      startTop = cardRect.top - deskRect.top;
      card.style.left = `${startLeft}px`;
      card.style.top = `${startTop}px`;
      card.style.right = 'auto'; card.style.bottom = 'auto';
      card.classList.add('is-dragging');
      card.style.zIndex = ++memoryZ;
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 6) moved = true;
      const maxLeft = memoryDesk.clientWidth - card.offsetWidth;
      const maxTop = memoryDesk.clientHeight - card.offsetHeight;
      card.style.left = `${Math.max(0, Math.min(maxLeft, startLeft + dx))}px`;
      card.style.top = `${Math.max(0, Math.min(maxTop, startTop + dy))}px`;
    });
    const endDrag = e => {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('is-dragging');
      try { card.releasePointerCapture(e.pointerId); } catch (_) {}
      if (!moved) openMemory(card);
    };
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);
    card.addEventListener('click', e => {
      if (innerWidth <= 760) openMemory(card);
      e.preventDefault();
    });
  });

  memoryFlip.addEventListener('click', flipMemory);
  memoryFlip.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipMemory(); }
  });
  memoryClose.addEventListener('click', closeMemory);
  memoryModal.addEventListener('click', e => { if (e.target === memoryModal) closeMemory(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && memoryModal.classList.contains('is-open')) closeMemory(); });

  // 3D tilt for memory cards.
  document.querySelectorAll('.tilt-card:not(.memory-card)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width - .5;
      const y = (e.clientY-r.top)/r.height - .5;
      card.style.transform = `rotate(${card.dataset.baseRotate || 0}deg) rotateX(${y*-8}deg) rotateY(${x*10}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Finale.
  const finaleButton = document.getElementById('finaleButton');
  const finaleMessage = document.getElementById('finaleMessage');
  finaleButton.addEventListener('click', () => {
    finaleMode = true;
    document.body.classList.add('finale-active');
    finaleMessage.textContent = 'HAPPY BIRTHDAY. You are doing amazing in life and you will keep achieving greatness, everyone is proud of you RIGHT GUYSSS???.';
    addBurst(innerWidth*.2,innerHeight*.25,180,10);
    addBurst(innerWidth*.5,innerHeight*.18,200,11);
    addBurst(innerWidth*.8,innerHeight*.25,180,10);
    setTimeout(() => { finaleMode = false; document.body.classList.remove('finale-active'); }, 7000);
  });
})();
