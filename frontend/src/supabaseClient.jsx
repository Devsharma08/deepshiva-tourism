import { createClient } from '@supabase/supabase-js'

// Use Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔧 Supabase Key exists:', !!supabaseKey);
console.log('🔧 Supabase Key length:', supabaseKey?.length);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL: Supabase environment variables not loaded!');
  console.error('Make sure .env file exists and dev server was restarted');
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============ AUTH FUNCTIONS ============

/**
 * Sign up a new user with email and password
 */
export async function signUp(email, password, displayName = '') {
  console.log('🔷 signUp called with:', { email, displayName });

  // 1. Create auth user
  console.log('🔷 Calling supabase.auth.signUp...');
  console.log('🔷 Using URL:', supabaseUrl);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName }
    }
  })

  console.log('🔷 Auth response:', { user: authData?.user?.id, error: authError });

  if (authError) {
    console.log('🔷 Auth error, throwing...');
    throw authError
  }

  // Helper to add timeout to operations
  const withTimeout = (promise, ms = 3000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);

  // 2. Insert into public.users table
  if (authData.user) {
    console.log('🔷 Upserting into users table...');

    // Generate default avatar URL using DiceBear API
    const avatarSeed = displayName || email.split('@')[0];
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`;

    try {
      const { error: userError } = await withTimeout(
        supabase.from('users').upsert({
          id: authData.user.id,
          email: email,
          display_name: displayName,
          avatar_url: avatarUrl,
          created_at: new Date().toISOString()
        }, { onConflict: 'id' })
      );

      if (userError) {
        console.error('❌ Error creating user profile:', userError);
      } else {
        console.log('✅ User profile created');
      }
    } catch (err) {
      console.warn('⚠️ Users table timed out - check RLS policies');
    }

    // 3. Initialize gamification data
    console.log('🔷 Upserting into user_gamification table...');
    try {
      const { error: gamificationError } = await withTimeout(
        supabase.from('user_gamification').upsert({
          user_id: authData.user.id,
          current_level: 1,
          current_xp: 0,
          player_title: 'Novice Wanderer',
          total_trips_completed: 0,
          total_km_traveled: 0,
          carbon_saved_kg: 0,
          badges_earned: [],
          unlocked_features: []
        }, { onConflict: 'user_id' })
      );

      if (gamificationError) {
        console.error('❌ Error initializing gamification:', gamificationError);
      } else {
        console.log('✅ Gamification initialized');
      }
    } catch (err) {
      console.warn('⚠️ Gamification table timed out - check RLS policies');
    }
  }

  console.log('🔷 signUp returning authData');
  return authData
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  console.log('🔷 signIn called');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  console.log('🔷 signIn response:', { user: data?.user?.id, error });

  if (error) throw error

  // Update last_login timestamp (with timeout)
  if (data.user) {
    console.log('🔷 Updating last_login...');
    try {
      const updatePromise = supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      await Promise.race([
        updatePromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]);
      console.log('✅ last_login updated');
    } catch (err) {
      console.warn('⚠️ last_login update timed out - check RLS on users table');
    }
  }

  console.log('🔷 signIn returning');
  return data
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Check if user has completed onboarding (with timeout and error handling)
 */
export async function hasCompletedOnboarding(userId) {
  if (!userId) return false;

  try {
    const checkPromise = supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to avoid error when no row exists

    const result = await Promise.race([
      checkPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 1500)
      )
    ]);

    // Handle various error cases gracefully
    if (result.error) {
      // PGRST116 = no rows found (expected for new users)
      // 406 = Not Acceptable (likely RLS issue)
      if (result.error.code === 'PGRST116' || result.error.code === '406') {
        return false;
      }
      console.warn('⚠️ hasCompletedOnboarding error:', result.error.message);
      return false;
    }

    return !!result.data;
  } catch (err) {
    // Handle timeout and network errors
    if (err.message === 'timeout') {
      console.warn('⚠️ hasCompletedOnboarding timed out, assuming false');
    } else {
      console.warn('⚠️ hasCompletedOnboarding failed:', err.message);
    }
    return false;
  }
}

/**
 * Get user profile (avatar, display_name) from public.users table
 */
export async function getUserProfile(userId) {
  try {
    const profilePromise = supabase
      .from('users')
      .select('avatar_url, display_name, email')
      .eq('id', userId)
      .single();

    const { data, error } = await Promise.race([
      profilePromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('getUserProfile timeout')), 3000)
      )
    ]);

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ getUserProfile timed out - check RLS on users table');
    return null;
  }
}

/**
 * Save user preferences from onboarding
 */
export async function saveUserPreferences(userId, preferences) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      budget_tier: preferences.budgetTier,
      dietary_restrictions: preferences.dietaryRestrictions,
      interest_tags: preferences.interestTags,
      interest_weights: preferences.interestWeights || {},
      walking_pace: preferences.walkingPace,
      accessibility_needs: preferences.accessibilityNeeds || [],
      crowd_tolerance: preferences.crowdTolerance,
      morning_person: preferences.morningPerson,
      preferred_transport: preferences.preferredTransport
    })
    .select()

  if (error) throw error
  return data
}

/**
 * Get user preferences (with error handling)
 */
export async function getUserPreferences(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to avoid error when no row exists

    // Handle errors gracefully
    if (error) {
      // PGRST116 = no rows found (expected for new users)
      // Ignore 406 errors (RLS issues)
      if (error.code !== 'PGRST116' && error.code !== '406') {
        console.warn('⚠️ getUserPreferences error:', error.message);
      }
      return null;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ getUserPreferences failed:', err.message);
    return null;
  }
}

