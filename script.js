const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeLabel = themeToggle?.querySelector('.theme-label');
const themeLogos = document.querySelectorAll('[data-theme-logo]');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const emojiButtons = document.querySelectorAll('.emoji-chip');
const answerButtons = document.querySelectorAll('.answer-card');
const gameFeedback = document.getElementById('gameFeedback');
const burstContainer = document.getElementById('emojiBurstContainer');

function applyTheme(theme) {
  const isDark = theme === 'dark';

  body.classList.toggle('dark', isDark);
  themeLogos.forEach((logo) => {
    logo.src = isDark ? 'logo-white.png' : 'logo-color.png';
  });

  if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
  if (themeLabel) themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
  }

  localStorage.setItem('codersClubTheme', theme);
}

const savedTheme = localStorage.getItem('codersClubTheme');
if (savedTheme) {
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  applyTheme('dark');
}

themeToggle?.addEventListener('click', () => {
  applyTheme(body.classList.contains('dark') ? 'light' : 'dark');
});

function setMenu(open) {
  siteNav?.classList.toggle('open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  if (menuToggle) menuToggle.textContent = open ? '✕' : '☰';
}

menuToggle?.setAttribute('aria-expanded', 'false');
menuToggle?.addEventListener('click', () => setMenu(!siteNav?.classList.contains('open')));

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('click', (event) => {
  if (!siteNav?.classList.contains('open')) return;
  if (!siteNav.contains(event.target) && !menuToggle?.contains(event.target)) setMenu(false);
});

function spawnEmojiBurst(emoji, x, y, amount = 10) {
  if (!burstContainer) return;

  for (let i = 0; i < amount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'emoji-burst';
    particle.textContent = emoji;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 210}px`);
    particle.style.setProperty('--dy', `${-80 - Math.random() * 150}px`);
    particle.style.setProperty('--rot', `${(Math.random() - 0.5) * 220}deg`);
    particle.style.animationDelay = `${i * 22}ms`;
    burstContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 1500);
  }
}

function burstFromElement(element, emoji, amount) {
  const rect = element.getBoundingClientRect();
  spawnEmojiBurst(emoji, rect.left + rect.width / 2, rect.top + rect.height / 2, amount);
}

emojiButtons.forEach((button) => {
  button.addEventListener('click', () => {
    burstFromElement(button, button.dataset.emoji || '✨', 10);
    button.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-4px) scale(1.08) rotate(-2deg)' },
        { transform: 'translateY(0) scale(1)' }
      ],
      { duration: 280, easing: 'ease-out' }
    );
  });
});

const missionCopy = {
  logic: 'Mantap! Mulai dari puzzle dan computational thinking. 🧩',
  build: 'Gas! Project pertamamu siap dibangun dari nol. ⚡',
  compete: 'Siapkan strategi—target berikutnya podium! 🥇',
  mentor: 'Pilihan keren! Tumbuh lebih cepat lewat kolaborasi. 🙌'
};

answerButtons.forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    answerButtons.forEach((answer) => answer.classList.remove('selected'));
    button.classList.add('selected');
    button.setAttribute('aria-pressed', 'true');
    answerButtons.forEach((answer) => {
      if (answer !== button) answer.setAttribute('aria-pressed', 'false');
    });

    if (gameFeedback) {
      gameFeedback.textContent = missionCopy[button.dataset.answer] || 'Misi dipilih! Saatnya mulai belajar. ✨';
      gameFeedback.classList.add('is-active');
    }

    burstFromElement(button, button.dataset.emoji || '✨', 14);
  });
});

const revealTargets = document.querySelectorAll(
  '.section-heading, .info-card, .timeline-item, .project-card, .track-card, .radar-card, .radar-note, .benefit-card, .ai-manifesto, .ai-rule-card, .ai-principles, .mentor-card, .faq-list details, .cta-box'
);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px' });

  revealTargets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

const navLinks = [...document.querySelectorAll('.site-nav a')];
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-25% 0px -65%', threshold: 0 });

  trackedSections.forEach((section) => navObserver.observe(section));
}

document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach((openDetail) => {
      if (openDetail !== detail) openDetail.open = false;
    });
  });
});
