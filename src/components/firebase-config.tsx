import React from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onDisconnect, onValue, set } from "firebase/database";

// Firebase context
interface FirebaseContextType {
  database: any;
  userId: string;
}

const FirebaseContext = React.createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const context = React.useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const FirebaseApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId] = React.useState(() => `user_${Math.random().toString(36).substring(2, 9)}`);
  const [database, setDatabase] = React.useState<any>(null);

  React.useEffect(() => {
    // Your Firebase configuration
    // IMPORTANT: Replace with your actual Firebase config in production
    const firebaseConfig = {
      apiKey: "AIzaSyBICVe7QNgS175xcNvqLo65tL2dPsyuibI",
      authDomain: "annonce-9ba51.firebaseapp.com",
      databaseURL:"https://annonce-9ba51-default-rtdb.firebaseio.com/",
      projectId: "annonce-9ba51",
      storageBucket: "annonce-9ba51.firebasestorage.app",
      messagingSenderId: "1060515801882",
      appId: "1:1060515801882:web:b3f9651820ef95d4e01aa3",
      measurementId: "G-57LNGLDFPH"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    setDatabase(db);

    // Set up presence system
    const presenceRef = ref(db, `presence/${userId}`);
    
    // When this client disconnects, remove them from the presence list
    onDisconnect(presenceRef).remove();
    
    // Add this client to the presence list
    set(presenceRef, {
      online: true,
      lastActive: new Date().toISOString()
    });

    return () => {
      // Clean up by removing the user when component unmounts
      set(presenceRef, null);
    };
  }, [userId]);

  if (!database) {
    return null;
  }

  return (
    <FirebaseContext.Provider value={{ database, userId }}>
      {children}
    </FirebaseContext.Provider>
  );
};