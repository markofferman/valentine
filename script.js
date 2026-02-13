(() => {
  'use strict';

  // =============================
  // Floating Hearts Background
  // =============================
  const heartSymbols = ['♥', '♡', '❤', '💕'];
  const heartsBg = document.querySelector('.hearts-bg');

  function createFloatingHeart() {
    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (14 + Math.random() * 20) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heartsBg.appendChild(heart);

    // Remove after animation completes
    const duration = parseFloat(heart.style.animationDuration) + parseFloat(heart.style.animationDelay);
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  // Spawn hearts at intervals
  function startFloatingHearts() {
    // Initial batch
    for (let i = 0; i < 6; i++) {
      setTimeout(createFloatingHeart, i * 400);
    }
    // Continuous generation
    setInterval(createFloatingHeart, 1800);
  }

  startFloatingHearts();

  // =============================
  // No Button Dodging Logic
  // =============================
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  const buttonsContainer = document.querySelector('.buttons-container');

  let dodgeCount = 0;
  const noTexts = [
    'No',
    'Are you sure?',
    'Really?',
    'Think again!',
    'Wrong button!',
    'Nope, try again!',
    'Not this one!',
    '😏',
  ];

  function dodgeNoButton(e) {
    e.preventDefault();
    e.stopPropagation();
    dodgeCount++;

    // Switch to absolute positioning after first dodge
    if (!noBtn.classList.contains('dodging')) {
      noBtn.classList.add('dodging');
    }

    // Get container bounds
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // Random position within container (with padding)
    const padding = 10;
    const maxX = containerRect.width - btnWidth - padding;
    const maxY = containerRect.height - btnHeight - padding;

    const randomX = padding + Math.random() * Math.max(maxX, 50);
    const randomY = padding + Math.random() * Math.max(maxY, 50);

    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    // Update No button text
    if (dodgeCount <= noTexts.length) {
      noBtn.textContent = noTexts[Math.min(dodgeCount, noTexts.length - 1)];
    }

    // Grow the Yes button
    const scale = 1 + dodgeCount * 0.08;
    yesBtn.style.transform = `scale(${Math.min(scale, 1.8)})`;

    // Shrink the No button after several dodges
    if (dodgeCount >= 3) {
      const shrink = 1 - (dodgeCount - 2) * 0.08;
      noBtn.style.fontSize = Math.max(shrink, 0.6) + 'rem';
      noBtn.style.padding = `${Math.max(0.4, 0.75 - dodgeCount * 0.04)}rem ${Math.max(1, 2 - dodgeCount * 0.1)}rem`;
    }

    // After many dodges, reduce opacity
    if (dodgeCount >= 6) {
      noBtn.style.opacity = Math.max(0.3, 1 - (dodgeCount - 5) * 0.15);
    }
  }

  // Desktop: dodge on hover
  noBtn.addEventListener('mouseover', dodgeNoButton);
  // Mobile: dodge on touch
  noBtn.addEventListener('touchstart', dodgeNoButton, { passive: false });

  // =============================
  // Yes Button — Celebration
  // =============================
  const questionSection = document.getElementById('question');
  const celebrationSection = document.getElementById('celebration');

  yesBtn.addEventListener('click', () => {
    // Hide opening and question sections
    document.getElementById('opening').classList.add('hidden');
    questionSection.classList.add('hidden');

    // Show celebration
    celebrationSection.classList.remove('hidden');

    // Scroll to top of celebration
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Launch confetti
    launchConfetti();
  });

  // =============================
  // Confetti Animation
  // =============================
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#be1e3e', '#f8d0d8', '#d4a574', '#e8c89e', '#ff6b8a', '#ff91a4'];
  const heartShape = '♥';

  class ConfettiPiece {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -20 - Math.random() * canvas.height * 0.5;
      this.size = 6 + Math.random() * 10;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.speedY = 1.5 + Math.random() * 3;
      this.speedX = (Math.random() - 0.5) * 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
      this.opacity = 1;
      this.isHeart = Math.random() > 0.6;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.rotation += this.rotationSpeed;

      // Fade out near bottom
      if (this.y > canvas.height * 0.75) {
        this.opacity -= 0.01;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);

      if (this.isHeart) {
        ctx.font = this.size + 'px serif';
        ctx.fillText(heartShape, 0, 0);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }

      ctx.restore();
    }
  }

  function launchConfetti() {
    confettiPieces = [];

    // Create pieces in waves
    for (let i = 0; i < 120; i++) {
      setTimeout(() => {
        confettiPieces.push(new ConfettiPiece());
      }, i * 20);
    }

    // Second wave
    setTimeout(() => {
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          confettiPieces.push(new ConfettiPiece());
        }, i * 30);
      }
    }, 1500);

    if (!animationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces = confettiPieces.filter(p => p.opacity > 0 && p.y < canvas.height + 20);

    confettiPieces.forEach(piece => {
      piece.update();
      piece.draw();
    });

    if (confettiPieces.length > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    } else {
      animationId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // =============================
  // Scroll-triggered animations
  // =============================
  const questionText = document.querySelector('.question-text');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (questionText) {
    questionText.style.opacity = '0';
    questionText.style.transform = 'translateY(20px)';
    observer.observe(questionText);
  }
})();
