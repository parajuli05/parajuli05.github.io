/* =========================================================================
   Prabhas Parajuli — Data Science Portfolio
   Shared interactions (vanilla JS, no dependencies)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. Mobile menu toggle ---------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });
        // close menu when a link is tapped
        navLinks.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            })
        );
    }

    /* ---------- 2. Navbar shadow on scroll ---------- */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- 3. Scroll reveal (IntersectionObserver) ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in'));
    }

    /* ---------- 4. Animated skill bars ---------- */
    const bars = document.querySelectorAll('.skill-bar span');
    if ('IntersectionObserver' in window && bars.length) {
        const barIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.width = (el.dataset.level || '80') + '%';
                    barIO.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        bars.forEach(b => barIO.observe(b));
    } else {
        bars.forEach(b => b.style.width = (b.dataset.level || '80') + '%');
    }

    /* ---------- 5. Animated counters ---------- */
    const counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window && counters.length) {
        const cIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                const dur = 1400;
                const start = performance.now();
                const step = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const val = target % 1 === 0
                        ? Math.round(target * eased)
                        : (target * eased).toFixed(1);
                    el.textContent = val + suffix;
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                cIO.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => cIO.observe(c));
    }

    /* ---------- 6. Hero rotating role (typing effect) ---------- */
    const roleEl = document.getElementById('hero-role');
    if (roleEl) {
        const roles = JSON.parse(roleEl.dataset.roles || '[]');
        if (roles.length) {
            const caret = '<span class="caret">&nbsp;</span>';
            let ri = 0, ci = 0, deleting = false;
            const tick = () => {
                const word = roles[ri];
                ci += deleting ? -1 : 1;
                roleEl.innerHTML = word.slice(0, ci) + caret;
                let wait = deleting ? 45 : 90;
                if (!deleting && ci === word.length) { wait = 1500; deleting = true; }
                else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; wait = 350; }
                setTimeout(tick, wait);
            };
            tick();
        }
    }
});

/* ---------- 7. WhatsApp contact form (kept from original) ---------- */
function sendToWhatsApp(event) {
    event.preventDefault();

    const form  = event.target;
    const name  = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const msg   = form.querySelector('#message').value.trim();

    if (!name || !email || !msg) {
        alert('Please fill in all fields');
        return;
    }

    const whatsappNumber = '9745619170'; // Prabhas — unchanged from original site

    const text =
        `*New message from portfolio*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A%0A` +
        `*Message:*%0A${encodeURIComponent(msg)}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    form.reset();
}
