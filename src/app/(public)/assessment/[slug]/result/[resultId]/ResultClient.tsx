'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, UserPlus, BookOpen, Download } from 'lucide-react';

interface Result {
  _id: string;
  personalityType: string;
  alternativeType1?: string;
  alternativeType2?: string;
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

  // Calculate dominant traits
  const traits = {
    ei: result.scores.extrovert > result.scores.introvert ? 'Extrovert' : 'Introvert',
    sn: result.scores.sensory > result.scores.intuitive ? 'Sensory' : 'Intuitive',
    tf: result.scores.thinking > result.scores.feeling ? 'Thinking' : 'Feeling',
    jp: result.scores.judging > result.scores.perceiving ? 'Judging' : 'Perceiving',
  };

  const dimensions = [
    {
      name: 'Extrovert vs Introvert',
      left: { label: 'Extrovert (E)', value: result.scores.extrovert },
      right: { label: 'Introvert (I)', value: result.scores.introvert },
    },
    {
      name: 'Sensory vs Intuitive',
      left: { label: 'Sensory (S)', value: result.scores.sensory },
      right: { label: 'Intuitive (N)', value: result.scores.intuitive },
    },
    {
      name: 'Thinking vs Feeling',
      left: { label: 'Thinking (T)', value: result.scores.thinking },
      right: { label: 'Feeling (F)', value: result.scores.feeling },
    },
    {
      name: 'Judging vs Perceiving',
      left: { label: 'Judging (J)', value: result.scores.judging },
      right: { label: 'Perceiving (P)', value: result.scores.perceiving },
    },
  ];

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Saya adalah tipe kepribadian ${result.personalityType}! Temukan tipe kepribadian Anda di Persona.`;

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
    alert('Link berhasil disalin!');
    setShowShareOptions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Result Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              ✓ Tes Selesai
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Tipe Kepribadian Anda
          </h1>

          <div className="my-8">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-12 py-8">
              <div className="text-7xl font-bold tracking-wider">
                {result.personalityType}
              </div>
              {content?.personalityName && (
                <div className="text-xl mt-4 opacity-90">
                  {content.personalityName}
                </div>
              )}
            </div>
          </div>

          {content?.subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              {content.subtitle}
            </p>
          )}

          {/* Guest CTA */}
          {isGuest && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                💾 Simpan Hasil Tes Anda!
              </h3>
              <p className="text-yellow-800 mb-4">
                Daftar sekarang untuk menyimpan hasil tes dan mengakses konten eksklusif tentang kepribadian Anda.
              </p>
              <button
                onClick={() => router.push('/register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <UserPlus size={20} />
                Daftar Gratis
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {content && (
              <button
                onClick={() => router.push(`/content/${content.slug}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <BookOpen size={20} />
                Pelajari Tipe Kepribadian Anda
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-lg border-2 border-gray-300 transition-colors inline-flex items-center gap-2"
              >
                <Share2 size={20} />
                Bagikan Hasil
              </button>

              {showShareOptions && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-10">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    📱 WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    📘 Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    🐦 Twitter
                  </button>
                  <button
                    onClick={() => handleShare('telegram')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    ✈️ Telegram
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    🔗 Salin Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Skor Detail Kepribadian
          </h2>

          <div className="space-y-6">
            {dimensions.map((dim, index) => {
              const leftPercent = dim.left.value;
              const rightPercent = dim.right.value;

              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {dim.name}
                    </span>
                  </div>

                  {/* Dual Progress Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 w-32 text-right">
                      {dim.left.label}
                    </span>
                    <div className="flex-1 flex items-center">
                      {/* Left bar */}
                      <div className="flex-1 h-8 bg-gray-100 rounded-l-lg overflow-hidden flex justify-end items-center">
                        <div
                          className="bg-indigo-500 h-full flex items-center justify-end pr-2"
                          style={{ width: `${leftPercent}%` }}
                        >
                          {leftPercent > 15 && (
                            <span className="text-white text-sm font-semibold">
                              {leftPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Right bar */}
                      <div className="flex-1 h-8 bg-gray-100 rounded-r-lg overflow-hidden flex items-center">
                        <div
                          className="bg-purple-500 h-full flex items-center pl-2"
                          style={{ width: `${rightPercent}%` }}
                        >
                          {rightPercent > 15 && (
                            <span className="text-white text-sm font-semibold">
                              {rightPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-32">
                      {dim.right.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alternative Types */}
        {(result.alternativeType1 || result.alternativeType2) && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tipe Kepribadian Alternatif
            </h2>
            <p className="text-gray-600 mb-6">
              Berdasarkan skor Anda yang cukup seimbang pada beberapa dimensi, tipe kepribadian ini juga mungkin menggambarkan diri Anda:
            </p>

            <div className="flex gap-4">
              {result.alternativeType1 && (
                <div className="flex-1 bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-700">
                    {result.alternativeType1}
                  </div>
                  <div className="text-sm text-indigo-600 mt-1">
                    Alternatif 1
                  </div>
                </div>
              )}
              {result.alternativeType2 && (
                <div className="flex-1 bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-700">
                    {result.alternativeType2}
                  </div>
                  <div className="text-sm text-purple-600 mt-1">
                    Alternatif 2
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}