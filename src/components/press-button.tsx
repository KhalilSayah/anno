import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFirebase } from "./firebase-config";
import { getDatabase, ref, set, onValue } from "firebase/database";
import * as Progress from "@radix-ui/react-progress";

export const PressButton: React.FC = () => {
  const { database, userId } = useFirebase();
  const [isPressed, setIsPressed] = React.useState(false);
  const [activePresses, setActivePresses] = React.useState(0);

  const emojis = ["😴", "🙂", "😄", "🔥", "🚀"];
  const emoji = emojis[Math.min(activePresses, 4)];

  React.useEffect(() => {
    const pressesRef = ref(database, "presses");
    const unsubscribe = onValue(pressesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const activeCount = Object.keys(data).length;
      setActivePresses(activeCount);
    });

    return () => unsubscribe();
  }, [database]);

  const handlePressStart = () => {
    setIsPressed(true);
    const pressRef = ref(database, `presses/${userId}`);
    set(pressRef, {
      timestamp: new Date().toISOString(),
      userId: userId
    });
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    const pressRef = ref(database, `presses/${userId}`);
    set(pressRef, null);
  };

  const progressValue = Math.min((activePresses / 4) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Button
        size="lg"
        color="primary"
        className={`h-24 w-full text-lg transition-all ${
          isPressed ? "scale-95 opacity-80 animate-pulse" : "scale-100"
        }`}
        onPressStart={handlePressStart}
        onPressEnd={handlePressEnd}
      >
        <Icon icon="lucide:hand" className="mr-2" />
        Press and Hold
      </Button>

      {/* Barre de progression */}
      <div className="w-full bg-gray-200 h-4 rounded-lg overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            progressValue < 100 ? "bg-blue-500" : "bg-green-500"
          }`}
          style={{ width: `${progressValue}%` }}
        ></div>
      </div>

      {/* Texte dynamique avec emoji */}
      <div className="flex items-center gap-2">
        <span className="text-default-600">Active presses:</span>
        <span
          className={`font-bold ${
            activePresses >= 4 ? "text-success" : "text-primary"
          }`}
        >
          {activePresses} / 4 {emoji}
        </span>
      </div>

      {/* Message dynamique */}
      <div className="text-sm text-center text-gray-500">
        {activePresses === 0 && "🫥 Personne ne presse..."}
        {activePresses === 1 && "🕺 Un pionnier s'est levé !"}
        {activePresses === 2 && "🤝 Deux, c’est mieux !"}
        {activePresses === 3 && "🔥 Trois, ça chauffe !"}
        {activePresses >= 4 && "🚀 Tous ensemble, gooo !"}
      </div>
    </div>
  );
};
