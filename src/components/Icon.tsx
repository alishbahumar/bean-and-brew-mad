import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'coffee' | 'heart' | 'bag' | 'receipt' | 'user' | 'search' | 'plus' | 'check' | 'clock' | 'star'
  | 'mail' | 'lock' | 'eye' | 'eyeoff' | 'logout' | 'back';

type Props = { name: IconName; color: ColorValue; size?: number; filled?: boolean };

/** Small UI icons (tabs, buttons). Food and drinks use real photos, see data/images.ts. */
export function Icon({ name, color, size = 24, filled }: Props) {
  const common = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'coffee' && (
        <>
          <Path {...common} d="M10 2v2M14 2v2M6 2v2" />
          <Path {...common} d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
        </>
      )}
      {name === 'heart' && (
        <Path
          {...common}
          fill={filled ? color : 'none'}
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        />
      )}
      {name === 'bag' && (
        <>
          <Path {...common} d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <Path {...common} d="M3 6h18" />
          <Path {...common} d="M16 10a4 4 0 0 1-8 0" />
        </>
      )}
      {name === 'receipt' && (
        <>
          <Path {...common} d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
          <Path {...common} d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11" />
        </>
      )}
      {name === 'user' && (
        <>
          <Path {...common} d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <Circle {...common} cx="12" cy="7" r="4" />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle {...common} cx="11" cy="11" r="8" />
          <Path {...common} d="m21 21-4.3-4.3" />
        </>
      )}
      {name === 'plus' && <Path {...common} strokeWidth={2.6} d="M12 5v14M5 12h14" />}
      {name === 'check' && <Path {...common} strokeWidth={2.6} d="M20 6 9 17l-5-5" />}
      {name === 'clock' && (
        <>
          <Circle {...common} cx="12" cy="12" r="10" />
          <Path {...common} d="M12 6v6l4 2" />
        </>
      )}
      {name === 'star' && (
        <Path
          {...common}
          fill={color}
          d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
        />
      )}
      {name === 'mail' && (
        <>
          <Rect {...common} x="2" y="4" width="20" height="16" rx="2" />
          <Path {...common} d="m22 7-8.99 5.73a2 2 0 0 1-2.02 0L2 7" />
        </>
      )}
      {name === 'lock' && (
        <>
          <Rect {...common} x="3" y="11" width="18" height="11" rx="2" />
          <Path {...common} d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      )}
      {name === 'eye' && (
        <>
          <Path {...common} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <Circle {...common} cx="12" cy="12" r="3" />
        </>
      )}
      {name === 'eyeoff' && (
        <>
          <Path {...common} d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <Path {...common} d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <Path {...common} d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <Path {...common} d="m2 2 20 20" />
        </>
      )}
      {name === 'logout' && (
        <>
          <Path {...common} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <Path {...common} d="m16 17 5-5-5-5M21 12H9" />
        </>
      )}
      {name === 'back' && <Path {...common} strokeWidth={2.4} d="m15 18-6-6 6-6" />}
    </Svg>
  );
}
