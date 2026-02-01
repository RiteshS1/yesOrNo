const { createApp } = Vue;

class AppController {
  static TIMING = {
    MIN_LOAD_TIME: 3000,
    STATE_CHANGE_DELAY: 50,
    HOME_ANIMATION_DELAY: 400,
    CONFETTI_DELAY: 1000,
    TEXT_REVEAL_DELAY: 500,
    RANDOM_BUTTON_DELAY: 300,
    NO_BUTTON_DELAY: 200,
    PAGE_LOAD_DELAY: 100,
    LOADER_FADE_DURATION: 600,
    APP_FADE_DELAY: 100,
    GSAP_CHECK_TIMEOUT: 2000,
    GSAP_CHECK_INTERVAL: 100
  };

  constructor() {
    this.lightningEffects = null;
    this.confettiEffects = null;
    this.pageAnimations = null;
    this.heartTrails = null;
    this.floatingHearts = null;
    this.particleBackground = null;
    this.musicPlayer = null;
    this.stateManager = null;
    this.videoPreloader = null;
    this.vueApp = null;
    this.buttonEffectsSetup = false;
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    try {
      this.showLoader();
      
      this.stateManager = new StateManager();
      this.videoPreloader = new VideoPreloader(this.stateManager);
      
      const progressBar = document.getElementById('progress-bar');
      const loadStart = Date.now();
      
      await this.videoPreloader.preloadAllVideos((loaded, total) => {
        const percent = (loaded / total) * 100;
        if (progressBar) {
          progressBar.style.width = `${percent}%`;
        }
      });
      
      const elapsed = Date.now() - loadStart;
      const remaining = AppController.TIMING.MIN_LOAD_TIME - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
      
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
      this.musicPlayer = new MusicPlayer();
      this.musicPlayer.init();
      this.createFooter();
      this.initVueApp();
      
      const checkGSAP = () => {
        if (typeof gsap === 'undefined' && typeof window.gsap === 'undefined') {
          if (Date.now() - this.startTime < AppController.TIMING.GSAP_CHECK_TIMEOUT) {
            setTimeout(checkGSAP, AppController.TIMING.GSAP_CHECK_INTERVAL);
            return;
          }
          console.warn('GSAP not loaded, using CSS animations');
        }

        this.pageAnimations.initPageLoad();
        this.pageAnimations.initButtonAnimations();
      };

      this.startTime = Date.now();
      checkGSAP();
      
      this.hideLoader();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.hideLoader();
    }
  }

  showLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
      loadingScreen.classList.remove('hidden');
    }
    if (app) {
      app.style.opacity = '0';
    }
  }

  hideLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, AppController.TIMING.LOADER_FADE_DURATION);
    }
    if (app) {
      setTimeout(() => {
        app.style.opacity = '1';
        app.style.transition = 'opacity 0.6s ease-in';
      }, AppController.TIMING.APP_FADE_DELAY);
    }
  }

  initVueApp() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialState = urlParams.get('state') || 'home';
    const appController = this;

    this.vueApp = createApp({
      data() {
        return {
          currentState: initialState,
          videoKey: 0
        };
      },
      computed: {
        currentConfig() {
          if (this.currentState === 'home') {
            return null;
          }
          return appController.stateManager.getStateConfig(this.currentState);
        }
      },
      watch: {
        currentState(newState, oldState) {
          if (newState !== oldState) {
            this.videoKey++;
            setTimeout(() => {
              this.$nextTick(() => {
                appController.handleStateChange(newState);
              });
            }, AppController.TIMING.STATE_CHANGE_DELAY);
          }
        },
        currentConfig: {
          handler(newConfig, oldConfig) {
            const newPath = newConfig ? newConfig.videoPath : null;
            const oldPath = oldConfig ? oldConfig.videoPath : null;
            
            if (newPath && newPath !== oldPath) {
              this.videoKey++;
            }
          },
          deep: true,
          immediate: false
        }
      },
      methods: {
        navigateToState(state) {
          if (this.currentState === state) return;
          this.currentState = state;
          const newUrl = state === 'home' ? window.location.pathname : `?state=${state}`;
          window.history.pushState({ state }, '', newUrl);
        },
        handleRandomNoClick(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      },
      mounted() {
        this.$nextTick(() => {
          appController.handleStateChange(this.currentState);
          appController.setupButtonEffects();
        });
        
        window.addEventListener('popstate', () => {
          const urlParams = new URLSearchParams(window.location.search);
          const state = urlParams.get('state') || 'home';
          this.currentState = state;
        });
      }
    });

    this.vueApp.mount('#app');
  }

  handleStateChange(state) {
    if (state === 'home') {
      setTimeout(() => {
        this.pageAnimations.initPageLoad();
        this.pageAnimations.initButtonAnimations();
      }, AppController.TIMING.HOME_ANIMATION_DELAY);
      return;
    }

    const config = this.stateManager.getStateConfig(state);
    if (!config) return;

    if (config.triggerConfetti) {
      setTimeout(() => {
        this.confettiEffects.trigger().catch(err => console.warn('Confetti trigger failed:', err));
        this.confettiEffects.startContinuous(15000).catch(err => console.warn('Confetti continuous failed:', err));
        
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
      }, AppController.TIMING.CONFETTI_DELAY);

      setTimeout(() => {
        this.pageAnimations.animateTextReveal();
      }, AppController.TIMING.TEXT_REVEAL_DELAY);
    }

    if (config.randomButton) {
      setTimeout(() => {
        this.pageAnimations.initRandomButtonMovement();
      }, AppController.TIMING.RANDOM_BUTTON_DELAY);
    } else {
      setTimeout(() => {
        this.pageAnimations.animateNoButtons();
      }, AppController.TIMING.NO_BUTTON_DELAY);
    }
    
    setTimeout(() => {
      this.pageAnimations.initPageLoad();
      this.pageAnimations.initButtonAnimations();
    }, AppController.TIMING.PAGE_LOAD_DELAY);
  }

  setupButtonEffects() {
    if (this.buttonEffectsSetup) return;
    this.buttonEffectsSetup = true;

    document.addEventListener('click', async (e) => {
      const button = e.target.closest('.btn a');
      if (!button) return;

      const isYesButton = button.textContent.trim().toLowerCase() === 'yes';
      
      if (isYesButton) {
        await this.confettiEffects.triggerFromButton(button);
      }
      
      this.heartTrails.createOnButtonClick(button);
      const rect = button.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth * 100;
      const y = (rect.top + rect.height / 2) / window.innerHeight * 100;
      this.floatingHearts.createBurst(x, y, 5);
    });
  }

  createFooter() {
    if (document.querySelector('.site-footer')) return;

    const container = document.querySelector('.container');
    if (!container) return;

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="footer-left">
        Built with ❤️ by RS
      </div>
      <div class="footer-right">
        <a href="https://github.com/RiteshS1" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a href="https://x.com/riiteshhhhh" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="X (Twitter)">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>
    `;
    container.parentNode.insertBefore(footer, container.nextSibling);
  }
}

const app = new AppController();
app.init();
