/**
 * Main Application Controller
 */

class AppController {
  constructor() {
    this.stateManager = null;
    this.lightningEffects = null;
    this.confettiEffects = null;
    this.pageAnimations = null;
    this.heartTrails = null;
    this.floatingHearts = null;
    this.particleBackground = null;
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.stateManager = new StateManager();
    this.particleBackground = new ParticleBackground();
    this.particleBackground.init();
    this.lightningEffects = new LightningEffects();
    this.lightningEffects.init();
    this.confettiEffects = new ConfettiEffects();
    this.heartTrails = new HeartTrails();
    this.heartTrails.init();
    this.floatingHearts = new FloatingHearts();
    this.floatingHearts.init();
    this.pageAnimations = new PageAnimations();
    this.setupButtonEffects();
    
    const checkGSAP = () => {
      if (typeof gsap === 'undefined' && typeof window.gsap === 'undefined') {
        if (Date.now() - this.startTime < 2000) {
          setTimeout(checkGSAP, 100);
          return;
        }
        console.warn('GSAP not loaded, using CSS animations');
      }

      this.pageAnimations.initPageLoad();
      this.pageAnimations.initButtonAnimations();

      if (window.location.pathname.includes('yesOrNo.html')) {
        this.setupYesOrNoPage();
      }
    };

    this.startTime = Date.now();
    checkGSAP();
  }

  setupButtonEffects() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn a');
      if (button) {
        this.confettiEffects.triggerFromButton(button);
        this.heartTrails.createOnButtonClick(button);
        const rect = button.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth * 100;
        const y = (rect.top + rect.height / 2) / window.innerHeight * 100;
        this.floatingHearts.createBurst(x, y, 5);
      }
    });
  }

  setupYesOrNoPage() {
    const currentState = this.stateManager.getCurrentState();
    const stateConfig = this.stateManager.getStateConfig(currentState);

    this.renderPageContent(stateConfig);

    if (stateConfig.triggerConfetti) {
      setTimeout(() => {
        this.confettiEffects.trigger();
        this.confettiEffects.startContinuous(15000);
        
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            this.lightningEffects.createLightningBurst(
              Math.random() * 100,
              Math.random() * 50,
              12
            );
          }, i * 500);
        }
        
        this.heartTrails.createHeartBurst(50, 30, 12);
        
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            this.heartTrails.createHeartTrail();
          }, i * 500);
        }
        
        this.floatingHearts.createBurst(50, 30, 15);
      }, 1000);

      setTimeout(() => {
        this.pageAnimations.animateTextReveal();
      }, 500);
    }

    if (stateConfig.randomButton) {
      this.pageAnimations.initRandomButtonMovement();
    } else {
      this.pageAnimations.animateNoButtons();
    }
  }

  renderPageContent(config) {
    const container = document.querySelector('.container');
    if (!container) return;

    let gifContainer = container.querySelector('.tenor-gif-embed');
    if (!gifContainer) {
      gifContainer = document.createElement('div');
      gifContainer.className = 'tenor-gif-embed';
      container.insertBefore(gifContainer, container.firstChild);
    }

    gifContainer.setAttribute('data-postid', config.gifPostId);
    gifContainer.setAttribute('data-share-method', 'host');
    gifContainer.setAttribute('data-aspect-ratio', config.gifAspectRatio);
    gifContainer.setAttribute('data-width', '100%');

    let h1 = container.querySelector('h1');
    if (!h1) {
      h1 = document.createElement('h1');
      container.appendChild(h1);
    }
    h1.textContent = config.title;

    let p = container.querySelector('p');
    if (config.subtitle) {
      if (!p) {
        p = document.createElement('p');
        container.appendChild(p);
      }
      p.textContent = config.subtitle;
      p.style.display = 'block';
    } else if (p) {
      p.style.display = 'none';
    }

    let btnContainer = container.querySelector('.btn');
    if (config.showButtons) {
      if (!btnContainer) {
        btnContainer = document.createElement('div');
        btnContainer.className = 'btn';
        container.appendChild(btnContainer);
      }

      btnContainer.innerHTML = '';

      const yesButton = document.createElement('a');
      yesButton.href = this.stateManager.getYesUrl();
      yesButton.textContent = 'Yes';
      btnContainer.appendChild(yesButton);

      if (config.nextState) {
        const noButton = document.createElement('a');
        noButton.href = `yesOrNo.html?state=${config.nextState}`;
        noButton.textContent = 'No';
        btnContainer.appendChild(noButton);
      } else if (config.randomButton) {
        const noButton = document.createElement('a');
        noButton.href = '#';
        noButton.id = 'move-random';
        noButton.textContent = 'No';
        
        noButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
        
        noButton.style.position = 'relative';
        noButton.style.touchAction = 'none';
        
        btnContainer.appendChild(noButton);
      }
    } else if (btnContainer) {
      btnContainer.style.display = 'none';
    }

    if (!document.querySelector('script[src*="tenor.com/embed.js"]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://tenor.com/embed.js';
      document.body.appendChild(script);
    }
  }
}

const app = new AppController();
app.init();
