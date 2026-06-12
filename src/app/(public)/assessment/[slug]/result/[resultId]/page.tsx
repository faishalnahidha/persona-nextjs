import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db/mongodb';
import Result from '@/lib/db/models/Result';
import '@/lib/db/models/User';
import Content from '@/lib/db/models/Content';
import ResultClient from './ResultClient';

const MOCK_PERSONALITY_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const;

/**
 * Result Page - Server Component
 *
 * Displays assessment results with personality type and scores.
 * In development, visit /assessment/<slug>/result/mock-<TYPE> (e.g. mock-INFJ)
 * to preview any personality result without a database record.
 */
export default async function ResultPage({
  params,
}: {
  params: Promise<{ slug: string; resultId: string }>;
}) {
  const { resultId } = await params;

  // Dev-only mock bypass — /result/mock-<TYPE> e.g. /result/mock-INFJ
  if (process.env.NODE_ENV === 'development' && resultId.startsWith('mock-')) {
    const type = resultId.replace('mock-', '').toUpperCase();
    const personalityType = MOCK_PERSONALITY_TYPES.includes(type as typeof MOCK_PERSONALITY_TYPES[number])
      ? type
      : 'INFJ';

    const isIntroverted = personalityType[0] === 'I';
    const isIntuitive = personalityType[1] === 'N';
    const isFeeling = personalityType[2] === 'F';
    const isJudging = personalityType[3] === 'J';

    const mockResult = {
      _id: `mock-${personalityType}`,
      personalityType,
      alternativeTypes: [] as string[],
      scores: {
        extrovert: isIntroverted ? 30 : 70,
        introvert: isIntroverted ? 70 : 30,
        sensory: isIntuitive ? 25 : 75,
        intuitive: isIntuitive ? 75 : 25,
        thinking: isFeeling ? 35 : 65,
        feeling: isFeeling ? 65 : 35,
        judging: isJudging ? 75 : 30,
        perceiving: isJudging ? 25 : 70,
      },
      completedAt: new Date().toISOString(),
      user: { name: 'Dev User', userType: 'guest' as const },
    };

    return <ResultClient result={mockResult} content={null} />;
  }

  await connectDB();

  // Fetch result
  const result = await Result.findById(resultId)
    .populate('userId', 'name userType')
    .lean();

  if (!result) {
    notFound();
  }

  // Fetch personality main content (if exists)
  let personalityContent = null;
  try {
    personalityContent = await Content.findOne({
      contentType: 'personality-main',
      personalityId: result.personalityType,
      published: true,
    })
      .select('title slug subtitle personalityName personalityGroup mainImage')
      .lean();
  } catch {
    console.log('Personality content not found');
  }

  // Serialize data for client component
  const resultData = {
    _id: result._id.toString(),
    personalityType: result.personalityType,
    alternativeTypes: (result.alternativeTypes ?? []) as string[],
    scores: result.scores,
    completedAt: result.completedAt.toISOString(),
    user: result.userId
      ? {
        name: (result.userId as unknown as { name: string }).name,
        userType: (result.userId as unknown as { userType: 'guest' | 'registered' }).userType,
      }
      : null,
  };

  const contentData = personalityContent
    ? {
      title: personalityContent.title,
      slug: personalityContent.slug,
      subtitle: personalityContent.subtitle,
      personalityName: personalityContent.personalityName,
      personalityGroup: personalityContent.personalityGroup,
      mainImage: personalityContent.mainImage,
    }
    : null;

  return <ResultClient result={resultData} content={contentData} />;
}