import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiBriefcase, FiBarChart2, FiShield, 
  FiLock, FiTrash2, FiLogOut, FiCheckCircle, FiActivity,
  FiZap, FiAward, FiClock, FiEdit3, FiCamera
} from 'react-icons/fi';
import { updateProfile, logoutUser, uploadAvatar } from '../authSlice';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { getImageUrl } from '../../../utils/helpers';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { user, loading } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    occupation: user?.occupation || ''
  });

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/profile/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(profileForm));
    if (updateProfile.fulfilled.match(res)) {
      toast.success('Profile updated!');
      setIsEditing(false);
    } else {
      toast.error(res.payload || 'Failed to update profile');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error('File size must be less than 2MB');
    }

    const res = await dispatch(uploadAvatar(file));
    if (uploadAvatar.fulfilled.match(res)) {
      toast.success('Avatar updated!');
    } else {
      toast.error(res.payload || 'Failed to upload avatar');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      await api.patch('/users/profile/password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: This will permanently delete your account and all your polls. This action cannot be undone. Are you sure?')) {
      return;
    }
    try {
      await api.delete('/users/profile');
      toast.success('Account deleted');
      dispatch(logoutUser());
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-brand-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl overflow-hidden border-4 border-surface-border group-hover:border-brand-500 transition-all">
            {user?.avatar ? (
               <img src={getImageUrl(user.avatar)} alt={user?.name} className="w-full h-full object-cover" />
            ) : user?.name?.[0]?.toUpperCase()}
            
            {/* Overlay for upload */}
            <button 
              onClick={handleAvatarClick}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs transition-opacity"
            >
              <FiCamera size={24} className="mb-1" />
              <span>Change</span>
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-surface-card border border-surface-border rounded-xl flex items-center justify-center text-brand-400 hover:text-white transition-colors shadow-lg"
          >
            <FiEdit3 size={18} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
            <span className="px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-xs font-bold uppercase tracking-wider w-fit mx-auto md:mx-0">
              {user?.role}
            </span>
          </div>
          <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
            <FiMail className="text-brand-500" /> {user?.email}
          </p>
          <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
            <FiBriefcase className="text-brand-500" /> {user?.occupation || 'No occupation set'}
          </p>
        </div>

        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => dispatch(logoutUser())} icon={<FiLogOut />}>Logout</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Insights */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Polls', value: stats?.totalPolls ?? 0, icon: <FiBarChart2 />, color: 'text-brand-400' },
              { label: 'Votes', value: stats?.totalResponses ?? 0, icon: <FiActivity />, color: 'text-emerald-400' },
              { label: 'Active', value: stats?.activePolls ?? 0, icon: <FiZap />, color: 'text-amber-400' },
              { label: 'Streak', value: `${stats?.streak ?? 0}d`, icon: <FiAward />, color: 'text-purple-400' },
            ].map((s) => (
              <div key={s.label} className="glass p-5 text-center space-y-1">
                <div className={`${s.color} flex justify-center mb-2`}>{s.icon}</div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500 uppercase font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Engagement Insights */}
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiZap className="text-brand-400" /> Engagement Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-sm text-gray-400">Peak Engagement</p>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                  <FiClock className="text-brand-500" /> {stats?.peakTime || 'No data'}
                </p>
                <p className="text-xs text-gray-500 italic">When your audience is most active</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-sm text-gray-400">Avg. Responses</p>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                   <FiActivity className="text-emerald-500" /> {stats?.avgResponses || 0} / poll
                </p>
                <p className="text-xs text-gray-500 italic">Participation efficiency rate</p>
              </div>
            </div>

            {stats?.mostPopularPoll && (
              <div className="p-4 rounded-2xl bg-brand-600/5 border border-brand-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-brand-400 font-bold uppercase mb-1">🔥 Top Performing Poll</p>
                    <h3 className="text-lg font-semibold text-white">{stats.mostPopularPoll.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{stats.mostPopularPoll.responses}</p>
                    <p className="text-xs text-gray-500">Total Votes</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-8">
          {/* Edit Profile */}
          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card p-6 overflow-hidden"
              >
                <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <Input 
                    label="Full Name" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  />
                  <Input 
                    label="Occupation" 
                    value={profileForm.occupation}
                    onChange={(e) => setProfileForm({...profileForm, occupation: e.target.value})}
                  />
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1" loading={loading}>Save Changes</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Account Security */}
          <div className="card p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiShield className="text-brand-400" /> Security
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input 
                type="password" 
                label="Current Password" 
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
              />
              <Input 
                type="password" 
                label="New Password" 
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              />
              <Input 
                type="password" 
                label="Confirm New Password" 
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              />
              <Button type="submit" variant="secondary" className="w-full">Update Password</Button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="card p-6 border-red-500/20 bg-red-500/5 space-y-4">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <FiTrash2 /> Danger Zone
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Deleting your account will remove all your data, polls, and analytics permanently.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-semibold"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

