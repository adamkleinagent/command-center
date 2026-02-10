import React from 'react';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: 'tasks' | 'dashboard';
  onTabChange: (tab: 'tasks' | 'dashboard') => void;
  projectName: string;
}

export function MobileNav({ isOpen, onToggle, activeTab, onTabChange, projectName }: MobileNavProps) {
  return (
    <>
      {/* Top Bar - Mobile Only */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-black/90 backdrop-blur-lg border-b border-zinc-900 flex items-center justify-between px-4 z-50 md:hidden">
        <button 
          onClick={onToggle}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-900 transition-colors"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-lg">🦾</span>
          <span className="font-semibold text-sm text-zinc-100 truncate max-w-[150px]">{projectName}</span>
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-black">
          <span className="text-lg font-bold">+</span>
        </button>
      </div>

      {/* Bottom Tab Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg border-t border-zinc-900 flex items-center justify-around px-4 z-50 md:hidden safe-area-bottom">
        <button 
          onClick={() => onTabChange('tasks')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
            activeTab === 'tasks' ? 'text-white' : 'text-zinc-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">Tasks</span>
        </button>
        
        <button 
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-white' : 'text-zinc-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">Reports</span>
        </button>
      </div>
    </>
  );
}
