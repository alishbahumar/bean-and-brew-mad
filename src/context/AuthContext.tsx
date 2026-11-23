import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { auth, db } from '@/services/firebase';

/**
 * Accounts live in Firebase Authentication (signup, login, logout).
 * The user's profile (name, email) is saved in Cloud Firestore at users/{uid}.
 * Guest mode is local only: nothing is sent to Firebase.
 */
const GUEST_KEY = 'bnb:guest:v1';
export const GUEST_ID = 'guest';

export type SessionUser = { id: string; name: string; email: string | null; isGuest: boolean };
type Result = { ok: true } | { ok: false; error: string; field?: 'name' | 'email' | 'password' };

type AuthValue = {
  hydrated: boolean;
  user: SessionUser | null;
  signUp: (name: string, email: string, password: string) => Promise<Result>;
  logIn: (email: string, password: string) => Promise<Result>;
  continueAsGuest: () => void;
  logOut: () => void;
  updateName: (name: string) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normalise = (email: string) => email.trim().toLowerCase();

function errorCode(e: unknown): string {
  return typeof e === 'object' && e && 'code' in e ? String((e as { code: unknown }).code) : '';
}

function friendly(e: unknown): { error: string; field?: 'email' | 'password' } {
  switch (errorCode(e)) {
    case 'auth/email-already-in-use':
      return { error: 'An account with this email already exists. Try logging in.', field: 'email' };
    case 'auth/invalid-email':
      return { error: 'Enter a valid email address.', field: 'email' };
    case 'auth/weak-password':
      return { error: 'Password must be at least 6 characters.', field: 'password' };
    case 'auth/user-not-found':
      return { error: 'No account found with this email. Please sign up.', field: 'email' };
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return { error: 'Wrong email or password. Please try again.', field: 'password' };
    case 'auth/too-many-requests':
      return { error: 'Too many attempts. Please wait a moment and try again.', field: 'password' };
    case 'auth/network-request-failed':
      return { error: 'No internet connection. Please check your network.', field: 'email' };
    default:
      return { error: 'Something went wrong. Please try again.', field: 'password' };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [guestLoaded, setGuestLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('Guest');
  // Name typed on the signup form: used right away, before Firestore has it.
  const pendingName = useRef<string | null>(null);

  // Load guest mode from the device.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(GUEST_KEY);
        if (raw) {
          const data = JSON.parse(raw) as { guest?: boolean; guestName?: string };
          setIsGuest(!!data.guest);
          setGuestName(data.guestName ?? 'Guest');
        }
      } catch {
        // Corrupt storage: start as signed out.
      } finally {
        setGuestLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!guestLoaded) return;
    AsyncStorage.setItem(GUEST_KEY, JSON.stringify({ guest: isGuest, guestName })).catch(() => {});
  }, [guestLoaded, isGuest, guestName]);

  // Firebase tells us when someone logs in or out (also restores the login when the app reopens).
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setFbUser(u);
      if (u) {
        setIsGuest(false);
        if (pendingName.current) {
          setProfileName(pendingName.current);
        } else {
          let name = u.displayName ?? '';
          try {
            const snap = await getDoc(doc(db, 'users', u.uid));
            const stored = snap.exists() ? (snap.data().name as string | undefined) : undefined;
            if (stored) name = stored;
          } catch (e) {
            console.warn('Could not read profile from Firestore:', e);
          }
          setProfileName(name || (u.email ?? '').split('@')[0]);
        }
      } else {
        setProfileName('');
      }
      setAuthReady(true);
    });
  }, []);

  const hydrated = guestLoaded && authReady;

  const user = useMemo<SessionUser | null>(() => {
    if (fbUser) {
      return {
        id: fbUser.uid,
        name: profileName || (fbUser.email ?? '').split('@')[0] || 'Friend',
        email: fbUser.email,
        isGuest: false,
      };
    }
    if (isGuest) return { id: GUEST_ID, name: guestName, email: null, isGuest: true };
    return null;
  }, [fbUser, profileName, isGuest, guestName]);

  const signUp = useCallback<AuthValue['signUp']>(async (name, email, password) => {
    const cleanName = name.trim();
    const cleanEmail = normalise(email);
    if (cleanName.length < 2) return { ok: false, error: 'Please enter your name.', field: 'name' };
    if (!EMAIL_RE.test(cleanEmail)) return { ok: false, error: 'Enter a valid email address.', field: 'email' };
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.', field: 'password' };
    pendingName.current = cleanName;
    try {
      // Firebase Authentication: create the account.
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      setProfileName(cleanName);
      updateProfile(cred.user, { displayName: cleanName }).catch(() => {});
      // Firestore write: save the profile in users/{uid}.
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name: cleanName,
          email: cleanEmail,
          createdAt: Date.now(),
        });
      } catch (e) {
        console.warn('Could not save profile to Firestore:', e);
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, ...friendly(e) };
    } finally {
      pendingName.current = null;
    }
  }, []);

  const logIn = useCallback<AuthValue['logIn']>(async (email, password) => {
    const cleanEmail = normalise(email);
    if (!EMAIL_RE.test(cleanEmail)) return { ok: false, error: 'Enter a valid email address.', field: 'email' };
    if (!password) return { ok: false, error: 'Enter your password.', field: 'password' };
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      return { ok: true };
    } catch (e) {
      return { ok: false, ...friendly(e) };
    }
  }, []);

  const continueAsGuest = useCallback(() => setIsGuest(true), []);

  const logOut = useCallback(() => {
    setIsGuest(false);
    if (auth.currentUser) signOut(auth).catch((e) => console.warn('Sign out failed:', e));
  }, []);

  const updateName = useCallback(
    (name: string) => {
      const clean = name.trim() || (isGuest ? 'Guest' : '');
      if (!clean) return;
      if (!fbUser) {
        setGuestName(clean);
        return;
      }
      setProfileName(clean);
      updateProfile(fbUser, { displayName: clean }).catch(() => {});
      // Firestore update: change the name in users/{uid}.
      setDoc(doc(db, 'users', fbUser.uid), { name: clean }, { merge: true }).catch((e) =>
        console.warn('Could not update name in Firestore:', e),
      );
    },
    [fbUser, isGuest],
  );

  const value = useMemo(
    () => ({ hydrated, user, signUp, logIn, continueAsGuest, logOut, updateName }),
    [hydrated, user, signUp, logIn, continueAsGuest, logOut, updateName],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
