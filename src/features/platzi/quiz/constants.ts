/**
 * Platzi quiz-specific constants
 */

export const PLATZI_QUIZ_SELECTORS = {
	// Combined selectors for old UI and new UI (evaluacion pages)
	QUIZ_OPTIONS:
		'button[data-testid="QuestionOption-content"], label[data-id="answer-option"]',
	OPTION_LETTER:
		'.QuestionOption-letter-span, label[data-id="answer-option"] > button',
	OPTION_LETTER_ELEMENT:
		'.QuestionOption-letter, label[data-id="answer-option"] > button',
	OPTION_TEXT_ELEMENT:
		'.QuestionOption-text, label[data-id="answer-option"] > span',

	// Button selectors
	CONTROL_BAR: ".ControlBar-content",
	CONTROL_BUTTONS: "button:not([disabled])",
	EVALUATE_BUTTON:
		'button[class*="Controllers_evaluateButton"]:not([disabled])',
	START_EXAM_BUTTON: 'button[data-trans="StartExam.cta.takeTest"]',
	START_QUIZ_BUTTON: 'button[maintext="StartQuiz.cta.takeTest"]',
	FINISH_BUTTON: 'button[testid="ControlBar-button-finish"]',
	CONTINUE_BUTTON: 'a[data-testid="ResultsOverview-btns-cta"]',
} as const

export const PLATZI_QUIZ_SHORTCUTS = {
	NEXT_OPTION: "down",
	PREVIOUS_OPTION: "up",
	SELECT_OPTION: "enter",
	CANCEL_SELECTION: "esc",
	SELECT_BY_LETTER: "a,b,c,d,e",
	SELECT_BY_NUMBER: "1,2,3,4,5",
	MARK_DISCARDED: "left",
	MARK_MAYBE: "right",
} as const

export interface ButtonConfig {
	selector: string
	label: string
}

/**
 * Platzi quiz button configurations in priority order
 * First matching button will be clicked
 */
export const PLATZI_QUIZ_BUTTONS: ButtonConfig[] = [
	{
		selector: PLATZI_QUIZ_SELECTORS.CONTROL_BAR,
		label: "ControlBar Button",
	},
	{
		selector: PLATZI_QUIZ_SELECTORS.START_EXAM_BUTTON,
		label: "Start Exam",
	},
	{
		selector: PLATZI_QUIZ_SELECTORS.START_QUIZ_BUTTON,
		label: "Start Quiz",
	},
	{
		selector: PLATZI_QUIZ_SELECTORS.FINISH_BUTTON,
		label: "Finish",
	},
	{
		selector: PLATZI_QUIZ_SELECTORS.CONTINUE_BUTTON,
		label: "Continue Learning",
	},
]
