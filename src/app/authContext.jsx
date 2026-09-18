import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CURRENT_USER, DEMO_CREDENTIALS } from "../constants/app";

const AuthContext = createContext(null);

/** Storage key holding the signed-in user (null when signed out). */
const SESSION_KEY = "session";

/**
 * Session state for the template.
 *
 * There is no backend here, so `signIn` validates against DEMO_CREDENTIALS and
 * otherwise accepts any well-formed email/password pair — the point is to
 * exercise the guarded-route flow, not to be a real auth system. Swap the body
 * of `signIn` for a fetch to your API and the rest of the app is unchanged.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(SESSION_KEY, null);

  const signIn = useCallback(
    async ({ email, password }) => {
      // Stand-in for a network round-trip so callers get a realistic
      // pending state to render.
      await new Promise((resolve) => setTimeout(resolve, 450));

      const isDemoAccount =
        email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password;

      if (!isDemoAccount && password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const session = isDemoAccount
        ? CURRENT_USER
        : {
            name: email.split("@")[0] || "New user",
            email: email.trim().toLowerCase(),
            role: "Administrator",
          };
      setUser(session);
      return session;
    },
    [setUser],
  );

  const signUp = useCallback(async ({ name, email }) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    // Registration does not sign the user in — it hands off to the sign-in
    // screen, which is what most real products do.
    return { name, email: email.trim().toLowerCase() };
  }, []);

  const signOut = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), signIn, signUp, signOut }),
    [user, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Access the current session. Throws if used outside <AuthProvider>. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
