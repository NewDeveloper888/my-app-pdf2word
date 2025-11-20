import React, { useState, useCallback } from 'react';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';
import UploadArea from './components/UploadArea';
import StatusDisplay from './components/StatusDisplay';
import ConversionOptions from './components/ConversionOptions';
import { AppState, FileData, ConversionMode } from './types';
import { fileToBase64, downloadWordFile } from './utils/fileHelpers';
import { convertPdfToHtml } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const [conversionMode, setConversionMode] = useState<ConversionMode>(ConversionMode.OPTIMIZE_EDITING);

  const processFile = useCallback(async (file: File) => {
    try {
      // 1. Set basic info
      setFileData({
        name: file.name,
        type: file.type,
        size: file.size,
        base64: ''
      });
      setAppState(AppState.UPLOADING);

      // 2. Convert to Base64
      const base64 = await fileToBase64(file);
      setFileData(prev => prev ? { ...prev, base64 } : null);

      // 3. Send to Gemini
      setAppState(AppState.PROCESSING);
      const htmlContent = await convertPdfToHtml(base64, conversionMode);
      
      // 4. Store result
      setConvertedContent(htmlContent);
      setAppState(AppState.SUCCESS);

    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  }, [conversionMode]);

  const handleDownload = useCallback(() => {
    if (convertedContent && fileData) {
      downloadWordFile(convertedContent, fileData.name);
    }
  }, [convertedContent, fileData]);

  const resetApp = useCallback(() => {
    setAppState(AppState.IDLE);
    setFileData(null);
    setConvertedContent(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-[Cairo]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-slate-50 -z-10"></div>
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-[10%] left-[-10%] w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-8 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <FileText size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">PDF<span className="text-blue-600">2</span>Word</h1>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-white/50 px-3 py-1 rounded-full border border-slate-200 backdrop-blur-sm">
          إصدار تجريبي 2.5
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 py-12 max-w-4xl mx-auto w-full">
        
        {/* Hero Text */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <Sparkles size={16} />
            <span>مدعوم بواسطة Gemini AI 2.5</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            حول ملفات PDF إلى <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Word باحترافية
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            أداة ذكية تحافظ على التنسيق، الجداول، والعناوين. <br className="hidden md:block"/>
            اختر وضع التحويل المناسب لك وارفع ملفك.
          </p>
        </div>

        {/* Application Container */}
        <div className="w-full max-w-xl transition-all duration-500">
          {appState === AppState.IDLE ? (
            <>
              <ConversionOptions 
                selectedMode={conversionMode} 
                onSelectMode={setConversionMode} 
                disabled={false} 
              />
              <UploadArea onFileSelected={processFile} disabled={false} />
            </>
          ) : (
            <StatusDisplay 
              state={appState} 
              fileData={fileData} 
              onDownload={handleDownload} 
              onReset={resetApp}
            />
          )}
        </div>

        {/* Features Grid (Visible only on IDLE) */}
        {appState === AppState.IDLE && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-center">
            {[
              { title: 'دقة عالية', desc: 'يحافظ على الفقرات والجداول بدقة مذهلة.' },
              { title: 'يدعم العربية', desc: 'معالجة ممتازة للنصوص العربية واتجاه اليمين.' },
              { title: 'سريع وآمن', desc: 'معالجة فورية في المتصفح بدون تخزين الملفات.' },
            ].map((feat, idx) => (
              <div key={idx} className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-slate-800 mb-2">{feat.title}</h4>
                <p className="text-slate-500 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default App;