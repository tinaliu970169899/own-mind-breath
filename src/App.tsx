/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isAfter,
  isBefore,
  parse
} from "date-fns";
import { 
  Wind, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  X, 
  Info,
  Heart,
  Leaf,
  Moon,
  Sun,
  Coffee,
  ExternalLink,
  Smartphone,
  Apple,
  Youtube,
  Globe,
  PlayCircle,
  Star,
  Coins,
  CheckCircle2,
  Calendar as CalendarIcon,
  ArrowLeft,
  Lightbulb,
  PartyPopper,
  Quote
} from "lucide-react";

// --- Components ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  key?: string | number;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-clean-primary/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Modal Header - Fixed */}
          <div className="flex justify-between items-center px-6 py-4 sm:px-8 sm:py-5 shrink-0 bg-white z-20 border-b border-clean-border/20">
            <h3 className="text-xl sm:text-xl font-serif font-bold text-clean-primary">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-clean-bg rounded-lg transition-colors text-clean-secondary active:scale-90"
            >
              <X size={18} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="px-6 py-6 sm:px-8 sm:py-7 overflow-y-auto grow custom-scrollbar bg-white">
            <div className="text-clean-secondary leading-relaxed font-sans text-base sm:text-base">
              {children}
            </div>
          </div>

          {/* Modal Footer - Fixed */}
          <div className="p-6 shrink-0 flex justify-center bg-clean-bg/30 border-t border-clean-border/20 z-20">
            <button 
              onClick={onClose}
              className="px-10 py-3 bg-clean-accent text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95 text-base"
            >
              我知道了
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const SectionHeading = ({ title, subtitle, light }: { title: string; subtitle?: string; light?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-left mb-12 sm:mb-16"
  >
    <div className={`${light ? 'text-white/60' : 'text-clean-accent'} text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase mb-3 sm:mb-4`}>Focus Point</div>
    <h2 className={`text-2xl sm:text-3xl font-serif ${light ? 'text-white' : 'text-clean-primary'} mb-4 sm:mb-5 tracking-tight`}>{title}</h2>
    {subtitle && <p className={`text-sm sm:text-sm ${light ? 'text-white/70' : 'text-clean-secondary'} max-w-2xl leading-relaxed opacity-80`}>{subtitle}</p>}
  </motion.div>
);

const DailyCheckIn = ({ onBack }: { onBack: () => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Start at April 2026
  const [checkIns, setCheckIns] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("mindfulness_checkins");
    return saved ? JSON.parse(saved) : {};
  });
  const [showDing, setShowDing] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);

  const minDate = new Date(2026, 3, 1); // April 2026
  const maxDate = new Date(2026, 11, 31); // Dec 2026

  useEffect(() => {
    localStorage.setItem("mindfulness_checkins", JSON.stringify(checkIns));
  }, [checkIns]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const totalDays = useMemo(() => Object.values(checkIns).filter(Boolean).length, [checkIns]);

  const toggleCheckIn = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const willBeChecked = !checkIns[dateKey];
    
    setCheckIns(prev => ({
      ...prev,
      [dateKey]: willBeChecked
    }));

    if (willBeChecked) {
      // Ding! effect
      setShowDing(true);
      setTimeout(() => setShowDing(false), 2000);

      // Milestone check (every 5 days)
      const newTotal = totalDays + 1;
      if (newTotal > 0 && newTotal % 5 === 0) {
        setMilestone(newTotal);
      }
    }
  };

  const nextMonth = () => {
    const next = addMonths(currentDate, 1);
    if (!isAfter(next, maxDate)) setCurrentDate(next);
  };

  const prevMonth = () => {
    const prev = subMonths(currentDate, 1);
    if (!isBefore(prev, minDate)) setCurrentDate(prev);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-clean-bg py-20 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Ding! Effect Overlay */}
      <AnimatePresence>
        {showDing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-full shadow-2xl flex flex-col items-center gap-2 border border-tiffany/50">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Lightbulb size={64} className="text-tiffany fill-tiffany/20" />
              </motion.div>
              <span className="text-tiffany font-bold tracking-[0.3em] uppercase text-xs">Ding!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Modal */}
      <Modal 
        isOpen={milestone !== null} 
        onClose={() => setMilestone(null)}
        title="🎉 覺察里程碑"
      >
        <div className="text-center space-y-6 py-4">
          <div className="w-24 h-24 bg-tiffany/10 rounded-full flex items-center justify-center mx-auto text-tiffany">
            <PartyPopper size={48} />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-serif text-clean-primary">恭喜！您已完成 {milestone} 天練習</h4>
            <p className="text-sm text-clean-secondary leading-relaxed">
              「每一步微小的覺察，都是通往內在平靜的基石。」<br />
              在這個繁忙的世界中，您為自己留下了這份專注，真的很棒。
            </p>
          </div>
          <div className="p-6 bg-clean-bg rounded-2xl border border-dashed border-clean-border flex gap-4 items-start text-left">
            <Quote className="text-tiffany shrink-0 mt-1" size={16} />
            <p className="text-sm italic font-serif leading-relaxed">
              身心合一，是在動盪中找回平穩的唯一途徑。請繼續溫柔地對待自己。
            </p>
          </div>
        </div>
      </Modal>

      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-clean-accent font-bold mb-12 hover:translate-x-1 transition-transform group uppercase text-[10px] tracking-[0.2em]"
        >
          <ArrowLeft size={16} /> Back to Mindfulness
        </button>

        <SectionHeading 
          title="每日正念簽到" 
          subtitle="記錄您的覺察旅程。每一次點擊，都是對當下最好的承諾。" 
        />

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-clean-border">
          {/* Calendar Header */}
          <div className="bg-clean-accent p-8 text-white flex justify-between items-center bg-gradient-to-r from-clean-accent to-tiffany">
            <h3 className="text-xl font-serif font-bold tracking-widest uppercase">
              {format(currentDate, "yyyy / MMM")}
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={prevMonth}
                disabled={isSameMonth(currentDate, minDate)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                disabled={isSameMonth(currentDate, maxDate)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 bg-clean-bg/50 border-b border-clean-border text-center py-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-[9px] font-bold text-clean-secondary uppercase tracking-widest">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 p-4 sm:p-8 gap-1 sm:gap-2 bg-white">
            {calendarDays.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const dateKey = format(day, "yyyy-MM-dd");
              const isChecked = checkIns[dateKey];
              const isOutsideRange = isBefore(day, minDate) || isAfter(day, maxDate);

              return (
                <button
                  key={i}
                  disabled={!isCurrentMonth || isOutsideRange}
                  onClick={() => toggleCheckIn(day)}
                  className={`
                    relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-500
                    ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : ''}
                    ${isChecked 
                      ? 'bg-tiffany text-white shadow-md z-10' 
                      : 'bg-clean-bg/30 text-clean-secondary hover:bg-clean-bg border border-clean-border/20'
                    }
                  `}
                >
                  <span className={`text-xs sm:text-sm font-serif ${isChecked ? 'font-bold' : ''}`}>
                    {format(day, "d")}
                  </span>
                  
                  <AnimatePresence>
                    {isChecked && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="mt-0.5"
                      >
                        <CheckCircle2 size={12} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div 
                    whileTap={{ scale: 1.4 }}
                    className="absolute inset-0 pointer-events-none rounded-xl bg-tiffany/20 opacity-0 group-active:opacity-100"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 p-8 bg-white/50 rounded-2xl border border-clean-border text-center">
          <p className="text-clean-secondary font-bold text-[10px] tracking-[0.2em] uppercase mb-2">Total Mindful Days</p>
          <div className="text-3xl font-serif font-bold text-clean-primary flex items-center justify-center gap-3">
            <span className="text-tiffany">{totalDays}</span>
            <div className="w-1 h-1 bg-clean-border rounded-full" />
            <span className="text-clean-accent tracking-widest uppercase text-xs">Days Accomplished</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [finalConclusion, setFinalConclusion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [tipChoice, setTipChoice] = useState<string | null>(null);
  const [showFeedbackThanks, setShowFeedbackThanks] = useState(false);
  const [view, setView] = useState<'landing' | 'checkin'>('landing');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const coreConcepts = [
    {
      id: "what",
      icon: <Wind size={20} />,
      title: "01 什麼是正念",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200",
      summary: "專注於此時此刻，不對過去感到懊悔，也不對未來感到焦慮。",
      content: (
        <div className="space-y-6">
          <p>正念並非「放空」或「不想事情」，而是一種特殊的注意模式。</p>
          <div className="relative p-7 bg-clean-bg rounded-2xl border-l-4 border-clean-accent italic my-8 shadow-inner">
            <p className="text-clean-primary leading-relaxed font-serif text-xl">
              「正念是時時刻刻非評價的覺察，需要刻意練習 (moment-to-moment non-judging awareness, practice on purpose)。」
            </p>
            <footer className="mt-4 text-clean-accent font-bold tracking-wider">— 喬．卡巴金（Jon Kabat-Zinn）博士</footer>
          </div>
          <p className="text-clean-secondary leading-relaxed">
            它能幫助我們跳脫大腦的「自動導航」模式，更清晰地覺察當下的內在狀態。透過不斷地練習，我們學會與情緒共處，而非受其左右。
          </p>
        </div>
      )
    },
    {
      id: "benefits",
      icon: <Heart size={20} />,
      title: "02 衛教資源",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200",
      summary: "臨床研究顯示，持續練習能降低壓力中心活性，提升情緒調節能力。",
      content: (
        <div className="space-y-6">
          <p className="text-clean-primary font-medium text-lg italic border-b border-clean-border pb-2">
            正念不僅是心靈練習，更有其穩固的生理學基礎。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-5 bg-clean-bg rounded-xl border border-clean-border/30">
              <h4 className="font-bold text-clean-accent mb-2">🧠 降低杏仁核活性</h4>
              <p className="text-sm text-clean-secondary leading-relaxed">
                研究發現持續練習 8 週後，大腦中負責處理恐懼、焦慮的「壓力中心」——杏仁核（Amygdala）的細胞體積會縮小，反應性也會降低。
              </p>
            </div>
            <div className="p-5 bg-clean-bg rounded-xl border border-clean-border/30">
              <h4 className="font-bold text-clean-accent mb-2">⚖️ 強化前額葉連結</h4>
              <p className="text-sm text-clean-secondary leading-relaxed">
                這意味著我們能更冷靜地應對情緒，增加大腦「決策中心」對原始情緒反應的調節能力，有效預防憂鬱復發。
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-clean-border shadow-sm">
            <h4 className="font-bold text-clean-primary mb-3">臨床應用效益：</h4>
            <ul className="list-disc list-inside text-clean-secondary space-y-2 text-sm ml-2">
              <li>顯著降低焦慮感與心理壓力值</li>
              <li>輔助慢性疼痛控制，改善生活品質</li>
              <li>提升專注力與工作效能</li>
              <li>改善睡眠品質與身心平衡</li>
              </ul>
          </div>
          <div className="pt-6 border-t border-clean-border mt-8">
            <h5 className="text-xs font-bold text-clean-primary uppercase tracking-widest mb-3">資料來源：</h5>
            <ul className="text-xs text-clean-secondary/70 space-y-1">
              <li>• Harvard Medical School: "Mindfulness meditation may ease anxiety, mental stress"</li>
              <li>• Psychiatry Research: Neuroimaging (2011), "Mindfulness practice leads to increases in regional brain gray matter density"</li>
              <li>• 衛生福利部：正念練習對情緒調節之衛教指引</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "practice",
      icon: <Sparkles size={20} />,
      title: "03 實踐時機",
      image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=1200",
      summary: "隨時隨地。洗碗時感受水的溫度、走路時觀察足部的觸感。",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-clean-accent/5 rounded-2xl border border-clean-accent/20">
            <p className="text-clean-primary font-medium leading-relaxed italic">
              「正念練習不受時間與空間的限制，不需要在特殊環境、心境或誰的指導下才可以進行，因此正念才可以大量運用於生活日常。」
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-clean-primary text-lg">生活中的練習示範：</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-clean-border">
                <span className="text-clean-accent font-bold">☕ 正念飲食</span>
                <p className="text-xs text-clean-secondary mt-1">細細品味食物的味道、質地與香氣，而非邊看手機邊吃。</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-clean-border">
                <span className="text-clean-accent font-bold">🚶 正念行走</span>
                <p className="text-xs text-clean-secondary mt-1">感受腳掌接觸地面的壓力變化，以及微風吹過皮膚的感覺。</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mt-8">
            <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
              ⚠️ 重要小提醒：效果非立竿見影
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              正念就像「大腦的重訓」，效果不一定能馬上顯現。這不是一帖靈丹妙藥，而是一種長期的生活態度。有時你可能會感到挫折，覺得念頭依然混亂，這完全是正常的。
            </p>
            <p className="text-sm text-amber-800 leading-relaxed mt-2 font-medium">
              關鍵在於「温柔的堅持」，給予自己一點耐心與空間，改變往往會在不知不覺中緩慢發生。
            </p>
          </div>
        </div>
      )
    }
  ];

  if (view === 'checkin') {
    return (
      <AnimatePresence mode="wait">
        <DailyCheckIn onBack={() => setView('landing')} />
      </AnimatePresence>
    );
  }

  return (
    <div className="relative min-h-screen bg-clean-bg selection:bg-clean-accent/30 selection:text-clean-primary">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-clean-accent z-[60] origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-12 overflow-hidden">
        {/* Large Atmospheric Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover"
            alt="Mindfulness breathing"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-clean-primary/20 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-clean-bg via-transparent to-clean-bg/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 max-w-4xl"
        >
          <div className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-6 drop-shadow-md opacity-80">Mindfulness Intro</div>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tighter leading-[1.1] mb-6 sm:mb-8 drop-shadow-xl">
            在繁瑣的世界裡 <br />
            練習「覺察」
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12 drop-shadow-md font-light tracking-wide px-4">
            正念不是要你放空，而是有意識地觀察當下的感受。<br className="hidden sm:block" />
            不帶批判地與自己相處，讓心靈重獲平靜。
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <a 
              href="#intro" 
              className="bg-clean-accent text-white px-10 py-4 sm:px-12 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 w-full sm:w-80"
            >
              開始探索 
              <ChevronRight size={20} />
            </a>
            <button 
              onClick={() => setView('checkin')}
              className="bg-transparent border border-white/40 text-white px-10 py-4 sm:px-12 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-white/10 hover:border-white transition-all active:scale-95 flex items-center justify-center gap-3 w-full sm:w-80 backdrop-blur-sm"
            >
              每日簽到
              <CalendarIcon size={20} />
            </button>

            <div className="text-white/70 text-xs font-medium tracking-[0.3em] uppercase mt-4">
              製作團隊：心的呼吸 Y.H  S.Z  T.Y
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Introduction / Content Section with the Stripe Card Style */}
      <section id="intro" className="py-24 sm:py-32 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20">
          <SectionHeading 
            title="核心內容與實踐" 
            subtitle="讓正念成為您的日常習慣，從每天五分鐘開始。簡單來說，就是「人在心在」。" 
          />
          
          <div className="space-y-6">
            {coreConcepts.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveModal(item.id)}
                className="info-stripe-card cursor-pointer group flex gap-4 sm:gap-6 items-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden border border-clean-border shadow-inner">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1 sm:mb-1 text-wrap">
                    <h3 className="text-base sm:text-base font-bold text-clean-primary flex items-center gap-2 group-hover:text-clean-accent transition-colors tracking-tight">
                      {item.title}
                    </h3>
                    <span className="text-[8px] sm:text-[9px] font-bold text-clean-accent bg-clean-accent/10 px-2 sm:px-2 py-0.5 rounded shrink-0 tracking-widest uppercase">Key</span>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-clean-secondary leading-relaxed line-clamp-2 opacity-70 font-light">{item.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Sections: Where & When - Modified for Minimalism */}
      <section className="bg-white py-32 border-y border-clean-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            {/* Where Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-clean-accent text-[9px] sm:text-[10px] font-bold tracking-[0.3em] mb-4 uppercase">Resources</div>
              <h2 className="text-xl sm:text-2xl font-serif text-clean-primary mb-8 sm:mb-8 tracking-tight">哪裡可以獲取資源？</h2>
              <div className="grid gap-4">
                {[
                  { id: "cm-center", title: "華人正念減壓", desc: "華人正念減壓中心提供豐富的網站教學、影片，是學習正念減壓（MBSR）的權威資源。", link: "https://www.mindfulness.com.tw/" },
                  { id: "cm-course", title: "正念減壓 8 週課程", desc: "各大醫學中心（如台大、亞東、慈濟醫院）的身心科，及心理諮商所常設有 MBSR 專業課程。", link: "https://www.mindfulness.com.tw/course/%E8%BA%AB%E5%BF%83%E5%81%A5%E5%BA%B7%E8%AA%B2%E7%A8%8B-i.1" },
                  { id: "digital-learning", title: "正念數位學習平台", desc: "精選線上資源與 YouTube 頻道，包含 mbsr.space、台灣正念工坊及華人正念中心。", isModal: true },
                  { id: "digital-tools", title: "數位引導工具", desc: "推薦 Insight Timer、Peace 及 Tide，點擊查看各平台下載連結。", isModal: true },
                  { id: "books", title: "經典書籍閱讀", desc: "推薦多本經典正念書籍，幫助深度理解正念應用。", isModal: true }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={(item.link || item.isModal) ? { scale: 1.02 } : {}}
                    className={`p-6 bg-clean-bg/40 rounded-xl border border-transparent transition-all ${(item.link || item.isModal) ? 'hover:border-clean-accent/40 cursor-pointer shadow-sm bg-white' : ''}`}
                    onClick={() => {
                      if (item.link) window.open(item.link, '_blank');
                      if (item.isModal) setActiveModal(item.id);
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-clean-primary">{item.title}</h4>
                      {(item.link || item.isModal) && <ExternalLink size={14} className="text-clean-accent" />}
                    </div>
                    <p className="text-clean-secondary text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* When Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-clean-accent text-[9px] sm:text-[10px] font-bold tracking-[0.3em] mb-4 uppercase opacity-80">Practice Moments</div>
              <h2 className="text-xl sm:text-2xl font-serif text-clean-primary mb-8 sm:mb-8 tracking-tight">生活的正念瞬間</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Coffee />, label: "用餐時" },
                  { icon: <Sun />, label: "清晨醒來" },
                  { icon: <Moon />, label: "睡規前" },
                  { icon: <Leaf />, label: "通勤中" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 border border-clean-border rounded-xl">
                    <div className="text-clean-accent">{item.icon}</div>
                    <div className="font-bold text-clean-primary">{item.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-clean-secondary italic leading-relaxed mb-12">
                不只是坐著冥想，通勤、用餐、甚至在呼吸的瞬間，都能練習。
              </p>

              <div className="pt-10 border-t border-clean-border">
                <div className="text-clean-accent text-[9px] sm:text-[10px] font-bold tracking-[0.3em] mb-6 uppercase opacity-80">Online Learning</div>
                <h3 className="text-xl sm:text-2xl font-serif text-clean-primary mb-8 tracking-tight">正念數位學習平台</h3>
                <div className="space-y-6">
                  {[
                    { 
                      name: "正念數位學習平台", 
                      url: "https://mbsr.space/", 
                      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
                      type: "Website"
                    },
                    { 
                      name: "台灣正念工坊", 
                      url: "https://youtube.com/@mindfulnesstmc?si=Ih1bSZ66xJPWPV-6", 
                      img: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&q=80&w=600",
                      type: "YouTube"
                    },
                    { 
                      name: "MBSR 華人正念減壓中心", 
                      url: "https://youtube.com/@mbsr?si=Yuco2lRn9tNukbT_", 
                      img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=600",
                      type: "YouTube"
                    }
                  ].map((plat, idx) => (
                    <a 
                      key={idx}
                      href={plat.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 p-3 bg-clean-bg/40 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-clean-accent/20"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-lg border border-clean-border">
                        <img src={plat.img} alt={plat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-clean-accent mb-1">{plat.type}</div>
                        <div className="text-sm font-bold text-clean-primary group-hover:text-clean-accent transition-colors tracking-tight">
                          {plat.name}
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-clean-accent opacity-0 group-hover:opacity-100 transition-opacity mr-2" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Interaction Area */}
      <section className="py-24 px-4 bg-clean-bg">
        <div className="max-w-4xl mx-auto">
          <SectionHeading 
            title="互動提醒" 
            subtitle="點擊下方的重點，感受那些你平常可能忽略的細微知覺。" 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { id: "tip1", label: "感受地板", color: "border-clean-border", text: "text-clean-primary", content: "閉上眼睛 10 秒，單純地感受你的腳掌與地板接觸的力量感。這能幫助你「落地」回歸當下。", image: "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe?auto=format&fit=crop&q=80&w=1200" },
              { id: "tip2", label: "觀察氣息", color: "border-clean-border", text: "text-clean-primary", content: "注意到你正在呼吸嗎？不用調整它，只是看著它進來，又看著它離開。", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" },
              { id: "tip3", label: "聽聽環境", color: "border-clean-border", text: "text-clean-primary", content: "現在周遭有什麼聲音？冷氣聲、遠處車聲、呼吸聲。不論好壞，聽聽它們就好。", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200" },
              { id: "tip4", label: "檢視肩膀", color: "border-clean-border", text: "text-clean-primary", content: "你的肩膀現在是緊繃的嗎？試著在下一次吐氣時，讓它微微下沉一點點。", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" }
            ].map((tip) => (
              <button
                key={tip.id}
                onClick={() => setActiveModal(tip.id)}
                className="relative h-48 rounded-2xl overflow-hidden group border border-clean-border hover:border-clean-accent hover:shadow-lg transition-all text-left"
              >
                <img 
                  src={tip.image} 
                  alt={tip.label} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-clean-primary/95 via-clean-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 w-full flex justify-between items-end">
                  <div>
                    <div className="text-white/60 text-[8px] sm:text-[9px] font-bold tracking-[0.3em] uppercase mb-1">PRACTICE</div>
                    <div className="text-base sm:text-lg font-bold text-white font-serif tracking-tight">{tip.label}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white border border-white/30 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-24 px-4 bg-white border-t border-clean-border">
        <div className="max-w-xl mx-auto text-center">
          <SectionHeading 
            title="請給五星好評" 
            subtitle="此時此地的小費分享" 
          />
          
          <div className="flex justify-center gap-2 mb-12">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRating(star)}
                className="transition-colors"
              >
                <Star 
                  size={40} 
                  fill={star <= rating ? "#C19A6B" : "none"} 
                  className={star <= rating ? "text-clean-accent" : "text-clean-border"} 
                />
              </motion.button>
            ))}
          </div>

          <div className="bg-clean-bg/30 p-10 rounded-3xl border border-dashed border-clean-border mb-12">
            <h4 className="text-xl font-bold text-clean-primary mb-6 flex items-center justify-center gap-2">
              <Coins className="text-clean-accent" /> 小費的選擇
            </h4>
            <div className="flex gap-4 justify-center">
              {["Yes", "Yes"].map((choice, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTipChoice(choice);
                    setShowFeedbackThanks(true);
                  }}
                  className={`px-10 py-4 rounded-full font-bold transition-all ${
                    tipChoice === choice 
                    ? "bg-clean-accent text-white shadow-lg" 
                    : "bg-white text-clean-primary border border-clean-border hover:border-clean-accent"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showFeedbackThanks && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-clean-accent font-bold text-lg"
              >
                感謝您的慷慨分享！在正念中，每一份善念都是最棒的小費。
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer / CTA Section - Updated for Minimalism */}
      <footer className="bg-white py-24 px-4 border-t border-clean-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-serif text-clean-primary mb-4">領取核心結論</h2>
            <p className="text-sm sm:text-sm text-clean-secondary max-w-sm">讓正念成為您的日常習慣，從每天五分鐘開始。</p>
          </div>
          <button
            onClick={() => setFinalConclusion(true)}
            className="bg-clean-accent text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
          >
            獲取核心結論 <Sparkles size={20} />
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-clean-border/50 text-center">
          <p className="text-clean-secondary/60 text-sm tracking-widest uppercase">
            &copy; 2026 Mindfulness Intro. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Interaction Tips Modals */}
      {[
        { id: "tip1", title: "關於「落地」", content: "當你感到混亂時，連結感官（如觸覺）是最快平息焦慮的方式。腳踏實地，能給予大腦一股安全感的訊號。", image: "https://images.unsplash.com/photo-1454486837617-ce8e1ba5ebfe?auto=format&fit=crop&q=80&w=1200" },
        { id: "tip2", title: "呼吸是錨點", content: "呼吸永遠伴隨著你。它就像一個錨，在思緒像暴風雨一樣猛烈時，呼吸能將你穩固在當下的平靜港灣。", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" },
        { id: "tip3", title: "聽而不判", content: "練習不僅僅是專注，更是學會「客觀」。聽聲音時，試著不要標籤它是『好聽』或『吵鬧』，只是觀察聲波的起伏。", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200" },
        { id: "tip4", title: "身體的訊號", content: "身體常比大腦更早反應壓力。學會覺察細微的緊繃，即意味著你開始擁有了自我調節情緒的主動權。", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200" }
      ].map(tip => (
        <Modal 
          key={tip.id}
          isOpen={activeModal === tip.id} 
          onClose={() => setActiveModal(null)}
          title={tip.title}
        >
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-clean-border shadow-sm aspect-video mb-6">
              <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <p className="text-lg leading-relaxed">{tip.content}</p>
          </div>
        </Modal>
      ))}

      {/* Core Concepts Modals */}
      {coreConcepts.map(concept => (
        <Modal
          key={concept.id}
          isOpen={activeModal === concept.id}
          onClose={() => setActiveModal(null)}
          title={concept.title}
        >
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-clean-border shadow-sm aspect-video mb-6">
              <img src={concept.image} alt={concept.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            {concept.content}
          </div>
        </Modal>
      ))}

      {/* Digital Learning Platforms Modal */}
      <Modal
        isOpen={activeModal === "digital-learning"}
        onClose={() => setActiveModal(null)}
        title="正念數位學習平台"
      >
        <div className="space-y-8">
          {[
            {
              name: "正念數位學習平台 (mbsr.space)",
              image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
              desc: "由專業正念導師維護的線上學習平台，提供系統化的冥想錄音與正念引導，適合所有程度的練習者。",
              link: "https://mbsr.space/",
              type: "website"
            },
            {
              name: "台灣正念工坊 (YouTube)",
              image: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&q=80&w=1200",
              desc: "台灣重要的正念推廣機構，YouTube 頻道提供大量的專家講座、練習指導與實戰分享。",
              link: "https://youtube.com/@mindfulnesstmc?si=Ih1bSZ66xJPWPV-6",
              type: "youtube"
            },
            {
              name: "MBSR 華人正念減壓中心 (YouTube)",
              image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=1200",
              desc: "由胡君梅老師創辦，致力於正念減壓在全球華人圈的推廣。頻道包含豐富的練習引導與問答。",
              link: "https://youtube.com/@mbsr?si=Yuco2lRn9tNukbT_",
              type: "youtube"
            }
          ].map((platform, index) => (
            <div key={index} className="border-b border-clean-border last:border-0 pb-12 last:pb-0">
              <div className="mb-4">
                <h4 className="font-bold text-2xl text-clean-primary flex items-center gap-2">
                  {platform.type === 'youtube' ? <Youtube size={24} className="text-red-600" /> : <Globe size={24} className="text-clean-accent" />}
                  {platform.name}
                </h4>
              </div>
              
              <div className="mb-6 overflow-hidden rounded-xl border border-clean-border shadow-sm aspect-video">
                <img 
                  src={platform.image} 
                  alt={`${platform.name} preview`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-clean-secondary text-base leading-relaxed mb-8">{platform.desc}</p>
              
              <div className="flex flex-wrap gap-3">
                <a 
                  href={platform.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-clean-accent text-white rounded-full text-base font-bold hover:shadow-lg transition-all"
                >
                  {platform.type === 'youtube' ? <PlayCircle size={18} /> : <ExternalLink size={18} />} 
                  立即前往學習
                </a>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Digital Tools Modal */}
      <Modal
        isOpen={activeModal === "digital-tools"}
        onClose={() => setActiveModal(null)}
        title="推薦數位引導工具"
      >
        <div className="space-y-8">
          {[
            {
              name: "Insight Timer",
              featured: "https://images.unsplash.com/photo-1496101015113-2dc492a5d3f2?auto=format&fit=crop&q=80&w=1200",
              desc: "全球最大的免費冥想資源庫，擁有上萬種引導。內容包含正念、睡眠與情緒調節。",
              web: "https://insighttimer.com/",
              ios: "https://apps.apple.com/tw/app/insight-timer-meditate-sleep/id337472899",
              android: "https://play.google.com/store/apps/details?id=com.spotlightsix.zentimerlite2"
            },
            {
              name: "Peace",
              featured: "https://images.unsplash.com/photo-1554244933-d876eda6b8ff?auto=format&fit=crop&q=80&w=1200",
              desc: "Peace收錄了超過200種冥想練習課程，並會根據新手 and 已經有冥想經驗的使用者推薦不同的訓練課程，其中冥想課程則又分為基礎課程、療癒課程、情感課程、意識指引四大類別，幫助使用者依照自己想達成的目標選擇不一樣的練習。",
              web: "https://peace-app.com/",
              ios: "https://apps.apple.com/tw/app/peace-breathe-relax-calm/id6758351591",
              android: "https://play.google.com/store/apps/details?id=com.peace.ahc&hl=zh_TW"
            },
            {
              name: "Tide (潮汐)",
              featured: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=1200",
              desc: "將自然環境音與冥想結合。提供番茄鐘、睡眠與正念練習，設計極致簡潔優雅。",
              web: "https://tide.fm/",
              ios: "https://apps.apple.com/cn/app/%E6%BD%AE%E6%B1%90-%E7%9D%A1%E7%9C%A0%E7%9B%91%E6%B5%8B-%E5%8A%A9%E7%9C%A0-%E6%A2%A6%E8%AF%9D%E6%89%93%E9%BC%BE-%E5%86%A5%E6%83%B3-%E7%99%BD%E5%99%AA%E9%9F%B3-hrv%E5%8E%8B%E5%8A%9B/id1077776989",
              android: "https://play.google.com/store/apps/details?id=io.moreless.tide&hl=zh_TW"
            }
          ].map((app, index) => (
            <div key={index} className="border-b border-clean-border last:border-0 pb-12 last:pb-0">
              <div className="mb-4">
                <h4 className="font-bold text-2xl text-clean-primary">{app.name}</h4>
              </div>
              
              <div className="mb-6 overflow-hidden rounded-xl border border-clean-border shadow-sm aspect-video">
                <img 
                  src={app.featured} 
                  alt={`${app.name} preview`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-clean-secondary text-base leading-relaxed mb-8">{app.desc}</p>
              
              <div className="flex flex-wrap gap-3">
                <a 
                  href={app.web} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-clean-accent text-clean-accent rounded-full text-sm font-bold hover:bg-clean-accent/5 transition-colors shadow-sm"
                >
                  <ExternalLink size={16} /> 官方網站
                </a>
                <a 
                  href={app.ios} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <Apple size={16} /> App Store
                </a>
                <a 
                  href={app.android} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 text-neutral-800 rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors border border-neutral-300 shadow-sm"
                >
                  <Smartphone size={16} /> Google Play
                </a>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Classic Books Modal */}
      <Modal
        isOpen={activeModal === "books"}
        onClose={() => setActiveModal(null)}
        title="推薦經典書籍"
      >
        <div className="space-y-8">
          {[
            {
              title: "《正念療癒力》",
              author: "喬．卡巴金",
              desc: "正念減壓（MBSR）的開山之作。詳盡介紹了如何透過正念面對壓力、疼痛與疾病，是理解正念醫療應用的必讀經典。",
              link: "https://www.books.com.tw/products/0010613064?srsltid=AfmBOoptpqhirghzjlKmejxd4JyxPK3wXSFyyWNoZHSuDEC9Mv8nfsP5",
              image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200"
            },
            {
              title: "《是情緒糟，不是你很糟》",
              author: "馬克．威萊斯等",
              desc: "針對憂鬱與負面情緒的內觀指南。透過心理學與正念的結合，幫助讀者穿透過去情緒迷霧，找回內心的平靜。",
              link: "https://www.psygarden.com.tw/book.php?func=visit&bookid=MjAxMDAzMDUxMjEwMjU=&deepread=7",
              image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200"
            },
            {
              title: "《正念：八週靜心計畫》",
              author: "馬克．威廉斯、丹尼．潘曼",
              desc: "非常實用的正念入門書。提供清晰的八週練習架構，適合想在忙碌生活中循序漸進建立冥想習慣的人。",
              link: "https://www.eslite.com/product/1001122732711980?srsltid=AfmBOopLFmrjO6Eebxly6sbFdndFXOHvfGLMuBYeS1-xndxWwDgWGNRc",
              image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200"
            }
          ].map((book, index) => (
            <div key={index} className="border-b border-clean-border last:border-0 pb-10 last:pb-0">
              <div className="mb-4">
                <h4 className="font-bold text-xl text-clean-primary">{book.title}</h4>
                <div className="text-sm text-clean-accent font-medium mt-1">作者：{book.author}</div>
              </div>
              
              <div className="mb-6 overflow-hidden rounded-xl border border-clean-border shadow-sm flex justify-center bg-gray-50">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="h-80 w-auto object-contain hover:scale-105 transition-transform duration-700 p-2"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-clean-secondary text-sm leading-relaxed mb-6">
                {book.desc}
              </p>
              
              <a 
                href={book.link} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-clean-accent text-white rounded-full text-sm font-bold hover:shadow-lg transition-all"
              >
                <ExternalLink size={16} /> 查看詳情
              </a>
            </div>
          ))}
        </div>
      </Modal>

      {/* Final Conclusion Alert */}
      <AnimatePresence>
        {finalConclusion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-clean-primary/60 backdrop-blur-sm"
              onClick={() => setFinalConclusion(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-12 rounded-2xl shadow-2xl max-w-lg text-center"
            >
              <h4 className="text-2xl font-serif font-bold text-clean-primary mb-6">核心結論</h4>
              <div className="text-xl text-clean-secondary leading-relaxed mb-10 space-y-4">
                <p>「在當下，不帶評判地覺察與接納所有身心經驗，關注在我們的此時此刻。」</p>
                <p className="text-base opacity-70">正念不代表問題會消失，而是讓我們擁有更大的容器去承載生命中的一切。</p>
              </div>
              <button 
                onClick={() => setFinalConclusion(false)}
                className="bg-clean-accent text-white px-10 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                關閉視窗
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
