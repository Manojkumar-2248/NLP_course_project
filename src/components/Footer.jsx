
import React from 'react';
import './Footer.css';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="footer-logo">AI Legal Simplifier</div>
                </div>

                <div className="footer-links">
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <a href="#" className="footer-link">Terms of Service</a>
                    <a href="#" className="footer-link">Security</a>
                </div>

                <div className="social-links">
                    <a href="#" className="social-icon">
                        <Github size={20} />
                    </a>
                    <a href="#" className="social-icon">
                        <Twitter size={20} />
                    </a>
                    <a href="#" className="social-icon">
                        <Linkedin size={20} />
                    </a>
                </div>

                <div className="copyright">
                    © {new Date().getFullYear()} AI Legal Simplifier. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer;
