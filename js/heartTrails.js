/**
 * Glowing Heart Trails Component
 */

class HeartTrails {
  constructor() {
    this.container = null;
    this.activeHearts = [];
    this.heartInterval = null;
  }

  init() {
    if (!this.container) {
      this.createContainer();
    }
    
    if (!this.container) {
      console.error('Failed to create heart trails container');
      return;
    }
    
    this.startContinuousHearts();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'heart-trails-container';
    document.body.appendChild(this.container);
  }

  createHeartTrail(x = null, y = null, size = null) {
    if (!this.container) {
      console.warn('Heart trails container not found, creating it...');
      this.createContainer();
      if (!this.container) {
        console.error('Failed to create container');
        return;
      }
    }

    const posX = x !== null ? x : Math.random() * 100;
    const posY = y !== null ? y : Math.random() * 100;
    const heartSize = size || (Math.random() * 80 + 60);

    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heart.setAttribute('class', 'glowing-heart');
    heart.setAttribute('width', heartSize);
    heart.setAttribute('height', heartSize);
    heart.setAttribute('viewBox', '0 0 24 24');
    heart.style.position = 'fixed';
    heart.style.left = `${posX}%`;
    heart.style.top = `${posY}%`;
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '3';
    heart.style.opacity = '0';
    heart.style.background = 'transparent';
    heart.style.border = 'none';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-opacity', '1');
    
    const pinkShades = ['#ffc0cb', '#ffb6c1'];
    const color = pinkShades[Math.floor(Math.random() * pinkShades.length)];
    
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '0.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    const filterId = `heart-glow-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-100%');
    filter.setAttribute('y', '-100%');
    filter.setAttribute('width', '300%');
    filter.setAttribute('height', '300%');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'coloredBlur');

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    heart.appendChild(defs);
    path.setAttribute('filter', `url(#${filterId})`);
    heart.appendChild(path);

    this.container.appendChild(heart);

    requestAnimationFrame(() => {
      this.animateHeartDrawing(heart, path, posX, posY);
    });

    const heartObj = { element: heart, path, startTime: Date.now() };
    this.activeHearts.push(heartObj);

    setTimeout(() => {
      if (heart.parentNode) {
        heart.remove();
      }
      this.activeHearts = this.activeHearts.filter(h => h !== heartObj);
    }, 5000);
  }

  animateHeartDrawing(svg, path, _x, _y) {
    let pathLength = path.getTotalLength();
    
    if (pathLength === 0) {
      setTimeout(() => {
        pathLength = path.getTotalLength();
        if (pathLength > 0) {
          this.animatePath(svg, path, pathLength);
        } else {
          console.warn('Path length is 0, using fallback animation');
          this.animatePath(svg, path, 50);
        }
      }, 50);
    } else {
      this.animatePath(svg, path, pathLength);
    }
  }

  animatePath(svg, path, pathLength) {
    path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    path.style.strokeDashoffset = pathLength;
    path.style.opacity = '1';

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      
      gsap.set(svg, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: 'center center'
      });
      
      tl.to(svg, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.1');

      tl.to(svg, {
        scale: 1.15,
        duration: 0.3,
        ease: 'power2.inOut'
      });
      
      tl.to(svg, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      });

      tl.to(svg, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'power2.in'
      }, '+=0.5');
    } else {
      svg.style.opacity = '1';
      svg.style.transform = 'translate(-50%, -50%)';
      svg.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
      
      path.style.transition = 'stroke-dashoffset 1.2s ease-out';
      
      requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0';
      });
      
      setTimeout(() => {
        svg.style.transform = 'translate(-50%, -50%) scale(1.15)';
        setTimeout(() => {
          svg.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
      }, 1500);
      
      setTimeout(() => {
        svg.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        svg.style.opacity = '0';
        svg.style.transform = 'translate(-50%, -50%) scale(0.8)';
      }, 3000);
    }
  }

  createTrailPath(startX, startY, endX, endY, count = 5) {
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      const size = 60 + (1 - Math.abs(progress - 0.5) * 2) * 40;
      
      setTimeout(() => {
        this.createHeartTrail(x, y, size);
      }, i * 200);
    }
  }

  startContinuousHearts() {
    const createHearts = () => {
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.createHeartTrail();
        }, i * 300);
      }
      this.heartInterval = setTimeout(createHearts, 2500);
    };
    
    setTimeout(() => {
      this.createHeartTrail();
      createHearts();
    }, 500);
  }

  createHeartBurst(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const angle = (Math.PI * 2 * i) / count;
        const distance = 20 + Math.random() * 15;
        const burstX = x + Math.cos(angle) * distance;
        const burstY = y + Math.sin(angle) * distance;
        this.createHeartTrail(burstX, burstY, 50 + Math.random() * 15);
      }, i * 100);
    }
  }

  createOnButtonClick(button) {
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth * 100;
    const y = (rect.top + rect.height / 2) / window.innerHeight * 100;
    
    this.createHeartBurst(x, y, 6);
  }

  initMouseTrail() {
    let trailTimer = null;
    let rafId = null;
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e) => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        
        if (distance > 5 && !trailTimer) {
          trailTimer = setTimeout(() => {
            this.createHeartTrail(x, y, 40);
            trailTimer = null;
          }, 300);
        }
        
        lastX = x;
        lastY = y;
        rafId = null;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  stop() {
    if (this.heartInterval) {
      clearTimeout(this.heartInterval);
      this.heartInterval = null;
    }
  }
}

window.HeartTrails = HeartTrails;
