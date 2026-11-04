import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const iconInit = () => window.lucide?.createIcons();
iconInit();

document.querySelectorAll('#skills, #skills *').forEach((element) => {
  element.style.opacity = '1';
  element.style.visibility = 'visible';
  element.style.transform = 'none';
});

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

const credentialModal = document.querySelector('#credential-modal');
const credentialModalTitle = document.querySelector('#credential-modal-title');
const credentialModalImage = document.querySelector('#credential-modal-image');
let lastCredentialCard = null;

const closeCredentialModal = () => {
  if (!credentialModal) return;
  credentialModal.hidden = true;
  document.body.style.overflow = '';
  lastCredentialCard?.focus();
};

const openCredentialModal = (card) => {
  if (!credentialModal || !credentialModalTitle || !credentialModalImage) return;
  lastCredentialCard = card;
  credentialModalTitle.textContent = card.dataset.credentialTitle || 'Credential';
  credentialModalImage.src = card.dataset.credentialImage || '';
  credentialModalImage.alt = `${credentialModalTitle.textContent} certificate`;
  credentialModal.hidden = false;
  document.body.style.overflow = 'hidden';
  credentialModal.querySelector('.credential-modal-close')?.focus();
};

document.querySelectorAll('.credential-card').forEach((card) => {
  card.addEventListener('click', () => openCredentialModal(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCredentialModal(card);
    }
  });
});

credentialModal?.querySelectorAll('[data-close-credential]').forEach((element) => {
  element.addEventListener('click', closeCredentialModal);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && credentialModal && !credentialModal.hidden) closeCredentialModal();
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
  iconInit();
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  iconInit();
}));


if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const glow = document.querySelector('.cursor-glow');
  let pointer = { x: -100, y: -100 }, ringPosition = { ...pointer };
  window.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    dot.style.opacity = ring.style.opacity = glow.style.opacity = '1';
    dot.style.left = `${pointer.x}px`; dot.style.top = `${pointer.y}px`;
  }, { passive: true });
  const follow = () => {
    ringPosition.x += (pointer.x - ringPosition.x) * .15;
    ringPosition.y += (pointer.y - ringPosition.y) * .15;
    ring.style.left = `${ringPosition.x}px`; ring.style.top = `${ringPosition.y}px`;
    glow.style.left = `${pointer.x}px`; glow.style.top = `${pointer.y}px`;
    requestAnimationFrame(follow);
  };
  follow();
  document.querySelectorAll('a,button,.tilt-card').forEach((item) => {
    item.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; ring.style.borderColor = 'var(--cyan)'; });
    item.addEventListener('mouseleave', () => { ring.style.width = '30px'; ring.style.height = '30px'; ring.style.borderColor = 'rgba(255,255,255,.55)'; });
  });
}

if (window.gsap && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.reveal', { opacity: 0, y: 25, duration: .9, stagger: .12, ease: 'power3.out', delay: .15 });
  gsap.utils.toArray('.content-section').forEach((section) => {
    const targets = section.querySelectorAll('.section-heading,.timeline-item,.project-card,.about-layout,.about-facts,.contact-layout');
    if (targets.length) {
      gsap.from(targets, {
        scrollTrigger: { trigger: section, start: 'top 78%' }, 
        opacity: 0,
         y: 35,
          duration: .8, 
          stagger: .08, 
          ease: 'power3.out'
      });
    }
  });
}

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (reducedMotion || window.innerWidth < 801) return;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    card.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${y * -3}deg)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const form = document.querySelector('#contact-form');
const contactEmail = 'mukesh.softwaredev@gmail.com';

function send(event) {
  event.preventDefault();
  const feedback = form.querySelector('.form-feedback');
  const data = new FormData(form);
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
  const body = encodeURIComponent(`${data.get('message')}\n\nReply to: ${data.get('email')}`);
  feedback.textContent = 'Opening your email client…';
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  setTimeout(() => { feedback.textContent = 'Thanks — your message is ready to send.'; form.reset(); }, 600);
}

form?.addEventListener('submit', send);

const canvas = document.querySelector('#hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
camera.position.z = 4.5;
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
const group = new THREE.Group();
scene.add(group);
const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 4), new THREE.MeshPhysicalMaterial({ color: 0xa31535, metalness: .65, roughness: .2, transmission: .1, clearcoat: 1, clearcoatRoughness: .15 }));
group.add(orb);
const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.31, 2), new THREE.MeshBasicMaterial({ color: 0xf07842, wireframe: true, transparent: true, opacity: .25 }));
group.add(wire);
const particleGeometry = new THREE.BufferGeometry();
const particles = new Float32Array(420 * 3);
for (let i = 0; i < particles.length; i += 3) {
  const radius = 2.2 + Math.random() * 1.5, theta = Math.random() * Math.PI * 2, phi = Math.acos((Math.random() * 2) - 1);
  particles[i] = radius * Math.sin(phi) * Math.cos(theta); particles[i + 1] = radius * Math.sin(phi) * Math.sin(theta); particles[i + 2] = radius * Math.cos(phi);
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
scene.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xffb36b, size: .018, transparent: true, opacity: .7 })));
scene.add(new THREE.AmbientLight(0xa31535, 1.4));
const keyLight = new THREE.PointLight(0xf07842, 25, 8); keyLight.position.set(3, 2, 4); scene.add(keyLight);
const fillLight = new THREE.PointLight(0xe63946, 18, 8); fillLight.position.set(-3, -2, 2); scene.add(fillLight);
let target = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => { target = { x: (event.clientX / innerWidth - .5) * .35, y: (event.clientY / innerHeight - .5) * .25 }; }, { passive: true });
const resize = () => { const box = canvas.getBoundingClientRect(); camera.aspect = box.width / box.height; camera.updateProjectionMatrix(); renderer.setSize(box.width, box.height, false); };
window.addEventListener('resize', resize); resize();
const render = (time = 0) => {
  group.rotation.y += .0028; group.rotation.x = Math.sin(time * .0005) * .1;
  group.position.x += (target.x - group.position.x) * .025; group.position.y += (-target.y - group.position.y) * .025;
  camera.position.x += (target.x * .45 - camera.position.x) * .02; camera.lookAt(0, 0, 0);
  renderer.render(scene, camera); requestAnimationFrame(render);
};
render();
