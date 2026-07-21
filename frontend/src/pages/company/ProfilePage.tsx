import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { ProfileAvatar } from '../../components/common/ProfileAvatar';
import { ImageCropModal } from '../../components/common/ImageCropModal';
import { Mail, Building2, Calendar, Fingerprint, Edit3, X, Check, Image, Trash2, Loader2, Lock, Eye, EyeOff, Key } from 'lucide-react';

const PROFILE_KEY = 'bf_profile_image';
const COVER_KEY = 'bf_cover_image';
const COVERS = [
  { from: '#86d6c8', to: '#5cb8a8', label: 'Teal' },
  { from: '#efc493', to: '#d4a56a', label: 'Amber' },
  { from: '#dce772', to: '#b8c94a', label: 'Lime' },
  { from: '#7eb8da', to: '#5a9fc4', label: 'Blue' },
  { from: '#e8a0b4', to: '#d47a94', label: 'Pink' },
  { from: '#86d6c8', to: '#efc493', label: 'Teal-Amber' },
];

function loadImage(userId: string, key: string): string | null {
  try {
    const raw = localStorage.getItem(`${key}_${userId}`);
    return raw || null;
  } catch { return null; }
}

function saveImage(userId: string, key: string, dataUrl: string) {
  try { localStorage.setItem(`${key}_${userId}`, dataUrl); } catch {}
}

function removeImage(userId: string, key: string) {
  try { localStorage.removeItem(`${key}_${userId}`); } catch {}
}

