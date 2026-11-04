import { motion, AnimatePresence } from 'motion/react';
import React from 'react';
import { AgentStageLog } from '../types';
import { CheckCircle2, Clock, AlertCircle, Cpu } from 'lucide-react';

interface AgentActivityTimelineProps {
  logs: AgentStageLog[];
  missionSummary?: string;
  agentRationale?: string;
  isProcessing: boolean;
}

export const AgentActivityTimeline: React.FC<AgentActivityTimelineProps> = ({
  logs,
  missionSummary,
  agentRationale,
  isProcessing
}) => {
  if (logs.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <motion.div
      className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6 shadow-xs"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-600" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
            Agent Reasoning & Operation Timeline
          </h3>
        </div>
        {isProcessing && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse"></span>
            Executing pipeline...
          </span>
        )}
      </div>

      {missionSummary && (
        <div className="mb-4 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 shadow-xs">
          <span className="font-bold text-cyan-800 block mb-0.5">Parsed Intent Formulation:</span>
          {missionSummary}
        </div>
      )}

      {/* Actual Stage Progression */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
        {logs.map((log, index) => {
          const isDone = log.status === 'completed';
          const isCurrent = log.status === 'in_progress';
          const isFail = log.status === 'failed';

          return (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="flex items-start gap-3 text-xs"
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <motion.span
                    className="block"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </motion.span>
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 text-cyan-600 animate-spin" />
                ) : isFail ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 bg-slate-100" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${isDone ? 'text-slate-900' : isCurrent ? 'text-cyan-700' : 'text-slate-500'}`}>
                    {log.title}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{log.description}</p>
                {log.details && (
                  <div className="mt-1.5 p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-700 space-y-0.5 shadow-xs">
                    {Object.entries(log.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-cyan-800 font-semibold truncate">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>

      {agentRationale && (
        <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600">
          <span className="font-mono text-slate-500 text-[11px] uppercase tracking-wider block mb-1 font-semibold">
            Autonomous Trade-Off Rationale:
          </span>
          <p className="italic text-slate-700">{agentRationale}</p>
        </div>
      )}
    </motion.div>
  );
};
