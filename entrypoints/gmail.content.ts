import hotkeys from "hotkeys-js";
import { SELECTORS, SHORTCUTS } from "@/lib/constants";
import { $ } from "@/lib/query";

export default defineContentScript({
  matches: ["*://mail.google.com/*"],
  main() {
    // Left arrow or '<' for newer email
    hotkeys(SHORTCUTS.GMAIL.NEWER, () => {
      const newerButton = $<HTMLElement>(SELECTORS.GMAIL.NEWER_BUTTON);
      if (newerButton && newerButton.getAttribute("aria-disabled") !== "true") {
        newerButton.click();
      }
    });

    // Right arrow or '>' for older email
    hotkeys(SHORTCUTS.GMAIL.OLDER, () => {
      const olderButton = $<HTMLElement>(SELECTORS.GMAIL.OLDER_BUTTON);
      if (olderButton && olderButton.getAttribute("aria-disabled") !== "true") {
        olderButton.click();
      }
    });

    // Switch to account by number (1-9)
    hotkeys(SHORTCUTS.GMAIL.ACCOUNT_SWITCH, (event) => {
      const numberPressed = parseInt(event.key, 10);
      if (numberPressed >= 1 && numberPressed <= 9) {
        switchToAccount(numberPressed - 1);
      }
    });

    // Press '0' to go to inbox
    hotkeys(SHORTCUTS.GMAIL.INBOX, () => {
      goToInbox();
    });

    // Press Enter to click the back/send button
    hotkeys(SHORTCUTS.GMAIL.BACK_SEND, () => {
      const mailRow = $<HTMLElement>(SELECTORS.GMAIL.BACK_SEND_BUTTON);
      if (mailRow) {
        try {
          mailRow.click();
          console.log("Gmail: Clicked back/send button via Enter key");
        } catch (error) {
          console.error("Gmail: Failed to click back/send button:", error);
        }
      }
    });

    // Function to switch to a specific account by index via URL modification
    function switchToAccount(index: number) {
      const newUrl = `https://mail.google.com/mail/u/${index}/#inbox`;
      window.location.href = newUrl;
    }

    // Function to go to inbox
    function goToInbox() {
      const inboxButton = $<HTMLElement>(SELECTORS.GMAIL.INBOX_BUTTON);

      if (inboxButton) {
        const inboxLink = $<HTMLElement>(
          SELECTORS.GMAIL.INBOX_LINK,
          inboxButton
        );
        if (inboxLink) {
          inboxLink.click();
          console.log("Gmail: Clicked inbox button");
          return;
        }
      }

      // Fallback: navigate via URL if button not found
      const currentUrl = window.location.href;
      const accountMatch = currentUrl.match(/\/mail\/u\/(\d+)\//);
      const currentAccount = accountMatch ? accountMatch[1] : "0";
      const inboxUrl = `https://mail.google.com/mail/u/${currentAccount}/#inbox`;
      window.location.href = inboxUrl;
    }
  },
});
