"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChallengePage() {
  const router = useRouter();
  const [challenger, setChallenger] = useState<string | null>(null);
  const [scoreToBeat, setScoreToBeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeUser = urlParams.get("challenge");

    if (challengeUser) {
      setChallenger(challengeUser);

      // Fetch high score from User API
      fetch(`http://localhost:5000/api/user/${challengeUser}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setScoreToBeat(null);
          } else {
            setScoreToBeat(data.highScore);
          }
        })
        .catch(() => setScoreToBeat(null))
        .finally(() => setLoading(false));
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#B771E5] text-white">
      {loading ? (
        <p className="text-lg">Loading challenge...</p>
      ) : challenger && scoreToBeat !== null ? (
        <>
          <h1 className="text-4xl font-bold">
            ⚡ {challenger} challenged you!
          </h1>
          <p className="text-2xl mt-4">
            They scored <span className="font-bold">{scoreToBeat} points</span>!
          </p>
          <p className="text-lg mt-2">Can you beat their high score? 🔥</p>

          <button
            className="mt-6 bg-yellow-500 text-black px-6 py-2 rounded text-lg font-bold"
            onClick={() => router.push("/game")}
          >
            Accept Challenge 🚀
          </button>
        </>
      ) : (
        <p className="text-lg">Challenge not found.</p>
      )}
    </div>
  );
}
