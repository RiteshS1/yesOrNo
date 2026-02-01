class ScriptLoader {
  static LOAD_TIMEOUT = 10000;
  static loadedScripts = new Set();

  static load(src, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(src)) {
        resolve();
        return;
      }

      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        this.loadedScripts.add(src);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = options.async !== false;
      script.defer = options.defer || false;

      const timeout = setTimeout(() => {
        reject(new Error(`Script load timeout: ${src}`));
      }, options.timeout || this.LOAD_TIMEOUT);

      script.onload = () => {
        clearTimeout(timeout);
        this.loadedScripts.add(src);
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  static async loadWithFallback(primary, fallback, options = {}) {
    try {
      await this.load(primary, options);
    } catch (primaryError) {
      console.warn(`Primary CDN failed (${primary}), trying fallback...`, primaryError);
      try {
        await this.load(fallback, options);
      } catch (fallbackError) {
        throw new Error(`Both CDNs failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
      }
    }
  }

  static isLoaded(src) {
    return this.loadedScripts.has(src) || document.querySelector(`script[src="${src}"]`) !== null;
  }
}

window.ScriptLoader = ScriptLoader;
