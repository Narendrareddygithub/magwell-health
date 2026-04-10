import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Machine } from '../types';

const getAiContext = (machines: Machine[]) => `
You are an AI assistant for the Mackwell Health UV-C Compliance Platform.
You answer questions based on the MINIBOX-HD2 Datasheet and common troubleshooting steps. Keep answers concise and helpful for mobile users.

Current Machine Status:
${machines.map(m => `- ${m.name} (${m.id}): Status is ${m.status}, Location: ${m.location}`).join('\n')}

Datasheet info:
Product: MINIBOX-HD2
Description: Ultraviolet Device Disinfection Chamber for high level disinfection of bacteria, viruses, spores on small objects.
Features: Class IIa Medical Device, Benchtop/desktop use, Automatic 5 minute treatment cycles, mercury-free solid-state LED (265nm).
Standards: BS8628:2022, BS EN ISO 13485:2016.
Efficacy: Enterococcus hirae (6.23 log), Escherichia coli (6.06 log), Acinetobacter baumanii (6.14 log), Staphylococcus aureus (7.09 log), Candida albicans (5.42 log).
Technical Data: 48V DC supply, 115W operation power, 5 minutes cycle time, 6 kg weight, 25000 hours LED lifetime.

Troubleshooting Steps:
1. Device won't start: Ensure the 48V DC power supply is connected. Check if the door is fully closed; the safety interlock prevents operation if the door is ajar.
2. Cycle interrupted: If the door is opened during a cycle, the UV-C LEDs will immediately cut out for safety. Close the door and restart the cycle.
3. Low UV-C Intensity: Ensure the inner reflective specular aluminium surfaces are clean and free of dust. Check the LED lifetime; LEDs may need replacement after 25,000 hours.
4. Connection issues: Ensure the device is within range of the facility network for real-time logging.
`;

type Message = { role: 'user' | 'ai', content: string };

export function AIChat({ machines, onBack }: { machines: Machine[], onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const context = getAiContext(machines);
      const prompt = `${context}\n\nUser: ${text}\nAI:`;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMessages([...newMessages, { role: 'ai', content: response.text || 'Sorry, I could not generate a response.' }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'ai', content: 'Sorry, there was an error connecting to the AI service.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    "What is the cycle time?",
    "How to start a cycle?",
    "Device won't start?",
    "What standards does it meet?",
    "How to clean the device?",
    "LED lifetime info",
    "Efficacy data",
    "Safety interlock help"
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <img 
            src="/mackwell-logo.png" 
            alt="Mackewell Health" 
            className="h-5 w-auto object-contain dark:invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">AI Help</h2>
        </div>
      </div>

      {/* Floating FAQs Marquee */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 overflow-hidden whitespace-nowrap relative">
        <div className="flex animate-marquee hover:pause-marquee gap-4 px-4">
          {[...faqs, ...faqs].map((faq, i) => (
            <button
              key={i}
              onClick={() => handleSend(faq)}
              className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap shadow-sm active:scale-95 transition-all"
            >
              {faq}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[24px] text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-[24px] rounded-bl-none border border-gray-100 dark:border-gray-800 flex gap-1.5 shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-24 transition-colors duration-300">
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-2 rounded-full border border-gray-100 dark:border-gray-700 shadow-inner">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask about MINIBOX-HD2..."
            className="flex-1 pl-4 py-2 bg-transparent text-sm focus:outline-none text-gray-900 dark:text-white"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 shadow-lg shadow-blue-600/20 active:scale-90 transition-all"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
