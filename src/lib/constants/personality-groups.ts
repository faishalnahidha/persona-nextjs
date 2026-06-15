export type PersonalityGroupCode = 'SJ' | 'NT' | 'NF' | 'SP';

export interface PersonalityGroup {
  personalityGroup: PersonalityGroupCode;
  personalityGroupName: string;
  bgColor: string;
}

const GROUPS: Record<PersonalityGroupCode, PersonalityGroup> = {
  SJ: {
    personalityGroup: 'SJ',
    personalityGroupName: 'Gold (SJ)',
    bgColor: 'bg-amber-400',
  },
  NT: {
    personalityGroup: 'NT',
    personalityGroupName: 'Blue (NT)',
    bgColor: 'bg-sky-400',
  },
  NF: {
    personalityGroup: 'NF',
    personalityGroupName: 'Green (NF)',
    bgColor: 'bg-emerald-400',
  },
  SP: {
    personalityGroup: 'SP',
    personalityGroupName: 'Red (SP)',
    bgColor: 'bg-red-400',
  },
};

const TYPE_TO_GROUP: Record<string, PersonalityGroupCode> = {
  ESTJ: 'SJ',
  ISTJ: 'SJ',
  ESFJ: 'SJ',
  ISFJ: 'SJ',
  ENTJ: 'NT',
  INTJ: 'NT',
  ENTP: 'NT',
  INTP: 'NT',
  ENFJ: 'NF',
  INFJ: 'NF',
  ENFP: 'NF',
  INFP: 'NF',
  ESTP: 'SP',
  ISTP: 'SP',
  ESFP: 'SP',
  ISFP: 'SP',
};

export function getPersonalityGroup(type: string): PersonalityGroup {
  const code = TYPE_TO_GROUP[type.toUpperCase()];
  return code
    ? GROUPS[code]
    : {
        personalityGroup: 'SJ',
        personalityGroupName: type,
        bgColor: 'bg-brand-neutral-400',
      };
}
