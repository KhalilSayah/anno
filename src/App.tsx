import React from "react";
import { Button, Card, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { FirebaseApp } from "./components/firebase-config";
import { PressButton } from "./components/press-button";
import { Announcement } from "./components/announcement";

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // Simulate Firebase initialization
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-default-600">Initializing connection...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <FirebaseApp>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Icon icon="lucide:users" className="text-primary" />
              <h1>J'ai quelque chose à vous dire mes Avengers</h1>
            </div>
            
            <p className="text-default-600">
            Célia, Marvin, Romain et Coco, vous devez tous les quatre appuyer en même temps sur le bouton pour voir l'annonce.
            </p>
            
            <PressButton />
            
            <Announcement />
            
            <div className="mt-4 text-sm text-default-500">
              <p>Avoue le site est hlou !</p>
            </div>
          </div>
        </Card>
      </div>
    </FirebaseApp>
  );
};

export default App;