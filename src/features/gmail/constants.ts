/**
 * Gmail-specific constants
 */

export const GMAIL_SELECTORS = {
  NEWER_BUTTON: '[aria-label="Newer"], [aria-label="Más reciente"]',
  OLDER_BUTTON: '[aria-label="Older"], [aria-label="Anterior"]',
  INBOX_BUTTON: '[data-tooltip="Inbox"], [data-tooltip="Recibidos"]',
  BACK_SEND_BUTTON: ".btb",
  INBOX_LINK: "a",
} as const;

export const GMAIL_SHORTCUTS = {
  NEWER: "left, <",
  OLDER: "right, >",
  ACCOUNT_SWITCH: "1,2,3,4,5,6,7,8,9",
  INBOX: "0",
  BACK_SEND: "enter",
} as const;

export const GMAIL_CONFIG = {
  URLS: {
    INBOX_BASE: "https://mail.google.com/mail",
    ACCOUNT_INBOX: (accountIndex: number) => `https://mail.google.com/mail/u/${accountIndex}/#inbox`,
    DEFAULT_INBOX: "https://mail.google.com/mail/u/0/#inbox",
  },
  ACCOUNT_INDEX_REGEX: /\/mail\/u\/(\d+)\//,
  PROJECTOR_HASH_PARAM: "projector",
  HASH_SEPARATOR: "?",
  MIN_ACCOUNT: 1,
  MAX_ACCOUNT: 9,
} as const;
