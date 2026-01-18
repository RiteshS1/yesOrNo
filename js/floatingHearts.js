/**
 * Floating Hearts Component
 */

class FloatingHearts {
  constructor() {
    this.container = null;
    this.heartInterval = null;
  }

  init() {
    this.createContainer();
    this.startFloatingHearts();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'floating-hearts-container';
    document.body.appendChild(this.container);
  }

  createFloatingHeart(x = null, y = null) {
    if (!this.container) return;

    const hearts = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '💞', '💟', '🧡'];
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = x !== null ? `${x}%` : `${Math.random() * 100}%`;
    heart.style.top = y !== null ? `${y}%` : `${Math.random() * 20 + 80}%`;
    heart.style.fontSize = `${Math.random() * 15 + 15}px`;
    
    this.container.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
      heart.remove();
    }, 3000);
  }

  startFloatingHearts() {
    const createHearts = () => {
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.createFloatingHeart();
        }, i * 300);
      }
      this.heartInterval = setTimeout(createHearts, 2000);
    };
    createHearts();
  }

  createBurst(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const angle = (Math.PI * 2 * i) / count;
        const distance = 10 + Math.random() * 10;
        const burstX = x + Math.cos(angle) * distance;
        const burstY = y + Math.sin(angle) * distance;
        this.createFloatingHeart(burstX, burstY);
      }, i * 50);
    }
  }

  stop() {
    if (this.heartInterval) {
      clearTimeout(this.heartInterval);
      this.heartInterval = null;
    }
  }
}

window.FloatingHearts = FloatingHearts;

