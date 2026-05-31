import type { Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

let cachedSession: Session | null = null;
let sessionLoaded = false;
let sessionLoadPromise: Promise<Session | null> | null = null;

const setCachedSession = (session: Session | null) => {
  cachedSession = session;
  sessionLoaded = true;
};

const loadSessionOnce = () => {
  if (!sessionLoadPromise) {
    sessionLoadPromise = supabase.auth.getSession().then(({ data }) => {
      setCachedSession(data.session);
      return data.session;
    });
  }
  return sessionLoadPromise;
};

supabase.auth.onAuthStateChange((_event, session) => {
  setCachedSession(session);
});

void loadSessionOnce();

const signUp = async (email: string, password: string, username: string) => {
  const trimmedUsername = username.trim();
  const result = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        username: trimmedUsername,
        full_name: trimmedUsername,
      },
    },
  });
  if (result.data.session) {
    setCachedSession(result.data.session);
  }
  return result;
};

const signIn = async (usernameOrEmail: string, password: string) => {
  const input = usernameOrEmail.trim();
  let email = input;

  if (!input.includes("@")) {
    const { data, error } = await supabase.rpc("get_email_for_username", {
      p_username: input,
    });
    if (error || !data) {
      return {
        data: { user: null, session: null },
        error: { message: "Usuario no encontrado. Usa tu email para iniciar sesión." },
      };
    }
    email = data as string;
  }

  const result = await supabase.auth.signInWithPassword({ email, password });
  if (result.data.session) {
    setCachedSession(result.data.session);
  }
  return result;
};

const signOut = async () => {
  const result = await supabase.auth.signOut();
  setCachedSession(null);
  return result;
};

const getSession = async () => {
  if (sessionLoaded) {
    return { data: { session: cachedSession } };
  }
  const session = await loadSessionOnce();
  return { data: { session } };
};

const getSessionUserId = async (): Promise<string | null> => {
  if (sessionLoaded) {
    return cachedSession?.user?.id ?? null;
  }
  const session = await loadSessionOnce();
  return session?.user?.id ?? null;
};

const isSessionReady = () => sessionLoaded;

const hasActiveSession = () => !!cachedSession?.user;

const onAuthStateChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => {
  return supabase.auth.onAuthStateChange(callback);
};

const getAuthErrorMessage = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.includes("email not confirmed")) {
    return "No se pudo iniciar sesión. Intenta de nuevo en unos segundos.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Usuario o contraseña incorrectos.";
  }
  if (lower.includes("email address invalid")) {
    return "El email no es válido.";
  }
  return message;
};

export {
  signUp,
  signIn,
  signOut,
  getSession,
  getSessionUserId,
  isSessionReady,
  hasActiveSession,
  onAuthStateChange,
  getAuthErrorMessage,
};
