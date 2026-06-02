import type { HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  letter?: string;
  src?: string;
  alt?: string;
  size?: number;
}

export function Avatar({ letter = 'F', src, alt, size = 40, className, style, ...rest }: AvatarProps) {
  const classes = ['fen-avatar', className ?? ''].filter(Boolean).join(' ');
  return (
    <div
      className={classes}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42), ...style }}
      {...rest}
    >
      {src ? (
        <img className="fen-avatar__img" src={src} alt={alt ?? letter} />
      ) : (
        letter.slice(0, 1).toUpperCase()
      )}
    </div>
  );
}
