import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

// XP rewards configuration
const XP_REWARDS = {
    daily_login: 10,
    streak_bonus: 5, // multiplied by streak days
    visit_map: 5,
    visit_chat: 10,
    explore_state: 15,
    complete_booking: 25,
};

// Daily limits to prevent XP farming
const DAILY_LIMITS = {
    visit_map: 3,
    visit_chat: 2,
    explore_state: 5,
};

// Level thresholds and titles
const LEVELS = [
    { level: 1, xp: 0, title: 'Novice Wanderer' },
    { level: 2, xp: 100, title: 'Curious Explorer' },
    { level: 3, xp: 250, title: 'Seasoned Traveler' },
    { level: 4, xp: 500, title: 'Adventure Seeker' },
    { level: 5, xp: 1000, title: 'Master Voyager' },
    { level: 6, xp: 2000, title: 'Legendary Explorer' },
];

const STORAGE_KEY = 'deepshiva_xp_tracker';

/**
 * Get XP tracking data from localStorage
 */
function getXPData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : {};

        // Reset daily counts if it's a new day
        const today = new Date().toDateString();
        if (data.lastDate !== today) {
            return {
                ...data,
                lastDate: today,
                dailyCounts: {},
                loginToday: false,
            };
        }
        return data;
    } catch {
        return { dailyCounts: {}, lastDate: new Date().toDateString() };
    }
}

/**
 * Save XP tracking data to localStorage
 */
function saveXPData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Calculate level from XP
 */
export function getLevelFromXP(xp) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xp) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

/**
 * Get XP needed for next level
 */
export function getNextLevelXP(currentXP) {
    for (const level of LEVELS) {
        if (currentXP < level.xp) {
            return level.xp;
        }
    }
    return LEVELS[LEVELS.length - 1].xp;
}

/**
 * Calculate streak days
 */
function calculateStreak(lastLoginDate) {
    if (!lastLoginDate) return 1;

    const last = new Date(lastLoginDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Same day = continue streak
    if (last.toDateString() === today.toDateString()) {
        return null; // Already logged in today
    }

    // Yesterday = increment streak
    if (last.toDateString() === yesterday.toDateString()) {
        return 'increment';
    }

    // Missed a day = reset streak
    return 'reset';
}

/**
 * Award XP to user and sync to Supabase
 */
async function awardXP(userId, amount, reason) {
    if (!userId || amount <= 0) return;

    console.log(`⭐ Awarding ${amount} XP for: ${reason}`);

    try {
        // First, get current XP
        const { data: current } = await supabase
            .from('user_gamification')
            .select('current_xp, current_level, login_streak')
            .eq('user_id', userId)
            .single();

        const currentXP = current?.current_xp || 0;
        const newXP = currentXP + amount;
        const newLevel = getLevelFromXP(newXP);

        // Update in database
        await supabase
            .from('user_gamification')
            .upsert({
                user_id: userId,
                current_xp: newXP,
                current_level: newLevel.level,
                player_title: newLevel.title,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        console.log(`✅ XP updated: ${currentXP} → ${newXP} (Level ${newLevel.level})`);
        return { newXP, newLevel };
    } catch (error) {
        console.error('Error awarding XP:', error);
        return null;
    }
}

/**
 * Hook to manage XP rewards
 */
export function useXPManager() {
    const { user, isAuthenticated } = useAuth();

    // Award XP for specific action (with daily limits)
    const awardActionXP = useCallback(async (action) => {
        if (!user?.id) return;

        const data = getXPData();
        const limit = DAILY_LIMITS[action];
        const count = data.dailyCounts?.[action] || 0;

        // Check daily limit
        if (limit && count >= limit) {
            console.log(`⏳ Daily limit reached for ${action}`);
            return null;
        }

        // Award XP
        const xpAmount = XP_REWARDS[action];
        if (!xpAmount) return null;

        const result = await awardXP(user.id, xpAmount, action);

        // Update daily count
        data.dailyCounts = data.dailyCounts || {};
        data.dailyCounts[action] = count + 1;
        saveXPData(data);

        return result;
    }, [user?.id]);

    // Check and award daily login XP
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        const checkDailyLogin = async () => {
            const data = getXPData();

            // Already logged in today
            if (data.loginToday && data.userId === user.id) {
                return;
            }

            // Streak calculation
            const streakAction = calculateStreak(data.lastLoginDateFull);
            let streakDays = data.streakDays || 0;

            if (streakAction === 'increment') {
                streakDays = streakDays + 1;
            } else if (streakAction === 'reset') {
                streakDays = 1;
            } else if (streakAction === null) {
                // Same day, do nothing
                return;
            }

            // Award daily login XP
            await awardXP(user.id, XP_REWARDS.daily_login, 'daily_login');

            // Award streak bonus if streak > 1
            if (streakDays > 1) {
                const streakXP = XP_REWARDS.streak_bonus * Math.min(streakDays, 7); // Cap at 7 days
                await awardXP(user.id, streakXP, `streak_${streakDays}_days`);
                console.log(`🔥 Streak: ${streakDays} days! +${streakXP} bonus XP`);
            }

            // Update streak in database
            try {
                await supabase
                    .from('user_gamification')
                    .update({ login_streak: streakDays })
                    .eq('user_id', user.id);
            } catch (e) {
                console.warn('Could not update streak:', e);
            }

            // Save to localStorage
            saveXPData({
                ...data,
                loginToday: true,
                userId: user.id,
                streakDays,
                lastLoginDateFull: new Date().toISOString(),
            });
        };

        checkDailyLogin();
    }, [isAuthenticated, user?.id]);

    return { awardActionXP };
}

export default useXPManager;