export function ProfilePage() {
  const { user, updateProfile } = useAuthContext();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileCropImage, setProfileCropImage] = useState<string | null>(null);
  const [coverCropImage, setCoverCropImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverIdx, setCoverIdx] = useState(0);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [saveError, setSaveError] = useState('');
  const [saveCooldown, setSaveCooldown] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{ currentPassword: string; currentEmail: string; errorMessage: string; showPassword: boolean } | null>(null);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwOpen, setPwOpen] = useState(false);
  const [showPwCurrent, setShowPwCurrent] = useState(false);
  const [showPwNew, setShowPwNew] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
      setProfileImage(loadImage(user.id, PROFILE_KEY));
      setCoverImage(loadImage(user.id, COVER_KEY));
    }
  }, [user]);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setProfileCropImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfileCrop = async (blob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileImage(dataUrl);
      if (user) saveImage(user.id, PROFILE_KEY, dataUrl);
      setProfileCropImage(null);
      window.dispatchEvent(new Event('profile-image-changed'));
    };
    reader.readAsDataURL(blob);
  };

  const handleCoverFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setCoverCropImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverCrop = async (blob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCoverImage(dataUrl);
      if (user) saveImage(user.id, COVER_KEY, dataUrl);
      setCoverCropImage(null);
    };
    reader.readAsDataURL(blob);
  };

  const handleCoverRemove = () => {
    setCoverImage(null);
    if (user) removeImage(user.id, COVER_KEY);
  };

  const savingRef = useRef(false);
  const handleSave = async (withConfirm?: { currentPassword: string; currentEmail: string }) => {
    if (!user || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError('');
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        ...(withConfirm ? { currentPassword: withConfirm.currentPassword, currentEmail: withConfirm.currentEmail } : {}),
      });
      setEditing(false);
      setConfirmModal(null);
      setSaveError('');
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      if (status === 429) {
        setSaveError('Too many requests. Please wait a moment before trying again.');
        setSaveCooldown(15);
        const interval = setInterval(() => {
          setSaveCooldown((prev) => {
            if (prev <= 1) { clearInterval(interval); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else if (withConfirm) {
        setConfirmModal((prev) => prev ? { ...prev, errorMessage: msg } : prev);
      } else {
        setSaveError(msg);
      }
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  const handleSaveClick = () => {
    if (!user) return;
    if (form.email !== user.email) {
      setConfirmModal({ currentPassword: '', currentEmail: '', errorMessage: '', showPassword: false });
    } else {
      handleSave();
    }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('Password must be at least 8 characters.');
      return;
    }
    setPwSaving(true);
    setPwError('');
    setPwSuccess('');
    try {
      const { authApi } = await import('../../api/auth.api');
      await authApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSuccess('Password updated successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwError(err?.response?.data?.message || 'Failed to update password.');
    } finally {
      setPwSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  const roleLabel = user.role === 'COMPANY_ADMIN' ? 'Manager' :
    user.role === 'SUPER_ADMIN' ? 'Owner' :
    user.role === 'EMPLOYEE' ? 'Employee' : 'Customer';

  const cover = COVERS[coverIdx];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5 sm:space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">Profile</h1>
          <p className="text-[#aaa9a5] mt-1 text-sm">Your account and personal details</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-lg border border-white/[.08] py-2 px-4 text-xs font-mono uppercase tracking-[.08em] text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-all cursor-pointer">
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => { setEditing(false); setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email }); setSaveError(''); }}
              className="flex items-center gap-2 rounded-lg border border-white/[.08] py-2 px-4 text-xs font-mono uppercase tracking-[.08em] text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-all cursor-pointer">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button onClick={handleSaveClick} disabled={saving || saveCooldown > 0}
              className="flex items-center gap-2 rounded-lg bg-[#86d6c8] py-2 px-4 text-xs font-mono uppercase tracking-[.08em] font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              {saving ? 'Saving...' : saveCooldown > 0 ? `Wait ${saveCooldown}s` : 'Save'}
            </button>
          </div>
        )}
        {saveError && (
          <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
            <p className="text-[11px] text-red-400 font-mono">{saveError}</p>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative h-28 sm:h-36 overflow-hidden group"
          style={!coverImage ? { background: `linear-gradient(135deg, ${cover.from}22, ${cover.to}11)` } : undefined}>
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${cover.from} 1px, transparent 1px), radial-gradient(circle at 75% 75%, ${cover.to} 1px, transparent 1px)`,
              backgroundSize: '40px 40px, 30px 30px',
            }} />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[.06] to-transparent" />
          {editing && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {coverImage && (
                <button onClick={handleCoverRemove}
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 hover:bg-red-500/60 transition-all cursor-pointer"
                  title="Remove cover">
                  <Trash2 className="h-3.5 w-3.5 text-white" />
                </button>
              )}
              <button onClick={() => coverInputRef.current?.click()}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 hover:bg-white/10 transition-all cursor-pointer"
                title="Upload cover image">
                <Image className="h-3.5 w-3.5 text-white" />
              </button>
              <div className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1.5">
                {COVERS.map((c, i) => (
                  <button key={c.label} onClick={() => { setCoverIdx(i); if (coverImage) handleCoverRemove(); }}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${!coverImage && i === coverIdx ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                    title={c.label} />
                ))}
              </div>
            </div>
          )}
        </div>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverFileSelect(f); e.target.value = ''; }} />

        <div className="px-5 sm:px-8 pb-5 sm:pb-7 -mt-11 sm:-mt-13">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
            <ProfileAvatar role={user.role} imageUrl={profileImage} onImageChange={handleFileSelect} />

            <div className="flex-1 min-w-0 pt-1 sm:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                {editing ? (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="rounded-lg border border-white/[.08] bg-white/[.06] py-1.5 px-3 text-sm text-white font-semibold focus:outline-none focus:border-[#86d6c8] w-full sm:w-32"
                      placeholder="First name" />
                    <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="rounded-lg border border-white/[.08] bg-white/[.06] py-1.5 px-3 text-sm text-white font-semibold focus:outline-none focus:border-[#86d6c8] w-full sm:w-32"
                      placeholder="Last name" />
                  </div>
                ) : (
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight truncate">
                    {user.firstName} {user.lastName}
                  </h2>
                )}
              </div>
              {editing ? (
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 rounded-lg border border-white/[.08] bg-white/[.06] py-1.5 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8] w-full sm:w-72"
                  placeholder="Email" />
              ) : (
                <p className="text-sm text-[#aaa9a5] mt-1 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-card rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#86d6c8]/10">
              <Building2 className="h-4 w-4 text-[#86d6c8]" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5]">Company</p>
          </div>
          <p className="text-sm font-semibold text-white">{user.company?.name || '—'}</p>
          {user.company && (
            <p className="text-[10px] text-[#aaa9a5] mt-0.5 font-mono">/{user.company.slug}</p>
          )}
        </div>
        <div className="glass-card rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#86d6c8]/10">
              <Calendar className="h-4 w-4 text-[#86d6c8]" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5]">Member Since</p>
          </div>
          <p className="text-sm font-semibold text-white">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <p className="text-[10px] text-[#aaa9a5] mt-0.5 font-mono">Account active</p>
        </div>
        <div className="glass-card rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#86d6c8]/10">
              <Fingerprint className="h-4 w-4 text-[#86d6c8]" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5]">User ID</p>
          </div>
          <p className="text-[11px] sm:text-xs font-mono text-white font-semibold truncate">{user.id}</p>
          <p className="text-[10px] text-[#aaa9a5] mt-0.5 font-mono">Unique identifier</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white font-serif tracking-tight">Account Details</h3>
          <span className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] px-2 py-0.5 rounded-full bg-white/[.06]">
            {roleLabel}
          </span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'First Name', value: editing ? form.firstName : user.firstName },
            { label: 'Last Name', value: editing ? form.lastName : user.lastName },
            { label: 'Email', value: editing ? form.email : user.email },
            { label: 'Role', value: roleLabel },
          ].map((field) => (
            <div key={field.label} className="flex items-center justify-between py-2 border-b border-white/[.04] last:border-0">
              <span className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">{field.label}</span>
              <span className="text-sm text-white font-medium">{field.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#e8a0b4]/10">
              <Key className="h-4 w-4 text-[#e8a0b4]" />
            </div>
            <h3 className="text-sm font-bold text-white font-serif tracking-tight">Change Password</h3>
          </div>
          <button onClick={() => { setPwOpen(!pwOpen); setPwError(''); setPwSuccess(''); }}
            className={`text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] hover:text-white transition-all cursor-pointer ${pwOpen ? 'text-white' : ''}`}>
            {pwOpen ? 'Cancel' : 'Update'}
          </button>
        </div>
        {pwOpen && (
          <div className="space-y-3 pt-2 border-t border-white/[.04]">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mb-1">Current Password</label>
              <div className="relative">
                <input type={showPwCurrent ? 'text' : 'password'} value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  className="w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-[#86d6c8]"
                  placeholder="Enter current password" />
                <button type="button" onClick={() => setShowPwCurrent(!showPwCurrent)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
                  {showPwCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mb-1">New Password</label>
              <div className="relative">
                <input type={showPwNew ? 'text' : 'password'} value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-[#86d6c8]"
                  placeholder="At least 8 characters" />
                <button type="button" onClick={() => setShowPwNew(!showPwNew)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
                  {showPwNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mb-1">Confirm New Password</label>
              <div className="relative">
                <input type={showPwConfirm ? 'text' : 'password'} value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  className="w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-[#86d6c8]"
                  placeholder="Re-enter new password" />
                <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
                  {showPwConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {pwError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                <p className="text-[11px] text-red-400 font-mono">{pwError}</p>
              </div>
            )}
            {pwSuccess && (
              <div className="rounded-lg bg-[#86d6c8]/10 border border-[#86d6c8]/20 px-3 py-2">
                <p className="text-[11px] text-[#86d6c8] font-mono">{pwSuccess}</p>
              </div>
            )}
            <button onClick={handleChangePassword} disabled={pwSaving || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 text-xs font-mono uppercase tracking-[.08em] font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {pwSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
              {pwSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {profileCropImage && (
        <ImageCropModal
          image={profileCropImage}
          onCrop={handleProfileCrop}
          onClose={() => setProfileCropImage(null)}
          title="Crop Profile Photo"
        />
      )}

      {coverCropImage && (
        <ImageCropModal
          image={coverCropImage}
          onCrop={handleCoverCrop}
          onClose={() => setCoverCropImage(null)}
          aspect={3}
          cropShape="rect"
          title="Crop Cover Image"
          outputSize={1200}
        />
      )}

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => !saving && setConfirmModal(null)}>
          <div className="w-full max-w-sm glass-card rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 pt-5 pb-2">
              <h2 className="text-base font-bold text-white font-serif tracking-tight">Confirm Email Change</h2>
              <p className="text-xs text-[#aaa9a5] mt-1.5 leading-relaxed">
                Changing your email will update the address you use to log in. Please confirm by entering your current email and password.
              </p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mb-1">Old Email</label>
                <input type="email" value={confirmModal.currentEmail}
                  onChange={(e) => setConfirmModal({ ...confirmModal, currentEmail: e.target.value, errorMessage: '' })}
                  className="w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8]"
                  placeholder="Enter your current email" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mb-1">New Email</label>
                <input type="email" value={form.email} readOnly
                  className="w-full rounded-lg border border-white/[.08] bg-white/[.04] py-2 px-3 text-sm text-[#86d6c8] focus:outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mb-1">Current Password</label>
                <div className="relative">
                  <input type={confirmModal.showPassword ? 'text' : 'password'}
                    value={confirmModal.currentPassword}
                    onChange={(e) => setConfirmModal({ ...confirmModal, currentPassword: e.target.value, errorMessage: '' })}
                    className="w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-[#86d6c8]"
                    placeholder="Enter your password" />
                  <button type="button" onClick={() => setConfirmModal({ ...confirmModal, showPassword: !confirmModal.showPassword })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
                    {confirmModal.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {confirmModal.errorMessage && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                  <p className="text-[11px] text-red-400 font-mono">{confirmModal.errorMessage}</p>
                </div>
              )}
            </div>
            <div className="px-5 pb-5 flex items-center gap-2">
              <button onClick={() => setConfirmModal(null)} disabled={saving}
                className="flex-1 rounded-lg border border-white/[.08] py-2 text-xs font-mono uppercase tracking-[.08em] text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-all cursor-pointer disabled:opacity-50">
                Cancel
              </button>
              <button onClick={() => handleSave({ currentPassword: confirmModal.currentPassword, currentEmail: confirmModal.currentEmail })} disabled={saving || saveCooldown > 0 || !confirmModal.currentPassword || !confirmModal.currentEmail}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#86d6c8] py-2 text-xs font-mono uppercase tracking-[.08em] font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                {saving ? 'Confirming...' : saveCooldown > 0 ? `Wait ${saveCooldown}s` : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
