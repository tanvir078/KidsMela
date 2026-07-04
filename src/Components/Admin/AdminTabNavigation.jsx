import { useState } from 'react';

export default function AdminTabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <nav className="flex gap-1 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-rose-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-rose-600" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
