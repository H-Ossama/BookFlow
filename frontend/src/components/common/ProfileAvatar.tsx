import { useRef } from 'react';
import { Pencil } from 'lucide-react';

interface ProfileAvatarProps {
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  imageUrl?: string | null;
  onImageChange?: (file: File) => void;
  size?: 'sm' | 'lg';
}

const ROLE_STYLE: Record<string, { gradient: string; border: string; label: string }> = {
  SUPER_ADMIN: {
    gradient: 'from-[#efc493] to-[#d4a56a]',
    border: '#d4a56a',
    label: 'SA',
  },
  COMPANY_ADMIN: {
    gradient: 'from-[#86d6c8] to-[#5cb8a8]',
    border: '#5cb8a8',
    label: 'AD',
  },
  EMPLOYEE: {
    gradient: 'from-[#7eb8da] to-[#5a9fc4]',
    border: '#5a9fc4',
    label: 'EM',
  },
  CUSTOMER: {
    gradient: 'from-[#e8a0b4] to-[#d47a94]',
    border: '#d47a94',
    label: 'CU',
  },
};

function AvatarSvg({ role, hasImage }: { role: string; hasImage: boolean }) {
  const s = ROLE_STYLE[role] || ROLE_STYLE.CUSTOMER;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full block" aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${role}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={s.gradient.split(' ')[0].replace('from-', '') || '#86d6c8'} />
          <stop offset="100%" stopColor={s.gradient.split(' ')[1]?.replace('to-', '') || '#5cb8a8'} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx="18" fill={`url(#bg-${role})`} opacity="0.15" />
      <rect x="0" y="0" width="100" height="100" rx="18" fill="none" stroke={s.border} strokeWidth="1.5" opacity="0.4" />
      {!hasImage && (
        <text x="50" y="58" textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="system-ui">
          {s.label}
        </text>
      )}
      {hasImage && (
        <>
          <clipPath id={`clip-${role}`}>
            <rect x="8" y="6" width="84" height="78" rx="10" />
          </clipPath>
          <image href="" x="8" y="6" width="84" height="78" rx="10" clipPath={`url(#clip-${role})`}
            className="profile-avatar-image" />
        </>
      )}
    </svg>
  );
}

export function ProfileAvatar({ role, imageUrl, onImageChange, size = 'lg' }: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = !!imageUrl;

  const dim = size === 'sm' ? 'w-9' : 'w-full max-w-[80px] sm:max-w-[100px]';

  return (
    <div className={`relative inline-block ${dim}`}>
      <div className="relative">
        <AvatarSvg role={role} hasImage={hasImage} />
        {imageUrl && (
          <div className="absolute overflow-hidden rounded-[10px] pointer-events-none"
            style={{
              left: '8%',
              top: '6%',
              width: '84%',
              height: '78%',
            }}>
            <img src={imageUrl} alt="Profile" className="w-full h-full object-cover select-none" draggable={false} />
          </div>
        )}
      </div>

      {onImageChange && (
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-[18px] opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
          <Pencil className="h-4 w-4 text-white drop-shadow-sm" />
        </button>
      )}

      {onImageChange && (
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onImageChange) onImageChange(file);
          e.target.value = '';
        }} />
      )}
    </div>
  );
}

export default ProfileAvatar;
