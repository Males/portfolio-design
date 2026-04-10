import { useRef, useCallback } from "react";

interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  trackColor?: string;
}

function SliderThumb() {
  return (
    <div className="w-[14px] h-[24px] rounded-[2px] bg-white border border-[#777AAF] flex items-center justify-center gap-[2px] shadow-sm cursor-grab active:cursor-grabbing">
      <div className="w-px h-[12px] bg-[#777AAF]" />
      <div className="w-px h-[12px] bg-[#777AAF]" />
    </div>
  );
}

export default function RangeSlider({
  value,
  min,
  max,
  onChange,
  trackColor = "bg-primary",
}: RangeSliderProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const fraction = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const getValueFromEvent = useCallback(
    (clientX: number) => {
      if (!railRef.current) return value;
      const rect = railRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(min + pct * (max - min));
    },
    [min, max, value]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      onChange(getValueFromEvent(e.clientX));

      const onMove = (ev: PointerEvent) => {
        onChange(getValueFromEvent(ev.clientX));
      };
      const onUp = () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
    },
    [onChange, getValueFromEvent]
  );

  return (
    <div
      ref={railRef}
      className="relative h-[24px] flex items-center cursor-pointer select-none"
      onPointerDown={handlePointerDown}
    >
      {/* Rail background */}
      <div className="absolute left-0 right-0 h-[4px] rounded-full bg-[#D6D6E7]" />

      {/* Filled track */}
      <div
        className={`absolute left-0 h-[4px] rounded-full ${trackColor}`}
        style={{ width: `${fraction * 100}%` }}
      />

      {/* Thumb */}
      <div
        className="absolute -translate-x-1/2"
        style={{ left: `${fraction * 100}%` }}
      >
        <SliderThumb />
      </div>
    </div>
  );
}
