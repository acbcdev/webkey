import hotkeys from "hotkeys-js";
import {
	goToInbox,
	switchToAccount,
} from "@/features/gmail/account-switcher";
import { GMAIL_CONFIG, GMAIL_SHORTCUTS } from "@/features/gmail/constants";
import {
	clickBackSendButton,
	navigateToNewer,
	navigateToOlder,
} from "@/features/gmail/navigation";

export default defineContentScript({
	matches: ["*://mail.google.com/*"],
	main() {
		// Left arrow or '<' for newer email
		hotkeys(GMAIL_SHORTCUTS.NEWER, () => {
			navigateToNewer();
		});

		// Right arrow or '>' for older email
		hotkeys(GMAIL_SHORTCUTS.OLDER, () => {
			navigateToOlder();
		});

		// Switch to account by number (1-9)
		hotkeys(GMAIL_SHORTCUTS.ACCOUNT_SWITCH, (event) => {
			const numberPressed = parseInt(event.key, 10);
			if (
				numberPressed >= GMAIL_CONFIG.MIN_ACCOUNT &&
				numberPressed <= GMAIL_CONFIG.MAX_ACCOUNT
			) {
				switchToAccount(numberPressed - 1);
			}
		});

		// Press '0' to go to inbox
		hotkeys(GMAIL_SHORTCUTS.INBOX, () => {
			goToInbox();
		});

		// Press Enter to click the back/send button
		hotkeys(GMAIL_SHORTCUTS.BACK_SEND, () => {
			clickBackSendButton();
		});
	},
});
