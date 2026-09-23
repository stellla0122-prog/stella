/* ============================================================
   main.js — 인터랙션 로직
   ============================================================ */

// ── 섹션 진입 애니메이션 (Intersection Observer) ──────────────
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();

// ── 내비게이션 활성화 로직 (Intersection Observer) ─────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('.section-target');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      // 상단 헤더 높이를 감안해 화면 중간쯤에서 활성화되도록 마진 설정
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
})();


// ── PDF iframe 폴백 처리 (4.3, 4.4) ──────────────────────────
(function initPdfFallback() {
  const checkFallback = (iframeId, fallbackId) => {
    const iframe  = document.getElementById(iframeId);
    const fallback = document.getElementById(fallbackId);
    if (!iframe || !fallback) return;
  
    iframe.addEventListener('error', () => {
      iframe.hidden   = true;
      fallback.hidden = false;
    });
  };

  checkFallback('pdf-iframe-plan', 'pdf-fallback-plan');
  checkFallback('pdf-iframe-brief', 'pdf-fallback-brief');
})();

// ── 카드뉴스 캐러셀 로직 (4.6) ──────────────────────────────────
(function initCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const nextBtn = document.getElementById('carousel-next');
  const prevBtn = document.getElementById('carousel-prev');
  const dotsContainer = document.getElementById('carousel-dots');
  
  let currentIndex = 0;
  let autoplayInterval = null;

  // 인디케이터(dot) 생성
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  const updateDots = (index) => {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  };

  const moveToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    updateDots(index);
    resetAutoplay();
  };

  nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
  prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));

  // 자동 재생
  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 5000);
  };
  const stopAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
  };
  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  // 호버 시 일시정지
  const container = document.getElementById('carousel');
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
})();

// ── 라이트박스 로직 (4.5, 4.6) ──────────────────────────────────
window.openLightbox = function(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (lightbox && img) {
    img.src = src;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
  }
};

window.closeLightbox = function(e) {
  // 닫기 버튼이나 배경 클릭 시 닫기
  if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      document.getElementById('lightbox-img').src = '';
    }
  }
};

// ESC 키로 라이트박스 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && !lightbox.hidden) {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      document.getElementById('lightbox-img').src = '';
    }
  }
});
