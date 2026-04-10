import React, { useEffect, useRef, useState } from 'react';
import { X, ScanLine, Zap, Image as ImageIcon, Info, Camera, RefreshCw, Barcode } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';

export function Scanner({ onScan, onCancel }: { onScan: (id: string) => void, onCancel: () => void }) {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isTransitioningRef = useRef(false);

  const startScanner = async () => {
    if (isTransitioningRef.current) return;
    
    try {
      isTransitioningRef.current = true;
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      if (html5QrCodeRef.current.isScanning) {
        isTransitioningRef.current = false;
        return;
      }

      const config = {
        fps: 20,
        qrbox: { width: 300, height: 100 }, // Wider for 1D barcode
        aspectRatio: 1.0,
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (navigator.vibrate) navigator.vibrate(50);
          onScan(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // Ignore frequent failures to find QR code in frame
        }
      );
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      console.error("Unable to start scanning", err);
      setError("Camera access denied or not available. Please check permissions.");
      setIsCameraActive(false);
    } finally {
      isTransitioningRef.current = false;
    }
  };

  const stopScanner = async () => {
    if (isTransitioningRef.current) return;

    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        isTransitioningRef.current = true;
        await html5QrCodeRef.current.stop();
        setIsCameraActive(false);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      } finally {
        isTransitioningRef.current = false;
      }
    }
  };

  const toggleFlash = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        const newState = !isFlashOn;
        await html5QrCodeRef.current.applyVideoConstraints({
          advanced: [{ torch: newState } as any]
        });
        setIsFlashOn(newState);
      } catch (err) {
        console.warn("Flash not supported on this device", err);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onCancel} 
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform"
        >
          <X size={20} />
        </motion.button>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-bold tracking-wide text-sm uppercase bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
        >
          Scan Barcode
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform"
        >
          <Info size={20} />
        </motion.button>
      </div>

      {/* Main Scanner View */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div id="qr-reader" className="w-full h-full absolute inset-0 [&_video]:object-cover [&_video]:h-full [&_video]:w-full"></div>
        
        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/50">
                <Camera className="text-red-500" size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Camera Error</h3>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <button 
                onClick={startScanner}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-transform"
              >
                <RefreshCw size={18} /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PhonePe Style Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Darkened areas outside the scan box */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* The Scan Window (Clear Area) - Wider for 1D barcode */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[120px] rounded-3xl shadow-[0_0_0_1000px_rgba(0,0,0,0.6)]">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-3xl"></div>

            {/* Scanning Line Animation - Horizontal for 1D */}
            <motion.div 
              animate={{ 
                top: ['10%', '90%', '10%'],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute left-2 right-2 h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-20"
            />
          </div>
        </div>

        {/* Quick Actions (Flash, Gallery) */}
        <div className="absolute bottom-40 left-0 right-0 flex justify-center gap-8 z-20">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleFlash}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition-colors ${isFlashOn ? 'bg-blue-500 text-white' : 'bg-white/10 backdrop-blur-md text-white border border-white/20'}`}
          >
            <Zap size={20} fill={isFlashOn ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold uppercase">Flash</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex flex-col items-center justify-center gap-1 text-white border border-white/20"
          >
            <ImageIcon size={20} />
            <span className="text-[10px] font-bold uppercase">Album</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Sheet Instructions */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-t-[40px] p-8 pb-10 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-colors duration-300"
      >
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
        <h3 className="text-xl font-black text-center mb-2 text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Barcode className="text-gray-900 dark:text-white" /> Scan Device Barcode
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 px-4">
          Align the 1D barcode on the <span className="text-blue-600 font-bold">MINIBOX-HD2</span> within the red frame to start the session.
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          {['DEV-001', 'DEV-002', 'DEV-003'].map(id => (
            <motion.button 
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(50);
                onScan(id);
              }} 
              className="py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col items-center gap-1"
            >
              <span className="text-blue-500">SIMULATE</span>
              {id}
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-6 font-bold uppercase tracking-widest">
          Secure Scanning • BS8628:2022 Compliant
        </p>
      </motion.div>
    </div>
  );
}
