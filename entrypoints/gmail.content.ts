import hotkeys from "hotkeys-js";
import { SELECTORS, SHORTCUTS, GMAIL } from "@/lib/constants";
import { $ } from "@/lib/query";

export default defineContentScript({
  matches: ["*://mail.google.com/*"],
  main() {
    // Helper function to check if projector mode is active
    const isProjectorMode = () => {
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.split(GMAIL.HASH_SEPARATOR)[1] || "");
      return hashParams.get(GMAIL.PROJECTOR_HASH_PARAM) === "1";
    };

    // Left arrow or '<' for newer email
    hotkeys(SHORTCUTS.GMAIL.NEWER, () => {
      if (isProjectorMode()) return;
      const newerButton = $<HTMLElement>(SELECTORS.GMAIL.NEWER_BUTTON);
      if (newerButton && newerButton.getAttribute("aria-disabled") !== "true") {
        newerButton.click();
      }
    });

    // Right arrow or '>' for older email
    hotkeys(SHORTCUTS.GMAIL.OLDER, () => {
      if (isProjectorMode()) return;

      const olderButton = $<HTMLElement>(SELECTORS.GMAIL.OLDER_BUTTON);
      if (olderButton && olderButton.getAttribute("aria-disabled") !== "true") {
        olderButton.click();
      }
    });

    // Switch to account by number (1-9)
    hotkeys(SHORTCUTS.GMAIL.ACCOUNT_SWITCH, (event) => {
      const numberPressed = parseInt(event.key, 10);
      if (numberPressed >= GMAIL.MIN_ACCOUNT && numberPressed <= GMAIL.MAX_ACCOUNT) {
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
      window.location.href = GMAIL.URLS.ACCOUNT_INBOX(index);
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
      const accountMatch = currentUrl.match(GMAIL.ACCOUNT_INDEX_REGEX);
      const currentAccount = accountMatch ? accountMatch[1] : "0";
      window.location.href = GMAIL.URLS.ACCOUNT_INBOX(parseInt(currentAccount));
    }
  },
});
