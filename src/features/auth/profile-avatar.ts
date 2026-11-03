const PROFILE_AVATAR_KEY = "pixel-forge-avatar";

export function getStoredAvatar(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PROFILE_AVATAR_KEY);
}

export function storeAvatar(avatar: string) {
  window.localStorage.setItem(PROFILE_AVATAR_KEY, avatar);
  window.dispatchEvent(new Event("pixel-forge-avatar-change"));
}

export function subscribeToAvatar(callback: () => void) {
  window.addEventListener("pixel-forge-avatar-change", callback);
  return () => window.removeEventListener("pixel-forge-avatar-change", callback);
}
