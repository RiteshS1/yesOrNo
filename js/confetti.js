class ConfettiEffects {
  static CONFETTI_COLORS = [
    '#ff9a9e', '#fecfef', '#ffd1dc', '#ffb6c1', 
    '#ffffff', '#ffc0cb', '#ff69b4', '#ff1493'
  ];

  static CONTINUOUS_COLORS = ['#ff9a9e', '#fecfef', '#ffd1dc', '#ffb6c1', '#ffffff'];

  constructor() {
    this.isLibraryLoaded = false;
    this.continuousInterval = null;
    this.loadPromise = null;
    this.CHECK_INTERVAL = 50;
    this.MAX_CHECK_DURATION = 5000;
    this.initLibraryCheck();
  }

  initLibraryCheck() {
    if (typeof confetti !== 'undefined') {
      this.isLibraryLoaded = true;
      return;
    }

    this.loadPromise = new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (typeof confetti !== 'undefined') {
          this.isLibraryLoaded = true;
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > this.MAX_CHECK_DURATION) {
          clearInterval(checkInterval);
          console.warn('Confetti library failed to load after timeout');
          resolve(false);
        }
      }, this.CHECK_INTERVAL);
    });
  }

  async ensureLibrary() {
    if (this.isLibraryLoaded || typeof confetti !== 'undefined') {
      this.isLibraryLoaded = true;
      return true;
    }

    if (this.loadPromise) {
      await this.loadPromise;
      return this.isLibraryLoaded;
    }

    return false;
  }

  async trigger() {
    if (!(await this.ensureLibrary())) {
      return;
    }

    const colors = ConfettiEffects.CONFETTI_COLORS;
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.5 },
        colors: colors
      });
      
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.5 },
        colors: colors
      });
      
      confetti({
        particleCount: 4,
        angle: 90,
        spread: 60,
        origin: { x: 0.5, y: 0 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: colors,
        shapes: ['circle', 'square']
      });
    }, 300);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { x: 0.3, y: 0.6 },
        colors: colors,
        shapes: ['circle']
      });
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { x: 0.7, y: 0.6 },
        colors: colors,
        shapes: ['square']
      });
    }, 1000);

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.4 },
        colors: colors,
        shapes: ['circle', 'square'],
        gravity: 0.8
      });
    }, 2000);
  }

  async startContinuous(duration = 10000) {
    if (!(await this.ensureLibrary())) return;
    
    const end = Date.now() + duration;
    const colors = ConfettiEffects.CONTINUOUS_COLORS;
    
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: Math.random() * 360,
        spread: 55,
        origin: { 
          x: Math.random(),
          y: Math.random() * 0.5
        },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        this.continuousInterval = null;
      }
    };

    this.continuousInterval = requestAnimationFrame(frame);
  }

  stopContinuous() {
    if (this.continuousInterval) {
      cancelAnimationFrame(this.continuousInterval);
      this.continuousInterval = null;
    }
  }

  async triggerFromButton(button) {
    if (!(await this.ensureLibrary())) return;
    
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    const colors = ConfettiEffects.CONTINUOUS_COLORS;
    
    confetti({
      particleCount: 100,
      angle: 90,
      spread: 45,
      origin: { x, y },
      colors: colors,
      startVelocity: 30
    });
  }

  async createShower(duration = 3000) {
    if (!(await this.ensureLibrary())) return;
    
    const end = Date.now() + duration;
    const colors = ConfettiEffects.CONTINUOUS_COLORS;
    
    const frame = () => {
      for (let i = 0; i < 5; i++) {
        confetti({
          particleCount: 3,
          angle: 90 + (Math.random() - 0.5) * 30,
          spread: 55,
          origin: { 
            x: Math.random(),
            y: 0
          },
          colors: colors
        });
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }
}

window.ConfettiEffects = ConfettiEffects;
