import {
  IconFileTextSpark,
  IconFlareFilled,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import { HeroForm } from "@/components/hero-form";

function IllustrationCardPersonality() {
  return (
    <div className="w-full h-full rounded-2xl bg-brand-neutral-500 p-4">
      <div className="flex flex-col h-full justify-between gap-4">
        <div className="flex flex-col gap-3">
          <AvatarGroup className="*:data-[slot=avatar]:ring-brand-neutral-500">
            <Avatar className="size-9 lg:size-12 bg-brand-neutral-600">
              <AvatarImage src="/images/avatar-tp/avatar-tp-enfp.webp" alt="ENFP" />
              <AvatarFallback className="bg-brand-neutral-600" />
            </Avatar>
            <Avatar className="size-9 lg:size-12  bg-brand-neutral-400">
              <AvatarImage src="/images/avatar-tp/avatar-tp-entj.webp" alt="ENTJ" />
              <AvatarFallback className="bg-brand-neutral-400" />
            </Avatar>
            <Avatar className="size-9 lg:size-12 bg-brand-neutral-600">
              <AvatarImage src="/images/avatar-tp/avatar-tp-esfp.webp" alt="ESFP" />
              <AvatarFallback className="bg-brand-neutral-600" />
            </Avatar>
            <Avatar className="size-9 lg:size-12 bg-brand-neutral-400">
              <AvatarImage src="/images/avatar-tp/avatar-tp-isfj.webp" alt="ISFJ" />
              <AvatarFallback className="bg-brand-neutral-400" />
            </Avatar>
          </AvatarGroup>

          <div className="flex items-center gap-2 ">
            <div className="text-4xl/11 font-medium font-heading text-brand-neutral-100">
              16
            </div>
            <div className="whitespace-pre-line para-sm-medium text-brand-neutral-100">
              tipe{"\n"}kepribadian
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-0 lg:gap-2">
          <div className="text-xl font-medium font-heading text-brand-neutral-300">
            100+
          </div>
          <div className="para-sm-medium text-brand-neutral-300">
            artikel panduan
          </div>
        </div>
      </div>
    </div>
  );
}

function IllustrationCardTestResult() {
  return (
    <div className="w-full h-full rounded-2xl bg-brand-neutral-400 p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium text-brand-neutral-100">
          Hasil tes
        </div>
        <div className="flex items-center gap-1">
          <IconFlareFilled className="size-5 text-brand-neutral-300" />
          <IconFlareFilled className="size-5 text-brand-neutral-300" />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex h-8 overflow-hidden rounded-full border-2 border-brand-neutral-600">
          <div className="flex w-[30%] items-center px-3 bg-transparent">
            <span className="text-sm font-medium font-mono text-brand-neutral-200">30%</span>
          </div>
          <div className="flex flex-1 items-center justify-end px-3 bg-brand-neutral-600">
            <span className="text-sm font-medium font-mono text-brand-neutral-200">70%</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-1 text-[0.625rem] text-brand-neutral-300">
          <span>Extroverted</span>
          <span>Introverted</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex h-8 overflow-hidden rounded-full border-2 border-brand-neutral-600">
          <div className="flex w-[55%] items-center px-3 bg-brand-neutral-600">
            <span className="text-sm font-medium text-brand-neutral-200">55%</span>
          </div>
          <div className="flex flex-1 items-center justify-end px-3 bg-transparent">
            <span className="text-sm font-medium text-brand-neutral-200">45%</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-1 text-[0.625rem] text-brand-neutral-300">
          <span>Sensory</span>
          <span>Intuitive</span>
        </div>
      </div>
    </div>
  );
}

function IllustrationCardTestCount() {
  return (
    <div className="col-span-2 xl:col-span-1 flex flex-row xl:flex-col w-full h-full rounded-2xl bg-brand-neutral-200 p-4 ">
      <div className="flex flex-row xl:flex-col items-start justify-center gap-2 xl:gap-0">
        <div className="text-4xl/11 xl:text-5xl font-heading font-medium text-brand-neutral-500">
          500+
        </div>
        <div className="whitespace-pre-line w-30 my-1 text-sm font-medium text-brand-neutral-500">
          tes telah dikerjakan
        </div>
      </div>
      <div className="flex flex-1 items-end justify-end">
        <IconFileTextSpark className="size-12 xl:size-16 text-brand-neutral-400" stroke={1.5} />
      </div>
    </div>
  );
}

function GroupIllustrationCards({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 xl:grid-cols-3 gap-3 min-h-48 mt-2 xl:mt-4 pr-0 2xl:pr-20 ${className ?? ""}`}>
      <IllustrationCardPersonality />
      <IllustrationCardTestResult />
      <IllustrationCardTestCount />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="flex w-full h-fit md:min-h-screen items-center bg-linear-to-r from-zinc-100 to-gray-100 via-slate-100">
        <div className="container md:max-lg:w-lg mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] justify-start lg:justify-center gap-6 xl:gap-10 px-6 lg:px-10 pt-24 pb-10 lg:py-0">

          {/* Left Side */}
          <div className="flex flex-col items-stretch justify-center mb-6 lg:mb-0 gap-4 lg:gap-6">
            <div className="flex flex-col gap-4 lg:gap-6">
              <h1 className="text-center lg:text-left text-4xl/10 xl:text-6xl/16 font-semibold xl:font-medium tracking-[-0.016em] xl:tracking-[-0.031em] text-foreground">
                Kenali diri untuk temukan pekerjaan terbaik
              </h1>
              <p className="text-center lg:text-left para-regular xl:text-lg text-foreground-alt w-full xl:w-2/3">
                Tes kepribadian MBTI <span className="italic">online</span> &amp; panduan potensi diri dalam
                mencapai karir terbaik
              </p>
            </div>

            {/* Cards for illustration*/}
            <GroupIllustrationCards className="hidden lg:grid" />
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-stretch justify-center">
            <HeroForm />
          </div>

          {/* Cards for illustration on mobile*/}
          <GroupIllustrationCards className="lg:hidden" />
        </div>
      </section>
    </main>
  );
}