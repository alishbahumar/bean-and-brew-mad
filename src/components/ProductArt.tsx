import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { ArtKind, Product } from '@/data/menu';

type Props = { kind: ArtKind; tint: string; size?: number };

/** Hand-drawn vector illustrations of every menu item (no image files needed). */
export function Art({ kind, tint, size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {kind === 'cup' && <Cup tint={tint} />}
      {kind === 'iced' && <Iced tint={tint} />}
      {kind === 'frappe' && <Frappe tint={tint} />}
      {kind === 'tea' && <Tea tint={tint} />}
      {kind === 'croissant' && <Croissant tint={tint} />}
      {kind === 'brownie' && <Brownie tint={tint} />}
      {kind === 'cookie' && <Cookie tint={tint} />}
    </Svg>
  );
}

export function ProductArt({ product, size }: { product: Product; size?: number }) {
  return <Art kind={product.kind} tint={product.tint} size={size} />;
}

function Cup({ tint }: { tint: string }) {
  return (
    <G>
      <Ellipse cx="100" cy="166" rx="82" ry="13" fill="#000" opacity={0.3} />
      <Ellipse cx="100" cy="152" rx="76" ry="14" fill="#E9DCCB" />
      <Path d="M152 96 C178 96 178 134 148 134" stroke="#F7EEE2" strokeWidth="10" fill="none" strokeLinecap="round" />
      <Path d="M48 84 H152 V112 C152 142 130 156 100 156 C70 156 48 142 48 112 Z" fill="#F7EEE2" />
      <Path d="M48 112 C48 142 70 156 100 156 C80 150 64 138 62 112 Z" fill="#E3D4BF" opacity={0.7} />
      <Ellipse cx="100" cy="84" rx="52" ry="10" fill="#E3D4BF" />
      <Ellipse cx="100" cy="85" rx="46" ry="7.5" fill={tint} />
      <Ellipse cx="100" cy="85" rx="22" ry="3.2" fill="#fff" opacity={0.22} />
      <Path d="M84 68 C76 58 92 52 84 40" stroke="#F3E3CC" strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.65} />
      <Path d="M102 70 C94 58 110 50 102 36" stroke="#F3E3CC" strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.65} />
      <Path d="M120 68 C112 58 128 52 120 42" stroke="#F3E3CC" strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.65} />
    </G>
  );
}

function Iced({ tint }: { tint: string }) {
  return (
    <G>
      <Ellipse cx="100" cy="178" rx="52" ry="8" fill="#000" opacity={0.3} />
      <Path d="M58 52 H142 L131 164 Q130 174 120 174 H80 Q70 174 69 164 Z" fill="#fff" opacity={0.12} />
      <Path d="M63 82 H137 L130 162 Q129 169 120 169 H80 Q71 169 70 162 Z" fill={tint} />
      <Path d="M63 82 H137 L135 104 H65 Z" fill="#fff" opacity={0.18} />
      <Path d="M114 16 L102 102" stroke="#D4A762" strokeWidth="7" strokeLinecap="round" />
      <Rect x="72" y="58" width="26" height="26" rx="6" fill="#fff" opacity={0.55} transform="rotate(-12 85 71)" />
      <Rect x="104" y="64" width="24" height="24" rx="6" fill="#fff" opacity={0.45} transform="rotate(10 116 76)" />
      <Rect x="88" y="96" width="22" height="22" rx="6" fill="#fff" opacity={0.3} transform="rotate(-6 99 107)" />
      <Path d="M58 52 H142 L131 164 Q130 174 120 174 H80 Q70 174 69 164 Z" fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth="3" />
      <Path d="M70 62 L76 150" stroke="#fff" strokeOpacity={0.35} strokeWidth="4" strokeLinecap="round" />
    </G>
  );
}

function Frappe({ tint }: { tint: string }) {
  return (
    <G>
      <Ellipse cx="100" cy="178" rx="52" ry="8" fill="#000" opacity={0.3} />
      <Path d="M58 60 H142 L131 164 Q130 174 120 174 H80 Q70 174 69 164 Z" fill="#fff" opacity={0.12} />
      <Path d="M62 70 H138 L130 162 Q129 169 120 169 H80 Q71 169 70 162 Z" fill={tint} />
      <Path d="M96 60 C80 56 66 48 76 38 C70 28 90 22 100 26 C112 18 132 26 124 38 C136 48 120 58 104 60 Z" fill="#F6EBDD" />
      <Path d="M84 40 C96 46 112 46 122 40" stroke="#D4A762" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M72 80 H128" stroke="#5C3322" strokeWidth="4" strokeLinecap="round" opacity={0.5} />
      <Path d="M126 20 L118 70" stroke="#D4A762" strokeWidth="6" strokeLinecap="round" />
      <Path d="M58 60 H142 L131 164 Q130 174 120 174 H80 Q70 174 69 164 Z" fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth="3" />
    </G>
  );
}

