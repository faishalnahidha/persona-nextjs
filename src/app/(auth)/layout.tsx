import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-image-background-gradient flex flex-col">
      <div className="flex items-center justify-center p-5 md:p-8">
        <Link href="/">
          <Image
            src="/images/logo-persona-full.svg"
            alt="Persona My Id Logo"
            width={160}
            height={26}
            priority
          />
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
