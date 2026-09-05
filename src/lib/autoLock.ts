// A deadline survives background timer suspension; returning to the app is not activity.
export function startAutoLock(minutes: number, onLock: () => void, host = window, page = document) {
  if (minutes === 0) return () => {};
  const duration = minutes * 60_000;
  let deadline = Date.now() + duration;
  let stopped = false;
  let timer: number;
  const check = () => {
    if (stopped) return;
    host.clearTimeout(timer);
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      stopped = true;
      onLock();
    } else {
      timer = host.setTimeout(check, remaining);
    }
  };
  const activity = () => {
    if (stopped || page.visibilityState !== 'visible' || !page.hasFocus()) return;
    if (Date.now() >= deadline) { check(); return; }
    deadline = Date.now() + duration;
    check();
  };
  const resume = () => { if (page.visibilityState === 'visible') check(); };
  const events = ['pointerdown', 'pointermove', 'keydown', 'wheel'];
  for (const event of events) host.addEventListener(event, activity, { passive: true });
  host.addEventListener('focus', resume);
  page.addEventListener('visibilitychange', resume);
  check();
  return () => {
    stopped = true;
    host.clearTimeout(timer);
    for (const event of events) host.removeEventListener(event, activity);
    host.removeEventListener('focus', resume);
    page.removeEventListener('visibilitychange', resume);
  };
}
