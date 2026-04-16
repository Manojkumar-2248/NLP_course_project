
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loading = () => {
    const textStyle = {
        fontSize: '0.875rem',
        color: '#94a3b8',
        margin: '0.5rem 0'
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: 'white',
        letterSpacing: '-0.025em'
    };

    return (
        <div className="glass-card" style={{
            maxWidth: '400px',
            margin: '100px auto',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
                <Loader2 size={48} color="#818cf8" />
            </motion.div>

            <h3 style={titleStyle}>Analyzing Document</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <motion.p
                    style={textStyle}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Parsing legal clauses...
                </motion.p>
                <motion.p
                    style={textStyle}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                    Checking risk exposure...
                </motion.p>
                <motion.p
                    style={textStyle}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                    Simplifying language...
                </motion.p>
            </div>
        </div>
    );
};

export default Loading;
