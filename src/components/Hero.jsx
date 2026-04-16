
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, ArrowRight, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = ({ onAnalyze }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        // In a real app, validate file type (PDF, docx, txt)
        setFile(file);
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const startAnalysis = () => {
        if (file) {
            onAnalyze(file);
        }
    };

    return (
        <div className="hero-section" id="get-started">
            <div className="gradient-bg-orb"></div>

            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="hero-badge">
                    <Zap size={16} className="text-accent" color="#fbbf24" />
                    <span>AI-Powered Legal Assistant</span>
                </div>

                <h1 className="hero-title">
                    Understand Legal Documents <br />
                    <span style={{
                        background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        in Seconds
                    </span>
                </h1>

                <p className="hero-subtitle">
                    Upload contracts and get simplified explanations, summaries, and risk analysis powered by advanced AI algorithms.
                </p>

                <div
                    className={`upload-area glass-card ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                    style={{ maxWidth: '672px', margin: '0 auto' }}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx,.txt"
                    />

                    {file ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="file-selected-view"
                        >
                            <div className="file-icon-wrapper success">
                                <FileText size={40} color="#10b981" />
                            </div>
                            <div className="file-details">
                                <h3 className="file-name">{file.name}</h3>
                                <p className="file-meta">
                                    {(file.size / 1024).toFixed(2)} KB • PDF Document
                                </p>
                            </div>
                            <div className="file-actions">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current.click();
                                    }}
                                    className="replace-btn"
                                >
                                    Replace
                                </button>
                                <button
                                    onClick={removeFile}
                                    className="remove-btn"
                                    aria-label="Remove file"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div
                            className="upload-placeholder clickable"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <motion.div
                                className="upload-icon-circle"
                                animate={isDragging ? { scale: 1.1, backgroundColor: "rgba(99, 102, 241, 0.2)" } : {}}
                            >
                                <Upload size={48} color={isDragging ? "#818cf8" : "#94a3b8"} />
                            </motion.div>
                            <h3 className="hero-upload-text">
                                {isDragging ? "Drop your file now" : "Drag & drop your file here"}
                            </h3>
                            <p className="hero-upload-subtext">
                                or click to browse from your computer
                            </p>
                            <div className="file-formats">
                                <span className="format-tag">PDF</span>
                                <span className="format-tag">DOCX</span>
                                <span className="format-tag">TXT</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analyze Button with animation handled by CSS/Framer */}
                <motion.button
                    onClick={startAnalysis}
                    disabled={!file}
                    className={`btn-primary hero-cta ${!file ? 'opacity-50' : ''}`}
                    style={{
                        margin: '40px auto 0',
                        opacity: !file ? 0.5 : 1,
                        cursor: !file ? 'not-allowed' : 'pointer'
                    }}
                    whileHover={file ? { scale: 1.05 } : {}}
                    whileTap={file ? { scale: 0.95 } : {}}
                >
                    Analyze Document
                    <ArrowRight size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Hero;
