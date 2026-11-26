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
    star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
    check: <path d="m4 12.5 5 5L20 6.5" />,
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
    user: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c1.2-3.5 3.8-5.2 7-5.2s5.8 1.7 7 5.2" />
      </>
    ),
    phone: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
        <path d="M11 18.5h2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 5.5L20 7" />
      </>
    ),
    card: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" />
      </>
    ),
    bank: (
      <>
        <path d="M3 9.5 12 4l9 5.5" />
        <path d="M5 9.5V19M10 9.5V19M14 9.5V19M19 9.5V19" />
        <path d="M3 21h18" />
      </>
    ),
    lock: (
      <>
        <rect x="4.5" y="10" width="15" height="11" rx="2.5" />
        <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 9.5V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.5a2.5 2.5 0 0 0 0 5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.5a2.5 2.5 0 0 0 0-5Z" />
        <path d="M12 8v8" strokeDasharray="2 3" />
      </>
    ),
    logout: (
      <>
        <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
        <path d="M10 8 6 12l4 4" />
        <path d="M6 12h9" />
      </>
    ),
    heart: <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />,
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.4" />
        <path d="M16.6 7.5h.01" />
      </>
    ),
    bell: (
      <>
        <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
        <path d="M10 18a2 2 0 0 0 4 0" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 9.2h4.2a1.9 1.9 0 0 1 0 3.8H9.5h4.6a1.9 1.9 0 0 1 0 3.8H9.5" />
      </>
    ),
    chat: (
      <>
        <path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4 20l1.3-4.6A7.5 7.5 0 1 1 20 12Z" />
        <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    box: (
      <>
        <path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
        <path d="M3.5 8v8l8.5 4 8.5-4V8" />
        <path d="M12 12v8" />
      </>
    ),
    send: <path d="m4 12 16-7-7 16-2.2-6.8L4 12Z" />,
    store: (
      <>
        <path d="M4 9.5V20h16V9.5" />
        <path d="M2.8 9.5 5 4h14l2.2 5.5a3 3 0 0 1-5.6 1 3 3 0 0 1-5.6 0 3 3 0 0 1-5.6-1Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="9" r="3.2" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <path d="M16 6.2a3.2 3.2 0 0 1 0 5.6M17.5 14.4A5.5 5.5 0 0 1 20.5 19" />
      </>
    ),
    key: (
      <>
        <circle cx="8.5" cy="8.5" r="3.5" />
        <path d="m11 11 8 8M16 16l2-2M18.5 18.5 21 16" />
      </>
    ),
  }

  return <svg {...common}>{paths[name] ?? null}</svg>
}
