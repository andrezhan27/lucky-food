"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export function PriceTabs({ adultsLabel, childrenLabel, label, adults, children }: {
  adultsLabel: string;
  childrenLabel: string;
  label: string;
  adults: ReactNode;
  children: ReactNode;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = [adultsLabel, childrenLabel];
  return (
    <div className="branch-price-tabs">
      <div role="tablist" aria-label={label} className="branch-tab-list">
        {labels.map((text, index) => (
          <button
            key={index}
            ref={element => { buttons.current[index] = element; }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={event => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - active;
              setActive(next);
              buttons.current[next]?.focus();
            }}
          >{text}</button>
        ))}
      </div>
      {[adults, children].map((content, index) => (
        <div key={index} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0}>
          {content}
        </div>
      ))}
    </div>
  );
}
