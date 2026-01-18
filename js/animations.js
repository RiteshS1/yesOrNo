/**
 * GSAP Animations Component
 */

class PageAnimations {
  constructor() {
    this.timeline = null;
  }

  /**
   * Initialize page load animations
   */
  initPageLoad() {
    const container = document.querySelector('.container');
    const gif = document.querySelector('.tenor-gif-embed');
    const h1 = document.querySelector('h1');
    const p = document.querySelector('p');
    const btn = document.querySelector('.btn');

    if (!container) return;

    if (typeof gsap === 'undefined') {
      container.style.opacity = '1';
      if (gif) gif.style.opacity = '1';
      if (h1) h1.style.opacity = '1';
      if (p) p.style.opacity = '1';
      if (btn) btn.style.opacity = '1';
      return;
    }

    gsap.set([container, gif, h1, p, btn], { opacity: 0 });
    this.timeline = gsap.timeline();

    this.timeline.to(container, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    });

    if (gif) {
      gsap.set(gif, { scale: 0.5, opacity: 0 });
      this.timeline.to(gif, {
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

  /**
   * Animate text with word-by-word reveal
   */
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

      button.addEventListener('click', function(e) {
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

  /**
   * Initialize random button movement for finalNo state
   */
  initRandomButtonMovement() {
    const moveRandom = document.querySelector("#move-random");
    if (!moveRandom) return;

    let isMoving = false;
    const moveButton = (button) => {
      if (isMoving) return;
      isMoving = true;
      const container = document.querySelector('.container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const btnContainer = button.closest('.btn');
      
      // Get button container bounds if it exists
      let btnContainerRect = btnContainer ? btnContainer.getBoundingClientRect() : containerRect;
      
      // Get current button position relative to button container
      const currentLeft = buttonRect.left - btnContainerRect.left;
      const currentTop = buttonRect.top - btnContainerRect.top;
      
      // Calculate available space (accounting for padding and button size)
      const padding = 15;
      const maxX = Math.max(0, btnContainerRect.width - buttonRect.width - padding);
      const maxY = Math.max(0, btnContainerRect.height - buttonRect.height - padding);
      
      // Ensure we have valid dimensions
      if (maxX <= 0 || maxY <= 0) {
        // Fallback: use container bounds
        const fallbackMaxX = Math.max(0, containerRect.width - buttonRect.width - padding);
        const fallbackMaxY = Math.max(0, containerRect.height - buttonRect.height - padding);
        
        if (fallbackMaxX <= 0 || fallbackMaxY <= 0) return;
        
        // Use container bounds
        const newX = Math.random() * fallbackMaxX;
        const newY = Math.random() * fallbackMaxY;
        const deltaX = newX - (buttonRect.left - containerRect.left);
        const deltaY = newY - (buttonRect.top - containerRect.top);
        
        if (typeof gsap !== 'undefined') {
          gsap.to(button, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          button.style.transition = 'transform 0.3s ease-out';
        }
        setTimeout(() => { isMoving = false; }, 300);
        return;
      }
      
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      const deltaX = newX - currentLeft;
      const deltaY = newY - currentTop;
      
      if (typeof gsap !== 'undefined') {
        gsap.to(button, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => { isMoving = false; }
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
        button.style.transition = 'transform 0.3s ease-out';
        setTimeout(() => { isMoving = false; }, 300);
      }
    };

    // Mouse events (desktop)
    moveRandom.addEventListener("mouseenter", function (e) {
      moveButton(e.target);
    });

    // Touch events (mobile)
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    
    moveRandom.addEventListener("touchstart", function (e) {
      touchStartTime = Date.now();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    moveRandom.addEventListener("touchend", function (e) {
      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      const touchDuration = Date.now() - touchStartTime;
      
      // Calculate movement distance
      const deltaX = Math.abs(touchEndX - touchStartX);
      const deltaY = Math.abs(touchEndY - touchStartY);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // If it's a quick tap (not a drag), move the button
      if (touchDuration < 300 && distance < 10) {
        e.preventDefault();
        moveButton(e.target);
      } else if (distance < 5) {
        // Very small movement, treat as tap
        e.preventDefault();
        moveButton(e.target);
      }
    });

    // Also move on touchmove if user tries to drag
    moveRandom.addEventListener("touchmove", function (e) {
      // Move button away when user tries to touch it
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      
      if (deltaX > 5 || deltaY > 5) {
        // User is trying to drag, move button away
        moveButton(e.target);
      }
    }, { passive: true });
  }

  animateNoButtons() {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.btn a[href*="state="], .btn a[href="#"]').forEach(button => {
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

