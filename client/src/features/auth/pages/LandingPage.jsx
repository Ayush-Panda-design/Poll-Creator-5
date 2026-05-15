import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiBarChart2,
  FiShare2,
  FiUsers,
  FiZap,
  FiShield,
  FiClock,
  FiLayers,
  FiCheckCircle,
  FiStar,
} from 'react-icons/fi';
import { HiOutlineChartBar } from 'react-icons/hi2';
import Logo from '../../../components/ui/Logo';

const features = [
  {
    icon: <FiZap />,
    title: 'Realtime Polling',
    desc: 'Votes update instantly across every connected device.',
  },
  {
    icon: <FiShare2 />,
    title: 'Easy Sharing',
    desc: 'Share polls with links, QR codes, or invite rooms.',
  },
  {
    icon: <FiBarChart2 />,
    title: 'Live Analytics',
    desc: 'Track audience engagement beautifully in realtime.',
  },
  {
    icon: <FiUsers />,
    title: 'Anonymous Voting',
    desc: 'Collect honest feedback without login friction.',
  },
];

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Startup Founder',
    text: 'The smoothest realtime polling experience we have ever used.',
  },
  {
    name: 'Sophia Lee',
    role: 'Community Manager',
    text: 'Our audience engagement increased massively after using Votora.',
  },
];

