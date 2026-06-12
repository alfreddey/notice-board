import React from 'react';

export function SketchyBox({ fillColor = 'white', strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg 
      className={`absolute inset-0 w-full h-full -z-10 ${className}`} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M 4,6 C 30,3 70,5 98,4 C 99,30 97,70 98,98 C 60,99 30,97 4,98 C 3,70 5,40 4,6 Z"
        fill="currentColor"
        stroke="none"
        className="text-slate-200"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 2,4 C 30,1 70,3 98,2 C 99,30 97,70 98,98 C 60,99 30,97 2,98 C 1,70 3,40 2,4 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 4,2 C 40,4 60,1 96,4 C 98,40 96,60 97,96 C 70,98 40,96 4,97 C 3,60 1,40 4,2 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SketchyButtonBg({ fillColor = '#fde047', strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg 
      className={`absolute inset-0 w-full h-full -z-10 ${className}`} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      {...props}
    >
      <path
        d="M 3,6 C 25,2 75,4 96,5 C 99,25 97,75 97,95 C 75,98 25,97 4,96 C 1,75 3,25 3,6 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 5,3 C 30,5 70,2 95,4 C 98,30 96,70 95,97 C 70,95 30,98 5,95 C 4,70 2,30 5,3 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="4 2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SketchyStar({ strokeColor = '#1e293b', fillColor = '#fef08a', className = '', ...props }: any) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      {...props}
    >
      <path 
        d="M 50,10 L 61,38 L 90,40 L 67,58 L 75,88 L 50,72 L 25,88 L 33,58 L 10,40 L 39,38 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path 
        d="M 48,12 L 59,37 L 88,42 L 65,59 L 73,86 L 52,70 L 27,87 L 35,59 L 12,42 L 41,37 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SketchyTrash({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path d="M 20,30 L 80,30 M 35,30 L 35,20 C 35,15 65,15 65,20 L 65,30 M 25,30 L 35,90 C 36,95 64,95 65,90 L 75,30" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 40,45 L 42,75 M 60,45 L 58,75" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function SketchyLine({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 10 10" preserveAspectRatio="none" className={className} {...props}>
      <path d="M 0,5 Q 5,3 10,6" fill="none" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M 1,4 Q 6,6 9,4" fill="none" stroke={strokeColor} strokeWidth="0.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function SketchyCircle({ strokeColor = '#1e293b', fillColor = 'transparent', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path 
        d="M 50,5 C 75,3 95,20 97,45 C 99,75 80,95 50,96 C 20,97 5,75 4,50 C 3,25 20,6 45,5" 
        fill={fillColor} 
        stroke={strokeColor} 
        strokeWidth="4" 
        strokeLinecap="round" 
        vectorEffect="non-scaling-stroke" 
      />
      <path 
        d="M 48,8 C 72,7 90,22 92,48 C 94,72 75,90 48,91 C 22,92 9,72 8,48 C 7,26 22,10 45,9" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeDasharray="4 6"
        strokeLinecap="round" 
        vectorEffect="non-scaling-stroke" 
      />
    </svg>
  );
}

export function SketchyStrike({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className={className} {...props}>
      <path d="M 0,5 Q 25,2 50,6 T 100,4" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M 2,7 Q 30,3 55,7 T 98,6" fill="none" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.6" />
    </svg>
  );
}

export function SketchyPencil({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path d="M 25,75 L 15,85 L 20,65 L 75,10 L 85,20 Z" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M 65,20 L 75,30 M 30,55 L 45,70 M 21,68 L 26,73" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function SketchyEraser({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path d="M 70,30 L 30,70 L 10,50 L 50,10 Z" fill="none" stroke={strokeColor} strokeWidth="6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M 30,70 L 50,90 L 90,50 L 70,30 Z" fill="#cbd5e1" fillOpacity="0.5" stroke={strokeColor} strokeWidth="6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M 10,50 L 50,90 M 50,10 L 90,50" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.5" />
    </svg>
  );
}
export function SketchyUndo({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path d="M 40,30 L 10,50 L 40,70" fill="none" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M 15,50 C 60,30 90,40 90,80" fill="none" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M 42,32 L 12,52 L 42,72" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.4" />
      <path d="M 17,52 C 62,32 92,42 92,82" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.4" />
    </svg>
  );
}

export function SketchyCursor({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path d="M 20,20 L 40,80 L 50,55 L 75,65 Z" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M 50,55 L 70,80" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function SketchyHeart({ strokeColor = '#1e293b', fillColor = '#fecaca', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path 
        d="M 50,30 C 50,30 45,10 25,10 C 5,10 5,40 50,90 C 95,40 95,10 75,10 C 55,10 50,30 50,30 Z" 
        fill={fillColor} 
        stroke={strokeColor} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        vectorEffect="non-scaling-stroke"
      />
      <path 
        d="M 48,32 C 48,32 43,12 23,12 C 3,12 3,42 48,92 C 93,42 93,12 73,12 C 53,12 48,32 48,32 Z" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        vectorEffect="non-scaling-stroke"
        opacity="0.5"
      />
    </svg>
  );
}

export function SketchyCheck({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path 
        d="M 15,55 L 40,80 L 85,20" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="10" 
        strokeLinecap="round"
        strokeLinejoin="round" 
        vectorEffect="non-scaling-stroke" 
      />
      <path 
        d="M 17,57 L 42,82 L 87,22" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="6" 
        strokeLinecap="round"
        strokeLinejoin="round" 
        vectorEffect="non-scaling-stroke" 
        opacity="0.3"
      />
    </svg>
  );
}

export function SketchySmiley({ strokeColor = '#1e293b', fillColor = '#fef08a', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path 
        d="M 50,5 C 75,3 95,20 97,45 C 99,75 80,95 50,96 C 20,97 5,75 4,50 C 3,25 20,6 45,5" 
        fill={fillColor} 
        stroke={strokeColor} 
        strokeWidth="4" 
        strokeLinecap="round" 
        vectorEffect="non-scaling-stroke" 
      />
      <path 
        d="M 30,40 Q 35,35 40,40 M 60,40 Q 65,35 70,40" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="6" 
        strokeLinecap="round" 
        vectorEffect="non-scaling-stroke" 
      />
      <path 
        d="M 25,60 Q 50,85 75,60" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="6" 
        strokeLinecap="round" 
        vectorEffect="non-scaling-stroke" 
      />
    </svg>
  );
}

export function SketchyPushPin({ strokeColor = '#1e293b', fillColor = '#ef4444', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path d="M 50,55 L 50,95" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M 30,55 L 70,55 L 60,35 L 70,15 L 30,15 L 40,35 Z" fill={fillColor} stroke={strokeColor} strokeWidth="4" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M 30,57 L 70,57 L 60,37 L 70,17 L 30,17 L 40,37 Z" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity="0.3" />
    </svg>
  );
}

export function SketchyPen({ strokeColor = '#1e293b', className = '', ...props }: any) {
  return (
    <svg viewBox="0 0 100 100" className={className} {...props}>
      <path 
        d="M 80,20 L 20,80 L 10,90 L 20,90 L 80,30 Z" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 60,40 L 40,60 M 70,10 L 90,30 M 75,25 L 25,75"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
