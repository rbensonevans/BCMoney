'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

// Use a global variable to ensure singletons across hot reloads in dev
let memoizedApp: FirebaseApp | undefined;
let memoizedAuth: Auth | undefined;
let memoizedFirestore: Firestore | undefined;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!memoizedApp) {
    const apps = getApps();
    if (apps.length > 0) {
      memoizedApp = apps[0];
    } else {
      try {
        // Attempt to initialize via Firebase App Hosting environment variables
        memoizedApp = initializeApp();
      } catch (e) {
        // Only warn in production because it's normal to use the firebaseConfig to initialize
        // during development
        if (process.env.NODE_ENV === "production") {
          console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
        }
        memoizedApp = initializeApp(firebaseConfig);
      }
    }
  }

  // Ensure Auth and Firestore are tied to the shared app instance
  if (!memoizedAuth) memoizedAuth = getAuth(memoizedApp);
  if (!memoizedFirestore) memoizedFirestore = getFirestore(memoizedApp);

  return {
    firebaseApp: memoizedApp,
    auth: memoizedAuth,
    firestore: memoizedFirestore
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';