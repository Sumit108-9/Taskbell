import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';

interface Props {
  size?: number;
  /**
   * 'bare'      — just the bell on transparent bg (use for badges/icons inside coloured containers)
   * 'rounded'   — bell on a blue gradient rounded square (full app-icon style)
   * 'dark'      — dark navy square with blue bell (for dark theme)
   * 'light'     — light blue square with solid blue bell + green check
   */
  variant?: 'bare' | 'rounded' | 'dark' | 'light';
  /** Show the red "3" notification badge */
  badge?: boolean | string;
  /** Corner radius for the rounded variants (auto-scales by default). */
  cornerRadius?: number;
}

/**
 * TaskBell brand logo — bell, clapper, handle and optional notification badge.
 * Source artwork is in a 512×512 viewBox so it scales crisply to any size.
 */
export function TaskBellLogo({
  size = 96,
  variant = 'rounded',
  badge = true,
  cornerRadius,
}: Props) {
  const radius = cornerRadius ?? size * 0.22;
  const badgeChar = typeof badge === 'string' ? badge : '3';

  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="tb-bg-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#1d4ed8" />
          <Stop offset="55%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#3b82f6" />
        </LinearGradient>
        <LinearGradient id="tb-bg-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0f172a" />
          <Stop offset="100%" stopColor="#1e293b" />
        </LinearGradient>
        <LinearGradient id="tb-bg-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#eff6ff" />
          <Stop offset="100%" stopColor="#dbeafe" />
        </LinearGradient>
        <LinearGradient id="tb-bell-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
          <Stop offset="100%" stopColor="#dbeafe" stopOpacity={0.9} />
        </LinearGradient>
        <LinearGradient id="tb-bell-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#60a5fa" />
          <Stop offset="100%" stopColor="#2563EB" />
        </LinearGradient>
      </Defs>

      {/* Background plate */}
      {variant === 'rounded' && (
        <>
          <Rect width={512} height={512} rx={(radius * 512) / size} fill="url(#tb-bg-blue)" />
          <Circle cx={256} cy={240} r={180} fill="none" stroke="#ffffff" strokeOpacity={0.06} strokeWidth={1.5} />
          <Circle cx={256} cy={240} r={210} fill="none" stroke="#ffffff" strokeOpacity={0.04} strokeWidth={1} />
        </>
      )}
      {variant === 'dark' && (
        <>
          <Rect width={512} height={512} rx={(radius * 512) / size} fill="url(#tb-bg-dark)" />
          <Circle cx={256} cy={240} r={185} fill="none" stroke="#2563EB" strokeOpacity={0.12} strokeWidth={1.5} />
        </>
      )}
      {variant === 'light' && (
        <Rect width={512} height={512} rx={(radius * 512) / size} fill="url(#tb-bg-light)" />
      )}

      {/* Bell artwork */}
      <G>
        {/* Bell dome */}
        <Path
          d="M256 110 C190 110 148 162 148 228 L148 310 L132 334 L380 334 L364 310 L364 228 C364 162 322 110 256 110Z"
          fill={
            variant === 'dark'
              ? 'url(#tb-bell-dark)'
              : variant === 'light'
              ? '#2563EB'
              : 'url(#tb-bell-fill)'
          }
        />
        {/* Left sheen highlight */}
        <Path
          d="M200 130 C185 155 178 185 178 220 L178 295 L165 316 L195 316 L195 220 C195 185 202 155 218 130Z"
          fill="#ffffff"
          fillOpacity={variant === 'light' ? 0.25 : 0.2}
        />
        {/* Clapper */}
        <Circle
          cx={256}
          cy={350}
          r={26}
          fill={variant === 'dark' ? '#60a5fa' : variant === 'light' ? '#2563EB' : '#ffffff'}
        />
        {/* Handle */}
        <Path
          d="M238 104 Q256 86 274 104"
          fill="none"
          stroke={variant === 'dark' ? '#93c5fd' : variant === 'light' ? '#1d4ed8' : '#ffffff'}
          strokeWidth={18}
          strokeLinecap="round"
        />

        {/* Notification badge */}
        {badge && (
          <>
            <Circle cx={348} cy={148} r={34} fill="#EF4444" />
            <SvgText
              x={348}
              y={161}
              textAnchor="middle"
              fill="#ffffff"
              fontSize={30}
              fontWeight="900"
            >
              {badgeChar}
            </SvgText>
          </>
        )}
      </G>
    </Svg>
  );
}
