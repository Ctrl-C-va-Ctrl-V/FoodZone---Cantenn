import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];

// Use custom firestoreDatabaseId if configured
export const db = config.firestoreDatabaseId
  ? initializeFirestore(app, {}, config.firestoreDatabaseId)
  : getFirestore(app);

export default app;
