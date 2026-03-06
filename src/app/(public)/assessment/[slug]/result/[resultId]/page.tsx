import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db/mongodb';
import Result from '@/lib/db/models/Result';
import Content from '@/lib/db/models/Content';
import ResultClient from './ResultClient';

/**
 * Result Page - Server Component
 * 
 * Displays assessment results with personality type and scores
 */
export default async function ResultPage({
  params,
}: {
  params: Promise<{ slug: string; resultId: string }>;
}) {
  await connectDB();

  // Fetch result
  const result = await Result.findById((await params).resultId)
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
    alternativeTypes: result.alternativeTypes,
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