import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPolls, deletePoll, publishPoll, duplicatePoll } from '../pollSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiBarChart2, FiShare2, FiTrash2, FiEdit,
  FiEye, FiZap, FiSearch, FiCopy
} from 'react-icons/fi';
import { SkeletonList } from '../../../components/loaders/SkeletonCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate, timeUntilExpiry } from '../../../utils/formatters';
import { buildPollUrl, copyToClipboard } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { polls, loading } = useSelector((s) => s.polls);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this poll? This cannot be undone.')) return;
    await dispatch(deletePoll(id));
    toast.success('Poll deleted');
  };

  const handlePublish = async (id) => {
    const res = await dispatch(publishPoll(id));
    if (publishPoll.fulfilled.match(res)) toast.success('Poll results published!');
    else toast.error('Failed to publish');
  };

  const handleDuplicate = async (id) => {
    const res = await dispatch(duplicatePoll(id));
    if (duplicatePoll.fulfilled.match(res)) toast.success('Poll duplicated!');
    else toast.error('Failed to duplicate');
  };

  const handleShare = async (pollCode) => {
    const url = buildPollUrl(pollCode);
    const ok = await copyToClipboard(url);
    toast.success(ok ? 'Link copied to clipboard!' : url);
  };

  const filteredPolls = useMemo(() => {
    return polls.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'active'
          ? p.status === 'active'
          : filter === 'expired'
          ? p.status === 'expired'
          : filter === 'published'
          ? p.isPublished
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [polls, searchTerm, filter]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#f5f5f5]">My Polls</h1>
          <p className="text-[#6b6b6b] mt-1 text-[14px]">Manage and monitor your polls</p>
        </div>

        <Link to="/polls/create" className="w-full md:w-auto">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition font-bold text-[14px] shadow-lg shadow-cyan-500/20">
            <FiPlus /> Create Poll
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Polls', value: polls.length, color: 'text-cyan-400' },
          { label: 'Active', value: polls.filter((p) => p.status === 'active').length, color: 'text-emerald-400' },
          {
            label: 'Total Responses',
            value: polls.reduce((s, p) => s + (p.totalResponses || 0), 0),
            color: 'text-cyan-500'
          },
          { label: 'Published', value: polls.filter((p) => p.isPublished).length, color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#151515] border border-white/[0.06] rounded-2xl p-5">
            <p className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
          <input
            type="text"
            placeholder="Search polls by title..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/[0.06] text-[#f5f5f5] placeholder:text-[#555] outline-none focus:border-[#3b82f6]/40 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
          {['all', 'active', 'expired', 'published'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-[13px] font-bold capitalize transition-all border shrink-0 ${
                filter === f
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-[#1a1a1a] border-white/[0.06] text-[#6b6b6b] hover:text-[#f5f5f5] hover:border-white/[0.15]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <SkeletonList count={3} />
      ) : filteredPolls.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-2xl text-center py-20 px-6 flex flex-col items-center">
          <FiZap className="text-4xl text-cyan-500 mb-4" />
          <h3 className="text-xl font-bold text-[#f5f5f5] mb-2">No polls found</h3>
          <p className="text-[#6b6b6b] mb-6 text-[14px]">Create your first poll to get started</p>
          <Link to="/polls/create" className="w-full sm:w-auto">
            <button className="w-full px-8 py-3 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition font-bold text-[14px]">
              Create Poll
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPolls.map((poll) => (
              <motion.div
                key={poll._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#151515] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-colors"
              >
                <div className="flex justify-between flex-wrap gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold text-[#f5f5f5] truncate">
                        {poll.title}
                      </h3>

                      <Badge status={poll.status} />

                      {poll.isQuiz && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                          Quiz
                        </span>
                      )}

                      {poll.isPublished && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border bg-amber-500/10 text-amber-400 border-amber-500/20">
                          Published
                        </span>
                      )}
                    </div>

                    <div className="text-[13px] text-[#6b6b6b] flex flex-wrap gap-4">
                      <span>{poll.questions?.length || 0} questions</span>
                      <span className="text-emerald-400 font-medium">
                        {poll.totalResponses || 0} responses
                      </span>
                      <span>Created {formatDate(poll.createdAt)}</span>

                      {poll.expiresAt && (
                        <span className={timeUntilExpiry(poll.expiresAt) === 'Expired'
                          ? 'text-red-400'
                          : 'text-amber-400'}>
                          ⏱ {timeUntilExpiry(poll.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 min-w-0 w-full md:w-auto">
                    <button
                      onClick={() => handleShare(poll.pollCode)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-white/[0.06] hover:bg-white/10 transition text-[#a3a3a3] hover:text-white"
                      title="Share"
                    >
                      <FiShare2 size={15} />
                    </button>

                    <button
                      onClick={() => handleDuplicate(poll._id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-white/[0.06] hover:bg-white/10 transition text-[#a3a3a3] hover:text-white"
                      title="Duplicate"
                    >
                      <FiCopy size={15} />
                    </button>

                    <Link
                      to={`/polls/${poll._id}/analytics`}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-white/[0.06] hover:bg-white/10 transition text-[#a3a3a3] hover:text-white"
                      title="Analytics"
                    >
                      <FiBarChart2 size={15} />
                    </Link>

                    <Link
                      to={`/polls/${poll._id}/edit`}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-white/[0.06] hover:bg-white/10 transition text-[#a3a3a3] hover:text-white"
                      title="Edit"
                    >
                      <FiEdit size={15} />
                    </Link>

                    {!poll.isPublished && poll.totalResponses > 0 && (
                      <button
                        onClick={() => handlePublish(poll._id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 transition"
                        title="Publish"
                      >
                        <FiEye size={15} />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(poll._id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;