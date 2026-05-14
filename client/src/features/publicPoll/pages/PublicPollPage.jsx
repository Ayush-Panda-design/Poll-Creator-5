import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import { connectSocket } from '../../../socket/socket';
import { SOCKET_EVENTS } from '../../../utils/constants';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import Logo from '../../../components/ui/Logo';

const PublicPollPage = () => {
  const { pollCode } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await api.get(`/polls/public/${pollCode}`);
        setPoll(res.data.poll);
      } catch (err) {
        if (err.response?.status === 410) setExpired(true);
        else setError(err.response?.data?.message || 'Poll not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [pollCode]);

  useEffect(() => {
    if (!poll) return;

    const socket = connectSocket();
    socket.emit(SOCKET_EVENTS.JOIN_POLL, poll._id);

    socket.on(SOCKET_EVENTS.PARTICIPANT_COUNT, ({ count }) =>
      setParticipants(count)
    );

    socket.on(SOCKET_EVENTS.POLL_EXPIRED, () => setExpired(true));

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, poll._id);
      socket.off(SOCKET_EVENTS.PARTICIPANT_COUNT);
      socket.off(SOCKET_EVENTS.POLL_EXPIRED);
    };
  }, [poll]);

  const handleSelect = (qIdx, option) =>
    setAnswers((a) => ({ ...a, [qIdx]: option }));

  const handleSubmit = async () => {
    const missing = poll.questions
      .map((q, i) => ({ ...q, index: i }))
      .filter((q) => q.required && !answers[q.index]);

    if (missing.length) {
      toast.error(`Please answer: "${missing[0].question}"`);
      return;
    }

    const payload = poll.questions.map((_, qIdx) => ({
      questionIndex: qIdx,
      selectedOption: answers[qIdx] || null,
    }));

    try {
      setSubmitting(true);
      const res = await api.post(`/responses/${poll._id}`, { answers: payload });

      if (res.data.quizResults) setQuizResults(res.data.quizResults);
      setSubmitted(true);

      toast.success('Response submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (!loading && poll && poll.isQuiz && !user)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="card text-center max-w-md w-full">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Login Required
          </h2>
          <p className="text-gray-400 mb-6">
            You must be signed in to participate in this quiz.
          </p>
          <Link to="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      </div>
    );

  if (expired)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="card text-center max-w-md w-full">
          <div className="text-4xl mb-4">⏰</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Poll Expired
          </h2>
          <p className="text-gray-400">
            This poll is no longer accepting responses.
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="card text-center max-w-md w-full">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Poll Not Found
          </h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="global-bg">
        <div className="global-bg-glow" />
        <div className="global-bg-grid" />
      </div>

      {/* Header */}
      <header className="border-b border-surface-border py-4 px-6 relative z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          {participants > 0 && (
            <span className="text-xs text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {participants} viewing
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              {poll.title}
            </h1>
            {poll.description && (
              <p className="text-gray-400">{poll.description}</p>
            )}
            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
              {poll.isAnonymous && <span>🔓 Anonymous</span>}
              <span>
                {poll.questions?.length} question
                {poll.questions?.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {poll.questions?.map((q, qIdx) => (
              <motion.div
                key={qIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    <span className="text-gray-400 mr-2">{qIdx + 1}.</span>
                    {q.question}
                  </h3>
                  {q.required && (
                    <span className="text-xs text-red-400">Required</span>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((option, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, option)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 group ${
                        answers[qIdx] === option
                          ? 'border-orange-500/50 bg-orange-500/10 text-white'
                          : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex-shrink-0 transition-all ${
                          answers[qIdx] === option
                            ? 'bg-orange-500 border-orange-500 scale-110 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                            : 'border-gray-500'
                        }`}
                      />
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit */}
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              loading={submitting}
              className="w-full"
              size="lg"
            >
              Submit Response
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PublicPollPage;