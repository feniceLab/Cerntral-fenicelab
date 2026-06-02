import type { ReactNode } from 'react';

interface DeviceFrameProps {
  children: ReactNode;
}

/** Moldura de iPhone (dynamic island + scroll interno). */
export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="fen-pt-stage">
      <div className="fen-pt-device">
        <div className="fen-pt-island" />
        {children}
      </div>
    </div>
  );
}
