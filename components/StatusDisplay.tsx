import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import { AppState, FileData } from '../types';

interface StatusDisplayProps {
  state: AppState;
  fileData: FileData | null;
  onDownload: () => void;
  onReset: () => void;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ state, fileData, onDownload, onReset }) => {
  if (state === AppState.IDLE) return null;

  return (
    <div className="mt-8 w-full max-w-xl mx-auto bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
      
      {/* File Info Header */}
      {fileData && (
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FileText size={20} />
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-800 truncate max-w-[200px]">{fileData.name}</p>
              <p className="text-xs text-slate-500">{fileData.size > 1024 * 1024 ? `${(fileData.size / (1024 * 1024)).toFixed(2)} MB` : `${(fileData.size / 1024).toFixed(2)} KB`}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 text-center">
        {/* LOADING STATE */}
        {(state === AppState.UPLOADING || state === AppState.PROCESSING) && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {state === AppState.UPLOADING ? 'جاري قراءة الملف...' : 'جاري التحويل باستخدام الذكاء الاصطناعي...'}
            </h3>
            <p className="text-slate-500 text-sm">قد يستغرق هذا بضع ثوانٍ حسب حجم الملف</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {state === AppState.SUCCESS && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">تم التحويل بنجاح!</h3>
            <p className="text-slate-500 mb-6 text-sm">ملفك جاهز للتحميل بصيغة Word</p>
            
            <div className="flex gap-3 w-full justify-center">
              <button 
                onClick={onReset}
                className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
              >
                تحويل ملف آخر
              </button>
              <button 
                onClick={onDownload}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 font-medium"
              >
                <Download size={18} />
                تحميل الملف
              </button>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {state === AppState.ERROR && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">عذراً، حدث خطأ</h3>
            <p className="text-slate-500 mb-6 text-sm">لم نتمكن من معالجة الملف. يرجى المحاولة مرة أخرى.</p>
            <button 
              onClick={onReset}
              className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              حاول مرة أخرى
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;