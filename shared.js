(() => {
  const cfg = window.BIRTHDAY_CONFIG;

  function targetDate() {
    const t = cfg.target;
    // IMPORTANT: no timezone suffix => date is constructed in visitor's local timezone.
    return new Date(t.year, t.monthIndex, t.day, t.hour, t.minute, t.second, 0);
  }

  function isUnlocked() {
    return cfg.devPreviewUnlocked || Date.now() >= targetDate().getTime();
  }

  window.BirthdayGate = { targetDate, isUnlocked };

  // Tiny browser-synth birthday instrumental. No external audio file required.
  class BirthdayMusic {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.timerIds = [];
      this.playing = false;
      this.loopTimer = null;
    }

    init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.13;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    note(freq, start, duration, type = 'triangle', volume = 0.7) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(start);
      osc.stop(start + duration + 0.04);
    }

    playPhrase() {
      this.init();
      const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.0,
        A4 = 440.0, Bb4 = 466.16, C5 = 523.25, D5 = 587.33, F5 = 698.46, G5 = 783.99;
      const melody = [
        [G4,.28],[G4,.18],[A4,.48],[G4,.48],[C5,.48],[Bb4,.88],
        [G4,.28],[G4,.18],[A4,.48],[G4,.48],[D5,.48],[C5,.88],
        [G4,.28],[G4,.18],[G5,.48],[E4,.48],[C5,.48],[Bb4,.48],[A4,.88],
        [F5,.28],[F5,.18],[E4,.48],[C5,.48],[D5,.48],[C5,1.0]
      ];
      let t = this.ctx.currentTime + 0.06;
      melody.forEach(([freq, duration], idx) => {
        this.note(freq, t, duration * 0.9, idx % 3 === 0 ? 'sine' : 'triangle', 0.55);
        this.note(freq / 2, t, duration * 0.82, 'sine', 0.12);
        t += duration;
      });
      return (t - this.ctx.currentTime) * 1000;
    }

    play() {
      if (this.playing) return;
      this.playing = true;
      const duration = this.playPhrase();
      this.loopTimer = setTimeout(() => {
        if (this.playing) {
          this.playing = false;
          this.play();
        }
      }, duration + 500);
    }

    stop() {
      this.playing = false;
      if (this.loopTimer) clearTimeout(this.loopTimer);
      this.loopTimer = null;
      if (this.ctx && this.ctx.state === 'running') this.ctx.suspend();
    }

    toggle() {
      if (this.playing) this.stop(); else this.play();
      return this.playing;
    }
  }

  window.birthdayMusic = new BirthdayMusic();
})();
