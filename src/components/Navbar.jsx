
import React, { useState } from 'react';
import { Scale, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="logo">
                    <div className="logo-icon">
                        <Scale size={24} color="#f8fafc" />
                    </div>
                    <span className="logo-text">AI Legal Simplifier</span>
                </a>

                {/* Desktop Menu */}
                <div className="nav-links">
                    <a href="#home" className="nav-link">Home</a>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#contact" className="nav-link">Contact</a>
                    <button
                        className="btn-primary nav-cta"
                        onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMenu}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                    >
                        <a href="#home" className="nav-link" onClick={() => setIsOpen(false)}>Home</a>
                        <a href="#about" className="nav-link" onClick={() => setIsOpen(false)}>About</a>
                        <a href="#contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</a>
                        <button
                            className="btn-primary nav-cta"
                            onClick={() => {
                                setIsOpen(false);
                                document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            Get Started
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
