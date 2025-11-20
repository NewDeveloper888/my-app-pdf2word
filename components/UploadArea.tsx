import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelected(file);
      } else {
        alert('الرجاء رفع ملف PDF فقط');
      }
    }
  }, [onFileSelected, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  }, [onFileSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        border-2 border-dashed rounded-2xl p-10
        flex flex-col items-center justify-center text-center
        transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      `}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="mb-4 p-4 bg-blue-100 text-blue-600 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
        {isDragging ? <UploadCloud size={40} /> : <FileType size={40} />}
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">
        {isDragging ? 'أفلت الملف هنا' : 'اضغط أو اسحب ملف PDF هنا'}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
        نقوم بتحويل ملفاتك بأمان وسرعة باستخدام الذكاء الاصطناعي للحصول على أفضل تنسيق.
      </p>
    </div>
  );
};

export default UploadArea;