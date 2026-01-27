/**
 * Seed Script - Import MBTI Assessment Questions
 *
 * Run this once to populate your database with the 70 MBTI questions
 * Usage: npx tsx scripts/seed-assessment.ts
 */

// IMPORTANT: Load environment variables FIRST, before any imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

// NOW we can safely import database modules
import { connectDB } from '../src/lib/db/mongodb';
import Assessment from '../src/lib/db/models/Assessment';
import User from '../src/lib/db/models/User';
import questionData from './question-data.json';

const testCalculation = () => {
  // Test the scoring calculation
  console.log('\n🧪 Testing scoring calculation...');

  const counts = { EI: 10, SN: 20, TF: 20, JP: 20 };

  const testAnswers = [
    'I',
    'N',
    'N',
    'F',
    'F',
    'P',
    'J',
    'I',
    'N',
    'N',
    'T',
    'T',
    'J',
    'J',
    'I',
    'N',
    'S',
    'T',
    'F',
    'J',
    'J',
    'I',
    'S',
    'N',
    'F',
    'F',
    'J',
    'J',
    'I',
    'S',
    'S',
    'T',
    'F',
    'J',
    'J',
    'I',
    'N',
    'N',
    'T',
    'T',
    'J',
    'P',
    'I',
    'S',
    'S',
    'F',
    'T',
    'J',
    'P',
    'E',
    'S',
    'N',
    'F',
    'F',
    'J',
    'J',
    'I',
    'N',
    'N',
    'T',
    'T',
    'J',
    'J',
    'I',
    'S',
    'N',
    'F',
    'F',
    'J',
    'P',
  ];

  const result = Assessment.calculateResult(testAnswers, counts);
  console.log('   Test result:', result.personalityType);
  console.log('   Scores:', result.scores);
  console.log('   Alternative types:', result.alternativeTypes);
};

async function seedAssessment() {
  try {
    console.log('🔗 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');

    // Check if assessment already exists
    const existingAssessment = await Assessment.findOne({ published: true });
    if (existingAssessment) {
      console.log('⚠️  Assessment already exists. Skipping seed.');
      console.log(`   Assessment ID: ${existingAssessment._id}`);
      testCalculation();
      process.exit(0);
    }

    // Find or create an admin user to be the creator
    let adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.log('📝 Creating admin user...');
      adminUser = await User.create({
        userType: 'registered',
        email: 'admin@persona.my.id',
        password: 'admin123', // TODO: Hash this in production!
        username: 'admin',
        name: 'Administrator',
        role: 'admin',
      });
      console.log('✅ Admin user created');
    }

    // Transform question data to match schema
    const questions = questionData.question.map(q => ({
      _id: q._id,
      group: q.type,
      text: q.text,
      options: q.answer as [
        { text: string; value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' },
        { text: string; value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' },
      ],
    }));

    // Count questions by type for validation
    const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };
    questions.forEach(q => {
      counts[q.group as keyof typeof counts]++;
    });

    console.log('📊 Question distribution:');
    console.log(`   EI (Extrovert/Introvert): ${counts.EI} questions`);
    console.log(`   SN (Sensory/Intuitive): ${counts.SN} questions`);
    console.log(`   TF (Thinking/Feeling): ${counts.TF} questions`);
    console.log(`   JP (Judging/Perceiving): ${counts.JP} questions`);
    console.log(`   Total: ${questions.length} questions`);

    // Create assessment
    console.log('📝 Creating MBTI assessment...');
    const assessment = await Assessment.create({
      title: 'MBTI Personality Assessment',
      description:
        'Tes kepribadian MBTI untuk mengetahui tipe kepribadian Anda. Terdiri dari 70 pertanyaan yang akan mengungkap dimensi kepribadian Anda.',
      instructions:
        'Jawab setiap pertanyaan dengan jujur sesuai dengan preferensi dan kecenderungan Anda. Tidak ada jawaban yang benar atau salah. Pilih jawaban yang paling menggambarkan diri Anda.',
      questions,
      published: true,
      createdBy: adminUser._id,
    });

    console.log('✅ Assessment created successfully!');
    console.log(`   Assessment ID: ${assessment._id}`);
    console.log(`   Title: ${assessment.title}`);
    console.log(`   Questions: ${assessment.questions.length}`);

    // Test the scoring calculation
    testCalculation();

    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding assessment:', error);
    process.exit(1);
  }
}

seedAssessment();
