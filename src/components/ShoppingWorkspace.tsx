
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  CornerDownLeft,
  RefreshCw,
  Check,
  Wallet,
  Heart,
} from 'lucide-react';

import { CurrencyCode, MissionPriority } from '../types';
import { formatPrice } from '../utils/currency';
import './ShoppingWorkspace.css';

interface ShoppingWorkspaceProps {
  onRunMission: (
    query: string,
    maxBudgetINR: number,
    priority: MissionPriority
  ) => void;
  isLoading: boolean;
  currency: CurrencyCode;
  currentBudget: number;
}

const PRESET_MISSIONS = [
  'Find wireless headphones under ₹5,000 with good battery life and noise cancellation',
  '75% compact mechanical keyboard for coding with hot-swappable switches',
  'Sleek smartwatch with AMOLED display and 7+ days battery life for fitness',
  'True wireless ANC earbuds with low latency and sweat resistance under ₹4,000',
  'Desk lightbar with asymmetric optical lighting and wireless controller',
];

const PRIORITIES = [
  { id: 'price', label: 'Best price', description: 'Spend wisely' },
  { id: 'quality', label: 'Quality', description: 'Made to last' },
  { id: 'features', label: 'Features', description: 'More to explore' },
  { id: 'durability', label: 'Durability', description: 'Built for everyday' },
];

export const ShoppingWorkspace: React.FC<ShoppingWorkspaceProps> = ({
  onRunMission,
  isLoading,
  currency,
  currentBudget,
}) => {
  const [query, setQuery] = useState(
    'Find wireless headphones under ₹5,000 with good battery life and noise cancellation'
  );

  const [maxBudget, setMaxBudget] = useState<number>(
    currentBudget || 5000
  );

  const [priority, setPriority] = useState<MissionPriority>('price');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || isLoading) return;

    onRunMission(query.trim(), maxBudget, priority);
  };

  const handleSelectPreset = (presetText: string) => {
    setQuery(presetText);

    if (presetText.includes('5,000')) setMaxBudget(5000);
    else if (presetText.includes('4,000')) setMaxBudget(4000);
    else if (presetText.includes('keyboard')) setMaxBudget(8000);
    else setMaxBudget(6000);
  };

  return (
    <motion.section
      className="kryvon-workspace"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* INTRODUCTION */}
      <div className="workspace-header">
        <div className="workspace-heading">
          <motion.div
            className="workspace-icon"
            initial={{ scale: 0.7, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles size={19} strokeWidth={1.6} />
          </motion.div>

          <div>
            <span className="workspace-eyebrow">
              A LITTLE HELP WITH YOUR NEXT FIND
            </span>

            <h2>
              Your shopping,
              <br />
              <em>made more personal.</em>
            </h2>

            <p className="workspace-intro">
              Tell us what you have in mind. We'll help you
              find the right things, without the endless searching.
            </p>
          </div>
        </div>

        <div className="workspace-budget-badge">
          <span className="budget-badge-label">
            <Wallet size={14} />
            YOUR BUDGET
          </span>

          <strong>{formatPrice(maxBudget, currency)}</strong>

          <span className="budget-badge-caption">
            A little room to choose wisely.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="workspace-form">

        {/* PERSONAL SHOPPING REQUEST */}
        <div className="workspace-section">
          <div className="workspace-label-row">
            <label htmlFor="mission-input">
              What are you looking for today?
            </label>

            <span className="workspace-step">01 / YOUR IDEA</span>
          </div>

          <div className="workspace-input-wrap">
            <textarea
              id="mission-input"
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Something for work, a new pair of headphones, a thoughtful upgrade... Tell us what you need."
              className="workspace-textarea"
            />

            <div className="workspace-input-footer">
              <span className="workspace-input-hint">
                <Sparkles size={13} />
                Just describe it naturally. We've got you.
              </span>

              <motion.button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="workspace-submit"
                whileHover={
                  !isLoading && query.trim()
                    ? { y: -2, scale: 1.015 }
                    : {}
                }
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      className="workspace-button-content"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      <RefreshCw className="workspace-spin" size={16} />
                      Finding your options...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="ready"
                      className="workspace-button-content"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      Find my products
                      <ArrowRight size={17} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* SUGGESTED IDEAS */}
        <div className="workspace-section workspace-suggestions">
          <div className="workspace-label-row">
            <div>
              <span className="workspace-small-eyebrow">
                NEED A LITTLE INSPIRATION?
              </span>

              <h3>
                A few ideas to get you started.
              </h3>
            </div>

            <span className="workspace-step">02 / GET INSPIRED</span>
          </div>

          <div className="workspace-preset-list">
            {PRESET_MISSIONS.map((preset, index) => {
              const isSelected = query === preset;

              return (
                <motion.button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`workspace-preset ${
                    isSelected ? 'is-selected' : ''
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 * index,
                    duration: 0.4,
                  }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={isSelected}
                >
                  <span className="preset-number">
                    0{index + 1}
                  </span>

                  <span className="preset-text">
                    {preset}
                  </span>

                  <span className="preset-check">
                    {isSelected ? (
                      <Check size={15} />
                    ) : (
                      <ArrowRight size={15} />
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* BUDGET AND PRIORITY */}
        <div className="workspace-controls">

          {/* BUDGET */}
          <div className="workspace-control-panel">
            <div className="workspace-label-row">
              <div className="workspace-control-title">
                <span className="control-icon">
                  <SlidersHorizontal size={17} />
                </span>

                <div>
                  <span className="workspace-small-eyebrow">
                    SPENDING COMFORTABLY
                  </span>
                  <h3>Set your budget.</h3>
                </div>
              </div>

              <strong className="workspace-price">
                {formatPrice(maxBudget, currency)}
              </strong>
            </div>

            <input
              type="range"
              min={1500}
              max={15000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="workspace-range"
              aria-label="Maximum shopping budget"
              style={{
                '--range-progress': `${
                  ((maxBudget - 1500) / (15000 - 1500)) * 100
                }%`,
              } as React.CSSProperties}
            />

            <div className="workspace-range-labels">
              <span>₹1,500</span>
              <span>₹5,000</span>
              <span>₹10,000</span>
              <span>₹15,000</span>
            </div>

            <p className="workspace-helper">
              Good choices don't have to mean spending more.
            </p>
          </div>

          {/* PRIORITY */}
          <div className="workspace-control-panel">
            <div className="workspace-control-title">
              <span className="control-icon">
                <Heart size={17} />
              </span>

              <div>
                <span className="workspace-small-eyebrow">
                  WHAT MATTERS TO YOU?
                </span>
                <h3>Choose your priority.</h3>
              </div>
            </div>

            <div className="workspace-priority-list">
              {PRIORITIES.map((option, index) => {
                const selected = priority === option.id;

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    className={`workspace-priority ${
                      selected ? 'is-selected' : ''
                    }`}
                    onClick={() =>
                      setPriority(option.id as MissionPriority)
                    }
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={selected}
                  >
                    <span className="priority-index">
                      0{index + 1}
                    </span>

                    <span className="priority-copy">
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>

                    <span className="priority-radio">
                      {selected && <span />}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="workspace-footer">
          <span>
            <Sparkles size={14} />
            Thoughtful finds. Your way.
          </span>

          <span className="workspace-footer-note">
            Your choices, your budget, your call.
          </span>
        </div>

      </form>
    </motion.section>
  );
};
