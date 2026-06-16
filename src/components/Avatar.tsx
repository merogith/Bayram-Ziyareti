import type { AvatarDescriptor } from '../types/avatar';
import './Avatar.css';

const SKIN: Record<NonNullable<AvatarDescriptor['skin']>, string> = {
  light: '\u{1F3FB}',
  medium: '\u{1F3FD}',
  dark: '\u{1F3FF}',
};

const bgFor = (a: AvatarDescriptor): string => {
  if (a.bgColor) return a.bgColor;
  if (a.ageBand === 'old') return '#efe2cf';
  if (a.ageBand === 'child') return a.gender === 'm' ? '#cfe6f2' : '#f7dde9';
  return a.gender === 'm' ? '#dceaf3' : '#f3e3ee';
};

const faceEmoji = (a: AvatarDescriptor): string => {
  let base: string;
  if (a.headscarf && a.gender === 'f') base = '\u{1F9D5}'; // 🧕
  else if (a.beard && a.gender === 'm' && a.ageBand !== 'old') base = '\u{1F9D4}'; // 🧔
  else if (a.ageBand === 'old') base = a.gender === 'm' ? '\u{1F474}' : '\u{1F475}';
  else if (a.ageBand === 'child') base = a.gender === 'm' ? '\u{1F466}' : '\u{1F467}';
  else base = a.gender === 'm' ? '\u{1F468}' : '\u{1F469}';
  return a.skin ? base + SKIN[a.skin] : base;
};

interface Props {
  avatar: AvatarDescriptor;
  size?: number;
  name?: string;
}

export function Avatar({ avatar, size = 56, name }: Props) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: bgFor(avatar), fontSize: size * 0.62 }}
      role="img"
      aria-label={name ?? 'kişi'}
    >
      <span className="avatar__face">{faceEmoji(avatar)}</span>
      {avatar.mustache && !avatar.beard && <span className="avatar__mustache" aria-hidden />}
      {avatar.glasses && (
        <span className="avatar__glasses" aria-hidden style={{ fontSize: size * 0.34 }}>
          {'\u{1F453}'}
        </span>
      )}
    </span>
  );
}
