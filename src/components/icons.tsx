// src/components/icons.tsx
// This file contains all the SVG icon components used throughout the app.

import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

export const SettingsIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></IconWrapper>;
export const SunIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></IconWrapper>;
export const CheckSquareIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></IconWrapper>;
export const SquareIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><rect width="18" height="18" x="3" y="3" rx="2"/></IconWrapper>;
export const XIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconWrapper>;
export const SparklesIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></IconWrapper>;
export const SendIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></IconWrapper>;
export const GripVerticalIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></IconWrapper>;
export const Trash2Icon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconWrapper>;
export const PlusIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="M5 12h14"/><path d="M12 5v14"/></IconWrapper>;
export const AlertTriangleIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></IconWrapper>;
export const SearchIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></IconWrapper>;
export const UploadIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></IconWrapper>;
export const ImageIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></IconWrapper>;

export {};
