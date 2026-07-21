import { useRef } from 'react';
import { Pencil } from 'lucide-react';

interface ProfileAvatarProps {
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  imageUrl?: string | null;
  onImageChange?: (file: File) => void;
  size?: 'sm' | 'lg';
}

const ROLE_BADGE: Record<string, { withImage: string; withoutImage: string }> = {
  SUPER_ADMIN: {
    withImage: '/profiles-roles/owner-with-profile-image.png',
    withoutImage: '/profiles-roles/owner-without-profile-image.png',
  },
  COMPANY_ADMIN: {
    withImage: '/profiles-roles/bisniss-manager-with-profile-image.png',
    withoutImage: '/profiles-roles/bisniss-manager-without-profile-image.png',
  },
  EMPLOYEE: {
    withImage: '/profiles-roles/employee-with-profile-image.png',
    withoutImage: '/profiles-roles/employee-without-profile-image.png',
  },
  CUSTOMER: {
    withImage: '/profiles-roles/customer-with-profile-image.png',
    withoutImage: '/profiles-roles/customer-without-profile-image.png',
  },
};

export function ProfileAvatar({ role, imageUrl, onImageChange, size = 'lg' }: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = !!imageUrl;
  const badge = ROLE_BADGE[role] || ROLE_BADGE.CUSTOMER;
  const src = hasImage ? badge.withImage : badge.withoutImage;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) onImageChange(file);
    e.target.value = '';
  };

  const dim = size === 'sm' ? 'w-9' : 'w-full max-w-[80px] sm:max-w-[100px]';

  return (
    <div className={`relative inline-block ${dim}`}>
      <img src={src} alt="" className="w-full h-auto block pointer-events-none select-none" draggable={false} />

      {hasImage && (
        <div
          className="absolute overflow-hidden rounded-full pointer-events-none"
          style={{
            left: '50%',
            top: '33.9%',
            transform: 'translate(-50%, -50%)',
            width: '81%',
            aspectRatio: 0.93,
          }}
        >
          <img src={imageUrl} alt="Profile" className="w-full h-full object-cover select-none" draggable={false} />
        </div>
      )}

      {onImageChange && (
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Pencil className="h-4 w-4 text-white drop-shadow-sm" />
        </button>
      )}

      {onImageChange && (
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      )}
    </div>
  );
}

export default ProfileAvatar;
