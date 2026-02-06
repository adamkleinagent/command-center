import { supabase } from './supabase'

/**
 * Registrácia nového používateľa
 */
export async function signUp(email: string, pass: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  })
  return { data, error }
}

/**
 * Prihlásenie existujúceho používateľa
 */
export async function signIn(email: string, pass: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  })
  return { data, error }
}

/**
 * Odhlásenie
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Získanie aktuálnej session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}
