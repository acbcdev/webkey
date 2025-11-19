/**
 * Centralized constants for all content scripts
 * Includes selectors, colors, shortcuts, and visual feedback values
 */

export const SELECTORS = {
  GMAIL: {
    NEWER_BUTTON: '[aria-label="Newer"], [aria-label="Más reciente"]',
    OLDER_BUTTON: '[aria-label="Older"], [aria-label="Anterior"]',
    INBOX_BUTTON: '[data-tooltip="Inbox"], [data-tooltip="Recibidos"]',
    BACK_SEND_BUTTON: ".btb",
    INBOX_LINK: "a",
  },
  PLATZI: {
    SEARCH_INPUT: "input[type='search']",
  },
  PLATZI_CURSOS: {
    CONTENT: '[class*="Articlass__content"]',
    HEADING_H1: "h1",
  },
  PLATZI_QUIZ: {
    QUIZ_OPTIONS: 'button[data-testid="QuestionOption-content"]',
    OPTION_LETTER: ".QuestionOption-letter-span",
    CONTROL_BAR: ".ControlBar-content",
    CONTROL_BUTTONS: "button:not([disabled])",
    START_EXAM_BUTTON: 'button[data-trans="StartExam.cta.takeTest"]',
    START_QUIZ_BUTTON: 'button[maintext="StartQuiz.cta.takeTest"]',
    FINISH_BUTTON: 'button[testid="ControlBar-button-finish"]',
    CONTINUE_BUTTON: 'a[data-testid="ResultsOverview-btns-cta"]',
  },
  NOTION: {
    ADD_NEW_ITEM: ".notion-gallery-view .notion-selectable.notion-collection_view-block div div",
  },
} as const;

export const VISUAL = {
  FEEDBACK_COLOR: "#4CAF50",
  ERROR_COLOR: "#f44336",
  WARNING_COLOR: "#ff9800",
  DISCARDED_COLOR: "#f44336",
  MAYBE_COLOR: "#2196F3",
  OUTLINE_WIDTH: 3,
  OUTLINE_OFFSET: 2,
  TRANSITION_DURATION: 300,
} as const;

export const SHORTCUTS = {
  GMAIL: {
    NEWER: "left, <",
    OLDER: "right, >",
    ACCOUNT_SWITCH: "1,2,3,4,5,6,7,8,9",
    INBOX: "0",
    BACK_SEND: "enter",
  },
  PLATZI: {
    FOCUS_SEARCH_MAC: "command+k",
    FOCUS_SEARCH_OTHER: "ctrl+k",
  },
  PLATZI_CURSOS: {
    COPY_HEADING: "h",
    COPY_CONTENT: "r",
  },
  PLATZI_QUIZ: {
    NEXT_OPTION: "down",
    PREVIOUS_OPTION: "up",
    SELECT_OPTION: "enter",
    CANCEL_SELECTION: "esc",
    SELECT_BY_LETTER: "a,b,c,d,e",
    SELECT_BY_NUMBER: "1,2,3,4,5",
    MARK_DISCARDED: "left",
    MARK_MAYBE: "right",
  },
  NOTION: {
    ADD_NEW_ITEM: "n",
  },
} as const;
