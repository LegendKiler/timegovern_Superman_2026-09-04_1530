import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from './UserContext'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { setTheme, resetTheme } = useUser()
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  // ==================== DERIVED PLAN VALUES ====================
  // MUST be declared before any function that uses them (avoid TDZ errors)
  const premiumTier = profile?.tier || 'free'
  const isPremium = premiumTier === 'pro' || premiumTier === 'premium'
  const isPro = premiumTier === 'pro'
  const widgetLimit = premiumTier === 'free' ? 3 : 999
  const calcSaveLimit = premiumTier === 'free' ? 5 : 999


  // ==================== SAVED CALCULATIONS ====================
  const getCalculations = async (type = null) => {
    if (!supabase || !user?.id) return { data: [], error: { message: 'Not signed in' } }
    let q = supabase
      .from('saved_calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (type) q = q.eq('calculator_type', type)
    const { data, error } = await q
    return { data: data || [], error }
  }

  const saveCalculation = async (calc) => {
    if (!supabase || !user?.id) return { error: { message: 'Please sign in to save calculations' } }
    const { data, error } = await supabase
      .from('saved_calculations')
      .insert({
        user_id: user.id,
        calculator_type: calc.type,
        country_slug: calc.countrySlug || null,
        title: calc.title,
        inputs: calc.inputs || {},
        results: calc.results || {},
        notes: calc.notes || null,
      })
      .select()
      .single()
    return { data, error }
  }

  const updateCalculation = async (id, updates) => {
    if (!supabase || !user?.id) return { error: { message: 'Not signed in' } }
    const { data, error } = await supabase
      .from('saved_calculations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    return { data, error }
  }

  const deleteCalculation = async (id) => {
    if (!supabase || !user?.id) return { error: { message: 'Not signed in' } }
    const { error } = await supabase
      .from('saved_calculations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    return { error }
  }


  // Tracks which user ID we've already applied the theme for
  const themeAppliedForUser = useRef(null)

  const fetchProfile = async (userId) => {
    if (!supabase) return null
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data
  }

  const refreshProfile = async () => {
    if (!user) return
    const data = await fetchProfile(user.id)
    if (data) setProfile(data)
  }

  // Apply theme from profile ONCE per login
  useEffect(() => {
    if (!user?.id) return
    if (!profile?.theme) return
    if (themeAppliedForUser.current === user.id) return

    if (profile.theme === 'dark' || profile.theme === 'light') {
      setTheme(profile.theme)
      themeAppliedForUser.current = user.id
    }
  }, [user?.id, profile?.theme, setTheme])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      } else {
        // Guest — force dark
        resetTheme()
        themeAppliedForUser.current = null
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      } else {
        // Signed out — reset to dark
        setProfile(null)
        resetTheme()
        themeAppliedForUser.current = null
      }
    })

    return () => subscription.unsubscribe()
  }, [resetTheme])

  const signUp = async (email, password, fullName) => {
    if (!supabase) return { error: { message: 'Auth not configured.' } }
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    if (!supabase) return { error: { message: 'Auth not configured.' } }
    // Reset the ref so we re-apply theme on this login
    themeAppliedForUser.current = null
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    themeAppliedForUser.current = null
    resetTheme()
    setProfile(null)
  }

  const resetPassword = async (email) => {
    if (!supabase) return { error: { message: 'Auth not configured.' } }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })
  }

  const updatePassword = async (newPassword) => {
    if (!supabase) return { error: { message: 'Auth not configured.' } }
    return await supabase.auth.updateUser({ password: newPassword })
  }

  const updateProfile = async (updates) => {
    if (!supabase || !user?.id) return { error: { message: 'Not signed in' } }
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()
    if (!error && data) {
      setProfile(data)
      // If theme was updated, apply it immediately AND mark as applied
      if (updates.theme) {
        setTheme(updates.theme)
        themeAppliedForUser.current = user.id
      }
    }
    return { data, error }
  }

  const updateEmail = async (newEmail) => {
    if (!supabase) return { error: { message: 'Auth not configured.' } }
    return await supabase.auth.updateUser({ email: newEmail })
  }

  const uploadAvatar = async (file) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    if (!user) return { error: { message: 'Please sign in first' } }

    if (!file.type.startsWith('image/')) {
      return { error: { message: 'Please select an image file (JPG, PNG, WEBP)' } }
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: { message: 'File must be under 5MB' } }
    }

    const ext = file.name.split('.').pop().toLowerCase()
    const fileName = 'avatar-' + Date.now() + '.' + ext
    const filePath = user.id + '/' + fileName

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, cacheControl: '3600' })

    if (uploadError) return { error: { message: 'Upload failed: ' + uploadError.message } }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl + '?t=' + Date.now()

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) return { error: { message: 'Failed to save avatar URL: ' + updateError.message } }

    setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
    return { data: { url: publicUrl }, error: null }
  }

  const downloadUserData = async () => {
    if (!user || !profile) return { error: { message: 'Not signed in' } }

    const exportData = {
      exported_at: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        email_verified: user.email_confirmed_at ? true : false,
      },
      profile: {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        tier: profile.tier,
        timezone: profile.timezone,
        language: profile.language,
        theme: profile.theme,
        time_format: profile.time_format,
        email_notifications: profile.email_notifications,
        flight_notifications: profile.flight_notifications,
        newsletter_subscribed: profile.newsletter_subscribed,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
      flight_searches: JSON.parse(localStorage.getItem('flightSearches') || '[]'),
      custom_clocks: JSON.parse(localStorage.getItem('timegovern_worldclocks_groups') || '{}'),
      saved_events: JSON.parse(localStorage.getItem('timegovern_events') || '{}'),
      exported_by: 'timegovern.com - Global Privacy Policy compliant',
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'timegovern-data-export-' + new Date().toISOString().split('T')[0] + '.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return { data: exportData, error: null }
  }

  // ==================== BOOKINGS ====================
  const saveBooking = async (booking) => {
    if (!supabase || !user?.id) return { error: { message: 'Please sign in to save bookings' } }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        booking_type: booking.type,
        reference: booking.reference || null,
        provider: booking.provider || null,
        title: booking.title || null,
        location: booking.location || null,
        start_date: booking.startDate || null,
        end_date: booking.endDate || null,
        total_price: booking.price || null,
        currency: booking.currency || null,
        booking_data: booking.rawData || {},
        status: 'saved',
      })
      .select()
      .single()

    return { data, error }
  }

  const getBookings = async (type = null) => {
    if (!supabase || !user?.id) return { data: [], error: { message: 'Not signed in' } }

    let query = supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (type) query = query.eq('booking_type', type)

    const { data, error } = await query
    return { data: data || [], error }
  }

  const deleteBooking = async (id) => {
    if (!supabase || !user?.id) return { error: { message: 'Not signed in' } }
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    return { error }
  }

  const updateBookingStatus = async (id, status) => {
    if (!supabase || !user?.id) return { error: { message: 'Not signed in' } }
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    return { data, error }
  }

  // ==================== WIDGETS ====================
  const getWidgets = async () => {
    if (!supabase || !user?.id) return { data: [], error: { message: 'Not signed in' } }
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  }

  const saveWidget = async (widget) => {
    if (!supabase || !user?.id) return { error: { message: 'Please sign in first' } }

    // Plan limit
    const { data: existing } = await supabase.from('widgets').select('id').eq('user_id', user.id)
    const count = existing?.length || 0
    const limit = premiumTier === 'free' ? 2 : 999
    if (count >= limit) {
      return { error: { message: 'Free plan allows 3 widgets. Upgrade to Pro for unlimited.' } }
    }

    const { data, error } = await supabase
      .from('widgets')
      .insert({
        user_id: user.id,
        name: widget.name,
        widget_type: widget.type,
        config: widget.config || {},
      })
      .select()
      .single()
    return { data, error }
  }

  const updateWidget = async (id, updates) => {
    if (!supabase || !user?.id) return { error: { message: 'Not signed in' } }
    const { data, error } = await supabase
      .from('widgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    return { data, error }
  }

  const deleteWidget = async (id) => {
    if (!supabase || !user?.id) return { error: { message: 'Not signed in' } }
    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    return { error }
  }


  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      signUp, signIn, signOut, resetPassword, updatePassword,
      updateProfile, updateEmail, uploadAvatar, downloadUserData, refreshProfile,
      premiumTier, isPremium, isPro,
      saveBooking, getBookings, deleteBooking, updateBookingStatus,
      getWidgets, saveWidget, updateWidget, deleteWidget,
      getCalculations, saveCalculation, updateCalculation, deleteCalculation, calcSaveLimit, widgetLimit,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
