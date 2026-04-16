import { useEffect, useState } from "react";
import { QUIET_THOUGHTS } from "../utils/thoughts";

export default function QuietMoment({ mood }) {
  const [thought, setThought] = useState("");

  useEffect(() => {
    //getting thought based on current mood or default in case of none
    const thoughtsArray = QUIET_THOUGHTS[mood] || QUIET_THOUGHTS.default;
    // pick any random thought from an array
    const randomeThought =
      thoughtsArray[Math.floor(Math.random() * thoughtsArray.length)];
    setThought(randomeThought);
  }, [mood]);
  return (
    <div className="flex flex-col items-center py-24 animate-in fade-in duration-1000 text-center px-6">
      <div className="w-8 h-8 rounded-full border-t-2 border-current animate-spin mb-8 opacity-30"></div>
      <p className="literary-text text-xl md:text-2xl opacity-80 max-w-lg leading-relaxed text-balance transition-opacity duration-1000">
        "{thought}"
      </p>
      <span className="mt-8 text-xs uppercase tracking-widest opacity-40">
        Please wait a moment
      </span>
    </div>
  );
}
