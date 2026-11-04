import React from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Sliders, CheckCircle2, Lock, CreditCard } from 'lucide-react';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

interface HeroProps {
  onStartShopping: () => void;
  onExploreWorkflow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartShopping, onExploreWorkflow }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 bg-white">
      {/* Subtle radial ambient background glow */}
      <motion.div 
        aria-hidden="true" 
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-100/60 blur-[120px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center max-w-3xl mx-auto space-y-6" variants={stagger} initial="hidden" animate="show">
          {/* Subtle Live Sandbox status chip */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
            <span>PayPal Sandbox Verified · Deterministic Policy Engine</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Shopping, with intelligence behind every decision.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Meet your autonomous shopping agent. Describe what you need, set your boundaries, and let KRYVON handle the research, comparison, and checkout assistance.
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={onStartShopping}
              className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-slate-900/10 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Start Shopping Mission</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onExploreWorkflow}
              className="px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Explore How It Works</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Autonomous Commerce Pipeline Visualizer */}
        <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6 flex items-center justify-between">
            <span>The Autonomous Commerce Pipeline</span>
            <span className="text-cyan-700 font-semibold">Zero Prompt-Injection Risk</span>
          </div>

          {/* Step Sequence */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            {[
              { num: '01', title: 'Intent In', desc: 'Natural language mission', icon: Zap },
              { num: '02', title: 'Understanding', desc: 'Category & spec extraction', icon: Sliders },
              { num: '03', title: 'Discovery', desc: 'Verified catalogue matching', icon: CheckCircle2 },
              { num: '04', title: 'Evaluation', desc: 'Pros, cons & fit score', icon: Sliders },
              { num: '05', title: 'Policy Engine', desc: 'Deterministic spending rules', icon: ShieldCheck },
              { num: '06', title: 'User Gate', desc: 'Explicit human approval', icon: Lock },
              { num: '07', title: 'Payment', desc: 'PayPal Sandbox settlement', icon: CreditCard },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.num}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className={`p-3.5 rounded-xl border transition-colors text-left flex flex-col justify-between ${
                    idx === 4 
                      ? 'bg-emerald-50/80 border-emerald-300' 
                      : idx === 6
                      ? 'bg-cyan-50/80 border-cyan-300'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-slate-400 font-bold">{step.num}</span>
                    <Icon className={`w-3.5 h-3.5 ${idx === 4 ? 'text-emerald-600' : idx === 6 ? 'text-cyan-600' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* 4 Key Pillar Highlights */}
        <motion.div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
          <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span>Autonomous Missions</span>
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Express complex purchasing goals in everyday sentences. KRYVON structures criteria and searches real items.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-600" />
              <span>Multi-Factor Matrix</span>
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Side-by-side spec comparison grounded in actual battery life, materials, and verified user ratings.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Deterministic Guardian</span>
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Strict mathematical financial policies (Allowed / Review Required / Blocked) that no AI model can bypass.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-600" />
              <span>PayPal Settlement</span>
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Authentic PayPal Sandbox checkout with verifiable backend capture and persistent ledger history.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
