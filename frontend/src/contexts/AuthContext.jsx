import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, hasCompletedOnboarding, getUserProfile } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null); // avatar_url, display_name
    const [loading, setLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
        // Check current session
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);

                if (currentUser) {
                    const onboarded = await hasCompletedOnboarding(currentUser.id);
                    setHasOnboarded(onboarded);

                    // Fetch user profile (avatar, display_name)
                    // TEMPORARILY DISABLED - causes blocking/infinite load due to RLS
                    // const profile = await getUserProfile(currentUser.id);
                    // setUserProfile(profile);
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (event === 'SIGNED_IN' && currentUser) {
                    const onboarded = await hasCompletedOnboarding(currentUser.id);
                    setHasOnboarded(onboarded);
                    setIsNewUser(!onboarded);

                    // Fetch profile
                    // TEMPORARILY DISABLED - causes blocking/infinite load due to RLS  
                    // const profile = await getUserProfile(currentUser.id);
                    // setUserProfile(profile);
                }

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserProfile(null);
                    setHasOnboarded(false);
                    setIsNewUser(false);
                }

                setLoading(false);
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
