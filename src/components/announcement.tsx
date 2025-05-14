import React from "react";
import {
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFirebase } from "./firebase-config";
import { ref, onValue } from "firebase/database";

export const Announcement: React.FC = () => {
  const { database } = useFirebase();
  const [showAnnouncement, setShowAnnouncement] = React.useState(false);
  const [hasShownAnnouncement, setHasShownAnnouncement] = React.useState(false); // 🔐 new state
  const [activePresses, setActivePresses] = React.useState(0);

  React.useEffect(() => {
    const pressesRef = ref(database, "presses");
    const unsubscribe = onValue(pressesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const activeCount = Object.keys(data).length;
      setActivePresses(activeCount);

      // Show announcement only once
      if (activeCount === 4 && !hasShownAnnouncement) {
        setShowAnnouncement(true);
        setHasShownAnnouncement(true);
      }
    });

    return () => unsubscribe();
  }, [database, hasShownAnnouncement]);

  return (
    <>
      {hasShownAnnouncement && (
        <Card className="w-full bg-success-100 border-success p-4 animate-pulse">
          <div className="flex flex-col items-center gap-2 text-success-700">
            <Icon icon="lucide:party-popper" className="text-3xl" />
            <h2 className="text-xl font-bold">Congratulations!</h2>
            <p>All 4 users are pressing simultaneously!</p>
          </div>
        </Card>
      )}

      <Modal isOpen={showAnnouncement} onOpenChange={setShowAnnouncement}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">JE SUIS PAPA ! </ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="rounded-full bg-success-100 p-4">
                <Icon icon="lucide:party-popper" className="text-4xl text-success" />
              </div>
              <h3 className="text-2xl font-bold">Šalim se! Idem s vama u Split.</h3>
              <p className="text-center text-default-600">
                Ca veut dire je viens avec vous à Split mes biches !
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onPress={() => setShowAnnouncement(false)}>
              Khalil t'es le meileur !
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