const gallery = [
  {
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop',
    title: 'Interactive Classrooms',
    desc: 'Run engaging live quizzes and instant feedback sessions.',
  },
  {
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop',
    title: 'Community Discussions',
    desc: 'Create modern audience interaction for communities & creators.',
  },
  {
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop',
    title: 'Startup & Team Decisions',
    desc: 'Collect realtime opinions during meetings and live events.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  // TYPEWRITER
  const words = [
    'Feels Instant',
    'Looks Premium',
    'Built for Realtime',
    'Made for Communities',
  ];

  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));

        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));

        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 40 : 85);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  // DYNAMIC POLL
  const [polls, setPolls] = useState([
    { name: 'JavaScript', votes: 78 },
    { name: 'Python', votes: 63 },
    { name: 'Java', votes: 42 },
    { name: 'C++', votes: 29 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPolls((prev) =>
        prev.map((poll) => {
          const random = Math.floor(Math.random() * 5);

          let updatedVotes = poll.votes + random;

          if (updatedVotes > 100) updatedVotes = 40;

          return {
            ...poll,
            votes: updatedVotes,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // NAVBAR SCROLL
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-[#121212] text-white overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[620px] h-[320px] bg-[#3b82f6]/[0.07] blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)',
            backgroundSize: '90px 90px',
          }}
        />
      </div>

      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
            ? 'bg-[#121212]/90 backdrop-blur-xl border-b border-[#333333]'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo />

            {/* nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'Gallery', 'Reviews'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[13px] text-[#6b6b6b] hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-[13px] text-[#6b6b6b] hover:text-white transition-colors px-3 py-1.5"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-[#f5f5f5] text-[#0a0a0a] text-[13px] font-semibold hover:bg-white transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-[72px]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#333333] bg-[#1a1a1a] text-[12px] text-[#7b7b7b] mb-8 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Modern realtime polling platform
              </div>

              {/* heading */}
              <h1 className="text-[56px] sm:text-[68px] lg:text-[78px] font-bold leading-[0.92] tracking-[-0.045em] text-[#f5f5f5] mb-8">
                Polls That
                <span className="block bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent min-h-[1.08em]">
                  {text}
                  <span className="animate-pulse opacity-50 text-[#3b82f6]">|</span>
                </span>
              </h1>

              {/* desc */}
              <p className="text-[#727272] text-[17px] leading-relaxed max-w-xl mb-10">
                Votora helps creators, startups, educators, and communities run
                beautiful live polls with immersive realtime interaction.
              </p>

              {/* buttons */}
              <div className="flex items-center gap-3 flex-wrap mb-14">
                <button
                  onClick={() => navigate('/signup')}
                  className="group px-6 py-3 rounded-xl bg-[#f5f5f5] text-[#0a0a0a] text-[14px] font-semibold flex items-center gap-2 hover:bg-white transition-colors"
                >
                  Start Free

                  <FiArrowRight className="group-hover:translate-x-0.5 transition-transform text-[13px]" />
                </button>

                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl border border-[#333333] bg-[#1a1a1a] hover:bg-[#222] transition-colors text-[14px] text-[#d0d0d0]"
                >
                  Sign In
                </Link>
              </div>

              {/* stats */}
              <div className="flex items-center gap-10 flex-wrap">
                {[
                  ['1M+', 'Votes processed'],
                  ['50K+', 'Live sessions'],
                  ['99.9%', 'Uptime reliability'],
                ].map(([val, label]) => (
                  <div key={label}>
                    <h3 className="text-[28px] font-bold tracking-[-0.03em] text-[#f5f5f5]">
                      {val}
                    </h3>

                    <p className="text-[#555] text-[13px] mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT - MOBILE DISPLAY WITH GLASSMORPHISM */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: 'easeInOut',
                }}
                className="relative w-[320px] rounded-[42px] border-[1.5px] border-[#444444] bg-[#151515] overflow-hidden backdrop-blur-2xl"
                style={{
                  boxShadow:
                    '0 40px 100px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* GLASSMORPHIC BORDER OVERLAY (Top Right Focus) */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                
                {/* top speaker/notch area */}
                <div className="flex justify-center pt-4 pb-2 relative z-10">
                  <div className="w-20 h-[4px] rounded-full bg-[#333333] border border-white/[0.05]" />
                </div>

                {/* content */}
                <div className="px-5 pb-8 pt-3 relative z-10">
                  {/* head */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[10px] text-[#555] uppercase tracking-widest font-medium mb-1">
                        Live Poll
                      </p>

                      <h2 className="text-[15px] font-semibold text-[#f5f5f5]">
                        Favourite Language?
                      </h2>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-[#444444] backdrop-blur-md flex items-center justify-center shadow-lg">
                      <HiOutlineChartBar className="text-[#3b82f6] text-[14px]" />
                    </div>
                  </div>

                  {/* bars */}
                  <div className="space-y-3">
                    {polls.map((option, i) => {
                      const isTop = i === 0;

                      return (
                        <motion.div
                          key={option.name}
                          layout
                          className="rounded-xl border border-[#333333] bg-white/[0.02] p-3.5 backdrop-blur-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p
                              className={`text-[12px] font-medium ${isTop
                                  ? 'text-[#f5f5f5]'
                                  : 'text-[#6b6b6b]'
                                }`}
                            >
                              {option.name}
                            </p>

                            <p
                              className={`text-[11px] font-semibold ${isTop ? 'text-[#3b82f6]' : 'text-[#444]'
                                }`}
                            >
                              {option.votes}%
                            </p>
                          </div>

                          <div className="h-[5px] rounded-full bg-[#222] overflow-hidden">
                            <motion.div
                              animate={{ width: `${option.votes}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{
                                background: isTop
                                  ? 'linear-gradient(90deg,#2563eb,#3b82f6)'
                                  : 'rgba(255,255,255,0.08)',
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* live badge with glass look */}
                  <div className="mt-5 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#333333] bg-white/[0.02] backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />

                    <span className="text-[10px] text-[#666] font-medium">
                      Results updating live
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative max-w-7xl mx-auto px-6 md:px-8 py-28"
      >
        <div className="w-full h-px bg-[#333333] mb-24" />

        <div className="text-center mb-16">
          <h2 className="text-[36px] md:text-[46px] font-bold tracking-[-0.03em] text-[#f5f5f5] mb-4">
            Built for modern live engagement
          </h2>

          <p className="text-[#6b6b6b] max-w-xl mx-auto text-[16px] leading-relaxed">
            Powerful realtime tools designed for classrooms, creators,
            communities, and modern events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#333333] rounded-2xl overflow-hidden border border-[#333333]">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-[#151515] p-7 hover:bg-[#1a1a1a] transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#333333] flex items-center justify-center text-[#3b82f6] text-[15px] mb-5">
                {f.icon}
              </div>

              <h3 className="text-[15px] font-semibold text-[#f5f5f5] mb-2">
                {f.title}
              </h3>

              <p className="text-[#555] leading-relaxed text-[13px]">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IMAGE SHOWCASE */}
      <section
        id="gallery"
        className="max-w-7xl mx-auto px-6 md:px-8 pb-28"
      >
        <div className="flex items-end justify-between mb-14 flex-wrap gap-5">
          <div>
            <p className="text-[#3b82f6] text-[13px] font-medium mb-3 tracking-wide uppercase">
              Real experiences
            </p>

            <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.04em] leading-none">
              Polling that feels
              <br />
              natural & immersive
            </h2>
          </div>

          <p className="max-w-md text-[#666] leading-relaxed text-[15px]">
            Designed for educators, creators, startups, and communities who
            want modern audience interaction without complexity.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {gallery.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-[#333333] bg-[#1a1a1a]">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[420px] object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 p-7">
                  <h3 className="text-[24px] font-semibold tracking-[-0.03em] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-[14px] text-[#c8c8c8] leading-relaxed max-w-[280px]">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOWER SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-28">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* left */}
          <div className="space-y-3">
            {[
              {
                icon: <FiShield />,
                title: 'Secure Infrastructure',
                desc: 'Protected realtime architecture built for reliability.',
              },
              {
                icon: <FiClock />,
                title: 'Instant Sync',
                desc: 'Every interaction updates instantly without refresh.',
              },
              {
                icon: <FiLayers />,
                title: 'Multiple Poll Types',
                desc: 'MCQs, ratings, quizzes and audience feedback.',
              },
              {
                icon: <FiCheckCircle />,
                title: 'Minimal Experience',
                desc: 'Modern interface focused on clarity and speed.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#333333] bg-[#151515] p-6 flex gap-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="min-w-[42px] h-[42px] rounded-xl bg-[#1a1a1a] border border-[#333333] flex items-center justify-center text-[#3b82f6] text-[14px] mt-0.5">
                  {f.icon}
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold text-[#f5f5f5] mb-1.5">
                    {f.title}
                  </h3>

                  <p className="text-[#555] text-[13px] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* reviews */}
          <div id="reviews" className="space-y-3">
            {testimonials.map((feedback, index) => (
              <motion.div
                key={feedback.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#333333] bg-[#151515] p-7"
              >
                <div className="flex items-center gap-0.5 text-[#3b82f6] mb-5">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className="text-[11px]" />
                  ))}
                </div>

                <p className="text-[15px] leading-relaxed text-[#b0b0b0] mb-6">
                  "{feedback.text}"
                </p>

                <div>
                  <h4 className="text-[13px] font-semibold text-[#f5f5f5]">
                    {feedback.name}
                  </h4>

                  <p className="text-[#555] text-[12px] mt-0.5">
                    {feedback.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pb-28">
        <div className="relative rounded-[32px] border border-[#333333] bg-[#151515] px-10 py-20 overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent" />

          <h2 className="text-[38px] md:text-[52px] font-bold tracking-[-0.04em] text-[#f5f5f5] mb-5">
            Start your first live poll today
          </h2>

          <p className="text-[#6b6b6b] max-w-xl mx-auto mb-10 text-[16px] leading-relaxed">
            Create immersive realtime polls for your audience, classroom,
            startup, or community in minutes.
          </p>

          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5f5f5] text-[#0a0a0a] text-[14px] font-semibold hover:bg-white transition-colors group"
          >
            Create Poll

            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform text-[13px]" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#333333]">
        <div className="max-w-6xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 rounded-md bg-[#1a1a1a] border border-[#333333] flex items-center justify-center">
              <span className="text-[9px] font-black text-[#f5f5f5]">V</span>

              <div className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#06b6d4]" />
            </div>

            <span className="text-[13px] text-[#444]">Votora</span>
          </div>

          <p className="text-[12px] text-[#3a3a3a]">
            © 2026 Votora. Built for modern realtime engagement.
          </p>

          <nav className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Status'].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] text-[#444] hover:text-[#8b8b8b] transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;