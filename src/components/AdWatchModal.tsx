import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AdCampaign } from '../types';
import { useApp } from '../context/AppContext';
import { getYouTubeEmbedUrl } from './AdPlacementManagerModal';
import {
  X,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Award,
  Tv,
} from 'lucide-react';

interface AdWatchModalProps {
  adNumber: 1 | 2;
  campaign: AdCampaign;
  rewardAmount: number;
  onClose: () => void;
  onCompleted: () => void;
}

export const AdWatchModal: React.FC<AdWatchModalProps> = ({
  adNumber,
  campaign,
  rewardAmount,
  onClose,
  onCompleted,
}) => {
  const { watchAd } = useApp();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(campaign.durationSeconds || 10);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const ytEmbed = getYouTubeEmbedUrl(campaign.videoUrl);

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) {
      setTimerFinished(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const progressPercent = Math.min(
    100,
    Math.round(((campaign.durationSeconds - secondsRemaining) / campaign.durationSeconds) * 100)
  );

  const handleVerifyAnswer = () => {
    if (selectedOption === null) {
      setQuizError('Please select an answer to verify and claim your reward.');
      return;
    }

    if (selectedOption !== campaign.verificationQuestion.correctIndex) {
      setQuizError('Incorrect answer. Please re-read the sponsored highlights above and try again.');
      return;
    }

    // Correct answer! Trigger reward
    setQuizError(null);
    const res = watchAd(adNumber);

    if (res.success) {
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch (err) {
        // Fallback silently if confetti encounters environment restrictions
      }

      setTimeout(() => {
        onCompleted();
      }, 2000);
    } else {
      setQuizError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Ad #{adNumber} of 2
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Reward: Rs {rewardAmount} PKR
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
            disabled={isSuccess}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Timer */}
        <div className="bg-slate-800/80 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            {timerFinished ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Ad View Time Completed! Answer quiz below to claim.
              </span>
            ) : (
              <span>
                Please view ad for <strong className="text-emerald-400">{secondsRemaining}s</strong> to unlock reward
              </span>
            )}
          </div>
          <div className="text-xs font-mono font-bold text-emerald-400">{progressPercent}%</div>
        </div>
        <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Ad Content */}
        <div className="p-6 space-y-5">
          {/* Optional Video / Media Screen */}
          {ytEmbed ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-xl">
              <iframe
                src={`${ytEmbed}&autoplay=1`}
                title={campaign.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : campaign.imageUrl ? (
            <div className="max-h-64 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl relative">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          ) : null}

          {/* Ad Banner Card */}
          <div
            className={`p-6 rounded-2xl bg-gradient-to-br ${campaign.bannerGradient || 'from-slate-900 via-slate-800 to-slate-900'} border border-slate-700/60 shadow-lg relative overflow-hidden`}
          >
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 text-cyan-300 border border-cyan-400/20">
                  {campaign.category}
                </span>
                <span className="text-xs text-slate-300 font-medium">{campaign.brand}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">{campaign.title}</h3>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">{campaign.description}</p>

              {/* Highlights pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {campaign.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/15 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    {h}
                  </span>
                ))}
              </div>

              {campaign.websiteUrl && (
                <div className="pt-2">
                  <a
                    href={campaign.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit Official Sponsor / Link
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Verification Question (Unlocked when timer finishes) */}
          {timerFinished ? (
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Human Verification to Claim Rs {rewardAmount}</h4>
                  <p className="text-xs text-slate-400">Answer this simple question based on the ad you just saw:</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <p className="text-sm font-semibold text-slate-200">{campaign.verificationQuestion.question}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {campaign.verificationQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedOption(idx);
                      setQuizError(null);
                    }}
                    className={`p-3 rounded-xl text-left text-xs sm:text-sm font-medium transition-all border ${
                      selectedOption === idx
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="inline-block w-5 font-bold text-slate-400">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {quizError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{quizError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Daily Limit: <strong>2 Ads/day</strong>
                </span>

                <button
                  type="button"
                  onClick={handleVerifyAnswer}
                  disabled={isSuccess}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isSuccess ? 'Credited!' : `Claim Rs ${rewardAmount} PKR`}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col items-center justify-center text-center py-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 animate-pulse">
                <Play className="w-5 h-5 ml-0.5" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Watching Sponsored Ad #{adNumber}</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Please remain on this screen for {secondsRemaining} more seconds. Once the timer reaches 0, you can
                instantly claim your <strong className="text-emerald-400">Rs {rewardAmount}</strong>!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
