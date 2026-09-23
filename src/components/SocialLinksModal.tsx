import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MessageCircle, Youtube, Save, ExternalLink, Link2, Check, Radio } from 'lucide-react';

interface SocialLinksModalProps {
  onClose: () => void;
}

export const SocialLinksModal: React.FC<SocialLinksModalProps> = ({ onClose }) => {
  const {
    whatsappLink,
    setWhatsappLink,
    whatsappLink2,
    setWhatsappLink2,
    whatsappChannelLink,
    setWhatsappChannelLink,
    youtubeChannelLink,
    setYoutubeChannelLink,
  } = useApp();

  const [waChannelInput, setWaChannelInput] = useState(whatsappChannelLink);
  const [waInput, setWaInput] = useState(whatsappLink);
  const [wa2Input, setWa2Input] = useState(whatsappLink2);
  const [ytInput, setYtInput] = useState(youtubeChannelLink);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (waChannelInput.trim()) {
      setWhatsappChannelLink(waChannelInput.trim());
    }
    if (waInput.trim()) {
      setWhatsappLink(waInput.trim());
    }
    if (wa2Input.trim()) {
      setWhatsappLink2(wa2Input.trim());
    }
    if (ytInput.trim()) {
      setYoutubeChannelLink(ytInput.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Manage WhatsApp & YouTube Links
              </h3>
              <p className="text-[11px] text-slate-400">
                واٹس ایپ چینل، ہیلپ لائنز، اور یوٹیوب چینل کے لنکس تبدیل کریں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* PRIMARY: WhatsApp Channel Link Input */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>📢 Official WhatsApp Channel Link (واٹس ایپ چینل کا لنک):</span>
              </label>
              {waChannelInput && (
                <a
                  href={waChannelInput}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-300 hover:underline flex items-center gap-1 font-bold bg-emerald-500/20 px-2 py-0.5 rounded"
                >
                  <ExternalLink className="w-3 h-3" /> Test Link
                </a>
              )}
            </div>
            <input
              type="text"
              value={waChannelInput}
              onChange={(e) => setWaChannelInput(e.target.value)}
              placeholder="e.g. https://whatsapp.com/channel/... ya https://chat.whatsapp.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-200 font-mono text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              required
            />
            <p className="text-[11px] text-emerald-400/90 leading-relaxed font-medium">
              👉 <strong>یہاں اپنے واٹس ایپ چینل (WhatsApp Channel) یا گروپ کا لنک پیسٹ کریں۔</strong> ایپ میں ہر جگہ صارفین کے سامنے آپ کا چینل ظاہر ہوگا تاکہ وہ اسے جوائن کر سکیں۔
            </p>
          </div>

          {/* WhatsApp Helpline 1 Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                WhatsApp Helpline #1 (0322-5290908 پہلا نمبر):
              </label>
              {waInput && (
                <a
                  href={waInput}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Test Link
                </a>
              )}
            </div>
            <input
              type="text"
              value={waInput}
              onChange={(e) => setWaInput(e.target.value)}
              placeholder="e.g. 03225290908 or https://wa.me/923225290908"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              required
            />
            <p className="text-[11px] text-slate-400">
              User instant helpline #1: Default is <strong>03225290908</strong> (`https://wa.me/923225290908`).
            </p>
          </div>

          {/* WhatsApp Helpline 2 Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-teal-400" />
                WhatsApp Helpline #2 (0309-8899212 دوسرا نمبر):
              </label>
              {wa2Input && (
                <a
                  href={wa2Input}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Test Link
                </a>
              )}
            </div>
            <input
              type="text"
              value={wa2Input}
              onChange={(e) => setWa2Input(e.target.value)}
              placeholder="e.g. 03098899212 or https://wa.me/923098899212"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-teal-500"
              required
            />
            <p className="text-[11px] text-slate-400">
              Second helpline: Default is <strong>03098899212</strong> (`https://wa.me/923098899212`).
            </p>
          </div>

          {/* YouTube Channel Link Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-red-500" />
                Official YouTube Channel Link (یوٹیوب چینل کا لنک):
              </label>
              {ytInput && (
                <a
                  href={ytInput}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Test Link
                </a>
              )}
            </div>
            <input
              type="text"
              value={ytInput}
              onChange={(e) => setYtInput(e.target.value)}
              placeholder="e.g. https://www.youtube.com/@YourChannelName"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              required
            />
            <p className="text-[11px] text-slate-400">
              Paste your official YouTube channel link where users can watch tutorials and earning proofs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  Links Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Links (محفوظ کریں)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

