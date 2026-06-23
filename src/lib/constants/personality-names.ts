const PERSONALITY_NAMES: Record<string, string> = {
  ESTJ: 'The Supervisor',
  ISTJ: 'The Inspector',
  ESFJ: 'The Provider',
  ISFJ: 'The Protector',
  ESTP: 'The Promoter',
  ISTP: 'The Crafter',
  ESFP: 'The Performer',
  ISFP: 'The Composer',
  ENTJ: 'The Commander',
  INTJ: 'The Mastermind',
  ENTP: 'The Inventor',
  INTP: 'The Thinker',
  ENFJ: 'The Mentor',
  INFJ: 'The Counselor',
  ENFP: 'The Champion',
  INFP: 'The Dreamer',
};

export const getPersonalityName = (personalityType: string): string | null => {
  return PERSONALITY_NAMES[personalityType.toUpperCase()] ?? null;
};

export const getPersonalityNameWithLetter = (
  personalityType: string,
): string | null => {
  const type = personalityType.toUpperCase();
  const name = PERSONALITY_NAMES[type];
  return name ? `${name} (${type})` : null;
};

