type Props = { industryKey: string; className?: string };

export function IndustryIcon({ industryKey, className }: Props) {
  const cn = "h-10 w-10 text-mib " + (className ?? "");
  switch (industryKey) {
    case "oil-gas":
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <path
            d="M8 28h24v4H8v-4zm2-14l6-6 4 4-6 6-4-4zm10 0l8-8 4 4-8 8-4-4z"
            fill="currentColor"
            opacity=".35"
          />
          <path
            d="M12 32V18l6-6v14l-6 6zm10-14v14l6-6V12l-6 6z"
            fill="currentColor"
          />
        </svg>
      );
    case "manufacturing":
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <rect
            x="6"
            y="14"
            width="28"
            height="14"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M10 14V10h6v4M18 14V8h6v6M26 14V11h6v3" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "mining":
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <path
            d="M6 30 L14 12 L20 22 L26 10 L34 30 Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity=".15"
          />
        </svg>
      );
    case "water":
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <path
            d="M20 8c-4 8-10 12-10 18a10 10 0 1020 0c0-6-6-10-10-18z"
            fill="currentColor"
            fillOpacity=".25"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    case "flask":
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <path
            d="M14 6h12v4l-6 14v8H14v-8l-6-14V6z"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity=".12"
          />
        </svg>
      );
    case "droplet":
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <path
            d="M20 6s-8 10-8 16a8 8 0 1016 0c0-6-8-16-8-16z"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity=".2"
          />
        </svg>
      );
    case "support":
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <circle cx="16" cy="14" r="6" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8 30c0-6 6-8 8-8h4c2 0 8 2 8 8"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M26 18l8 4-4 8" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden>
          <rect
            x="8"
            y="8"
            width="24"
            height="24"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
  }
}
