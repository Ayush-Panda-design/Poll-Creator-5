import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPolls, deletePoll, publishPoll, duplicatePoll } from '../pollSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiBarChart2, FiShare2, FiTrash2, FiEdit, FiEye, FiZap, FiSearch, FiCopy } from 'react-icons/fi';
import { SkeletonList } from '../../../components/loaders/SkeletonCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate, timeUntilExpiry } from '../../../utils/formatters';
import { buildPollUrl, copyToClipboard } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { polls, loading } = useSelector((s) => s.polls);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, expired, published

  useEffect(() => { dispatch(fetchPolls()); }, []);

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
    const ok  = await copyToClipboard(url);
    toast.success(ok ? 'Link copied to clipboard!' : url);
  };

  const filteredPolls = useMemo(() => {
    return polls.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'active' ? p.status === 'active' :
        filter === 'expired' ? p.status === 'expired' :
        filter === 'published' ? p.isPublished : true;
      return matchesSearch && matchesFilter;
    });
  }, [polls, searchTerm, filter]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Polls</h1>
          <p className="text-gray-400 mt-1">Manage and monitor your polls</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/polls/create">
            <Button icon={<FiPlus />}>Create Poll</Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Polls',     value: polls.length,                                     color: 'text-brand-400' },
          { label: 'Active',          value: polls.filter((p) => p.status === 'active').length, color: 'text-emerald-400' },
          { label: 'Total Responses', value: polls.reduce((s, p) => s + (p.totalResponses || 0), 0), color: 'text-purple-400' },
          { label: 'Published',       value: polls.filter((p) => p.isPublished).length,        color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass p-5">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search polls by title..." 
            className="input-field pl-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['all', 'active', 'expired', 'published'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                filter === f 
                  ? 'bg-brand-600 border-brand-500 text-white' 
                  : 'bg-surface-card border-surface-border text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Poll list */}
      {loading ? (
        <SkeletonList count={3} />
      ) : filteredPolls.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-400 text-3xl">
            <FiZap />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || filter !== 'all' ? 'No matching polls found' : 'No polls yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filter !== 'all' ? 'Try adjusting your search or filters.' : 'Create your first poll and start collecting responses.'}
          </p>
          {!(searchTerm || filter !== 'all') && (
            <Link to="/polls/create"><Button>Create your first poll</Button></Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPolls.map((poll, i) => (
              <motion.div
                key={poll._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
                className="card hover:border-brand-500/30 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="font-semibold text-white text-lg truncate">{poll.title}</h3>
                      <Badge status={poll.status} />
                      {poll.isPublished && <span className="badge badge-published">Published</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                      <span>{poll.questions?.length || 0} questions</span>
                      <span className="text-emerald-400 font-medium">{poll.totalResponses || 0} responses</span>
                      <span>Created {formatDate(poll.createdAt)}</span>
                      {poll.expiresAt && (
                        <span className={timeUntilExpiry(poll.expiresAt) === 'Expired' ? 'text-red-400' : 'text-amber-400'}>
                          ⏱ {timeUntilExpiry(poll.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => handleShare(poll.pollCode)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Copy Link">
                      <FiShare2 />
                    </button>
                    <button onClick={() => handleDuplicate(poll._id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Duplicate">
                      <FiCopy />
                    </button>
                    <Link to={`/polls/${poll._id}/analytics`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Analytics">
                      <FiBarChart2 />
                    </Link>
                    <Link to={`/polls/${poll._id}/edit`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Edit">
                      <FiEdit />
                    </Link>
                    {!poll.isPublished && poll.totalResponses > 0 && (
                      <button onClick={() => handlePublish(poll._id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 transition-all" title="Publish Results">
                        <FiEye />
                      </button>
                    )}
                    <button onClick={() => handleDelete(poll._id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                      <FiTrash2 />
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

