class ParticleBackground {
  constructor() {
    this.container = null;
    this.particles = [];
    this.animationFrame = null;
  }

  init() {
    this.createContainer();
    this.createParticles();
    this.animate();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'particle-background';
    document.body.appendChild(this.container);
  }

  createParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 10 + 15;
      const delay = Math.random() * 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = Math.random() * 0.5 + 0.3;
      
      this.container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  animate() {
    if (typeof gsap !== 'undefined') {
      this.particles.forEach((particle, index) => {
        gsap.to(particle, {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          duration: Math.random() * 5 + 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.1
        });
      });
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}

window.ParticleBackground = ParticleBackground;

