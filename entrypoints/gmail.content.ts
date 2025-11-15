import hotkeys from "hotkeys-js";
import { $ } from "@/lib/query";

export default defineContentScript({
  matches: ["*://mail.google.com/*"],
  main() {
    // Left arrow or '<' for newer email
    hotkeys("left, <", () => {
      const newerButton = $<HTMLElement>(
        '[aria-label="Newer"], [aria-label="Más reciente"]'
      );
      if (newerButton && newerButton.getAttribute("aria-disabled") !== "true") {
        newerButton.click();
      }
    });

    // Right arrow or '>' for older email
    hotkeys("right, >", () => {
      const olderButton = $<HTMLElement>(
        '[aria-label="Older"], [aria-label="Anterior"]'
      );
      if (olderButton && olderButton.getAttribute("aria-disabled") !== "true") {
        olderButton.click();
      }
    });

    // const modifier = isMac ? "" : "ctrl+shift";
    // `${modifier}+1,${modifier}+2,${modifier}+3,${modifier}+4,${modifier}+5,${modifier}+6,${modifier}+7,${modifier}+8,${modifier}+9`
    const keys = "1,2,3,4,5,6,7,8,9";
    hotkeys(keys, (event) => {
      const numberPressed = parseInt(event.key, 10);
      if (numberPressed >= 1 && numberPressed <= 9) {
        switchToAccount(numberPressed - 1);
      }
    });

    // Press '0' to go to inbox
    hotkeys("0", () => {
      goToInbox();
    });
    // Press Enter to click the back/send button (e.g., in conversation or compose view)
    hotkeys("enter", () => {
      const mailRow = $<HTMLElement>(".btb");
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
      // Build new URL - always go to inbox when switching accounts
      const newUrl = `https://mail.google.com/mail/u/${index}/#inbox`;
      window.location.href = newUrl;
    }

    // Function to go to inbox
    function goToInbox() {
      // Try to find the inbox button in the sidebar (supports English and Spanish)
      const inboxButton = $<HTMLElement>(
        '[data-tooltip="Inbox"], [data-tooltip="Recibidos"]'
      );

      if (inboxButton) {
        // Find the link inside the inbox button
        const inboxLink = $<HTMLElement>("a", inboxButton);
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
