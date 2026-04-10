import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, ShieldCheck, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { CycleProgress } from '../components/CycleProgress';

export function TheatreEvidence({ onComplete }: { onComplete: (hasVideo: boolean) => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoCaptured, setVideoCaptured] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Request camera access when component mounts
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => console.error("Error accessing camera:", err));

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRecord = () => {
    if (!stream) return;
    
    setRecording(true);
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
      setVideoCaptured(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative">
      {/* Toast Notification */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm"
        >
          <CheckCircle2 size={16} className="text-green-400" />
          Log saved locally successfully
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex-1">
          <img 
            src="/mackwell-logo.png" 
            alt="Mackewell Health" 
            className="h-5 w-auto object-contain dark:invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Step 4 of 4</h2>
      </div>

      <CycleProgress step={4} />

      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Evidence Capture</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Confirm the cycle completed successfully and optionally capture video evidence.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Mandatory Confirmation</h3>
          
          <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 flex items-start gap-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500 text-white">
              <CheckCircle2 size={16} />
            </div>
            <div className="text-left">
              <div className="font-bold text-emerald-900 dark:text-emerald-100">
                Confirm the cycle completed successfully.
              </div>
              <div className="text-xs mt-1 text-emerald-700 dark:text-emerald-300">
                * By clicking the button below, I verify that the indicators show a successful UV-C exposure.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Video Evidence</h3>
            <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full uppercase tracking-widest">Optional</span>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            By clicking record, you will capture a 3-second video of the clean instruments as evidence.
          </p>

          {!videoCaptured ? (
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-800">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {recording ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
                  <motion.div 
                    animate={{ opacity: [1, 0.5, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-4 h-4 bg-red-500 rounded-full mb-4"
                  />
                  <span className="text-white font-bold tracking-widest uppercase">Recording...</span>
                </div>
              ) : (
                <button 
                  onClick={handleRecord}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 hover:bg-black/40 transition-colors text-white"
                >
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center border-4 border-white/20 shadow-lg mb-3">
                    <Video size={24} />
                  </div>
                  <span className="text-sm font-bold tracking-wider">TAP TO RECORD</span>
                </button>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-emerald-900/20 rounded-2xl flex flex-col items-center justify-center border border-emerald-500/30">
              <CheckCircle2 size={48} className="text-emerald-500 mb-2" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Video Captured</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => onComplete(videoCaptured)}
            className="w-full py-5 bg-blue-600 text-white rounded-[32px] font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            <ShieldCheck size={20} /> Seal & Sign Session
          </button>
        </div>
      </div>
    </div>
  );
}
