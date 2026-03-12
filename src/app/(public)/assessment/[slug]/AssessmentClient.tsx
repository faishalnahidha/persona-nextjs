'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconAlertCircle,
  IconCircleLetterS,
} from '@tabler/icons-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';

interface GuestData {
  guestName: string;
  dateOfBirth?: string;
  gender?: string;
}

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
  slug: string;
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

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Apakah hasil tes ini akurat?',
    answer:
      'Hasil tes didasarkan pada metodologi MBTI (Myers-Briggs Type Indicator) yang telah digunakan secara luas di dunia selama puluhan tahun. Kejujuran dalam menjawab setiap pertanyaan sangat memengaruhi akurasi hasil. Tidak ada jawaban benar atau salah — setiap tipe kepribadian memiliki kekuatan masing-masing.',
  },
  {
    id: 'faq-2',
    question: 'Apakah metode ini ilmiah?',
    answer:
      'Metode Tipologi Jung ataupun MBTI bukanlah alat pengukuran yang sangat acak seperti astrologi. Metode ini telah diteliti selama tujuh dekade oleh para ilmuan. Hasil riset membuktikan metode ini memiliki tingkat validitas dan reliabilitas mencapai 80–90% yang berarti memiliki tingkat keakuratan yang sangat tinggi dengan penyimpangan yang sangat kecil terhadap kesalahan hasilnya.',
  },
  {
    id: 'faq-3',
    question: 'Berapa lama waktu yang dibutuhkan?',
    answer:
      'Tes ini terdiri dari 70 pertanyaan dan umumnya membutuhkan waktu sekitar 15–20 menit. Jawablah dengan santai tanpa terburu-buru, karena tidak ada batas waktu.',
  },
  {
    id: 'faq-4',
    question: 'Apakah saya bisa mengulang tes?',
    answer:
      'Ya, kamu dapat mengulang tes kapan saja. Hasil bisa sedikit berbeda tergantung kondisi dan suasana hati saat menjawab. Cobalah menjawab sesuai kebiasaanmu sehari-hari, bukan situasi ideal. Coba juga untuk tidak terpengaruh norma/nilai di masyarakat dan lingkungan sekitarmu.',
  },
];

