"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/modal";

type Question = {
  _id: string;
  clues: string[];
  options: string[];
};

type AnswerResponse = {
  isCorrect: boolean;
  fun_fact: string[];
  trivia: string[];
};

export default function GamePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameState, setGameState] = useState<
    "playing" | "success" | "wrong" | "gameOver"
  >("playing");
  const [answerData, setAnswerData] = useState<AnswerResponse | null>(null);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [modalStage, setModalStage] = useState<
    "instructions" | "username" | "none"
  >("instructions");
  const [challenger, setChallenger] = useState<string | null>(null);
  const [challengerScore, setChallengerScore] = useState<number | null>(null);
  const [didWinChallenge, setDidWinChallenge] = useState<boolean | null>(null);

  // Fetch a question when the game starts
  useEffect(() => {
    fetch("http://localhost:5000/api/question")
      .then((res) => res.json())
      .then((data) => setQuestion(data));

    const urlParams = new URLSearchParams(window.location.search);
    const challengeUser = urlParams.get("challenge");

    if (challengeUser) {
      setChallenger(challengeUser);
      setUsername(challengeUser); // Auto-fill username

      // Fetch the challenger's high score
      fetch(`http://localhost:5000/api/user/${challengeUser}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.highScore !== undefined) {
            setChallengerScore(data.highScore);
          }
        })
        .catch(() => setChallengerScore(null));
    }
  }, []);

  // Handle closing the instructions modal
  const handleInstructionsClose = () => {
    setModalStage("username");
  };

  // Handle username submission
  const handleUsernameSubmit = () => {
    if (!username?.trim()) return;
    setModalStage("none"); // Close username modal and start game
  };

  // Handle answer submission
  const handleSubmit = () => {
    if (!question || !selectedOption) return;

    startTransition(async () => {
      const res = await fetch("http://localhost:5000/api/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId: question._id,
          answer: selectedOption,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data: AnswerResponse = await res.json();

      setAnswerData(data);

      if (data.isCorrect) {
        setScore((prev) => prev + 10);
        setGameState("success");
      } else {
        setLives((prevLives) => {
          const updatedLives = prevLives - 1;
          console.log("Lives left:", updatedLives); // ✅ Correctly logs updated value

          if (updatedLives === 0) {
            console.log("Game Over!"); // ✅ Logs "Game Over!"
            handleGameOver();
          } else {
            setGameState("wrong");
          }

          return updatedLives; // Ensure state updates correctly
        });
      }
    });
  };

  // Handle game over and update high score
  const handleGameOver = async () => {
    if (!username) return;

    try {
      await fetch("http://localhost:5000/api/user", {
        method: "POST",
        body: JSON.stringify({ username, highScore: score }),
        headers: { "Content-Type": "application/json" },
      });

      // Determine if the user won the challenge
      if (challengerScore !== null) {
        setDidWinChallenge(score > challengerScore);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }

    setGameState("gameOver");
  };

  // Fetch the next question
  const handleNextQuestion = async () => {
    setSelectedOption("");
    setGameState("playing");
    setAnswerData(null);

    const res = await fetch("http://localhost:5000/api/question");
    const newQuestion = await res.json();
    setQuestion(newQuestion);
  };

  // Restart the game
  const handleRestartGame = async () => {
    setLives(5);
    setScore(0);
    setGameState("playing");
    setAnswerData(null);

    const res = await fetch("http://localhost:5000/api/question");
    const newQuestion = await res.json();
    setQuestion(newQuestion);
  };

  // Generate challenge link
  const handleChallengeFriend = () => {
    const shareURL = `${window.location.origin}/challenge?challenge=${username}`;

    if (navigator.share) {
      navigator.share({
        title: "Globetrotter Challenge",
        text: `${username} challenged you in the Globetrotter game! Can you beat their high score?`,
        url: shareURL,
      });
    } else {
      navigator.clipboard.writeText(shareURL);
      alert("Challenge link copied! Share it with your friends.");
    }
  };

  if (!question)
    return <div className="text-white text-2xl">Loading Question...</div>;

  return (
    <div className="h-screen w-full bg-[#B771E5] flex flex-col items-center justify-center">
      {/* Display Hearts & Score */}
      <div className="absolute top-4 left-4 text-white text-xl">
        {"❤️".repeat(lives)}
      </div>
      <div className="absolute top-4 right-4 text-white text-xl">
        Score: {score}
      </div>

      {/* Game Playing Screen */}
      {gameState === "playing" && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6">Guess the City</h2>
          <p className="text-lg text-white">{question.clues[0]}</p>

          <div className="mt-6 flex flex-col gap-4">
            {question.options.map((option) => (
              <button
                key={option}
                className={`py-2 px-6 rounded ${
                  selectedOption === option
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </>
      )}

      {/* Success Screen */}
      {gameState === "success" && answerData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-600 text-white text-center">
          <h2 className="text-4xl font-bold">✅ Correct! 🎉</h2>
          <p className="text-lg mt-4">{answerData.trivia[0]}</p>
          <p className="text-lg mt-2">{answerData.fun_fact[0]}</p>
          <button
            className="mt-6 bg-white text-black px-6 py-2 rounded"
            onClick={handleNextQuestion}
          >
            Next Question →
          </button>
        </div>
      )}

      {/* Wrong Answer Screen */}
      {gameState === "wrong" && answerData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-600 text-white text-center">
          <h2 className="text-4xl font-bold">❌ Wrong Answer!</h2>
          <p className="text-lg mt-4">{answerData.trivia[1]}</p>
          <p className="text-lg mt-2">{answerData.fun_fact[1]}</p>
          <p className="text-lg mt-4">Lives left: {"❤️".repeat(lives)}</p>
          <button
            className="mt-6 bg-white text-black px-6 py-2 rounded"
            onClick={handleNextQuestion}
          >
            Try Next Question →
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === "gameOver" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white text-center">
          <h2 className="text-5xl font-bold">🎮 Game Over!</h2>
          <p className="text-2xl mt-4">Final Score: {score} points</p>

          {challenger && challengerScore !== null && (
            <div className="mt-6">
              {didWinChallenge === true ? (
                <p className="text-green-400 text-xl font-bold">
                  🎉 You beat {challenger}'s score of {challengerScore}!
                </p>
              ) : (
                <p className="text-red-400 text-xl font-bold">
                  ❌ {challenger} scored {challengerScore}. Try again!
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4">
            <button
              className="bg-yellow-500 text-black px-6 py-2 rounded text-lg font-bold"
              onClick={handleChallengeFriend}
            >
              Challenge a Friend 🚀
            </button>
            <button
              className="bg-white text-black px-6 py-2 rounded text-lg font-bold"
              onClick={handleRestartGame}
            >
              Play Again 🔄
            </button>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {modalStage === "instructions" && (
        <Modal isOpen={true} onClose={() => {}}>
          <div className="p-6 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Game!</h2>
            <p className="text-gray-700 mb-4">
              You'll be given clues to guess the correct city. Select an option
              and submit your answer. You have 5 hearts—wrong answers cost a
              life!
            </p>
            <button
              onClick={handleInstructionsClose}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
            >
              Got it!
            </button>
          </div>
        </Modal>
      )}

      {/* Username Modal */}
      {modalStage === "username" && (
        <Modal isOpen={true} onClose={() => {}}>
          <div className="p-6 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Enter Your Name</h2>
            <input
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded text-black"
              placeholder="Enter your name"
            />
            <button
              onClick={handleUsernameSubmit}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
            >
              Start Game
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
