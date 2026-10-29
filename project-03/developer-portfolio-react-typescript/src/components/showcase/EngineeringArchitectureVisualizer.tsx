import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowRight, ArrowDown, Database, Server, Code2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { architectureNodesData, type ArchitectureNode } from '@/constants/portfolio';

export const EngineeringArchitectureVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(architectureNodesData[0]);

  const getNodeIcon = (layer: string) => {
    switch (layer) {
      case 'Frontend':
        return <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'API Layer':
        return <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'Backend Services':
        return <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Persistence':
        return <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f18] shadow-card space-y-8 my-10">
      {/* Header */}
      <div className="space-y-2 text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Layers className="w-4 h-4" />
          <span>Interactive Development Stack</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Enterprise Full-Stack Architecture Flow
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Click or hover over any architecture layer below to inspect component responsibilities, API boundaries, and technology integration.
        </p>
      </div>

      {/* Horizontal Flow Diagram (Desktop) & Vertical (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-center">
        {architectureNodesData.map((node, index) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setSelectedNode(node)}
                className={`p-4 rounded-2xl border transition-all text-left w-full space-y-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {node.layer}
                  </span>
                  <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-800'}`}>
                    {getNodeIcon(node.layer)}
                  </div>
                </div>
                <h4 className="text-sm font-bold leading-tight">{node.technology}</h4>
              </button>

              {/* Arrow Connector */}
              {index < architectureNodesData.length - 1 && (
                <div className="flex justify-center my-1 lg:my-0 text-slate-400">
                  <ArrowRight className="w-5 h-5 hidden lg:block" />
                  <ArrowDown className="w-5 h-5 lg:hidden" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Details Breakdown Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                {getNodeIcon(selectedNode.layer)}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {selectedNode.layer} Layer Breakdown
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedNode.technology}
                </h3>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Hands-on & Project Implementation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-500 uppercase tracking-wider">Role & Description</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedNode.description}</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-500 uppercase tracking-wider">Where Used in Portfolio</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedNode.whereUsed}</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-500 uppercase tracking-wider">Related Technologies</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedNode.relatedTech.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EngineeringArchitectureVisualizer;
