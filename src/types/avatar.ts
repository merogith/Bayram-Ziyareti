export type Gender = 'm' | 'f';
export type AgeBand = 'child' | 'young' | 'adult' | 'old';

/**
 * A small descriptor that the <Avatar> component turns deterministically into an
 * emoji + CSS-composed face. No image assets are used anywhere in the game.
 */
export interface AvatarDescriptor {
  gender: Gender;
  ageBand: AgeBand;
  /** Emoji skin-tone modifier. */
  skin?: 'light' | 'medium' | 'dark';
  mustache?: boolean;
  beard?: boolean;
  glasses?: boolean;
  /** Headscarf for older women / some adults (teyze, nine). */
  headscarf?: boolean;
  /** Circle background colour; falls back to a palette colour derived from id. */
  bgColor?: string;
  expression?: 'neutral' | 'smile' | 'wink';
}

export const makeAvatar = (partial: Partial<AvatarDescriptor> & Pick<AvatarDescriptor, 'gender'>): AvatarDescriptor => ({
  ageBand: 'adult',
  expression: 'smile',
  ...partial,
});
