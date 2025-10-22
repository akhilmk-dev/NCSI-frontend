// lib/sessionId.js
import { v4 as uuidv4 } from 'uuid';

export function getBrowserSessionId() {
  if (typeof window === 'undefined') return null; // SSR-safe

  let id = sessionStorage.getItem('browser_session_id');
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem('browser_session_id', id);
  }
  return id;
}