const CHECKPOINTS = [0, 25, 50, 75, 100];

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
  const [guestData, setGuestData] = useState<GuestData | null>(null);

  const totalQuestions = assessment.questions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  useEffect(() => {
    const guestRaw = sessionStorage.getItem('guest_data');
    if (guestRaw) setGuestData(JSON.parse(guestRaw));
  }, []);

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
    if (
      confirm(
        'Untuk menyimpan progress, Anda perlu mendaftar. Lanjutkan ke halaman registrasi?',
      )
    ) {
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
      const answersArray = assessment.questions.map(q => answers[q._id]);

      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentSlug: assessment.slug,
          answers: answersArray,
          questionCounts: assessment.questionCounts,
          guestName: guestData?.guestName,
          dateOfBirth: guestData?.dateOfBirth,
          gender: guestData?.gender,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.removeItem(`assessment_${assessment._id}`);
        sessionStorage.removeItem('guest_data');
        router.push(`/assessment/${assessment.slug}/result/${result.resultId}`);
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

  // ── Instruction Page ───────────────────────────────────────────────────────
  if (showInstructions) {
    return (
      <div className='min-h-screen bg-background'>
        <Header scrollEffect={false} />
        <div className='flex justify-center my-20 md:mt-38'>
          <div className='max-w-3xl w-full flex flex-col gap-6 px-6 lg:px-0'>

            {/* Main intro card */}
            <div className='bg-card border border-brand-neutral-200 rounded-2xl p-4 md:p-10 flex flex-col gap-4 md:gap-6'>

              <div className='flex flex-col gap-2'>
                {guestData?.guestName && (
                  <h2 className='heading-2 text-foreground'>
                    Hai, {guestData.guestName}!
                  </h2>
                )}
                <h4 className='heading-4 text-foreground-alt'>
                  Selamat datang di {assessment.title}
                </h4>
                <div className='para-regular text-foreground-alt mt-2' dangerouslySetInnerHTML={{ __html: assessment.description }} />

              </div>

              {assessment.instructions && (
                <div className='bg-background border border-border rounded-xl p-4 flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <IconAlertCircle size={20} className='text-muted-foreground shrink-0' />
                    <span className='para-lg-bold text-accent-foreground'>Instruksi</span>
                  </div>
                  <div className='para-regular text-card-foreground' dangerouslySetInnerHTML={{ __html: assessment.instructions }} />
                  <div className='flex flex-col md:flex-row gap-2 md:gap-4'>
                    <span className='para-regular text-card-foreground'>
                      Jumlah Pertanyaan: <strong>{totalQuestions}</strong>
                    </span>
                    <span className='para-regular text-card-foreground'>
                      Estimasi Waktu: <strong>15–20 menit</strong>
                    </span>
                  </div>
                </div>
              )}

              <Button
                size="lg"
                onClick={() => setShowInstructions(false)}
                className='w-full rounded-full md:h-12'
              >
                Mulai Tes Sekarang
              </Button>
            </div>

            {/* FAQ card */}
            <div className='bg-card border border-brand-neutral-200 rounded-2xl px-4 py-2 md:px-6 md:py-4'>
              <Accordion type='single' collapsible className='w-full' defaultValue='faq-root'>
                <AccordionItem value='faq-root' className='border-none'>
                  <AccordionTrigger className='items-center text-2xl font-semibold text-foreground hover:no-underline py-2'>
                    FAQ
                  </AccordionTrigger>
                  <AccordionContent className='pb-0'>
                    <Accordion type='single' collapsible className='w-full'>
                      {FAQ_ITEMS.map((item, index) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className={index === FAQ_ITEMS.length - 1 ? 'border-none' : ''}
                        >
                          <AccordionTrigger className='text-base font-body font-semibold text-foreground-alt text-left'>
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className='para-regular text-foreground-alt'>
                              {item.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── Assessment Page ────────────────────────────────────────────────────────
  const question = assessment.questions[currentQuestion];
  const isAnswered = !!answers[question._id];
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className='min-h-screen bg-background'>
      <Header scrollEffect={false} />
      <div className='p-6 pt-20 md:pt-24'>
        <div className='max-w-[768px] mx-auto flex flex-col gap-6'>

          {/* Progress card */}
          <div className='bg-card border border-brand-neutral-200 rounded-2xl p-6 flex flex-col gap-6'>

            {/* Header row */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                {guestData?.guestName && (
                  <span className='heading-4 text-foreground'>
                    {guestData.guestName}
                  </span>
                )}
                {/* Static score badge */}
                <div className='bg-brand-neutral-200 rounded-lg px-2 py-0.5 flex items-center gap-1'>
                  <IconCircleLetterS size={12} className='text-foreground' />
                  <span className='para-mini-medium font-mono text-foreground'>100</span>
                </div>
              </div>

              <button
                onClick={handleSave}
                className='rounded-full border border-brand-neutral-200 px-4 py-2 flex items-center gap-2 hover:bg-background transition-colors'
              >
                <IconDeviceFloppy size={16} className='text-foreground' />
                <span className='btn-text-sm text-foreground'>Simpan Progress</span>
              </button>
            </div>

            {/* Progress bar with checkpoint labels */}
            <div className='flex flex-col gap-2'>
              <div className='relative h-5 w-full'>
                {/* Track */}
                <div className='absolute inset-0 bg-brand-neutral-300 rounded-full' />
                {/* Fill */}
                <div
                  className='absolute left-0 top-0 h-5 bg-primary rounded-full transition-all duration-300'
                  style={{ width: `${progress}%` }}
                />
                {/* Checkpoint labels */}
                <div className='absolute inset-0 flex justify-between items-center px-2'>
                  {CHECKPOINTS.map(cp => (
                    <span
                      key={cp}
                      className={`para-mini-medium leading-none ${progress >= cp
                        ? 'text-primary-foreground font-semibold'
                        : 'text-muted-foreground opacity-80'
                        }`}
                    >
                      {cp}%
                    </span>
                  ))}
                </div>
              </div>

              <p className='para-sm text-muted-foreground'>
                Pertanyaan {currentQuestion + 1} dari {totalQuestions}
              </p>
            </div>

          </div>

          {/* Question card */}
          <div className='bg-card border border-brand-neutral-200 rounded-2xl p-10 flex flex-col gap-6'>
            <h3 className='heading-4 text-card-foreground'>
              {question.text}
            </h3>

            <div className='flex flex-col gap-4'>
              {question.options.map((option, index) => {
                const selected = answers[question._id] === option.value;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question._id, option.value)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${selected
                      ? 'bg-brand-accent-200 border-brand-accent-600'
                      : 'bg-card border-brand-neutral-200 hover:border-brand-neutral-300'
                      }`}
                  >
                    <div className='flex items-start gap-3'>
                      <div
                        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selected
                          ? 'border-brand-accent-500 bg-white'
                          : 'border-brand-neutral-300 bg-white'
                          }`}
                      >
                        {selected && (
                          <div className='w-2.5 h-2.5 bg-brand-accent-700 rounded-full' />
                        )}
                      </div>
                      <span
                        className={selected ? 'para-regular-medium text-card-foreground' : 'para-regular text-card-foreground'}
                      >
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-between'>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className='w-10 h-10 rounded-xl border border-brand-neutral-200 bg-card flex items-center justify-center hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <IconChevronLeft size={20} className='text-foreground' />
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className='flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary border border-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90'
              >
                <span className='btn-text-sm text-primary-foreground'>
                  {isSubmitting ? 'Memproses...' : 'Selesai'}
                </span>
                <IconChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className='w-10 h-10 rounded-xl border border-brand-neutral-200 bg-card flex items-center justify-center hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <IconChevronRight size={20} className='text-foreground' />
              </button>
            )}
          </div>

          {!isAnswered && (
            <p className='text-center para-sm text-muted-foreground'>
              Pilih salah satu jawaban untuk melanjutkan
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
