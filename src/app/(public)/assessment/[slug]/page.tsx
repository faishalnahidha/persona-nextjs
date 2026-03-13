import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db/mongodb';
import Assessment from '@/lib/db/models/Assessment';
import AssessmentClient from './AssessmentClient';

/**
 * Assessment Page - Server Component
 *
 * Fetches assessment data from database and passes to client component
 */
export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  // Fetch published assessment by slug
  const assessment = await Assessment.findOne({
    slug,
    published: true
  }).lean();

  if (!assessment || !assessment.published) {
    notFound();
  }


  // Calculate question counts for scoring

  const questionCounts = { EI: 0, SN: 0, TF: 0, JP: 0 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assessment.questions.forEach((q: any) => {
    questionCounts[q.group as keyof typeof questionCounts]++;
  });

  // Serialize data for client component
  const assessmentData = {
    _id: assessment._id.toString(),
    slug: assessment.slug,
    title: assessment.title,
    description: assessment.description,
    instructions: assessment.instructions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions: assessment.questions.map((q: any) => ({
      _id: q._id,
      group: q.group,
      text: q.text,
      options: q.options,
    })),
    questionCounts,
  };

  return <AssessmentClient assessment={assessmentData} />;
}
