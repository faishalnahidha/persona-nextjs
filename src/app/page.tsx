import {
  IconFileTextSpark,
  IconFlareFilled,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import { HeroForm } from "@/components/hero-form";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="flex w-full h-screen items-center bg-linear-to-r from-brand-neutral-100 to-brand-neutral-50">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] justify-center gap-4 md:gap-6 lg:gap-10 px-6 md:px-10">

          {/* Left Side */}
          <div className="flex flex-col items-stretch justify-center gap-6">
            <div className="flex flex-col gap-6">
              <h1 className="text-6xl/16 font-medium text-foreground">
                Kenali diri untuk temukan pekerjaan terbaik
              </h1>
              <p className="para-lg text-foreground-alt w-full xl:w-2/3">
                Tes kepribadian MBTI <span className="italic">online</span> &amp; panduan potensi diri dalam
                mencapai karir terbaik
              </p>
            </div>

            {/* Cards for illustration*/}
            <div className="grid grid-cols-3 gap-2 min-h-48 mt-4 pr-0 2xl:pr-20">
              {/* Cards #1*/}
              <div className="w-full h-full rounded-2xl bg-brand-neutral-500 p-4">
                <div className="flex flex-col h-full justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <AvatarGroup className="*:data-[slot=avatar]:ring-brand-neutral-500">
                      <Avatar className="size-12 bg-brand-neutral-600">
                        <AvatarImage src="/images/avatar-tp/avatar-tp-enfp.webp" alt="ENFP" />
                        <AvatarFallback className="bg-brand-neutral-600" />
                      </Avatar>
                      <Avatar className="size-12  bg-brand-neutral-400">
                        <AvatarImage src="/images/avatar-tp/avatar-tp-entj.webp" alt="ENTJ" />
                        <AvatarFallback className="bg-brand-neutral-400" />
                      </Avatar>
                      <Avatar className="size-12 bg-brand-neutral-600">
                        <AvatarImage src="/images/avatar-tp/avatar-tp-esfp.webp" alt="ESFP" />
                        <AvatarFallback className="bg-brand-neutral-600" />
                      </Avatar>
                      <Avatar className="size-12 bg-brand-neutral-400">
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

                  <div className="flex items-center gap-2">
                    <div className="text-xl font-medium font-heading text-brand-neutral-300">
                      100+
                    </div>
                    <div className="para-sm-medium text-brand-neutral-300">
                      artikel panduan
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards #2*/}
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
              {/* Cards #3*/}
              <div className="w-full h-full rounded-2xl bg-brand-neutral-200 p-4 flex flex-col">
                <div>
                  <div className="text-5xl font-heading font-medium text-brand-neutral-500">
                    500+
                  </div>
                  <div className="whitespace-pre-line w-30 my-1 text-sm font-medium text-brand-neutral-500">
                    tes telah dikerjakan
                  </div>
                </div>
                <div className="flex flex-1 items-end justify-end">
                  <IconFileTextSpark className="size-16 text-brand-neutral-400" stroke={1.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-stretch justify-center">
            <HeroForm />
          </div>
        </div>
      </section>
    </main>
  );
}