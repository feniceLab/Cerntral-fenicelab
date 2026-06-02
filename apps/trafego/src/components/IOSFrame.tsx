// ============================================================
// Moldura iPhone para o Portal do Cliente (mobile, read-only).
// ============================================================
import type { ReactNode } from 'react';

export function IOSFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 390,
        height: 800,
        background: 'var(--fen-nero)',
        borderRadius: 46,
        padding: 11,
        boxShadow: '0 30px 80px rgba(42,33,28,.32)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'var(--fen-avorio)',
          borderRadius: 36,
          overflow: 'hidden',
        }}
      >
        {/* notch / dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 28,
            background: 'var(--fen-nero)',
            borderRadius: 16,
            zIndex: 10,
          }}
        />
        <div
          className="fen-body"
          style={{ height: '100%', background: 'var(--fen-avorio)', overflowY: 'auto', overflowX: 'hidden' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
