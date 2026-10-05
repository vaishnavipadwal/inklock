import { useCallback, useEffect, useState } from "react";
import api, { sectionToken } from "../api/books";

const message = (err, fallback) => {
  const d = err.response?.data?.detail;
  return typeof d === "string" ? d : fallback;
};

// unlock() and setup() return "" on success, or an error message
export default function usePrivateSection() {
  const [ready, setReady] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [privateCount, setPrivateCount] = useState(0);
  const [unlocked, setUnlocked] = useState(() => !!sectionToken.get());

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/private/status");
      setHasPassword(data.has_password);
      setPrivateCount(data.private_count);
    } catch {
      /* keep defaults; the books request shows its own error */
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const grant = useCallback(async (path, password, fallback) => {
    try {
      const { data } = await api.post(path, { password });
      sectionToken.set(data.section_token);
      setUnlocked(true);
      return "";
    } catch (err) {
      return message(err, fallback);
    }
  }, []);

  const unlock = useCallback(
    (pw) => grant("/private/unlock", pw, "Could not unlock the private section."),
    [grant]
  );

  const setup = useCallback(
    async (pw) => {
      const err = await grant("/private/setup", pw, "Could not set the private section password.");
      if (!err) setHasPassword(true);
      return err;
    },
    [grant]
  );

  const lock = useCallback(() => {
    sectionToken.clear();
    setUnlocked(false);
  }, []);

  return { ready, hasPassword, privateCount, unlocked, refresh, unlock, setup, lock };
}
