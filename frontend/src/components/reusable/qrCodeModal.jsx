import React, { useRef, useState } from "react";
import { X, Download, Share2, Loader2 } from "lucide-react";
import domtoimage from "dom-to-image-more";
import { handleShareQR } from "../../hooks/helper/shareQRCode";
import * as htmlToImage from 'html-to-image';

export const QRModal = ({ isOpen, onClose, event }) => {
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !event) return null;

  // ... inside your component
  const handleSaveFullCard = async () => {
    try {
      setIsExporting(true);

      // 1. Give the browser a moment to ensure the hidden DOM node is ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      const node = cardRef.current;

      // 2. Capture with explicit width/height to avoid white-space issues
      const blob = await domtoimage.toBlob(node, {
        bgcolor: "#ffffff",
        cacheBust: true,
        width: 400, // Match your style width
        height: 600, // Approximate height of your ticket
        style: {
          opacity: "1",
          visibility: "visible",
          left: "0",
          top: "0",
          transform: "none", // Prevents layout shifts
        },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${event.title.replace(/\s+/g, "_")}_Ticket.png`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Visual Modal (Screen Only) */}
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="bg-orange-600 p-4 text-white text-center relative overflow-hidden">
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={onClose}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest mb-0.5">
            Digital Pass
          </h3>
          <p className="text-orange-100 text-[11px] opacity-90 line-clamp-1 px-6">
            {event.title}
          </p>
        </div>

        <div className="p-6 text-center bg-white">
          <div className="relative bg-white p-3 rounded-2xl border-[2px] border-gray-100 mb-4 group max-w-[220px] mx-auto">
            <img
              src={event.qrCode}
              alt="Cloudinary QR"
              className="w-full h-auto aspect-square object-contain mx-auto"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.src =
                  "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ErrorFetchingCloudinaryQR";
              }}
            />
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-orange-600 rounded-tl-sm"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-orange-600 rounded-tr-sm"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-orange-600 rounded-bl-sm"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-orange-600 rounded-br-sm"></div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-ping"></span>
            <span className="text-[9px] font-black uppercase tracking-widest">
              Valid for Entry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left border-t border-b border-gray-50 py-4 mb-6">
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">
                Date
              </p>
              <p className="text-[11px] font-black text-gray-900">
                {event.date}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">
                Time
              </p>
              <p className="text-[11px] font-black text-gray-900">
                {event.time}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">
                Venue
              </p>
              <p className="text-[11px] font-black text-gray-900 line-clamp-1">
                {event.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSaveFullCard}
              disabled={isExporting}
              className="flex items-center justify-center space-x-2 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? "Saving..." : "Save Pass"}</span>
            </button>
            <button
              className="flex items-center justify-center space-x-2 py-3 bg-orange-100 text-orange-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-200 transition-all active:scale-95"
              onClick={() => handleShareQR(event)}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Ticket Perforation Holes */}
        <div className="absolute left-0 top-[76px] -translate-x-1/2 w-5 h-5 bg-gray-900/80 rounded-full"></div>
        <div className="absolute right-0 top-[76px] translate-x-1/2 w-5 h-5 bg-gray-900/80 rounded-full"></div>
      </div>
      <div
        ref={cardRef}
        style={{
          width: "400px",
          position: "fixed",
          left: "0",
          top: "0",
          zIndex: "-50", // Behind everything
        }}
        className="opacity-0 pointer-events-none bg-white rounded-[3rem] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-orange-600 p-8 text-white text-center">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-2">
            Digital Pass
          </h3>
          <p className="text-orange-50 text-base font-bold px-8">
            {event.title}
          </p>
        </div>

        <div className="p-10 text-center bg-white relative">
          {/* QR Area */}
          <div className="relative bg-white p-5 rounded-[2.5rem] border-2 border-gray-100 mb-8 inline-block">
            <img
              src={event.qrCode}
              alt="QR Export"
              className="w-[240px] h-[240px] object-contain mx-auto"
              crossOrigin="anonymous"
            />
            {/* Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-orange-600 rounded-tl-lg"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-orange-600 rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-orange-600 rounded-bl-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-orange-600 rounded-br-lg"></div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 text-left border-t border-gray-100 pt-8">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                Date
              </p>
              <p className="text-base font-black text-gray-900">{event.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                Time
              </p>
              <p className="text-base font-black text-gray-900">{event.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
