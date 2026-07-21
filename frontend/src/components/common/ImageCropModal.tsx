import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';

interface ImageCropModalProps {
  image: string;
  onCrop: (croppedBlob: Blob) => void;
  onClose: () => void;
  aspect?: number;
  cropShape?: 'round' | 'rect';
  title?: string;
  outputSize?: number;
}

export function ImageCropModal({ image, onCrop, onClose, aspect = 1, cropShape = 'round', title = 'Crop Photo', outputSize = 400 }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    await new Promise((resolve) => { img.onload = resolve; });

    const targetW = outputSize;
    const targetH = Math.round(targetW / aspect);
    canvas.width = targetW;
    canvas.height = targetH;

    ctx.drawImage(
      img,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      0, 0, targetW, targetH
    );

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
    }, 'image/webp', 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-lg glass-card rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-base font-bold text-white font-serif tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative w-full h-[340px] bg-[#050505]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-[#aaa9a5] shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1 appearance-none bg-white/[.08] rounded-full cursor-pointer accent-[#86d6c8] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#86d6c8]"
            />
            <ZoomIn className="h-4 w-4 text-[#aaa9a5] shrink-0" />
          </div>

          <button onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer">
            <Check className="h-4 w-4" /> Apply Photo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;
