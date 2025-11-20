import React from 'react';
import { LayoutTemplate, FileEdit, AlignLeft } from 'lucide-react';
import { ConversionMode } from '../types';

interface ConversionOptionsProps {
  selectedMode: ConversionMode;
  onSelectMode: (mode: ConversionMode) => void;
  disabled: boolean;
}

const ConversionOptions: React.FC<ConversionOptionsProps> = ({ selectedMode, onSelectMode, disabled }) => {
  const options = [
    {
      id: ConversionMode.PRESERVE_LAYOUT,
      icon: LayoutTemplate,
      label: 'تنسيق أصلي',
      desc: 'الحفاظ على الشكل العام'
    },
    {
      id: ConversionMode.OPTIMIZE_EDITING,
      icon: FileEdit,
      label: 'سهولة التحرير',
      desc: 'تحسين النص للتعديل'
    },
    {
      id: ConversionMode.TEXT_ONLY,
      icon: AlignLeft,
      label: 'نص فقط',
      desc: 'استخراج المحتوى فقط'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 w-full">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedMode === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelectMode(option.id)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
              ${isSelected 
                ? 'bg-white border-blue-500 text-blue-700 shadow-md ring-1 ring-blue-500 scale-[1.02]' 
                : 'bg-white/80 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            type="button"
          >
            <Icon size={22} className={`mb-2 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="font-bold text-sm">{option.label}</span>
            <span className="text-xs text-slate-400 mt-1">{option.desc}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ConversionOptions;