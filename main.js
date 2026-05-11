import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, where, serverTimestamp, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Note: ROI Chart logic has been moved to a dedicated <script> block in index.html for stability.

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    if (mobileMenu && navList) {
        mobileMenu.onclick = () => {
            navList.classList.toggle('active');
        };

        // Close menu when a link is clicked
        navList.querySelectorAll('a').forEach(link => {
            link.onclick = () => navList.classList.remove('active');
        });
    }

    // --- Scroll-to-Top Button ---
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });
        scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 1. Navigation setup
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 2. Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hand-card, .community-cta, .hand-grid').forEach(el => {
        el.classList.add('animate-up');
        observer.observe(el);
    });

    // 3. Product Modal Logic
    const productModal = document.getElementById('product-modal');
    const closeProductBtn = document.getElementById('btn-close-product');
    const viewMoreBtns = document.querySelectorAll('.btn-view-more');

    if (productModal && viewMoreBtns.length > 0) {
        viewMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                productModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeProductBtn.addEventListener('click', () => {
            productModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
