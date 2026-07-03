'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconAlertCircle,
} from '@tabler/icons-react';
import { ScoreBadge } from './ScoreBadge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';

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
        sessionStorage.setItem('guest_user_id', result.userId);
        sessionStorage.setItem(
          'guest_result_url',
          `/assessment/${assessment.slug}/result/${result.resultId}`,
        );
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

  // ── Assessment Layout ────────────────────────────────────────────────────────
  const question = assessment.questions[currentQuestion];
  const isAnswered = !!answers[question._id];
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className='min-h-screen'>
      <Header />
      <div className='flex justify-center py-20 md:pt-38'>
        <div className='max-w-3xl w-full flex flex-col gap-6 px-6 lg:px-0'>

          {showInstructions ? (
            <>
              {/* ── Instruction Page ──────────────────────────────────────────────────────── */}
              {/* Main intro card */}
              <div className='flex flex-col bg-card border border-brand-neutral-200 rounded-2xl p-4 md:p-10 gap-4 md:gap-6'>

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
              <div className='bg-card border border-border rounded-2xl px-4 py-2 md:px-6 md:py-4'>
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
            </>
          ) : (
            <>
              {/* ── Assessment Page ──────────────────────────────────────────────────────── */}
              {/* Progress card */}
              <div className='flex flex-col bg-card border border-border rounded-2xl p-4 md:p-6 gap-4 md:gap-6'>

                {/* Header row */}
                <div className='flex flex-col md:flex-row items-stretch md:items-center justify-start md:justify-between gap-2 md:gap-4'>
                  <div className='flex items-center gap-4'>
                    {guestData?.guestName && (
                      <span className='heading-4 text-foreground'>
                        Hai {guestData.guestName}!
                      </span>
                    )}
                    <ScoreBadge score={100} className='hidden md:flex' />
                  </div>
                  <div className='flex items-center gap-2'>
                    <ScoreBadge score={100} className='flex md:hidden' />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSave}
                      className='rounded-full'
                    >
                      <IconDeviceFloppy />
                      Simpan Progress
                    </Button>

                  </div>

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
                            : 'text-muted-foreground opacity-32'
                            }
                        ${cp === 0
                              ? 'opacity-0'
                              : ''
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
              <div className='flex flex-col bg-card border border-border rounded-2xl p-4 md:p-10 gap-4 md:gap-6'>
                <div className='heading-4 text-card-foreground'>
                  {question.text}
                </div>

                <RadioGroup
                  value={answers[question._id] ?? ''}
                  onValueChange={(val) => handleAnswer(question._id, val)}
                  className='flex flex-col gap-4'
                >
                  {question.options.map((option, index) => (
                    <FieldLabel
                      key={index}
                      htmlFor={`${question._id}-${index}`}
                      className='rounded-xl! border-border has-data-[state=checked]:border-brand-accent-600 has-data-[state=checked]:bg-brand-accent-200 hover:border-border hover:bg-brand-accent-50 transition-all cursor-pointer'
                    >
                      <Field orientation='horizontal'>
                        <RadioGroupItem
                          value={option.value}
                          id={`${question._id}-${index}`}
                          className='shrink-0 mt-1! border-brand-neutral-300 data-[state=checked]:border-brand-accent-500 [&>span>svg]:fill-brand-accent-700'
                        />
                        <FieldContent>
                          <span className='para-regular-medium text-card-foreground'>
                            {option.text}
                          </span>
                        </FieldContent>
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </div>

              {/* Navigation */}
              <div className='flex items-center py-2 gap-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className='rounded-full'
                  >
                    <IconChevronLeft />
                  </Button>

                  {isLastQuestion ? (
                    <Button
                      variant="default"
                      size="icon-lg"
                      onClick={handleSubmit}
                      disabled={!allAnswered || isSubmitting}
                      className='rounded-full'
                    >
                      <span className='btn-text-sm text-primary-foreground'>
                        {isSubmitting ? 'Memproses...' : 'Selesai'}
                      </span>
                      <IconChevronRight />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon-lg"
                      onClick={handleNext}
                      disabled={!isAnswered}
                      className='rounded-full icon-lg'
                    >
                      <IconChevronRight />
                    </Button>
                  )}
                </div>

                {!isAnswered && (
                  <p className='text-left para-sm text-muted-foreground'>
                    Pilih salah satu jawaban untuk melanjutkan
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
