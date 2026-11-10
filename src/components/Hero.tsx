
import React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  Lock,
  CreditCard,
} from 'lucide-react';

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 25,
    },
  },
};

const pipelineSteps = [
  {
    num: '01',
    title: 'Intent In',
    desc: 'Natural language mission',
    icon: Zap,
  },
  {
    num: '02',
    title: 'Understanding',
    desc: 'Category & spec extraction',
    icon: Sliders,
  },
  {
    num: '03',
    title: 'Discovery',
    desc: 'Verified catalogue matching',
    icon: CheckCircle2,
  },
  {
    num: '04',
    title: 'Evaluation',
    desc: 'Pros, cons & fit score',
    icon: Sliders,
  },
  {
    num: '05',
    title: 'Policy Engine',
    desc: 'Deterministic spending rules',
    icon: ShieldCheck,
  },
  {
    num: '06',
    title: 'User Gate',
    desc: 'Explicit human approval',
    icon: Lock,
  },
  {
    num: '07',
    title: 'Payment',
    desc: 'PayPal Sandbox settlement',
    icon: CreditCard,
  },
];

const features = [
  {
    title: 'Autonomous Missions',
    description:
      'Express complex purchasing goals in everyday sentences. KRYVON structures criteria and searches real items.',
    icon: Zap,
    accent: 'bg-[#E9E1F2]',
    iconColor: 'text-[#78618F]',
  },
  {
    title: 'Multi-Factor Matrix',
    description:
      'Side-by-side spec comparison grounded in actual battery life, materials, and verified user ratings.',
    icon: Sliders,
    accent: 'bg-[#F8E5DC]',
    iconColor: 'text-[#B77960]',
  },
  {
    title: 'Deterministic Guardian',
    description:
      'Strict mathematical financial policies (Allowed / Review Required / Blocked) that no AI model can bypass.',
    icon: ShieldCheck,
    accent: 'bg-[#DDEFE7]',
    iconColor: 'text-[#4F8C70]',
  },
  {
    title: 'PayPal Settlement',
    description:
      'Authentic PayPal Sandbox checkout with verifiable backend capture and persistent ledger history.',
    icon: CreditCard,
    accent: 'bg-[#E1EAF1]',
    iconColor: 'text-[#547B98]',
  },
];

