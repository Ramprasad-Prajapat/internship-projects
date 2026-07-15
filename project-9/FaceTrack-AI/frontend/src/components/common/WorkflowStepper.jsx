// FaceTrack AI — WorkflowStepper.
// A compact horizontal step strip used to make multi-step flows legible
// (e.g. Mark Attendance: Face Scan → Location → Confirm → Done). Purely
// presentational: pass the steps and which index is active.
//
//   steps      [{ key, label, icon }]
//   activeIndex current step (0-based); steps before it render as "done"
//   error       when true, the active step is shown in an error state

import { Check } from 'lucide-react';

export default function WorkflowStepper({ steps = [], activeIndex = 0, error = false }) {
  if (!steps.length) return null;

  return (
    <div className="ft-stepper" role="list">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const Icon = s.icon;
        const state = done ? 'is-done' : active ? (error ? 'is-error' : 'is-active') : '';
        return (
          <div className="ft-stepper-item" role="listitem" key={s.key || s.label}>
            <span className={`ft-stepper-node ${state}`}>
              {done ? <Check size={16} /> : Icon ? <Icon size={16} /> : i + 1}
            </span>
            <span className="ft-stepper-label">{s.label}</span>
            {i < steps.length - 1 ? <span className={`ft-stepper-line ${done ? 'is-done' : ''}`} /> : null}
          </div>
        );
      })}
    </div>
  );
}
