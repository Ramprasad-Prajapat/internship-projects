// FaceTrack AI — SearchInput. Icon + controlled text input.

import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="ft-search">
      <Search size={15} className="ft-search-ico" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