function Tea({ tint }: { tint: string }) {
  return (
    <G>
      <Ellipse cx="100" cy="168" rx="70" ry="11" fill="#000" opacity={0.3} />
      <Ellipse cx="100" cy="158" rx="62" ry="11" fill="#E9DCCB" />
      <Path d="M62 58 C60 100 64 122 76 140 Q86 152 100 152 Q114 152 124 140 C136 122 140 100 138 58 Z" fill="#fff" opacity={0.16} />
      <Path d="M64 78 C64 104 68 124 78 138 Q87 150 100 150 Q113 150 122 138 C132 124 136 104 136 78 Z" fill={tint} />
      <Path d="M64 78 H136" stroke="#fff" strokeOpacity={0.35} strokeWidth="3" />
      <Path d="M63 100 H137" stroke="#D4A762" strokeWidth="5" opacity={0.85} />
      <Path d="M62 58 C60 100 64 122 76 140 Q86 152 100 152 Q114 152 124 140 C136 122 140 100 138 58" fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth="3" />
      <Path d="M74 66 C72 96 76 118 84 134" stroke="#fff" strokeOpacity={0.4} strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M88 48 C80 38 96 32 88 20" stroke="#F3E3CC" strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.6} />
      <Path d="M110 48 C102 38 118 32 110 22" stroke="#F3E3CC" strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.6} />
    </G>
  );
}

function Croissant({ tint }: { tint: string }) {
  return (
    <G>
      <Ellipse cx="100" cy="158" rx="84" ry="12" fill="#000" opacity={0.3} />
      <G transform="translate(100 108)">
        <Ellipse cx="-74" cy="26" rx="14" ry="10" fill="#B87326" transform="rotate(55 -74 26)" />
        <Ellipse cx="74" cy="26" rx="14" ry="10" fill="#B87326" transform="rotate(-55 74 26)" />
        <Ellipse cx="-52" cy="8" rx="22" ry="20" fill="#C8802D" transform="rotate(30 -52 8)" />
        <Ellipse cx="52" cy="8" rx="22" ry="20" fill="#C8802D" transform="rotate(-30 52 8)" />
        <Ellipse cx="-26" cy="-4" rx="26" ry="28" fill={tint} transform="rotate(14 -26 -4)" />
        <Ellipse cx="26" cy="-4" rx="26" ry="28" fill={tint} transform="rotate(-14 26 -4)" />
        <Ellipse cx="0" cy="-8" rx="26" ry="32" fill="#E5A24F" />
        <Path d="M-14 -34 C-6 -20 -6 -2 -14 14" stroke="#B87326" strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.6} />
        <Path d="M14 -34 C6 -20 6 -2 14 14" stroke="#B87326" strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.6} />
        <Ellipse cx="-4" cy="-22" rx="9" ry="14" fill="#fff" opacity={0.22} />
      </G>
    </G>
  );
}

function Brownie({ tint }: { tint: string }) {
  return (
    <G>
      <Ellipse cx="100" cy="162" rx="76" ry="10" fill="#000" opacity={0.3} />
      <Path d="M44 108 H132 V148 H44 Z" fill="#3E2216" />
      <Path d="M44 108 L72 82 H160 L132 108 Z" fill={tint} />
      <Path d="M132 108 L160 82 V122 L132 148 Z" fill="#2E190F" />
      <Rect x="44" y="124" width="88" height="6" fill="#E8CFA6" />
      <Path d="M62 100 L82 88 M82 102 L102 88 M102 102 L122 88 M122 102 L142 88" stroke="#F1DFC0" strokeWidth="3" strokeLinecap="round" opacity={0.85} />
      <Circle cx="98" cy="96" r="2.5" fill="#fff" opacity={0.3} />
      <Rect x="90" y="52" width="40" height="40" rx="5" fill="#4A2818" transform="rotate(-8 110 72)" />
      <Path d="M92 60 H128" stroke="#F1DFC0" strokeWidth="3" strokeLinecap="round" opacity={0.8} transform="rotate(-8 110 72)" />
    </G>
  );
}

function Cookie({ tint }: { tint: string }) {
  return (
    <G>
      <Ellipse cx="100" cy="166" rx="72" ry="10" fill="#000" opacity={0.3} />
      <Circle cx="100" cy="102" r="64" fill="#B97F3E" />
      <Circle cx="100" cy="98" r="62" fill={tint} />
      <Ellipse cx="82" cy="70" rx="26" ry="14" fill="#fff" opacity={0.15} />
      <Ellipse cx="78" cy="84" rx="9" ry="7" fill="#3B2216" />
      <Ellipse cx="116" cy="76" rx="8" ry="6" fill="#3B2216" />
      <Ellipse cx="128" cy="108" rx="10" ry="7" fill="#3B2216" />
      <Ellipse cx="96" cy="112" rx="8" ry="6" fill="#3B2216" />
      <Ellipse cx="70" cy="122" rx="7" ry="5" fill="#3B2216" />
      <Ellipse cx="108" cy="136" rx="9" ry="6" fill="#3B2216" />
      <Ellipse cx="140" cy="132" rx="6" ry="4" fill="#3B2216" />
      <Ellipse cx="62" cy="100" rx="6" ry="4" fill="#3B2216" />
    </G>
  );
}
