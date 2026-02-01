class VideoPreloader {
  static LOAD_TIMEOUT = 30000;

  constructor(stateManager) {
    this.stateManager = stateManager;
    this.loadedVideos = new Map();
    this.loadPromises = new Map();
  }

  getVideoPath(state) {
    const videoMap = {
      'home': './assets/home.mp4',
      'yes': './assets/yes.mp4',
      'firstNo': './assets/firstNo.mp4',
      'secondNo': './assets/secondNo.mp4',
      'finalNo': './assets/finalNo.mp4'
    };
    return videoMap[state] || videoMap['firstNo'];
  }

  getAllVideoPaths() {
    const states = Object.keys(this.stateManager.states);
    return ['home', ...states].map(state => ({
      state,
      path: this.getVideoPath(state)
    }));
  }

  preloadVideo(state) {
    if (this.loadPromises.has(state)) {
      return this.loadPromises.get(state);
    }

    const path = this.getVideoPath(state);
    const promise = new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      
      let loaded = false;
      let timeoutId = null;
      
      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };
      
      const handleCanPlay = () => {
        if (!loaded) {
          loaded = true;
          cleanup();
          this.loadedVideos.set(state, video);
          resolve(video);
        }
      };
      
      const handleError = () => {
        cleanup();
        reject(new Error(`Failed to load video: ${path}`));
      };
      
      video.addEventListener('canplaythrough', handleCanPlay, { once: true });
      video.addEventListener('loadeddata', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });
      
      video.src = path;
      video.load();
      
      timeoutId = setTimeout(() => {
        if (!loaded) {
          handleError();
        }
      }, VideoPreloader.LOAD_TIMEOUT);
    });

    this.loadPromises.set(state, promise);
    return promise;
  }

  async preloadAllVideos(onProgress) {
    const videos = this.getAllVideoPaths();
    const total = videos.length;
    let loaded = 0;

    const promises = videos.map(({ state, path }) => {
      return this.preloadVideo(state)
        .then(() => {
          loaded++;
          if (onProgress) {
            onProgress(loaded, total);
          }
        })
        .catch(err => {
          console.warn(`Failed to preload ${state}:`, err);
          loaded++;
          if (onProgress) {
            onProgress(loaded, total);
          }
        });
    });

    await Promise.all(promises);
  }

  isVideoLoaded(state) {
    return this.loadedVideos.has(state);
  }

  getLoadedVideo(state) {
    return this.loadedVideos.get(state);
  }
}

window.VideoPreloader = VideoPreloader;
