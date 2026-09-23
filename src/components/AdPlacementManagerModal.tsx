import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdCampaign } from '../types';
import {
  X,
  Youtube,
  Save,
  RotateCcw,
  CheckCircle2,
  Tv,
  HelpCircle,
  Clock,
  Play,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface AdPlacementManagerModalProps {
  initialSlot?: 1 | 2;
  onClose: () => void;
  onTestWatchAd?: (campaign: AdCampaign, slot: 1 | 2) => void;
}

export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = clean.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=0&rel=0`
    : null;
}

export const AdPlacementManagerModal: React.FC<AdPlacementManagerModalProps> = ({
  initialSlot = 1,
  onClose,
  onTestWatchAd,
}) => {
  const { saveAdCampaign, resetAdCampaigns, getCampaignForSlot } = useApp();

  const [activeSlot, setActiveSlot] = useState<1 | 2>(initialSlot);

  // Load selected slot campaign
  const currentSlotCampaign = getCampaignForSlot(activeSlot);

  const [formData, setFormData] = useState<AdCampaign>(() => ({
    ...currentSlotCampaign,
    videoUrl: currentSlotCampaign.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mediaType: 'video',
    category: 'YouTube Ad Video',
  }));

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Switch slots
  const handleSwitchSlot = (slot: 1 | 2) => {
    setActiveSlot(slot);
    const campaign = getCampaignForSlot(slot);
    setFormData({
      ...campaign,
      videoUrl: campaign.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      mediaType: 'video',
      category: 'YouTube Ad Video',
    });
    setSavedSuccess(false);
  };

  const handleHighlightChange = (index: number, value: string) => {
    const updated = [...(formData.highlights || ['', '', ''])];
    updated[index] = value;
    setFormData({ ...formData, highlights: updated });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...formData.verificationQuestion.options];
    updatedOptions[index] = value;
    setFormData({
      ...formData,
      verificationQuestion: {
        ...formData.verificationQuestion,
        options: updatedOptions,
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdCampaign({
      ...formData,
      adIndex: activeSlot,
      mediaType: 'video',
      category: 'YouTube Ad Video',
      bannerGradient:
        activeSlot === 1
          ? 'from-red-950 via-slate-900 to-red-900/40'
          : 'from-amber-950 via-slate-900 to-orange-950/40',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const embedUrl = getYouTubeEmbedUrl(formData.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                YouTube Ads Management System
              </h3>
              <p className="text-[11px] text-slate-400">
                یہاں اپنے یوٹیوب ویڈیو ایڈز کا لنک لگائیں اور محفوظ کریں
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

        {/* Slot Switcher Tabs */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSwitchSlot(1)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeSlot === 1
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              Daily YouTube Ad #1
            </button>

            <button
              type="button"
              onClick={() => handleSwitchSlot(2)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeSlot === 2
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              Daily YouTube Ad #2
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              resetAdCampaigns();
              handleSwitchSlot(activeSlot);
            }}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main YouTube Video Link Input */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-950/30 via-slate-950 to-slate-950 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                Paste YouTube Video Ad Link (یوٹیوب ویڈیو لنک):
              </label>
              <span className="text-[10px] text-red-400 font-bold uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Slot #{activeSlot}
              </span>
            </div>

            <input
              type="text"
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-red-500/40 text-white font-mono text-xs focus:outline-none focus:border-red-400 shadow-inner"
              required
            />

            <p className="text-[11px] text-slate-400">
              Paste standard YouTube URL (e.g. `https://www.youtube.com/watch?v=XXXX` or `https://youtu.be/XXXX`). Users will watch this 10s video task to claim their plan reward.
            </p>

            {/* YouTube Live Embed Preview */}
            {embedUrl ? (
              <div className="mt-3 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-emerald-400" /> Video Embed Preview:
                </p>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-700 shadow-lg">
                  <iframe
                    src={embedUrl}
                    title="YouTube Ad Preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 flex items-center gap-2">
                <span>Please enter a valid YouTube video URL to generate the live preview.</span>
              </div>
            )}
          </div>

          {/* Ad Details: Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Video Ad Title / Topic (ایڈ کا عنوان):
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Top Real Online Earning Ways"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                Channel / Brand Name (چینل کا نام):
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Daily Pay Official Channel"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Tagline & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Short Tagline (چھوٹا تعارف):
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Watch 10s video tutorial and claim reward"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                External Channel / Sponsor Website Link:
              </label>
              <input
                type="text"
                value={formData.websiteUrl || ''}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.youtube.com/@channel"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300">
              Full Video Description & Task Instructions:
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* 3 Video Highlights */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              3 Key Highlights (نمایاں پوائنٹس):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[0, 1, 2].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  value={formData.highlights[idx] || ''}
                  onChange={(e) => handleHighlightChange(idx, e.target.value)}
                  placeholder={`Highlight ${idx + 1}`}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                />
              ))}
            </div>
          </div>

          {/* Verification Question to verify watch */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Watch Verification Question (ویڈیو کے بعد کا آسان سوال):
            </div>

            <input
              type="text"
              value={formData.verificationQuestion.question}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  verificationQuestion: {
                    ...formData.verificationQuestion,
                    question: e.target.value,
                  },
                })
              }
              placeholder="e.g. Which payment methods are supported in Daily Pay?"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
              required
            />

            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 block">
                Select the correct answer option (ریڈیو بٹن سے درست آپشن منتخب کریں):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.verificationQuestion.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      formData.verificationQuestion.correctIndex === i
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={formData.verificationQuestion.correctIndex === i}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          verificationQuestion: {
                            ...formData.verificationQuestion,
                            correctIndex: i,
                          },
                        })
                      }
                      className="accent-emerald-500"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="w-full bg-transparent text-white text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              {onTestWatchAd && (
                <button
                  type="button"
                  onClick={() => onTestWatchAd(formData, activeSlot)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  Test Watch Ad #{activeSlot}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-lg shadow-red-600/30 flex items-center gap-1.5 active:scale-95"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Ad #{activeSlot} Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save YouTube Ad #{activeSlot} (محفوظ کریں)
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
