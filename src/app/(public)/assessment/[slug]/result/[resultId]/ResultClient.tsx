'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  IconLock,
  IconHelp,
  IconDeviceFloppy,
  IconShare3,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPersonalityGroup } from '@/lib/constants/personality-groups';
import {
  getPersonalityName,
  getPersonalityNameWithLetter,
} from '@/lib/constants/personality-names';
import Header from '@/components/header';

function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatUserDisplayName(name: string, dateOfBirth?: string): string {
  if (!dateOfBirth) return name;
  return `${name} (${calculateAge(dateOfBirth)})`;
}

function getPersonalityIllustrationPath(
  personalityType: string,
  variant: 'withframe' | 'plain' | 'thumbnail',
): string {
  const type = personalityType.toLowerCase();
  return variant === 'withframe'
    ? `/images/illustration/svg-withframe-${type}.svg`
    : variant === 'plain'
      ? `/images/illustration/svg-${type}.svg`
      : `/images/illustration/svg-thumbnail-${type}.svg`;
}

interface Result {
  _id: string;
  personalityType: string;
  alternativeTypes: string[];
  scores: {
    extrovert: number;
    introvert: number;
    sensory: number;
    intuitive: number;
    thinking: number;
    feeling: number;
    judging: number;
    perceiving: number;
  };
  completedAt: string;
  user: {
    name: string;
    userType: 'guest' | 'registered';
    dateOfBirth?: string;
  } | null;
}

interface Content {
  title: string;
  slug: string;
  subtitle?: string;
  personalityName?: string;
  personalityGroup?: string;
  mainImage?: string;
}

