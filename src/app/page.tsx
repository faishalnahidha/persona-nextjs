import Link from "next/link";

import {
  IconArrowDownLeft,
  IconFileTextSpark,
  IconFlareFilled,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="w-full h-screen bg-linear-to-r from-brand-neutral-100 to-brand-neutral-50">
        <div className="container mx-auto w-full h-full items-center grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 md:gap-6 lg:gap-10 px-6 md:px-10">

          {/* Left Side */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h1 className="text-6xl font-medium text-foreground">
                Kenali diri untuk temukan pekerjaan terbaik
              </h1>
              <p className="para-lg text-foreground-alt">
                Tes kepribadian MBTI <span className="italic">online</span> &amp; panduan potensi diri dalam
                mencapai karir terbaik
              </p>
            </div>

            {/* Cards for illustration*/}
            <div className="grid grid-cols-3 gap-2 min-h-48 py-4 pr-0 2xl:pr-20">
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
                  <IconFileTextSpark className="size-16 text-brand-neutral-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="pl-6">
            <div className="h-[530px] w-[480px] rounded-2xl bg-[#27272a] p-10">
              <div className="flex w-[400px] flex-col gap-10">
                <div className="flex items-start justify-between">
                  <h2 className="text-heading-2 text-[#fafafa]">
                    Mulai Tes Gratis
                  </h2>
                  <div className="grid size-8 place-items-center rounded-full bg-[#3f3f46]">
                    <IconArrowDownLeft className="size-4 text-[#a1a1aa]" />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <Input
                    className="h-10 rounded-lg border-[#e4e4e7] bg-white px-4 py-0 text-sm text-[#27272a] shadow-none placeholder:text-[#71717a]"
                    placeholder="Masukan nama kamu..."
                  />

                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e4e4e7] bg-white px-4 text-left text-body-sm text-[#71717a]"
                  >
                    <span>Placeholder</span>
                    <span className="text-[#71717a]">▾</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-[#fafafa] px-3 py-1">
                      <span className="size-2 rounded-full bg-[#7c3aed]" />
                      <span className="text-label leading-none text-[#27272a]">
                        Laki-laki
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-[#71717a] bg-transparent px-3 py-1">
                      <span className="size-2 rounded-full border border-[#71717a]" />
                      <span className="text-label leading-none text-[#e4e4e7]">
                        Perempuan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-10">
                  <Button className="h-12 w-full rounded-full bg-gradient-to-r from-[#9333ea] to-[#6366f1] text-button text-[#fafafa] hover:from-[#9333ea]/90 hover:to-[#6366f1]/90">
                    Mulai Tes
                  </Button>

                  <div className="flex items-center gap-1 text-body-sm text-[#e4e4e7]">
                    <span>Sudah punya akun?</span>
                    <Link href="/login" className="text-[#fafafa]">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}