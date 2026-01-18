class ConfettiEffects {
  constructor() {
    this.isLibraryLoaded = false;
    this.continuousInterval = null;
    this.checkLibrary();
  }

  checkLibrary() {
    if (typeof confetti !== 'undefined') {
      this.isLibraryLoaded = true;
    } else {
      setTimeout(() => {
        if (typeof confetti !== 'undefined') {
          this.isLibraryLoaded = true;
        }
      }, 100);
    }
  }

  trigger() {
    if (!this.isLibraryLoaded && typeof confetti === 'undefined') {
      console.warn('canvas-confetti library not loaded');
      return;
    }

    const colors = [
      '#ff9a9e', '#fecfef', '#ffd1dc', '#ffb6c1', 
      '#ffffff', '#ffc0cb', '#ff69b4', '#ff1493'
    ];
    
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

  startContinuous(duration = 10000) {
    if (typeof confetti === 'undefined') return;
    
    const end = Date.now() + duration;
    const colors = ['#ff9a9e', '#fecfef', '#ffd1dc', '#ffb6c1', '#ffffff'];
    
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

  triggerFromButton(button) {
    if (typeof confetti === 'undefined') return;
    
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    const colors = ['#ff9a9e', '#fecfef', '#ffd1dc', '#ffb6c1', '#ffffff'];
    
    confetti({
      particleCount: 100,
      angle: 90,
      spread: 45,
      origin: { x, y },
      colors: colors,
      startVelocity: 30
    });
  }

  createShower(duration = 3000) {
    if (typeof confetti === 'undefined') return;
    
    const end = Date.now() + duration;
    const colors = ['#ff9a9e', '#fecfef', '#ffd1dc', '#ffb6c1', '#ffffff'];
    
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