export default function ResultClient({
  result,
  content,
}: {
  result: Result;
  content: Content | null;
}) {
  const router = useRouter();
  const [showShareOptions, setShowShareOptions] = useState(false);

  const isGuest = !result.user || result.user.userType === 'guest';
  const primaryGroup = getPersonalityGroup(result.personalityType);

  const dominantTraits = [
    result.scores.extrovert >= result.scores.introvert
      ? 'Extroverted'
      : 'Introverted',
    result.scores.sensory >= result.scores.intuitive ? 'Sensory' : 'Intuitive',
    result.scores.thinking >= result.scores.feeling ? 'Thinking' : 'Feeling',
    result.scores.judging >= result.scores.perceiving
      ? 'Judging'
      : 'Perceiving',
  ];

  const dimensions = [
    {
      left: { label: 'Extroverted', value: result.scores.extrovert },
      right: { label: 'Introverted', value: result.scores.introvert },
    },
    {
      left: { label: 'Sensory', value: result.scores.sensory },
      right: { label: 'Intuitive', value: result.scores.intuitive },
    },
    {
      left: { label: 'Thinking', value: result.scores.thinking },
      right: { label: 'Feeling', value: result.scores.feeling },
    },
    {
      left: { label: 'Judging', value: result.scores.judging },
      right: { label: 'Perceiving', value: result.scores.perceiving },
    },
  ];

  const alternatives = result.alternativeTypes.slice(0, 4);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Saya adalah tipe kepribadian ${result.personalityType}! Temukan tipe kepribadianmu di Persona.`;
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareOptions(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareOptions(false);
  };

  return (
    <div className='min-h-screen'>
      <Header />
      <div className='flex justify-center py-20 md:pt-38'>
        <div className='container w-full flex flex-col gap-12 px-6 lg:px-10'>
          {/* ── Section 1: Result Hero ── */}
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_1fr] xl:grid-cols-[3fr_2fr_2fr] items-start gap-6 xl:mb-18 2xl:mb-36'>
            {/* Col 1: Illustration card */}
            <div
              className={cn(
                'relative rounded-2xl overflow-visible lg:max-xl:overflow-hidden min-h-[480px] h-full aspect-auto sm:max-lg:aspect-5/4 lg:max-xl:col-span-full',
                primaryGroup.bgColor,
              )}
            >
              <div className='relative flex flex-col items-start xl:items-end gap-2 p-6'>
                {/* Type code */}
                <span className='text-primary-foreground font-heading font-medium text-6xl lg:text-7xl tracking-tight leading-none'>
                  {result.personalityType}
                </span>
                {/* Background trait words */}
                <div className='relative flex flex-col select-none'>
                  {dominantTraits.map(trait => (
                    <span
                      key={trait}
                      className='text-primary-foreground/40 font-heading font-light text-4xl md:text-5xl xl:text-right'
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <Image
                src={getPersonalityIllustrationPath(
                  result.personalityType,
                  'withframe',
                )}
                alt={content?.personalityName ?? result.personalityType}
                width={666}
                height={945}
                priority
                className='absolute top-0 sm:-top-12 left-1/2 -translate-x-1/2 lg:max-xl:-translate-x-1/10 z-10 w-dvw max-w-none sm:w-3/4 lg:w-1/2 xl:w-full block object-contain drop-shadow-[-4px_8px_40px_rgba(0,0,0,0.2)]'
              />
            </div>

            {/* Col 2: Summary card */}
            <div className='bg-card border rounded-2xl p-6 pt-5 flex flex-col gap-6 lg:min-h-[480px] xl:min-h-[560px]'>
              <div className='flex flex-col gap-3'>
                <Badge variant='secondary' className='rounded-sm'>
                  Ringkasan kepribadianmu
                </Badge>
                <h2 className='heading-2'>
                  {getPersonalityName(result.personalityType)}
                </h2>
                {content?.subtitle && (
                  <p className='para-regular text-muted'>{content.subtitle}</p>
                )}
                <p className='para-regular text-foreground-alt'>
                  Kamu yang memiliki tipe kepribadian The Champion (ENFP) adalah
                  seorang yang bersemangat, idealis, dan kreatif. Dapat
                  menguasai berbagai keahlian yang menarik bagi mereka, dan
                  sangat baik dalam berhubungan dengan orang lain. <br /> <br />
                  The Champion hidup dengan nilai-nilai yang sesuai dengan
                  nilai-nilai pribadinya. Mereka berpikiran terbuka dan
                  fleksibel, serta memiliki berbagai minat dan keahlian.
                </p>
              </div>
              {/* {content?.slug && (
                <Button
                  className="w-fit"
                  onClick={() => router.push(`/content/${content.slug}`)}
                >
                  Baca Selengkapnya
                </Button>
              )} */}
              <Button
                className='w-full sm:w-fit rounded-full'
                onClick={() => router.push(`/content/#`)}
              >
                Baca Selengkapnya
              </Button>
            </div>

            {/* Col 3: Score card */}
            <div className='bg-card border rounded-2xl p-6 pt-5 flex flex-col gap-6 h-full'>
              {/* Header info */}
              <div className='flex flex-col gap-3'>
                <Badge variant='secondary' className='rounded-sm'>
                  Detail hasil tes
                </Badge>
                <h3 className='heading-4'>
                  {formatUserDisplayName(
                    result.user?.name ?? 'Guest User',
                    result.user?.dateOfBirth,
                  )}
                </h3>
                <div className='flex flex-col'>
                  <p className='para-mini text-muted-foreground'>
                    Warna/tipe kepribadianmu:
                  </p>
                  <p className='para-sm-bold'>
                    {`${primaryGroup.personalityGroupName} / ${getPersonalityNameWithLetter(result.personalityType)}`}
                  </p>
                </div>
              </div>

              {/* Balance of 100% progress bars */}
              <div className='flex flex-col gap-4'>
                {dimensions.map(dim => {
                  const leftDominant = dim.left.value >= dim.right.value;
                  return (
                    <div key={dim.left.label} className='flex flex-col gap-1.5'>
                      <div className='flex h-7 overflow-hidden rounded-lg'>
                        <div
                          className={cn(
                            'flex shrink-0 items-center justify-start pl-3',
                            leftDominant
                              ? 'bg-brand-neutral-600 rounded-xs'
                              : 'bg-brand-neutral-200',
                          )}
                          style={{ width: `${dim.left.value}%` }}
                        >
                          <span
                            className={cn(
                              'font-mono text-xs tracking-widest',
                              leftDominant
                                ? 'text-brand-neutral-100'
                                : 'text-brand-neutral-400',
                            )}
                          >
                            {dim.left.value}%
                          </span>
                        </div>
                        <div
                          className={cn(
                            'flex shrink-0 items-center justify-end pr-3',
                            !leftDominant
                              ? 'bg-brand-neutral-600 rounded-xs'
                              : 'bg-brand-neutral-200',
                          )}
                          style={{ width: `${dim.right.value}%` }}
                        >
                          <span
                            className={cn(
                              'font-mono text-xs tracking-widest',
                              !leftDominant
                                ? 'text-brand-neutral-100'
                                : 'text-brand-neutral-400',
                            )}
                          >
                            {dim.right.value}%
                          </span>
                        </div>
                      </div>
                      {/* Parameter labels */}
                      <div className='flex justify-between'>
                        <span className='para-mini text-muted-foreground'>
                          {dim.left.label}
                        </span>
                        <span className='para-mini text-muted-foreground'>
                          {dim.right.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className='grid grid-cols-1 md:grid-cols-2 w-full md:flex md:w-fit gap-3 md:gap-2'>
                <Button
                  variant='outline'
                  className='w-full md:w-fit rounded-full gap-2'
                >
                  <IconDeviceFloppy />
                  Simpan Hasil
                </Button>
                <div className='relative w-full md:w-fit'>
                  <Button
                    variant='outline'
                    className='w-full md:w-fit rounded-full gap-2'
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <IconShare3 />
                    Share
                  </Button>
                  {showShareOptions && (
                    <div className='absolute top-full mt-2 right-0 bg-card border rounded-2xl shadow-lg py-2 w-48 z-10'>
                      {(
                        ['whatsapp', 'facebook', 'twitter', 'telegram'] as const
                      ).map(platform => (
                        <button
                          key={platform}
                          onClick={() => handleShare(platform)}
                          className='w-full text-left px-4 py-2 para-sm hover:bg-muted transition-colors capitalize'
                        >
                          {platform === 'twitter'
                            ? 'X / Twitter'
                            : platform.charAt(0).toUpperCase() +
                              platform.slice(1)}
                        </button>
                      ))}
                      <hr className='my-1 border-border' />
                      <button
                        onClick={handleCopyLink}
                        className='w-full text-left px-4 py-2 para-sm hover:bg-muted transition-colors'
                      >
                        Salin Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Panduan kepribadianmu (guest) ── */}
          {isGuest && (
            <div className='flex flex-col gap-6'>
              <div className='flex items-center gap-3'>
                <h2 className='heading-2'>Panduan kepribadianmu</h2>
                <IconLock
                  size={28}
                  className='text-muted-foreground'
                  strokeWidth={2}
                />
              </div>
              <div className='bg-card border border-brand-neutral-200 rounded-2xl p-6'>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-2'>
                    <h4 className='heading-4'>
                      Lihat panduan khusus tipe kepribadianmu
                    </h4>
                    <p className='para-regular text-foreground-alt'>
                      Daftar sekarang untuk membaca konten eksklusif tentang:
                      pemilihan karir, lingkungan kerja, sampai tipe bos yang
                      ideal untuk kamu.
                    </p>
                  </div>
                  <Button
                    size='lg'
                    className='w-full md:w-50 h-12 rounded-full text-base'
                    onClick={() => router.push('/register')}
                  >
                    Daftar Gratis
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── Section 3: Bandingkan dengan tipe kepribadian lain ── */}
          {alternatives.length > 0 && (
            <div className='flex flex-col gap-6'>
              <div className='flex items-center gap-3'>
                <h2 className='heading-2'>
                  Bandingkan dengan tipe kepribadian lain
                </h2>
                <IconHelp
                  size={28}
                  className='text-muted-foreground'
                  strokeWidth={2}
                />
              </div>
              <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
                {alternatives.map(type => {
                  const altGroup = getPersonalityGroup(type);
                  return (
                    <div
                      key={type}
                      className='bg-card border rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 hover:cursor-pointer select-none'
                      onClick={() => router.push(`#`)}
                    >
                      <div
                        className={cn(
                          'relative w-full aspect-video overflow-hidden',
                          altGroup.bgColor,
                        )}
                      >
                        <Image
                          src={getPersonalityIllustrationPath(
                            type,
                            'thumbnail',
                          )}
                          alt={type}
                          width={426}
                          height={318}
                          className='relative object-cover object-center'
                        />
                      </div>
                      <div className='p-4 pb-6 flex flex-col gap-3'>
                        <Badge variant='secondary' className='rounded-sm'>
                          {getPersonalityGroup(type).personalityGroupName}
                        </Badge>
                        <h4 className='heading-4'>
                          {getPersonalityNameWithLetter(type)}
                        </h4>
                        <p className='para-sm text-foreground-alt'>
                          Pemikir cerdas yang selalu tertantang untuk melakukan
                          perdebatan dan diskusi-diskusi intelektual
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

