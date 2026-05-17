import React from 'react';
import Svg, { Path, Circle, Line, Rect, Polyline, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const base = (size = 20, color = '#0F172A', strokeWidth = 2) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const Bell = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);
export const Home = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);
export const CalendarIcon = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Rect x="3" y="4" width="18" height="18" rx="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);
export const BarChart = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Line x1="12" y1="20" x2="12" y2="10" />
    <Line x1="18" y1="20" x2="18" y2="4" />
    <Line x1="6" y1="20" x2="6" y2="16" />
  </Svg>
);
export const SettingsIcon = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);
export const Plus = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);
export const Search = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);
export const Clock = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);
export const ChevronLeft = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
);
export const ChevronRight = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);
export const Check = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);
export const Trash = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
    <Path d="M10 11v6M14 11v6" />
  </Svg>
);
export const Edit = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Path d="M12 20h9" />
    <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
  </Svg>
);
export const Repeat = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Polyline points="17 1 21 5 17 9" />
    <Path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <Polyline points="7 23 3 19 7 15" />
    <Path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Svg>
);
export const ChevronDown = ({ size, color, strokeWidth }: IconProps) => (
  <Svg {...base(size, color, strokeWidth)}>
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);
