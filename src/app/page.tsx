import Link from "next/link";

import {
  IconArrowUpRight,
  IconFileText,
  IconLogin,
  IconSparkles,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#f4f4f5] to-[#fafafa]">
      <Button size="lg"
      >
        Login
        <IconLogin />
      </Button>
      <header className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-[#7c3aed]" />
          <span className="font-heading text-sm font-semibold tracking-[0.25px] text-[#27272a]">
            PERSONA{" "}
            <span className="text-[#7c3aed]">
              MY<span className="text-[#27272a]">.ID</span>
            </span>
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="#artikel-panduan"
            className="font-heading text-sm font-normal tracking-[0.25px] text-[#27272a]"
          >
            Artikel Panduan
          </Link>
          <Link
            href="#blog"
            className="font-heading text-sm font-normal tracking-[0.25px] text-[#27272a]"
          >
            Blog
          </Link>
          <Link
            href="#buku"
            className="font-heading text-sm font-normal tracking-[0.25px] text-[#27272a]"
          >
            Buku (Legacy)
          </Link>

          <Button size="lg"
          >
            Login
            <IconLogin />
          </Button>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-[1440px] px-10 pt-[189px]">
        <div className="grid grid-cols-[3fr_2fr] gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h1 className="font-heading text-[60px] font-medium leading-[1.1] tracking-[-1px] text-[#27272a]">
                Kenali dirimu untuk menemukan pekerjaan terbaik
              </h1>
              <p className="max-w-[480px] font-body text-[18px] font-normal leading-[28px] tracking-[-0.1px] text-[#3f3f46]">
                Tes kepribadian MBTI online &amp; panduan potensi diri dalam
                mencapai karir terbaik
              </p>
            </div>

            <div className="grid w-fit grid-cols-3 gap-2">
              <div className="h-[196px] w-[232px] rounded-2xl bg-[#71717a] p-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="size-10 rounded-full bg-[#d4d4d8] ring-2 ring-[#71717a]" />
                    <div className="size-10 rounded-full bg-[#a1a1aa] ring-2 ring-[#71717a]" />
                    <div className="size-10 rounded-full bg-[#e4e4e7] ring-2 ring-[#71717a]" />
                    <div className="size-10 rounded-full bg-[#d4d4d8] ring-2 ring-[#71717a]" />
                    <div className="size-10 rounded-full bg-[#a1a1aa] ring-2 ring-[#71717a]" />
                  </div>
                </div>

                <div className="mt-10 flex items-start gap-[6px]">
                  <div className="font-heading text-[36px] font-medium leading-[1.2] text-[#f4f4f5]">
                    16
                  </div>
                  <div className="whitespace-pre-line font-body text-sm font-medium leading-[1.25] tracking-[-0.1px] text-[#f4f4f5]">
                    tipe{"\n"}kepribadian
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-1.5">
                  <div className="font-heading text-[20px] font-medium leading-[1.2] tracking-[0.1px] text-[#d4d4d8]">
                    100+
                  </div>
                  <div className="font-body text-sm font-medium leading-none tracking-[-0.1px] text-[#d4d4d8]">
                    artikel panduan
                  </div>
                </div>
              </div>

              <div className="h-[196px] w-[232px] rounded-2xl bg-[#a1a1aa] p-4">
                <div className="flex items-center justify-between">
                  <div className="font-body text-[18px] font-medium leading-[28px] tracking-[-0.1px] text-[#f4f4f5]">
                    Hasil tes
                  </div>
                  <div className="flex items-center gap-1 text-[#f4f4f5]">
                    <IconSparkles className="size-4 opacity-70" />
                    <IconSparkles className="size-4 opacity-40" />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between font-mono text-sm leading-[18.6667px] tracking-[1.5px] text-[#d4d4d8]">
                    <span>20%</span>
                    <span className="text-[#e4e4e7]">80%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#d4d4d8]">
                    <div className="h-2 w-[80%] rounded-full bg-[#71717a]" />
                  </div>
                  <div className="flex items-center justify-between font-body text-xs font-medium leading-[1.25] tracking-[-0.1px] text-[#e4e4e7]">
                    <span>Extroverted</span>
                    <span>Introverted</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between font-mono text-sm leading-[18.6667px] tracking-[1.5px] text-[#d4d4d8]">
                    <span>55%</span>
                    <span className="text-[#e4e4e7]">45%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#d4d4d8]">
                    <div className="h-2 w-[55%] rounded-full bg-[#71717a]" />
                  </div>
                  <div className="flex items-center justify-between font-body text-xs font-medium leading-[1.25] tracking-[-0.1px] text-[#e4e4e7]">
                    <span>Sensory</span>
                    <span>Intuitive</span>
                  </div>
                </div>
              </div>

              <div className="h-[196px] w-[232px] rounded-2xl bg-[#e4e4e7] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-heading text-[48px] font-medium leading-[60px] tracking-[-0.5px] text-[#71717a]">
                      500+
                    </div>
                    <div className="whitespace-pre-line font-body text-sm font-medium leading-[1.25] tracking-[-0.1px] text-[#71717a]">
                      tes telah{"\n"}dikerjakan
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#d4d4d8] p-2">
                    <IconFileText className="size-6 text-[#71717a]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pl-6">
            <div className="h-[530px] w-[480px] rounded-2xl bg-[#27272a] p-10">
              <div className="flex w-[400px] flex-col gap-10">
                <div className="flex items-start justify-between">
                  <h2 className="font-heading text-[30px] font-semibold leading-[36px] tracking-[0.25px] text-[#fafafa]">
                    Mulai Tes Gratis
                  </h2>
                  <div className="grid size-8 place-items-center rounded-full bg-[#3f3f46]">
                    <IconArrowUpRight className="size-4 text-[#a1a1aa]" />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <Input
                    className="h-10 rounded-lg border-[#e4e4e7] bg-white px-4 py-0 text-sm text-[#27272a] shadow-none placeholder:text-[#71717a]"
                    placeholder="Masukan nama kamu..."
                  />

                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-[#e4e4e7] bg-white px-4 text-left font-body text-sm font-normal leading-[20px] tracking-[0px] text-[#71717a]"
                  >
                    <span>Placeholder</span>
                    <span className="text-[#71717a]">▾</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-[#fafafa] px-3 py-1">
                      <span className="size-2 rounded-full bg-[#7c3aed]" />
                      <span className="font-heading text-sm font-normal leading-none tracking-[0.25px] text-[#27272a]">
                        Laki-laki
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-[#71717a] bg-transparent px-3 py-1">
                      <span className="size-2 rounded-full border border-[#71717a]" />
                      <span className="font-heading text-sm font-normal leading-none tracking-[0.25px] text-[#e4e4e7]">
                        Perempuan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-10">
                  <Button className="h-12 w-full rounded-full bg-gradient-to-r from-[#9333ea] to-[#6366f1] font-heading text-base font-normal leading-none tracking-[0.25px] text-[#fafafa] hover:from-[#9333ea]/90 hover:to-[#6366f1]/90">
                    Mulai Tes
                  </Button>

                  <div className="flex items-center gap-1 font-body text-sm font-normal leading-[20px] tracking-[0px] text-[#e4e4e7]">
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
    </main >
  );
}