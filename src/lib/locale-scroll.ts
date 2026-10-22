// Kept in memory only for the next language navigation in this browser tab.
export type LocaleScrollPosition = {
  pathname: string;
  sectionIndex: number;
  sectionId: string;
  progress: number;
  viewportOffset: number;
  scrollY: number;
  atBottom: boolean;
};

let pendingPosition: LocaleScrollPosition | null = null;

function sections() {
  return Array.from(document.querySelectorAll<HTMLElement>(
    "#main > section, #reservation, footer",
  ));
}

export function captureLocaleScroll(pathname: string) {
  const viewportOffset = Math.min(
    window.innerHeight / 3,
    (document.querySelector(".header")?.getBoundingClientRect().height ?? 0) + 24,
  );
  const elements = sections();
  // Prefer the innermost matching region, such as the booking card inside reviews.
  let sectionIndex = -1;
  elements.forEach((element, index) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.top <= viewportOffset && bounds.bottom > viewportOffset) {
      sectionIndex = index;
    }
  });
  const section = elements[sectionIndex];
  const bounds = section?.getBoundingClientRect();
  pendingPosition = {
    pathname,
    sectionIndex,
    sectionId: section?.id ?? "",
    progress: bounds ? (viewportOffset - bounds.top) / bounds.height : 0,
    viewportOffset,
    scrollY: window.scrollY,
    atBottom: window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2,
  };
}

export function capturePageTop(pathname: string) {
  pendingPosition = {
    pathname,
    sectionIndex: -1,
    sectionId: "",
    progress: 0,
    viewportOffset: 0,
    scrollY: 0,
    atBottom: false,
  };
}

export function takeLocaleScroll(pathname: string) {
  if (pendingPosition?.pathname !== pathname) return null;
  const position = pendingPosition;
  pendingPosition = null;
  return position;
}

export function restoreLocaleScroll(position: LocaleScrollPosition) {
  const section = position.sectionId
    ? document.getElementById(position.sectionId)
    : sections()[position.sectionIndex];
  let top = position.scrollY;
  if (section) {
    const bounds = section.getBoundingClientRect();
    top = window.scrollY + bounds.top + bounds.height * position.progress - position.viewportOffset;
  }
  if (position.atBottom) top = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
}
