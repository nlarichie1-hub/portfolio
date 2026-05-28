import React from "react";
import { Printer, X, CheckCircle, FileText, Monitor } from "lucide-react";

interface PrintGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export default function PrintGuideModal({ isOpen, onClose, onPrint }: PrintGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 max-w-md w-full p-6 relative overflow-hidden">
        
        {/* Decorative corner pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-100 rounded-bl-full -z-10" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-100 transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-900">
            <Printer size={20} className="text-[#FF6B4A]" />
          </div>
          <h3 className="font-display font-black text-lg text-neutral-900 tracking-tight">Print / Export PDF</h3>
        </div>

        <p className="text-xs text-neutral-600 mb-5 leading-relaxed font-sans">
          Your browser's native print engine converts this layout into a pixel-perfect, vector-crisp PDF document. Click below to bring up the print configuration panel.
        </p>

        <div className="space-y-3.5 mb-6 text-xs text-neutral-700 font-sans">
          <div className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">1</span>
            <p className="leading-snug">
              Set the print <strong>Destination</strong> to <strong>Save as PDF</strong>.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">2</span>
            <p className="leading-snug">
              In <strong>More Settings</strong>, verify <strong>Background graphics</strong> is <strong>enabled</strong> to preserve theme tints, grids, and dividers.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">3</span>
            <p className="leading-snug">
              Uncheck <strong>Headers and footers</strong> to eliminate auto-generated timestamps and URL slugs from page margins.
            </p>
          </div>

          <div className="flex gap-2.5 items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">4</span>
            <p className="leading-snug">
              Ensure the page Layout is <strong>Portrait</strong> and paper size is set to standard <strong>A4</strong> or <strong>US Letter</strong>.
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              setTimeout(() => {
                onPrint();
              }, 250);
            }}
            className="flex-1 py-2 px-4 rounded-xl bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-850 transition-all flex items-center justify-center gap-1.5"
          >
            <Printer size={13} className="text-[#8B5CF6]" />
            <span>Open Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}
