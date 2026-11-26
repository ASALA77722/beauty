export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.5 }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
  }

  const paths = {
    bag: (
      <>
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    menu: (
      <>
        <path d="M3 7h18" />
        <path d="M3 12h18" />
        <path d="M3 17h18" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </>
    ),
    star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
    check: <path d="m4 12.5 5 5L20 6.5" />,
    leaf: (
      <>
        <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z" />
        <path d="M4 20 14 10" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    truck: (
      <>
        <path d="M3 7h10v9H3z" />
        <path d="M13 10h4l4 4v2h-8z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 3v6" />
        <path d="M12 15v6" />
        <path d="M3 12h6" />
        <path d="M15 12h6" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    heart: (
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
    ),
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.4" />
        <path d="M16.6 7.5h.01" />
      </>
    ),
  }

  return <svg {...common}>{paths[name] ?? null}</svg>
}
