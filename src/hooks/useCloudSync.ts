import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/useStore";

const LAST_SYNC_AT_KEY = "daily-flux-cloud-last-synced-at";
const LAST_LOCAL_CHANGE_AT_KEY = "daily-flux-cloud-last-local-change-at";

const toMs = (value: string | null | undefined): number => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const useCloudSync = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(
    localStorage.getItem(LAST_SYNC_AT_KEY),
  );
  const [syncState, setSyncState] = useState<
    "idle" | "authenticating" | "syncing" | "success" | "error"
  >("idle");

  const exportSyncSnapshot = useStore((state) => state.exportSyncSnapshot);
  const applySyncSnapshot = useStore((state) => state.applySyncSnapshot);

  useEffect(() => {
    const sub = useStore.subscribe(() => {
      localStorage.setItem(LAST_LOCAL_CHANGE_AT_KEY, new Date().toISOString());
    });
    return () => sub();
  }, []);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) throw new Error("Email is required");
    setSyncState("authenticating");
    setSyncMessage("Sending magic link...");

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setSyncState("error");
      setSyncMessage(error.message);
      throw error;
    }
    setSyncState("success");
    setSyncMessage("Magic link sent. Open it on this device to sign in.");
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSyncState("idle");
    setLastSyncedAt(null);
    setSyncMessage("Signed out from cloud sync.");
  }, []);

  const pullSnapshot = useCallback(async () => {
    if (!session?.user?.id) throw new Error("You must sign in first.");

    const { data, error } = await supabase
      .from("user_snapshots")
      .select("state_json, updated_at")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }, [session?.user?.id]);

  const pushSnapshot = useCallback(async () => {
    if (!session?.user?.id) throw new Error("You must sign in first.");
    const state = exportSyncSnapshot();

    const { error } = await supabase.from("user_snapshots").upsert(
      {
        user_id: session.user.id,
        state_json: state,
        schema_version: 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) throw error;
  }, [exportSyncSnapshot, session?.user?.id]);

  const syncNow = useCallback(async () => {
    if (!session?.user?.id) {
      throw new Error("Sign in first to sync data.");
    }

    setIsSyncing(true);
    setSyncState("syncing");
    setSyncMessage("Syncing...");

    try {
      const remote = await pullSnapshot();
      const now = new Date().toISOString();
      const lastSyncedAt = toMs(localStorage.getItem(LAST_SYNC_AT_KEY));
      const lastLocalChangedAt = toMs(localStorage.getItem(LAST_LOCAL_CHANGE_AT_KEY));
      const remoteUpdatedAt = toMs(remote?.updated_at);

      const hasRemoteChangesSinceLastSync = remoteUpdatedAt > lastSyncedAt;
      const hasLocalChangesSinceLastSync = lastLocalChangedAt > lastSyncedAt;

      if (remote?.state_json && hasRemoteChangesSinceLastSync) {
        if (hasLocalChangesSinceLastSync) {
          const useRemote = window.confirm(
            "Cloud data changed since your last sync and this device also has unsynced changes.\n\nPress OK to use cloud data.\nPress Cancel to keep local data and overwrite cloud.",
          );
          if (useRemote) {
            applySyncSnapshot(remote.state_json);
          } else {
            await pushSnapshot();
          }
        } else {
          applySyncSnapshot(remote.state_json);
        }
      } else {
        await pushSnapshot();
      }

      localStorage.setItem(LAST_SYNC_AT_KEY, now);
      localStorage.setItem(LAST_LOCAL_CHANGE_AT_KEY, now);
      setLastSyncedAt(now);
      setSyncState("success");
      setSyncMessage("Sync complete.");
    } catch (error) {
      setSyncState("error");
      setSyncMessage(error instanceof Error ? error.message : "Sync failed.");
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [applySyncSnapshot, pullSnapshot, pushSnapshot, session?.user?.id]);

  return {
    session,
    isAuthLoading,
    syncMessage,
    syncState,
    lastSyncedAt,
    isSyncing,
    sendMagicLink,
    signOut,
    syncNow,
  };
};
