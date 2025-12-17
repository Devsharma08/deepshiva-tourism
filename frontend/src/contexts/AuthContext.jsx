import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase, getCurrentUser, hasCompletedOnboarding } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const authCheckedRef = useRef(false);

    useEffect(() => {
        // Check current session - FAST: don't await onboarding check
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);

                // Set loading to false IMMEDIATELY after getting user
                // Don't wait for onboarding check
                setLoading(false);
                authCheckedRef.current = true;

                // Check onboarding in BACKGROUND (non-blocking)
                if (currentUser) {
                    hasCompletedOnboarding(currentUser.id)
                        .then(onboarded => setHasOnboarded(onboarded))
                        .catch(() => setHasOnboarded(false));
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
                setLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                setLoading(false);

                if (event === 'SIGNED_IN' && currentUser) {
                    // Check onboarding in background
                    hasCompletedOnboarding(currentUser.id)
                        .then(onboarded => {
                            setHasOnboarded(onboarded);
                            setIsNewUser(!onboarded);
                        })
                        .catch(() => {
                            setHasOnboarded(false);
                            setIsNewUser(true);
                        });
                }

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserProfile(null);
                    setHasOnboarded(false);
                    setIsNewUser(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const completeOnboarding = () => {
        setHasOnboarded(true);
        setIsNewUser(false);
    };

    const value = {
        user,
        userProfile,
        loading,
        isNewUser,
        hasOnboarded,
        completeOnboarding,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
