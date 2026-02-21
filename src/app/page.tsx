import Link from "next/link";

import {
  IconArrowDownLeft,
  IconFileTextSpark,
  IconLogin2,
  IconFlareFilled,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-r from-brand-neutral-100 to-brand-neutral-50">
      <header className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-brand-accent-600" />
          <span className="text-nav font-semibold text-brand-accent-500">
            PERSONA{" "}
            <span className="text-[#7c3aed]">
              MY<span className="text-[#27272a]">.ID</span>
            </span>
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="#artikel-panduan" className="text-nav text-[#27272a]">
            Artikel Panduan
          </Link>
          <Link href="#blog" className="text-nav text-[#27272a]">
            Blog
          </Link>
          <Link href="#buku" className="text-nav text-[#27272a]">
            Buku (Legacy)
          </Link>

          <Button size="lg"
          >
            Login
            <IconLogin2 />
          </Button>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-[1440px] px-10 pt-[189px]">
        <div className="grid grid-cols-[3fr_2fr] gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <h1 className="text-6xl font-medium text-[#27272a]">
                Kenali dirimu untuk menemukan pekerjaan terbaik
              </h1>
              <p className="para-lg text-[#3f3f46]">
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
                  </div>
                </div>

                <div className="mt-10 flex items-start gap-[6px]">
                  <div className="text-4xl font-medium font-heading text-[#f4f4f5]">
                    16
                  </div>
                  <div className="whitespace-pre-line text-sm font-medium tracking-[-0.1px] text-[#f4f4f5]">
                    tipe{"\n"}kepribadian
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-1.5">
                  <div className="text-heading-display-xs text-[#d4d4d8]">
                    100+
                  </div>
                  <div className="text-body-sm-medium leading-none text-[#d4d4d8]">
                    artikel panduan
                  </div>
                </div>
              </div>

              <div className="h-[196px] w-[232px] rounded-2xl bg-[#a1a1aa] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-body-lg-medium text-[#f4f4f5]">
                    Hasil tes
                  </div>
                  <div className="flex items-center gap-1 text-[#f4f4f5]">
                    <IconFlareFilled className="size-5 opacity-70" />
                    <IconFlareFilled className="size-5 opacity-40" />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-mono-sm text-[#d4d4d8]">
                    <span>20%</span>
                    <span className="text-[#e4e4e7]">80%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#d4d4d8]">
                    <div className="h-2 w-[80%] rounded-full bg-[#71717a]" />
                  </div>
                  <div className="flex items-center justify-between text-body-xs text-[#e4e4e7]">
                    <span>Extroverted</span>
                    <span>Introverted</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-mono-sm text-[#d4d4d8]">
                    <span>55%</span>
                    <span className="text-[#e4e4e7]">45%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#d4d4d8]">
                    <div className="h-2 w-[55%] rounded-full bg-[#71717a]" />
                  </div>
                  <div className="flex items-center justify-between text-body-xs text-[#e4e4e7]">
                    <span>Sensory</span>
                    <span>Intuitive</span>
                  </div>
                </div>
              </div>

              <div className="h-[196px] w-[232px] rounded-2xl bg-[#e4e4e7] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-heading-display-md text-[#71717a]">
                      500+
                    </div>
                    <div className="whitespace-pre-line text-body-sm-medium text-[#71717a]">
                      tes telah{"\n"}dikerjakan
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#d4d4d8] p-2">
                    <IconFileTextSpark className="size-6 text-[#71717a]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

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