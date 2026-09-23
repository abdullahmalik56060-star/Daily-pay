import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  MessageCircle,
  Youtube,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Settings,
  Sparkles,
  Phone,
  FileText,
  User,
  AlertCircle,
  ExternalLink,
  Radio,
} from 'lucide-react';

interface SupportViewProps {
  onOpenSocialLinksModal: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onOpenSocialLinksModal }) => {
  const {
    user,
    whatsappLink,
    whatsappLink2,
    whatsappChannelLink,
    youtubeChannelLink,
    supportMessages,
    sendSupportMessage,
  } = useApp();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [subject, setSubject] = useState('Deposit & Payment Inquiry');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendSupportMessage({
      name,
      phone,
      subject,
      message,
    });

    setFeedback('Message sent successfully! Our Support Team has provided an initial response below.');
    setMessage('');
    setTimeout(() => setFeedback(null), 5000);
  };

  const faqs = [
    {
      q: 'ودڈرا کب اور کیسے ہوگا؟ (When & How can I withdraw?)',
      a: 'ودڈرا کے لیے کم از کم کوئی ایک ارننگ پلان (Plan 1 - Rs 150, Plan 2 - Rs 300, ya Plan 3 - Rs 450) منتخب کرنا ضروری ہے۔ پلان ایکٹو ہونے کے بعد آپ کم از کم Rs 500 سے زیادہ سے زیادہ Rs 1,000 تک ہر 4 دن بعد اپنے JazzCash، Easypaisa یا OPay اکاؤنٹ میں ودڈرا حاصل کر سکتے ہیں۔',
    },
    {
      q: 'ڈیپازٹ پر 10 فیصد بونس کیسے ملتا ہے؟ (How does the 10% deposit bonus work?)',
      a: 'آپ جتنی بھی رقم JazzCash (03706486965 - Naveed Ahmad)، Easypaisa (03174679161 - tanveer ahmad) یا OPay (03098899212 - shamshad akhtar) پر بھیج کر TID سبمٹ کریں گے، سسٹم خود بخود اس میں 10 فیصد بونس شامل کر کے آپ کے والٹ میں کریڈٹ کر دے گا۔',
    },
    {
      q: 'یوٹیوب ایڈز کیسے دیکھنی ہیں؟ (How to watch YouTube ads & earn?)',
      a: 'ڈیش بورڈ پر جا کر "Watch Ad #1" اور "Watch Ad #2" پر کلک کریں۔ 10 سیکنڈ تک یوٹیوب ویڈیو ایڈ دیکھیں، ٹائمر مکمل ہونے پر ایک آسان سوال کا جواب دیں اور رقم فوری طور پر آپ کے اکاؤنٹ میں شامل ہو جائے گی۔',
    },
    {
      q: 'لاگ ان، ڈیلی اور ریفرل بونس کے کیا اصول ہیں؟ (Bonus rules)',
      a: 'لاگ ان بونس Rs 25 PKR، روزانہ حاضری بونس Rs 5 PKR، اور ہر دوست کو انوائٹ کرنے پر Rs 10 PKR ریفرل بونس ملتا ہے۔',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Customer Support Desk & Helpline
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Daily Pay Support Team (کسٹمر سپورٹ ٹیم)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              کسی بھی مسئلے، ڈپازٹ یا ودڈرا کے بارے میں مدد کے لیے ہم سے رابطہ کریں۔ آپ یہاں سوال پوچھ سکتے ہیں یا براہِ راست واٹس ایپ اور یوٹیوب پر رابطہ کر سکتے ہیں۔
            </p>
          </div>

          <button
            onClick={onOpenSocialLinksModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all shrink-0 self-start sm:self-center"
            title="Edit WhatsApp Channel & Helplines"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            Paste WhatsApp Links (لنکس بدلیں)
          </button>
        </div>
      </div>

      {/* Official Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Official Support & Channel */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                ONLINE NOW • 24/7 HELPLINE
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white">Official WhatsApp Helpline & Channel</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              فوری مدد، ڈپازٹ کنفرمیشن، اور ودڈرا معلومات کے لیے ہماری ٹیم سے رابطہ کریں، یا آفیشل واٹس ایپ چینل جوائن کریں۔
            </p>

            <div className="space-y-2">
              {/* Official WhatsApp Channel Row */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <div>
                    <span className="text-[11px] text-emerald-300 font-extrabold block">Official WhatsApp Channel (آفیشل چینل):</span>
                    <span className="font-mono text-white text-[11px] truncate max-w-[180px] sm:max-w-xs block">
                      {whatsappChannelLink}
                    </span>
                  </div>
                </div>
                <a
                  id="btn-support-channel-whatsapp"
                  href={whatsappChannelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black flex items-center gap-1 transition-all shrink-0 shadow-sm active:scale-95"
                >
                  <Radio className="w-3.5 h-3.5" />
                  Join Channel
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Primary Helpline 1 (پہلا نمبر):</span>
                    <span className="font-mono text-emerald-400 font-extrabold text-sm">0322-5290908</span>
                  </div>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat #1
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Secondary Helpline 2 (دوسرا نمبر):</span>
                    <span className="font-mono text-teal-400 font-extrabold text-sm">0309-8899212</span>
                  </div>
                </div>
                <a
                  href={whatsappLink2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat #2
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a
              id="btn-support-channel-quick"
              href={whatsappChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Join Channel
            </a>
            <a
              id="btn-support-chat-whatsapp-1"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-slate-950" />
              WA 1 (0324)
            </a>
            <a
              id="btn-support-chat-whatsapp-2"
              href={whatsappLink2}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border border-teal-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-teal-400" />
              WA 2 (0309)
            </a>
          </div>
        </div>

        {/* Official YouTube Channel */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Youtube className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                OFFICIAL CHANNEL
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white">Official YouTube Channel</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ہمارے یوٹیوب چینل پر ودڈرا کے لائیو ثبوت، ڈیپازٹ کا طریقہ اور ارننگ ٹیوٹوریل دیکھیں۔
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-red-400 truncate">
              {youtubeChannelLink}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <a
              href={youtubeChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Youtube className="w-4 h-4" />
              Watch Video Proofs (یوٹیوب چینل کھولیں)
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Support Desk Form & Live Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ask Question Form */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Ask Support Team (ہم سے کوئی بات پوچھیں)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              اپنا سوال یا مسئلہ یہاں لکھیں۔ ہماری ٹیم فوری طور پر جواب دے گی۔
            </p>
          </div>

          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Your Name (نام):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Mobile / WhatsApp No (موبائل نمبر):</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Subject / Category (موضوع منتخب کریں):</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Deposit & Payment Inquiry">JazzCash / Easypaisa / OPay Deposit Help</option>
                <option value="Withdrawal Inquiry">Withdrawal (ودڈرا کے متعلق سوال)</option>
                <option value="Plan Activation">Earning Plan Activation (پلان خریدنا)</option>
                <option value="YouTube Ads Task">YouTube Ads Task Issue (ایڈز کا مسئلہ)</option>
                <option value="Bonus & Referral">Bonus & Referral Query (بونس کی معلومات)</option>
                <option value="General Question">General Question (عام معلومات)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Your Question / Message (اپنا سوال لکھیں):</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here... e.g. میں نے ڈپازٹ کر دیا ہے کب تک اپروو ہوگا؟"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                required
              />
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              Send Question to Support Team (سوال بھیجیں)
            </button>
          </form>
        </div>

        {/* Previous Messages & Responses Thread */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Support Conversations & Tickets ({supportMessages.length})
              </h3>
              <span className="text-[11px] text-slate-400">Live Status</span>
            </div>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {msg.ticketId}
                      </span>
                      <span className="font-bold text-white truncate max-w-[180px]">{msg.subject}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{msg.date}</span>
                  </div>

                  {/* User question */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                    <strong className="text-slate-400 text-[11px] block mb-1">Your Question:</strong>
                    {msg.message}
                  </div>

                  {/* Support Team Agent Reply */}
                  {msg.reply && (
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 leading-relaxed space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Support Team Representative Reply:
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.repliedAt || 'Replied'}</span>
                      </div>
                      <p className="text-xs text-slate-200">{msg.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Instant WhatsApp Helpline (24/7 فوری رابطہ):</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                id="btn-ticket-whatsapp-helpline-1"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                title="Open Instant WhatsApp Helpline: 03225290908"
              >
                <MessageCircle className="w-4 h-4 text-slate-950" />
                <span>Helpline 1: 0322-5290908</span>
              </a>

              <a
                id="btn-ticket-whatsapp-helpline-2"
                href={whatsappLink2}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                title="Open Second WhatsApp Helpline: 03098899212"
              >
                <MessageCircle className="w-4 h-4 text-teal-400" />
                <span>Helpline 2: 0309-8899212</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-extrabold text-white">Frequently Asked Questions (اکثر پوچھے جانے والے سوالات)</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-950 border border-slate-800/90 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-all"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
