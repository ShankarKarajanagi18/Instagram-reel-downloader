/**
 * Footer Component
 */

import React from 'react';
import { Zap, Github, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-8" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #ff6b56, #e8403e)' }}>
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <div>
              <p className="font-semibold" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)' }}>
                Reel<span className="gradient-text">Grab</span>
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Download Instagram Reels
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'FAQ'].map(link => (
              <a key={link} href="#"
                 className="text-xs transition-colors duration-200"
                 style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}
                 onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'}
                 onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            Made with <Heart size={11} fill="currentColor" style={{ color: 'var(--coral)' }} /> — © {year} ReelGrab
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center mt-6 leading-relaxed max-w-2xl mx-auto"
           style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
          ReelGrab is not affiliated with Instagram or Meta. This tool is intended for personal use only.
          Please respect content creators' rights and Instagram's Terms of Service.
        </p>
      </div>
    </footer>
  );
}
