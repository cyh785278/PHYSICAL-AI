import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, where, serverTimestamp, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Note: ROI Chart, Product Modal, and Mobile Menu logic have been moved
// to i18n.js or dedicated script blocks for better stability and offline support.

document.addEventListener('DOMContentLoaded', () => {
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

    // Navigation Active State setup
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
