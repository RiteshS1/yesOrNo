class PageAnimations {
  constructor() {
    this.timeline = null;
    this.buttonListenersSetup = new WeakSet();
    this.randomButtonElements = new WeakSet();
  }

  initPageLoad() {
    const container = document.querySelector('.container');
    const video = document.querySelector('.state-video');
    const h1 = document.querySelector('h1');
    const p = document.querySelector('p');
    const btn = document.querySelector('.btn');

    if (!container) return;

    if (typeof gsap === 'undefined') {
      container.style.opacity = '1';
      if (video) video.style.opacity = '1';
      if (h1) h1.style.opacity = '1';
      if (p) p.style.opacity = '1';
      if (btn) btn.style.opacity = '1';
      return;
    }

    gsap.set([container, video, h1, p, btn], { opacity: 0 });
    this.timeline = gsap.timeline();

    this.timeline.to(container, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    });

    if (video) {
      gsap.set(video, { scale: 0.5, opacity: 0 });
      this.timeline.to(video, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, '-=0.4');
    }

    if (h1) {
      gsap.set(h1, { y: 30, opacity: 0 });
      this.timeline.to(h1, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.3');
    }

    if (p) {
      gsap.set(p, { y: 20, opacity: 0 });
      this.timeline.to(p, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2');
    }

    if (btn && btn.children.length > 0) {
      gsap.set(btn.children, { y: 20, opacity: 0, scale: 0.8 });
      this.timeline.to(btn.children, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: 'back.out(1.2)'
      }, '-=0.2');
    }
  }

  animateTextReveal() {
    const h1 = document.querySelector('h1');
    if (!h1 || typeof gsap === 'undefined') return;

    const words = h1.textContent.split(' ');
    h1.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    
    const wordSpans = h1.querySelectorAll('.word');
    
    gsap.from(wordSpans, {
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: 0.1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.5
    });
  }

  initButtonAnimations() {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.btn a').forEach(button => {
      if (this.buttonListenersSetup.has(button)) return;
      this.buttonListenersSetup.add(button);

      button.addEventListener('mouseenter', function() {
        gsap.to(this, {
          scale: 1.05,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      button.addEventListener('mouseleave', function() {
        gsap.to(this, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.in'
        });
      });

      button.addEventListener('click', function() {
        gsap.to(this, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      });
    });
  }

  initRandomButtonMovement() {
    const moveRandom = document.querySelector("#move-random");
    if (!moveRandom) return;
    
    if (this.randomButtonElements.has(moveRandom)) {
      return;
    }
    this.randomButtonElements.add(moveRandom);

    let isMoving = false;
    let lastButtonMoveTime = 0;
    const isMobile = window.innerWidth <= 768;
    const moveButton = (button) => {
      const now = Date.now();
      const throttleTime = isMobile ? 20 : 30;
      if (isMoving && (now - lastButtonMoveTime < throttleTime)) return;
      isMoving = true;
      lastButtonMoveTime = now;
      const container = document.querySelector('.container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      
      let btnContainerRect = containerRect;
      if (!isMobile) {
        const btnContainer = button.closest('.btn');
        btnContainerRect = btnContainer ? btnContainer.getBoundingClientRect() : containerRect;
      }
      
      const currentLeft = buttonRect.left - btnContainerRect.left;
      const currentTop = buttonRect.top - btnContainerRect.top;
      const padding = isMobile ? 5 : 15;
      const maxX = Math.max(0, btnContainerRect.width - buttonRect.width - padding);
      const maxY = Math.max(0, btnContainerRect.height - buttonRect.height - padding);
      
      if (maxX <= 0 || maxY <= 0) {
        const fallbackMaxX = Math.max(0, containerRect.width - buttonRect.width - padding);
        const fallbackMaxY = Math.max(0, containerRect.height - buttonRect.height - padding);
        
        if (fallbackMaxX <= 0 || fallbackMaxY <= 0) return;
        
        const newX = Math.random() * fallbackMaxX;
        const newY = Math.random() * fallbackMaxY;
        const deltaX = newX - (buttonRect.left - containerRect.left);
        const deltaY = newY - (buttonRect.top - containerRect.top);
        
        const duration = isMobile ? 0.03 : 0.05;
        if (typeof gsap !== 'undefined') {
          gsap.to(button, {
            x: deltaX,
            y: deltaY,
            duration: duration,
            ease: 'power2.out',
            onComplete: () => { 
              isMoving = false;
            }
          });
        } else {
          button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          button.style.transition = `transform ${duration}s ease-out`;
          setTimeout(() => { isMoving = false; }, duration * 1000);
        }
        return;
      }
      
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      const deltaX = newX - currentLeft;
      const deltaY = newY - currentTop;
      
      const duration = isMobile ? 0.03 : 0.05;
      if (typeof gsap !== 'undefined') {
        gsap.to(button, {
          x: deltaX,
          y: deltaY,
          duration: duration,
          ease: 'power2.out',
          onComplete: () => { 
            isMoving = false;
          }
        });
      } else {
        const currentTransform = window.getComputedStyle(button).transform;
        let currentX = 0, currentY = 0;
        
        if (currentTransform && currentTransform !== 'none') {
          const matrix = currentTransform.match(/matrix.*\((.+)\)/);
          if (matrix) {
            const values = matrix[1].split(', ');
            currentX = parseFloat(values[4]) || 0;
            currentY = parseFloat(values[5]) || 0;
          }
        }
        
        button.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px)`;
        button.style.transition = `transform ${duration}s ease-out`;
        setTimeout(() => { isMoving = false; }, duration * 1000);
      }
    };

    moveRandom.addEventListener("mouseenter", function (e) {
      e.preventDefault();
      moveButton(e.target);
    });

    moveRandom.addEventListener("mouseover", function (e) {
      e.preventDefault();
      moveButton(e.target);
    });

    moveRandom.addEventListener("mousemove", function (e) {
      e.preventDefault();
      moveButton(e.target);
    });

    let lastTouchMoveTime = 0;
    
    moveRandom.addEventListener("touchstart", function (e) {
      e.preventDefault();
      e.stopPropagation();
      moveButton(e.target);
    }, { passive: false });

    moveRandom.addEventListener("touchmove", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      
      if (now - lastTouchMoveTime > 10) {
        moveButton(e.target);
        lastTouchMoveTime = now;
      }
    }, { passive: false });

    moveRandom.addEventListener("touchend", function (e) {
      e.preventDefault();
      e.stopPropagation();
      moveButton(e.target);
      return false;
    }, { passive: false });

    moveRandom.addEventListener("touchcancel", function (e) {
      e.preventDefault();
      e.stopPropagation();
      moveButton(e.target);
    }, { passive: false });
  }

  animateNoButtons() {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.btn a[href*="state="], .btn a[href="#"]').forEach(button => {
      if (this.buttonListenersSetup.has(button)) return;
      
      button.addEventListener('mouseenter', function() {
        gsap.to(this, {
          x: Math.random() * 20 - 10,
          y: Math.random() * 20 - 10,
          rotation: Math.random() * 10 - 5,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }
}

window.PageAnimations = PageAnimations;

