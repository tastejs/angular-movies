export function preventDefault(e: Event): Event {
  e.preventDefault();
  return e;
}

export function stopPropagation(e: Event): Event {
  e.stopPropagation();
  return e;
}

export function preventDefaultStopPropagation(e: Event): Event {
  e.stopPropagation();
  e.preventDefault();
  return e;
}
