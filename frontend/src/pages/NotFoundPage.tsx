import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

interface Dash { start: number; end: number }
interface Ring { radius: number; speed: number; angle: number; dashes: Dash[] }

export function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const thickCanvas = document.createElement('canvas');
    const thickCtx = thickCanvas.getContext('2d')!;
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d')!;

    let width: number, height: number, cx: number, cy: number;
    let rings: Ring[] = [];
    let rafId: number;

    function initCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      cx = width / 2;
      cy = height / 2 - 50;

      canvas!.width = width;
      canvas!.height = height;
      thickCanvas.width = width;
      thickCanvas.height = height;
      textCanvas.width = width;
      textCanvas.height = height;

      textCtx.clearRect(0, 0, width, height);
      textCtx.fillStyle = '#fff';
      const fontSize = Math.min(width * 0.4, 450);
      textCtx.font = `900 ${fontSize}px "Arial Black", Impact, sans-serif`;
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.save();
      textCtx.translate(cx, cy);
      textCtx.scale(0.85, 1.2);
      textCtx.fillText('404', 0, 0);
      textCtx.restore();
    }

    function createRings() {
      rings = [];
      const numRings = 60;
      for (let i = 1; i <= numRings; i++) {
        const radius = i * 14;
        const dashes: Dash[] = [];
        let angle = 0;
        while (angle < Math.PI * 2) {
          const dashLen = Math.random() * 0.4 + 0.05;
          const gapLen = Math.random() * 0.6 + 0.1;
          if (angle + dashLen < Math.PI * 2) {
            dashes.push({ start: angle, end: angle + dashLen });
          }
          angle += dashLen + gapLen;
        }
        rings.push({
          radius,
          speed: (Math.random() * 0.003 + 0.001) * (i % 2 === 0 ? 1 : -1),
          angle: Math.random() * Math.PI * 2,
          dashes,
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      thickCtx.clearRect(0, 0, width, height);

      for (const ring of rings) {
        ring.angle += ring.speed;

        ctx.beginPath();
        for (const d of ring.dashes) {
          ctx.arc(cx, cy, ring.radius, ring.angle + d.start, ring.angle + d.end);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        thickCtx.beginPath();
        for (const d of ring.dashes) {
          thickCtx.arc(cx, cy, ring.radius, ring.angle + d.start, ring.angle + d.end);
        }
        thickCtx.strokeStyle = 'rgba(255,255,255,0.22)';
        thickCtx.lineWidth = 6;
        thickCtx.stroke();
      }

      thickCtx.globalCompositeOperation = 'destination-in';
      thickCtx.drawImage(textCanvas, 0, 0);
      thickCtx.globalCompositeOperation = 'source-over';

      ctx.drawImage(thickCanvas, 0, 0);

      rafId = requestAnimationFrame(animate);
    }

    initCanvas();
    createRings();
    animate();

    const onResize = () => initCanvas();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <div
        className="rotate-message fixed top-0 left-0 w-full h-full bg-black z-[9999] items-center justify-center text-center p-8 text-[#a1a1aa] text-lg"
        style={{ display: 'none' }}
      >
        <p>Rotate your device to ensure a better experience</p>
      </div>

      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-[5vh] text-center max-w-[600px] mx-auto px-8 pointer-events-none">
        <Link
          to="/"
          className="logo text-[2.8rem] font-extrabold tracking-tight leading-none italic text-white no-underline pointer-events-auto"
        >
          BookFlow<span className="text-[#86d6c8]">.</span>
        </Link>
        <p className="text-base sm:text-[1.1rem] leading-relaxed text-[#888888] font-normal pointer-events-auto mt-6">
          Looks like this page doesn&apos;t exist (yet). Just like a blank
          space in a conversation, there&apos;s nothing to respond to.
          {'\n'}Go back to{' '}
          <Link
            to="/dashboard"
            className="text-[#888888] no-underline border-b border-[#555] pb-0.5 transition-colors hover:text-white hover:border-white"
          >
            Dashboard
          </Link>{' '}
          or{' '}
          <Link
            to="/"
            className="text-[#888888] no-underline border-b border-[#555] pb-0.5 transition-colors hover:text-white hover:border-white"
          >
            Main
          </Link>
        </p>
      </div>

      <style>{`
        @media screen and (max-width: 768px) and (orientation: portrait) {
          .rotate-message { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
export default NotFoundPage;
