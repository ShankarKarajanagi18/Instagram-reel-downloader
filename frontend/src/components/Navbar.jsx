/**
 * Navbar Component
 * Logo + navigation + dark mode toggle
 */

import React from 'react';
import { Moon, Sun, Zap } from 'lucide-react';

export default function Navbar({ isDark, onToggleDark }) {
  return (
    <nav className="relative z-50 px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #ff6b56, #e8403e)' }}>
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div>
            <span className="font-display font-700 text-lg tracking-tight"
                  style={{ color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>
              Reel<span className="gradient-text">Grab</span>
            </span>
          </div>
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-4">
          {/* Nav links – hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'How it works', 'FAQ'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
                 className="text-sm font-medium transition-colors duration-200"
                 style={{ color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}
                 onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                 onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                {label}
              </a>
            ))}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="btn-ghost flex items-center gap-2 px-3 py-2 text-sm tooltip"
            data-tip={isDark ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle dark mode">
            {isDark
              ? <Sun size={16} style={{ color: 'var(--coral)' }} />
              : <Moon size={16} style={{ color: 'var(--text-secondary)' }} />}
          </button>
        </div>

      </div>
    </nav>
  );
}
