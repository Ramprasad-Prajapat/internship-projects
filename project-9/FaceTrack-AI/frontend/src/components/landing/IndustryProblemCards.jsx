// FaceTrack AI — IndustryProblemCards.
// Data-driven "problems we solve" grid for the marketing landing page. Renders
// inside the landing shell (.ft-land), reusing .ft-land-grid / .ft-land-card
// with a red "problem" icon modifier. Pass `items` to override the defaults.

import { UserX, Fingerprint, FileWarning, MapPinOff, Clock, ShieldAlert, CalendarX, Building2 } from 'lucide-react';

const DEFAULT_PROBLEMS = [
  { icon: UserX, title: 'Proxy & buddy punching', text: 'Coworkers marking attendance for each other inflates payroll and hides absenteeism.' },
  { icon: Fingerprint, title: 'Card & fingerprint misuse', text: 'Shared RFID cards and shared fingerprint scanners are easy to game and raise hygiene concerns.' },
  { icon: MapPinOff, title: 'No location proof', text: 'Field and multi-branch staff can mark attendance from anywhere with no geo verification.' },
  { icon: Clock, title: 'Manual late & overtime math', text: 'HR hand-calculates late arrivals and overtime, causing payroll mismatches and disputes.' },
  { icon: FileWarning, title: 'Weak reporting & visibility', text: 'No real-time dashboard across branches means problems surface only at month-end.' },
  { icon: ShieldAlert, title: 'Suspicious attempts go unseen', text: 'Low-confidence scans and repeated failures are never logged or reviewed.' },
  { icon: CalendarX, title: 'Leave & correction chaos', text: 'Manual leave approvals and attendance corrections cause delays, confusion and record mismatches.' },
  { icon: Building2, title: 'No branch-level control', text: 'Hard to manage attendance policies, shifts and visibility separately across multiple branches.' },
];

export default function IndustryProblemCards({ items = DEFAULT_PROBLEMS }) {
  return (
    <div className="ft-land-grid ft-feature-grid">
      {items.map(({ icon: Icon, title, text }) => (
        <article key={title} className="ft-land-card ft-land-card--problem ft-glass">
          <span className="ft-land-card-icon">
            <Icon size={22} />
          </span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}
