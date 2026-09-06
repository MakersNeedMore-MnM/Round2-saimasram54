'use client';

import React from 'react';
import { Jurisdiction } from '@/types/lease';
import { Globe, MapPin, Building2 } from 'lucide-react';

interface JurisdictionSelectorProps {
  jurisdiction: Jurisdiction;
  onChange: (updated: Jurisdiction) => void;
}

export const JurisdictionSelector: React.FC<JurisdictionSelectorProps> = ({
  jurisdiction,
  onChange,
}) => {
  const handleCountryChange = (country: string) => {
    let state = 'California';
    if (country === 'India') state = 'Maharashtra';
    if (country === 'United Kingdom') state = 'England';
    if (country === 'Canada') state = 'Ontario';

    onChange({ ...jurisdiction, country, state });
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs">
      <div className="flex items-center gap-1.5 text-indigo-400 font-semibold shrink-0">
        <Globe className="h-4 w-4" />
        <span>Jurisdiction:</span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={jurisdiction.country}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="United States">United States</option>
          <option value="India">India</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
        </select>

        <select
          value={jurisdiction.state}
          onChange={(e) => onChange({ ...jurisdiction, state: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
        >
          {jurisdiction.country === 'United States' && (
            <>
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Texas">Texas</option>
            </>
          )}
          {jurisdiction.country === 'India' && (
            <>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
            </>
          )}
          {jurisdiction.country === 'United Kingdom' && <option value="England">England</option>}
          {jurisdiction.country === 'Canada' && <option value="Ontario">Ontario</option>}
        </select>

        <select
          value={jurisdiction.leaseType}
          onChange={(e: any) => onChange({ ...jurisdiction, leaseType: e.target.value })}
          className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Retail">Retail</option>
          <option value="Industrial">Industrial</option>
        </select>
      </div>
    </div>
  );
};
