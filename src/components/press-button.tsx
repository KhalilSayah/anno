import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFirebase } from "./firebase-config";
import { getDatabase, ref, set, onValue } from "firebase/database";

export const PressButton: React.FC = () => {
  const { database, userId } = useFirebase();
  const [isPressed, setIsPressed] = React.useState(false);
  const [activePresses, setActivePresses] = React.useState(0);

  React.useEffect(() => {
    // Listen for changes in the active presses
    const pressesRef = ref(database, "presses");
    const unsubscribe = onValue(pressesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const activeCount = Object.keys(data).length;
      setActivePresses(activeCount);
    });

    return () => {
      unsubscribe();
    };
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

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Button
        size="lg"
        color="primary"
        className={`h-24 w-full text-lg transition-all ${
          isPressed ? "scale-95 opacity-80" : "scale-100"
        }`}
        onPressStart={handlePressStart}
        onPressEnd={handlePressEnd}
      >
        <Icon icon="lucide:hand" className="mr-2" />
        Press and Hold
      </Button>
      
      <div className="flex items-center gap-2">
        <span className="text-default-600">Active presses:</span>
        <span className={`font-bold ${activePresses === 4 ? "text-success" : "text-primary"}`}>
          {activePresses} / 4
        </span>
      </div>
    </div>
  );
};