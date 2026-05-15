import { motion } from 'framer-motion';
import { 
  FiZap, FiPlusCircle, FiShare2, FiBarChart2, 
  FiLock, FiClock, FiCheckCircle, FiUserCheck, FiTarget, 
  FiTrendingUp, FiLayers, FiAward
} from 'react-icons/fi';

const HelpPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const guides = [
    {
      id: 'creation',
      title: 'How to Make a Poll',
      icon: <FiPlusCircle />,
      color: 'text-cyan-400',
      description: 'Creating a poll is quick and easy. Just follow these 3 steps:',
      details: [
        'Step 1: Give your poll a name and a short description.',
        'Step 2: Add your questions. You can make them mandatory so nobody skips them.',
        'Step 3: Choose if you want the results to be private or public.',
      ]
    },
    {
      id: 'quiz',
      title: 'How Quizzes Work',
      icon: <FiAward />,
      color: 'text-amber-400',
      description: 'Turn your poll into a fun test with right and wrong answers.',
      details: [
        'Pick the "Right Answer" for each question while creating.',
        '🔑 Important: To keep things fair, everyone must Log In to take a quiz.',
        'People will see their score immediately after they finish.',
      ]
    },
    {
      id: 'voting',
      title: 'How to Vote',
      icon: <FiUserCheck />,
      color: 'text-emerald-400',
      description: 'Answering is simple for your audience.',
      details: [
        'Just click on the option you like best.',
        'Your choice is saved as you go. Click "Submit" at the end.',
        'The app will tell you if you missed any important questions.',
      ]
    },
    {
      id: 'analytics',
      title: 'Viewing Results',
      icon: <FiTrendingUp />,
      color: 'text-indigo-400',
      description: 'See what everyone is thinking in real-time.',
      details: [
        'Charts update instantly as soon as someone votes.',
        'Live Counter: See how many people are looking at the poll right now.',
        'Download for Excel: Save all responses to your computer with one click.',
      ]
    },
    {
      id: 'anticheat',
      title: 'Anti-Cheat Mode',
      icon: <FiLock />,
      color: 'text-rose-400',
      description: 'Keep your quizzes fair and honest.',
      details: [
        'If enabled, the quiz will auto-submit if a user leaves the tab.',
        'Users will be blocked from answering more if they try to cheat.',
        'Works perfectly for school tests or competitive contests.',
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold mb-6">
          <FiZap className="animate-pulse" /> HELP CENTER
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Everything you need to <span className="text-cyan-500">get started</span>.
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Votora is a simple tool to help you collect feedback and run fun quizzes in real-time.
        </p>
      </motion.div>

      {/* Grid of Guides */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
      >
        {guides.map((guide) => (
          <motion.div 
            key={guide.id}
            variants={itemVariants}
            className="group p-8 rounded-3xl bg-[#151515] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-500"
          >
            <div className={`text-3xl mb-6 ${guide.color} bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
              {guide.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{guide.title}</h3>
            <p className="text-gray-400 mb-8 font-medium">{guide.description}</p>
            
            <ul className="space-y-4">
              {guide.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <FiCheckCircle className="mt-1 flex-shrink-0 text-cyan-500" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Uniqueness Section */}
      <div className="bg-cyan-500/5 rounded-[40px] p-10 md:p-20 border border-cyan-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-bold text-white mb-6">Why use Votora?</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We made Votora to be fast, safe, and fun. Here is what makes us special:
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="text-cyan-400 text-xl font-bold flex items-center gap-2">
                <FiClock /> Super Fast
              </div>
              <p className="text-gray-500 text-sm">When someone votes, everyone sees the results change instantly. No waiting, no refreshing.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-emerald-400 text-xl font-bold flex items-center gap-2">
                <FiLock /> Built-in Safety
              </div>
              <p className="text-gray-500 text-sm">We protect your polls from spam and hackers so your data stays clean and honest.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-purple-400 text-xl font-bold flex items-center gap-2">
                <FiTarget /> Choose One
              </div>
              <p className="text-gray-500 text-sm">To keep things simple, users pick exactly one answer for each question. No confusing multiple choices.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-pink-400 text-xl font-bold flex items-center gap-2">
                <FiLayers /> Big Screen Ready
              </div>
              <p className="text-gray-500 text-sm">If you are in a meeting, use our "Presentation Mode" to show your results on a large projector or screen.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-20 text-center text-gray-600 text-sm flex flex-col items-center gap-4">
        <p>© 2026 Votora Polling Platform • All rights reserved</p>
        <div className="flex gap-6 uppercase tracking-widest font-black text-[10px]">
          <span className="text-cyan-500/50 hover:text-cyan-400 cursor-pointer transition">Privacy Policy</span>
          <span className="text-cyan-500/50 hover:text-cyan-400 cursor-pointer transition">Terms of Service</span>
          <span className="text-cyan-500/50 hover:text-cyan-400 cursor-pointer transition">API Docs</span>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
