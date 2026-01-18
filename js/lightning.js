class LightningEffects {
  constructor() {
    this.container = null;
    this.lightningInterval = null;
    this.sparkleInterval = null;
  }

  init() {
    this.createContainer();
    this.startRandomLightning();
    this.startSparkles();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'lightning-container';
    document.body.appendChild(this.container);
  }

  startRandomLightning() {
    const createBurst = () => {
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        setTimeout(() => this.createLightning(), i * 100);
      }
      this.lightningInterval = setTimeout(createBurst, Math.random() * 2000 + 1000);
    };
    createBurst();
  }

  createLightning() {
    if (!this.container) return;

    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    
    const left = Math.random() * 100;
    const top = Math.random() * 80;
    const height = Math.random() * 200 + 80;
    const width = Math.random() * 3 + 1;
    
    lightning.style.left = `${left}%`;
    lightning.style.top = `${top}%`;
    lightning.style.height = `${height}px`;
    lightning.style.width = `${width}px`;
    lightning.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
    
    const colors = [
      'rgba(255, 255, 255, 0.9)',
      'rgba(200, 220, 255, 0.9)',
      'rgba(255, 200, 255, 0.9)',
      'rgba(255, 182, 193, 0.9)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    lightning.style.background = `linear-gradient(to bottom, ${color} 0%, transparent 100%)`;
    lightning.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px ${color}`;
    
    this.container.appendChild(lightning);
    
    setTimeout(() => {
      lightning.classList.add('active');
    }, 10);
    
    this.createSparkles(left, top);
    
    setTimeout(() => {
      lightning.remove();
    }, 400);
  }

  createSparkles(x, y, count = 8) {
    if (!this.container) return;
    
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      
      const size = Math.random() * 6 + 10;
      const angle = (Math.PI * 2 * i) / count;
      const distance = Math.random() * 50 + 20;
      
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.left = `${x}%`;
      sparkle.style.top = `${y}%`;
      sparkle.style.background = `radial-gradient(circle, white, transparent)`;
      sparkle.style.boxShadow = `0 0 ${size * 2}px white`;
      
      this.container.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.classList.add('active');
        sparkle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      }, 10);
      
      setTimeout(() => {
        sparkle.remove();
      }, 600);
    }
  }

  startSparkles() {
    const createSparkleBurst = () => {
      const count = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.createSparkles(
            Math.random() * 100,
            Math.random() * 100
          );
        }, i * 200);
      }
      this.sparkleInterval = setTimeout(createSparkleBurst, 2000);
    };
    createSparkleBurst();
  }

  createLightningBurst(x, y, count = 8) {
    if (!this.container) return;
    
    const boltCount = count || Math.floor(Math.random() * 5) + 8;
    for (let i = 0; i < boltCount; i++) {
      setTimeout(() => {
        const lightning = document.createElement('div');
        lightning.className = 'lightning';
        
        const angle = (Math.PI * 2 * i) / boltCount + (Math.random() - 0.5) * 0.5;
        const distance = Math.random() * 150 + 80;
        
        lightning.style.left = `${x}%`;
        lightning.style.top = `${y}%`;
        lightning.style.height = `${distance}px`;
        lightning.style.width = `${Math.random() * 2 + 1}px`;
        lightning.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
        lightning.style.transformOrigin = 'top center';
        
        // Bright white for bursts
        lightning.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, transparent 100%)';
        lightning.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.9)';
        
        this.container.appendChild(lightning);
        
        setTimeout(() => {
          lightning.classList.add('active');
        }, 10);
        
        setTimeout(() => {
          lightning.remove();
        }, 400);
      }, i * 30);
    }
    
    this.createSparkles(x, y, 20);
  }

  stop() {
    if (this.lightningInterval) {
      clearTimeout(this.lightningInterval);
      this.lightningInterval = null;
    }
    if (this.sparkleInterval) {
      clearTimeout(this.sparkleInterval);
      this.sparkleInterval = null;
    }
  }
}

window.LightningEffects = LightningEffects;