interface HeroProps {
  onStartShopping: () => void;
  onExploreWorkflow: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartShopping,
  onExploreWorkflow,
}) => {
  return (
    <section className="relative overflow-hidden bg-white text-[#102D43]">

      {/* HERO */}
      <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pt-14">

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex max-w-5xl flex-col items-center text-center"
        >
          {/* Small status label */}
          <motion.div
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#DCE8E1] bg-[#F5F9F6] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#547B68] sm:text-xs"
          >
            <span className="h-2 w-2 rounded-full bg-[#79B994]" />
            PayPal Sandbox Verified
            <span className="mx-1 text-[#B8C8BD]">·</span>
            Deterministic Policy Engine
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={fadeUp}
            className="relative z-10 max-w-4xl text-[clamp(2.5rem,6.5vw,5.8rem)] font-medium italic leading-[1.04] tracking-[-0.055em] text-[#102D43]"
          >
            Shopping, with intelligence behind every decision.
          </motion.h1>

          {/* Headphone visual */}
          <motion.div
            variants={fadeUp}
            className="relative mt-[-0.25rem] flex w-full max-w-4xl items-center justify-center"
          >
            <div className="relative flex h-[300px] w-full items-center justify-center sm:h-[390px] lg:h-[440px]">

              {/* Soft circular green backdrop */}
              <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B9ED91] blur-[1px] sm:h-[310px] sm:w-[310px] lg:h-[350px] lg:w-[350px]" />

              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9CCB91]/40 sm:h-[390px] sm:w-[390px]" />

              {/* Ambient light */}
              <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9F1C9]/50 blur-[65px] sm:h-[500px] sm:w-[500px]" />

              {/* CSS headphone illustration */}
              <motion.div
                animate={{ y: [0, -9, 0], rotate: [-2, 1, -2] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 h-[250px] w-[250px] sm:h-[330px] sm:w-[330px] lg:h-[365px] lg:w-[365px]"
              >
                {/* Headband */}
                <div className="absolute left-1/2 top-[2%] h-[75%] w-[68%] -translate-x-1/2 rounded-t-full border-[13px] border-b-0 border-[#172B29] shadow-[inset_4px_5px_8px_rgba(255,255,255,0.22),5px_8px_12px_rgba(0,0,0,0.18)] sm:border-[17px]" />

                {/* Left connector */}
                <div className="absolute left-[15%] top-[49%] h-[27%] w-[9%] rotate-[-24deg] rounded-full bg-gradient-to-r from-[#101D1D] via-[#425B53] to-[#101D1D]" />

                {/* Right connector */}
                <div className="absolute right-[15%] top-[42%] h-[28%] w-[9%] rotate-[12deg] rounded-full bg-gradient-to-r from-[#101D1D] via-[#425B53] to-[#101D1D]" />

                {/* Left ear cup */}
                <div className="absolute bottom-[8%] left-[7%] h-[43%] w-[25%] rotate-[-42deg] rounded-[38%] border-[5px] border-[#263C36] bg-gradient-to-br from-[#657B70] via-[#182A27] to-[#080F10] shadow-[8px_12px_16px_rgba(0,0,0,0.3)]">
                  <div className="absolute inset-[12%] rounded-[38%] border-[5px] border-[#71877B] bg-gradient-to-br from-[#293C36] to-[#0B1413]" />
                  <div className="absolute inset-[25%] rounded-[35%] bg-[#101C1A] shadow-inner" />
                </div>

                {/* Right ear cup */}
                <div className="absolute right-[7%] top-[34%] h-[43%] w-[25%] rotate-[8deg] rounded-[38%] border-[5px] border-[#263C36] bg-gradient-to-br from-[#71877A] via-[#182A27] to-[#080F10] shadow-[8px_12px_16px_rgba(0,0,0,0.3)]">
                  <div className="absolute inset-[12%] rounded-[38%] border-[5px] border-[#71877B] bg-gradient-to-br from-[#293C36] to-[#0B1413]" />
                  <div className="absolute inset-[25%] rounded-[35%] bg-[#101C1A] shadow-inner" />
                </div>
              </motion.div>

              {/* Small editorial detail */}
              <div className="absolute bottom-5 left-0 hidden rounded-xl border border-[#E7EAE5] bg-white/90 px-4 py-3 text-left shadow-sm sm:block">
                <p className="text-xl font-semibold tracking-tight text-[#102D43]">
                  01
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#87948D]">
                  Discover
                </p>
              </div>

              <div className="absolute bottom-5 right-0 hidden rounded-xl border border-[#E7EAE5] bg-white/90 px-4 py-3 text-left shadow-sm sm:block">
                <p className="text-xl font-semibold tracking-tight text-[#102D43]">
                  AI
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#87948D]">
                  Shop smarter
                </p>
              </div>
            </div>
          </motion.div>

          {/* Supporting text */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-1 max-w-2xl text-sm leading-7 text-[#697A83] sm:text-base"
          >
            Meet your autonomous shopping agent. Describe what you need, set
            your boundaries, and let KRYVON handle the research, comparison,
            and checkout assistance.
          </motion.p>

          {/* Actions */}
          <motion.div
            variants={fadeUp}
            className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          >
            <button
              onClick={onStartShopping}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#102D43] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1B435B] active:scale-[0.98] sm:w-auto"
            >
              Start Shopping Mission
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreWorkflow}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D8E0DC] bg-white px-7 py-3.5 text-sm font-semibold text-[#344E5B] transition-all duration-300 hover:border-[#A9C9B5] hover:bg-[#F7FAF7] active:scale-[0.98] sm:w-auto"
            >
              Explore How It Works
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* AUTONOMOUS COMMERCE PIPELINE */}
      <div className="border-y border-[#E9EDE9] bg-[#FAFBF9] py-14 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#82938A]">
                Behind every decision
              </p>
              <h2 className="text-2xl font-medium tracking-[-0.04em] text-[#102D43] sm:text-3xl">
                The Autonomous Commerce Pipeline
              </h2>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E7F2E9] px-3 py-2 text-[10px] font-semibold text-[#527B61]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#71A982]" />
              Zero Prompt-Injection Risk
            </span>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7"
          >
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className={`flex min-h-[132px] flex-col justify-between rounded-2xl border p-4 transition-colors ${
                    idx === 4
                      ? 'border-[#C9E2D0] bg-[#EAF4EC]'
                      : idx === 6
                        ? 'border-[#C8DDE8] bg-[#EAF2F6]'
                        : 'border-[#E8ECE8] bg-white'
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-[#9AA7A0]">
                      {step.num}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${
                        idx === 4
                          ? 'text-[#548365]'
                          : idx === 6
                            ? 'text-[#547F99]'
                            : 'text-[#72858C]'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-[#203C49]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-[#829097]">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* FOUR ORIGINAL FEATURE TILES */}
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#82938A]">
            What makes KRYVON different
          </p>
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-[#102D43] sm:text-3xl">
            Intelligence at every step.
          </h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[#E9ECE8] bg-white p-6 transition-shadow duration-300 hover:shadow-[0_12px_35px_rgba(16,45,67,0.06)]"
              >
                <div
                  className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent}`}
                >
                  <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>

                <h3 className="text-sm font-semibold text-[#183747]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-[#77858B]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
