import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-[#4635B1] flex flex-col gap-6 items-center overflow-clip">
      <div className="flex flex-col items-center gap-6 mt-32">
        <div className="text-[#B771E5] text-9xl font-bold">GlobeTrotter</div>
        <div className="text-[#FFFBCA] text-3xl font-bold">
          YOUR ULTIMATE TRAVEL GUESSING GAME
        </div>
        <Link
          href="/game"
          className="bg-[#AEEA94] py-4 px-6 text-white rounded-2xl font-bold"
        >
          <div> Play Now!</div>
        </Link>
      </div>
      <Image
        className="absolute bottom-0 translate-y-[1000px] animate-spin-slow infinite duration-75"
        alt="Earth"
        src="/earth.svg"
        width={1500}
        height={1500}
      />
    </div>
  );
}
