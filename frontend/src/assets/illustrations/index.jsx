// Empty state SVG illustrations — custom drawn, no external dependencies

export const NoVendorsIllustration = ({ className = 'w-48 h-48' }) => (
  <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="40" width="200" height="140" rx="12" fill="#f1f5f9"/>
    <rect x="20" y="40" width="200" height="36" rx="12" fill="#e2e8f0"/>
    <rect x="20" y="64" width="200" height="12" rx="0" fill="#e2e8f0"/>
    {/* Building icon */}
    <rect x="88" y="72" width="64" height="80" rx="4" fill="#cbd5e1"/>
    <rect x="96" y="80" width="16" height="20" rx="2" fill="#94a3b8"/>
    <rect x="128" y="80" width="16" height="20" rx="2" fill="#94a3b8"/>
    <rect x="96" y="108" width="16" height="20" rx="2" fill="#94a3b8"/>
    <rect x="128" y="108" width="16" height="20" rx="2" fill="#94a3b8"/>
    <rect x="104" y="128" width="32" height="24" rx="2" fill="#7c8fa1"/>
    {/* Plus circle */}
    <circle cx="176" cy="152" r="24" fill="#059669"/>
    <path d="M176 140v24M164 152h24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    {/* Ground */}
    <rect x="20" y="152" width="200" height="4" rx="2" fill="#e2e8f0"/>
    {/* Side buildings */}
    <rect x="28" y="100" width="52" height="52" rx="4" fill="#e2e8f0"/>
    <rect x="38" y="110" width="12" height="14" rx="1" fill="#cbd5e1"/>
    <rect x="58" y="110" width="12" height="14" rx="1" fill="#cbd5e1"/>
    <rect x="160" y="112" width="52" height="40" rx="4" fill="#e2e8f0"/>
    <rect x="170" y="122" width="12" height="14" rx="1" fill="#cbd5e1"/>
    <rect x="190" y="122" width="12" height="14" rx="1" fill="#cbd5e1"/>
  </svg>
);

export const NoQuotationsIllustration = ({ className = 'w-48 h-48' }) => (
  <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Document stack */}
    <rect x="70" y="30" width="120" height="150" rx="8" fill="#e2e8f0" transform="rotate(-8 70 30)"/>
    <rect x="60" y="24" width="120" height="150" rx="8" fill="#f1f5f9" transform="rotate(-3 60 24)"/>
    <rect x="52" y="20" width="120" height="150" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
    {/* Document lines */}
    <rect x="68" y="48" width="88" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="68" y="64" width="72" height="6" rx="3" fill="#f1f5f9"/>
    <rect x="68" y="78" width="80" height="6" rx="3" fill="#f1f5f9"/>
    {/* Dollar */}
    <circle cx="128" cy="118" r="30" fill="#ecfdf5"/>
    <text x="118" y="126" fontSize="28" fill="#059669" fontWeight="bold">$</text>
    {/* Plus */}
    <circle cx="176" cy="56" r="20" fill="#059669"/>
    <path d="M176 46v20M166 56h20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Checkmark line items */}
    <circle cx="74" cy="101" r="5" fill="#a7f3d0"/>
    <path d="M72 101l2 2 3-3" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="84" y="98" width="48" height="5" rx="2.5" fill="#f1f5f9"/>
    <circle cx="74" cy="117" r="5" fill="#fde68a"/>
    <rect x="84" y="114" width="36" height="5" rx="2.5" fill="#f1f5f9"/>
  </svg>
);

export const NoActivitiesIllustration = ({ className = 'w-48 h-48' }) => (
  <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clock face */}
    <circle cx="120" cy="95" r="70" fill="#f1f5f9"/>
    <circle cx="120" cy="95" r="60" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
    <circle cx="120" cy="95" r="4" fill="#94a3b8"/>
    {/* Clock hands */}
    <line x1="120" y1="95" x2="120" y2="52" stroke="#334155" strokeWidth="3" strokeLinecap="round"/>
    <line x1="120" y1="95" x2="148" y2="108" stroke="#059669" strokeWidth="3" strokeLinecap="round"/>
    {/* Hour markers */}
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
      const r = 50, cx = 120 + r * Math.sin((deg * Math.PI) / 180), cy = 95 - r * Math.cos((deg * Math.PI) / 180);
      return <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3 : 1.5} fill={i % 3 === 0 ? '#94a3b8' : '#cbd5e1'} />;
    })}
    {/* Activity pulses */}
    <rect x="32" y="160" width="8" height="30" rx="4" fill="#a7f3d0"/>
    <rect x="48" y="148" width="8" height="42" rx="4" fill="#059669"/>
    <rect x="64" y="154" width="8" height="36" rx="4" fill="#6ee7b7"/>
    <rect x="80" y="145" width="8" height="45" rx="4" fill="#059669"/>
    <rect x="144" y="158" width="8" height="32" rx="4" fill="#a7f3d0"/>
    <rect x="160" y="150" width="8" height="40" rx="4" fill="#059669"/>
    <rect x="176" y="155" width="8" height="35" rx="4" fill="#6ee7b7"/>
    <rect x="192" y="146" width="8" height="44" rx="4" fill="#059669"/>
  </svg>
);

export const NoComparisonIllustration = ({ className = 'w-48 h-48' }) => (
  <svg className={className} viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left card */}
    <rect x="16" y="40" width="90" height="130" rx="10" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5"/>
    <rect x="26" y="56" width="70" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="26" y="72" width="52" height="6" rx="3" fill="#f1f5f9"/>
    <rect x="26" y="86" width="60" height="6" rx="3" fill="#f1f5f9"/>
    <rect x="26" y="108" width="70" height="28" rx="6" fill="#e2e8f0"/>
    <text x="44" y="128" fontSize="16" fill="#94a3b8" fontWeight="bold">$$$</text>
    {/* Right card */}
    <rect x="134" y="40" width="90" height="130" rx="10" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5"/>
    <rect x="144" y="56" width="70" height="8" rx="4" fill="#a7f3d0"/>
    <rect x="144" y="72" width="52" height="6" rx="3" fill="#d1fae5"/>
    <rect x="144" y="86" width="60" height="6" rx="3" fill="#d1fae5"/>
    <rect x="144" y="108" width="70" height="28" rx="6" fill="#059669"/>
    <text x="158" y="128" fontSize="16" fill="white" fontWeight="bold">$$$</text>
    {/* Trophy on right card */}
    <circle cx="179" cy="52" r="14" fill="#f59e0b"/>
    <text x="172" y="57" fontSize="16">🏆</text>
    {/* VS divider */}
    <circle cx="120" cy="105" r="18" fill="#334155"/>
    <text x="111" y="111" fontSize="13" fill="white" fontWeight="bold">VS</text>
    {/* Arrows */}
    <path d="M106 95 L114 105 L106 115" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M134 95 L126 105 L134 115" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);
