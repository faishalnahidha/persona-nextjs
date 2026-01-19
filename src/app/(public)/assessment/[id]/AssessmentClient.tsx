'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface Option {
  text: string;
  value: string;
}

interface Question {
  _id: string;
  group: string;
  text: string;
  options: [Option, Option];
}

interface Assessment {
  _id: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  questionCounts: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
}

export default function AssessmentClient({
  assessment,
}: {
  assessment: Assessment;
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = assessment.questions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  // Load saved answers from sessionStorage (for guests)
  useEffect(() => {
    const saved = sessionStorage.getItem(`assessment_${assessment._id}`);
    if (saved) {
      const { answers: savedAnswers, currentQuestion: savedCurrent } =
        JSON.parse(saved);
      setAnswers(savedAnswers);
      setCurrentQuestion(savedCurrent);
      setShowInstructions(false);
    }
  }, [assessment._id]);

  // Auto-save to sessionStorage
  useEffect(() => {
    if (!showInstructions && Object.keys(answers).length > 0) {
      sessionStorage.setItem(
        `assessment_${assessment._id}`,
        JSON.stringify({ answers, currentQuestion }),
      );
    }
  }, [answers, currentQuestion, assessment._id, showInstructions]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSave = () => {
    // Prompt user to register to save progress
    if (
      confirm(
        'Untuk menyimpan progress, Anda perlu mendaftar. Lanjutkan ke halaman registrasi?',
      )
    ) {
      // Store current state before redirecting
      sessionStorage.setItem(
        `assessment_${assessment._id}`,
        JSON.stringify({ answers, currentQuestion }),
      );
      router.push('/register');
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < totalQuestions) {
      alert(
        `Anda belum menjawab semua pertanyaan. ${Object.keys(answers).length}/${totalQuestions} dijawab.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert answers object to array in question order
      const answersArray = assessment.questions.map(q => answers[q._id]);

      // Submit to API
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessment._id,
          answers: answersArray,
          questionCounts: assessment.questionCounts,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Clear session storage
        sessionStorage.removeItem(`assessment_${assessment._id}`);

        // Redirect to results page
        router.push(`/assessment/${assessment._id}/result/${result.resultId}`);
      } else {
        alert('Terjadi kesalahan: ' + result.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan saat mengirim hasil tes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showInstructions) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6'>
        <div className='max-w-2xl w-full bg-white rounded-lg shadow-lg p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-4'>
            {assessment.title}
          </h1>
          <p className='text-gray-600 mb-6'>{assessment.description}</p>

          {assessment.instructions && (
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6'>
              <h2 className='font-semibold text-blue-900 mb-2'>Instruksi:</h2>
              <p className='text-blue-800'>{assessment.instructions}</p>
            </div>
          )}

          <div className='bg-gray-50 rounded-lg p-4 mb-6'>
            <p className='text-sm text-gray-600 mb-2'>
              <strong>Jumlah Pertanyaan:</strong> {totalQuestions}
            </p>
            <p className='text-sm text-gray-600'>
              <strong>Estimasi Waktu:</strong> {Math.ceil(totalQuestions * 0.5)}{' '}
              menit
            </p>
          </div>

          <button
            onClick={() => setShowInstructions(false)}
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
          >
            Mulai Tes
          </button>
        </div>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];
  const isAnswered = !!answers[question._id];
  const allAnswered = Object.keys(answers).length === totalQuestions;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Header with Progress */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-800'>
              Pertanyaan {currentQuestion + 1} dari {totalQuestions}
            </h2>
            <button
              onClick={handleSave}
              className='flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium'
            >
              <Save size={18} />
              Simpan Progress
            </button>
          </div>

          {/* Progress Bar */}
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-indigo-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className='text-sm text-gray-600 mt-2'>
            {Object.keys(answers).length} dari {totalQuestions} dijawab
          </p>
        </div>

        {/* Question Card */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
          <div className='mb-2'>
            <span className='inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full'>
              Group: {question.group}
            </span>
          </div>

          <h3 className='text-xl font-semibold text-gray-800 mb-6'>
            {question.text}
          </h3>

          <div className='space-y-4'>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question._id, option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[question._id] === option.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${answers[question._id] === option.value
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                      }`}
                  >
                    {answers[question._id] === option.value && (
                      <div className='w-2 h-2 bg-white rounded-full' />
                    )}
                  </div>
                  <span className='text-gray-700'>{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className='flex items-center justify-between gap-4'>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className='flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <ChevronLeft size={20} />
            Sebelumnya
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className='flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Memproses...' : 'Selesai & Lihat Hasil'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className='flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed'
            >
              Selanjutnya
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Help Text */}
        {!isAnswered && (
          <p className='text-center text-sm text-gray-500 mt-4'>
            Pilih salah satu jawaban untuk melanjutkan
          </p>
        )}
      </div>
    </div>
  );
}
