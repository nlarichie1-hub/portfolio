import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();
// Request Workspace Drive read-only scope
provider.addScope("https://www.googleapis.com/auth/drive.readonly");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Load cached token from memory during session if available
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If logged in but no token in memory (e.g. page refresh), they need to authenticate again
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get Google Drive access token from authentication flow");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Sign-in popup error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  createdTime?: string;
  size?: string;
}

export const fetchDriveImages = async (
  folderId: string,
  accessToken: string
): Promise<DriveFileItem[]> => {
  if (!accessToken) throw new Error("Missing OAuth Access Token");

  // Query folder files, fetching only images, sorted by created time descending
  const q = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    q
  )}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,createdTime,size)&pageSize=40&orderBy=createdTime%20desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errorDetails}`);
  }

  const result = await response.json();
  return result.files || [];
};

// Generates high quality preview link from Google Drive thumbnail link
export const getHighResDriveLink = (thumbnailLink?: string, fallbackFileId?: string): string => {
  if (!thumbnailLink) {
    if (fallbackFileId) {
      // Direct embedding parameter using documentation public redirect
      return `https://docs.google.com/uc?export=view&id=${fallbackFileId}`;
    }
    return "https://images.unsplash.com/photo-1549463512-2051094f13d8?auto=format&fit=crop&q=80&w=600";
  }
  // Replace =s220 or other size limitations with =s1000 for extremely high fidelity views
  return thumbnailLink.replace(/=s\d+$/, "=s1000");
};
