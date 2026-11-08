import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Owner login. Edit and delete are enforced by the database for the signed-in owner,
// so this is real protection rather than a passcode in the page code.
export function useOwner() {
  const [state, setState] = useState({ ready: !supabase, isOwner: !supabase, email: null });

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    async function check(session) {
      if (!session) { if (alive) setState({ ready: true, isOwner: false, email: null }); return; }
      const { data } = await supabase.from("edgelist_admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
      if (alive) setState({ ready: true, isOwner: !!data, email: session.user.email });
    }
    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { check(session); });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message === "Invalid login credentials" ? "That email and password didn't match." : error.message);
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}
