# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WebKey is a multi-website browser extension built with WXT framework using Chrome Manifest V3. It provides custom keyboard shortcuts for Gmail, Platzi (courses, quizzes), and Notion to improve productivity.

## Architecture: Screaming Architecture Pattern

This project uses **Screaming Architecture** - the folder structure immediately communicates what the application does:

```
webkey/
├── entrypoints/              # WXT entry points (thin wrappers)
│   ├── gmail.content.ts      # Routes to features/gmail
│   ├── platzi.content.ts     # Routes to features/platzi
│   ├── platzi-cursos.content.ts    # Routes to features/platzi/content-copy
│   ├── platzi-quiz.content.ts      # Routes to features/platzi/quiz
│   ├── notion.content.ts     # Routes to features/notion
│   ├── global.content.ts     # Global hotkeys (Ctrl+Shift+H for home navigation)
│   ├── popup/                # React popup UI entry point
│   │   └── App.tsx           # Main popup component
│   └── background.ts
│
├── features/                 # Feature modules (Screaming Architecture!)
│   ├── gmail/                # Gmail keyboard shortcuts & account switching
│   │   ├── constants.ts      # Selectors, shortcuts, Gmail-specific config
│   │   ├── navigation.ts     # Email navigation logic
│   │   └── account-switcher.ts  # Account switching functionality
│   │
│   ├── platzi/               # Platzi main site & course features
│   │   ├── constants.ts      # Platzi-specific constants
│   │   ├── search.ts         # Search input focus toggle
│   │   ├── content-copy.ts   # Course content copying
│   │   ├── icons.ts          # SVG icon definitions
│   │   └── quiz/             # Quiz/exam-specific features
│   │       ├── constants.ts  # Quiz selectors, shortcuts, button configs
│   │       ├── QuizNavigator.ts   # Core quiz navigation state machine
│   │       ├── mark-state.ts      # Mark state management (discarded/maybe/confident)
│   │       └── button-handler.ts  # Button finding & clicking logic
│   │
│   ├── notion/               # Notion productivity features
│   │   ├── constants.ts      # Notion selectors & shortcuts
│   │   └── gallery.ts        # Gallery view management
│   │
│   ├── global/               # Global cross-site features
│   │   ├── constants.ts      # Global shortcuts (Ctrl+Shift+H)
│   │   └── home-navigation.ts # Navigate to custom home URLs per domain
│   │
│   ├── url-mapper/           # Custom home URL mapping UI & logic
│   │   ├── hooks/            # React hooks for popup UI
│   │   │   ├── useCurrentTab.ts   # Get current tab info
│   │   │   └── useUrlMapper.ts    # Manage custom home URL mappings
│   │   ├── UrlMapperManager.tsx   # Main popup component
│   │   ├── UrlMapperForm.tsx      # Form for adding/editing mappings
│   │   ├── UrlMapperList.tsx      # List of saved mappings
│   │   └── types.ts          # TypeScript interfaces for URL mappings
│   │
│   └── ui/                   # Reusable UI components (shadcn/ui - Radix + Tailwind)
│       ├── button.tsx        # Button component (shadcn/ui)
│       ├── input.tsx         # Input field component (shadcn/ui)
│       ├── dropdown.tsx      # Dropdown/select component (shadcn/ui)
│       ├── textarea.tsx      # Textarea component (shadcn/ui)
│       ├── tooltip.tsx       # Tooltip component (shadcn/ui)
│       ├── separator.tsx     # Separator/divider component (shadcn/ui)
│       └── ...               # Other shadcn/ui components
│
└── lib/                      # Shared utilities (organized by concern, not by website)
    ├── dom/                  # DOM operations
    │   ├── query.ts          # $() and $$() - Typed DOM query helpers
    │   └── clipboard.ts      # copyText(), copyElementText() with visual feedback
    │
    ├── ui/                   # Visual feedback utilities
    │   ├── colors.ts         # Shared color constants (COLORS, VISUAL)
    │   └── visual-feedback.ts  # flashBackground(), highlightElement(), markAs*()
    │
    ├── platform/             # Cross-platform compatibility
    │   └── detection.ts      # isMac(), isWindows(), isLinux()
    │
    ├── storage/              # Data persistence & cross-document storage
    │   └── home-urls.ts      # Manage custom home URLs using @wxt-dev/storage
    │
    └── navigation/           # Navigation utilities
        └── home-navigation.ts # Cross-tab home URL navigation logic
```

### Key Architectural Principles

1. **Feature-First Organization** - `features/` folder screams "This does Gmail, Platzi, Notion!"
2. **Thin Entrypoints** - `entrypoints/*.content.ts` only register hotkeys; business logic lives in `features/`
3. **Co-located Constants** - Each feature has its own `constants.ts` with selectors & shortcuts for that domain
4. **Shared Utils by Concern** - `lib/` organized by what it does (dom, ui, platform), not by website
5. **Extracted Domain Models** - Quiz has `QuizNavigator` + `MarkStateManager` for testable logic separation

### WXT Framework Integration

- **Auto-bundling**: Files ending in `.content.ts` in `entrypoints/` are automatically bundled
- **Manifest Generation**: Match patterns from `defineContentScript()` are auto-added to manifest.json
- **No Manual Config**: Add a new website? Just create `entrypoints/website.content.ts` and run `pnpm build`
- **Build Output**: `.output/chrome-mv3/` or `.output/firefox-mv3/` contains built extension

## Development Commands

**IMPORTANT**: Do not run `pnpm build` or `pnpm dev` automatically. Only run these when explicitly requested by the user.

```bash
# Development mode (Chrome, with hot reload for quick iteration)
pnpm dev

# Development for Firefox
pnpm dev:firefox

# Type checking without building
pnpm compile

# Production build (Chrome Manifest V3)
pnpm build

# Production build (Firefox)
pnpm build:firefox

# Create distribution packages
pnpm zip          # Creates chrome-mv3.zip
pnpm zip:firefox  # Creates firefox-mv3.zip

# Code quality & formatting
pnpm lint         # Check code with Biome linter
pnpm format       # Auto-format code with Biome
pnpm check        # Full Biome check (lint + format validation)

# Install dependencies
pnpm install
```

**Code Quality**: The project uses **Biome** (v2.3.6) for linting and formatting. Pre-commit hooks automatically run `biome check --write --staged` to enforce consistency. Run `pnpm format` before committing to avoid hook failures.

## Adding New Website Features

When adding keyboard shortcuts for a new website:

1. **Create feature module**: `features/{website}/constants.ts`
   ```typescript
   export const WEBSITE_SELECTORS = { /* ... */ };
   export const WEBSITE_SHORTCUTS = { /* ... */ };
   ```

2. **Create entrypoint**: `entrypoints/{website}.content.ts`
   ```typescript
   import hotkeys from "hotkeys-js";
   import { WEBSITE_SHORTCUTS } from "@/features/{website}/constants";

   export default defineContentScript({
     matches: ["*://{website.com}/*"],
     main() {
       hotkeys(WEBSITE_SHORTCUTS.ACTION, () => {
         // business logic
       });
     },
   });
   ```

3. **Extract business logic** into feature modules (e.g., `features/{website}/actions.ts`)
4. **Import from lib/** for shared utilities: `@/lib/dom/query`, `@/lib/ui/visual-feedback`
5. **Build**: `pnpm build` automatically registers the script in manifest

## Common Development Patterns

### Platform Detection
```typescript
import { isMac } from "@/lib/platform/detection";

const shortcut = isMac() ? "command+k" : "ctrl+k";
```

### DOM Queries with Type Safety
```typescript
import { $, $$ } from "@/lib/dom/query";

const button = $<HTMLButtonElement>("#submit");
const allOptions = $$<HTMLElement>(".option");
```

### Clipboard Operations with Visual Feedback
```typescript
import { copyText, copyElementText } from "@/lib/dom/clipboard";

// Copy with automatic background flash
await copyElementText(element);

// Copy plain text
await copyText("Hello World");
```

### Visual Feedback
```typescript
import {
  flashBackground,
  highlightElement,
  markAsConfident
} from "@/lib/ui/visual-feedback";
import { VISUAL } from "@/lib/ui/colors";

// Flash background (returns promise when complete)
await flashBackground(element, VISUAL.FEEDBACK_COLOR, 300);

// Highlight multiple elements
highlightElement(selectedElement, allElements, VISUAL.CONFIDENT_COLOR);

// Mark quiz option (includes border + text styling)
markAsConfident(element, selectorForLetter, selectorForText);
```

### Feature Constants Pattern
Constants should be co-located with the feature that uses them:
- `features/gmail/constants.ts` - Gmail selectors/shortcuts
- `features/platzi/quiz/constants.ts` - Quiz-specific selectors/shortcuts
- `features/global/constants.ts` - Global shortcuts
- `lib/ui/colors.ts` - Shared colors used by multiple features

### Storage Persistence with @wxt-dev/storage
For features that need persistent data across browser sessions (like custom home URL mappings):

```typescript
import { storage } from "@wxt-dev/storage";

// Define reactive storage in lib/storage/home-urls.ts
export const customHomeUrls = storage.defineItem<Record<string, string>>(
  "sync:customHomeUrls", // 'sync:' prefix syncs across browser profile
  {
    defaultValue: {},
    version: 1,
  }
);

// Use in React hooks (popup/features)
import { useStorage } from "@wxt-dev/storage/react";
const [homeUrls, setHomeUrls] = useStorage(customHomeUrls);

// Use in content scripts
import { customHomeUrls } from "@/lib/storage/home-urls";
const urls = await customHomeUrls.getValue(); // Returns Promise
await customHomeUrls.setValue({ "gmail.com": "https://gmail.com/mail" });

// Watch for changes in content scripts
customHomeUrls.watch((newValue) => {
  console.log("Home URLs updated:", newValue);
});
```

**Key Points:**
- `sync:` prefix = syncs across device profile (what we use for cross-tab data)
- Returns Promises in content scripts, reactive in React via `useStorage()`
- Changes to storage automatically sync across all tabs/windows

### React Components & Popup UI
The popup UI uses React with **shadcn/ui** (Radix UI primitives + Tailwind CSS):

```typescript
// features/url-mapper/UrlMapperManager.tsx
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";
import { useUrlMapper } from "./hooks/useUrlMapper";

export default function UrlMapperManager() {
  const { homeUrls, addMapping, removeMapping } = useUrlMapper();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Custom Home URLs</h2>
      <UrlMapperForm onAdd={addMapping} />
      <UrlMapperList items={homeUrls} onRemove={removeMapping} />
    </div>
  );
}
```

**UI Component Library** (`features/ui/` - shadcn/ui):
- Uses **shadcn/ui** - a collection of beautiful, accessible Radix UI primitives
- Pre-styled with Tailwind CSS (v4.1.17)
- Component aliases configured in `components.json` for clean imports: `@/features/ui/button`
- All components are fully customizable and composable
- Use existing shadcn/ui components instead of creating new ones
- Reference: [shadcn/ui Docs](https://ui.shadcn.com/)

**React Hooks for Popup Features** (`features/{feature}/hooks/`):
- `useCurrentTab()` - Get current browser tab info (URL, domain, favicon)
- `useUrlMapper()` - Manage custom home URL mappings with storage
- Extract component logic into custom hooks for reusability and testability

## Key Files & Responsibilities

### Entrypoints (Entry points for WXT)
- **Role**: Register keyboard shortcuts, delegate to feature modules
- **Should be**: Thin and focused (just hotkey registration)
- **Examples**: `entrypoints/gmail.content.ts`, `entrypoints/platzi-quiz.content.ts`

### Features (Domain logic)
- **Role**: Implement business logic for each website/feature
- **Should include**: Constants, functions, classes (QuizNavigator)
- **Examples**: `features/platzi/quiz/QuizNavigator.ts`, `features/gmail/navigation.ts`

### Lib (Shared utilities)
- **Role**: Cross-cutting concerns used by 2+ features
- **Organized by**: Concern (dom, ui, platform), not by website
- **Should NOT have**: Website-specific code
- **Examples**: `lib/dom/query.ts`, `lib/ui/visual-feedback.ts`

## Keyboard Shortcuts Reference

See [README.md](README.md) for complete keyboard shortcut documentation by website.

## Build Output Structure

After `pnpm build`:
```
.output/chrome-mv3/
├── content-scripts/      # Bundled content scripts
│   ├── gmail.js
│   ├── platzi.js
│   └── ...
├── manifest.json         # Auto-generated from defineContentScript configs
└── ...
```

Manifest is auto-generated from content script `matches` patterns - no manual updates needed.

## Implementation Patterns to Follow

### Global Cross-Site Features
Global features (like Ctrl+Shift+H for custom home navigation) run on all sites:

```typescript
// entrypoints/global.content.ts
import hotkeys from "hotkeys-js";
import { GLOBAL_SHORTCUTS } from "@/features/global/constants";
import { navigateToCustomHome } from "@/features/global/home-navigation";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    hotkeys(GLOBAL_SHORTCUTS.GO_TO_CUSTOM_HOME, async (event) => {
      event.preventDefault();
      await navigateToCustomHome();
    });
  },
});
```

**Pattern:**
- `matches: ["<all_urls>"]` runs on all websites
- Functionality delegates to `features/global/` for domain-specific logic
- Uses `lib/storage/home-urls.ts` to load user-configured home URLs

### Storage Access in Content Scripts vs Popup

```typescript
// Content Script (content-scripts use Promises)
import { customHomeUrls } from "@/lib/storage/home-urls";

const urls = await customHomeUrls.getValue();
const homeUrl = urls[currentDomain];

// Popup/React Components (use React hooks)
import { useStorage } from "@wxt-dev/storage/react";
import { customHomeUrls } from "@/lib/storage/home-urls";

function MyComponent() {
  const [urls] = useStorage(customHomeUrls); // Reactive
  return <div>{urls[domain]}</div>;
}
```

### Mark States (Quiz Feature Example)
The quiz feature uses a sophisticated mark state system with cycling:
- `null` → "maybe" → "confident" → "discarded" → `null` (forward direction)
- Extracted into `MarkStateManager` class for testability
- Visual styling applied via `markAsDiscarded()`, `markAsMaybe()`, `markAsConfident()` functions

### Button Priority Matching (Quiz Feature)
Button clicking uses configuration-driven priority order:
```typescript
// features/platzi/quiz/constants.ts
export const PLATZI_QUIZ_BUTTONS: ButtonConfig[] = [
  { selector: ".ControlBar-content", label: "ControlBar Button" },
  { selector: 'button[data-trans="StartExam.cta.takeTest"]', label: "Start Exam" },
  // ... more buttons in priority order
];
```

This allows flexible button matching without hardcoding logic.

### URL Navigation vs DOM Clicking
- **Gmail**: Uses URL navigation when button clicking isn't reliable
- **Platzi**: Primarily DOM-based clicking with fallback patterns
- **Notion**: Direct DOM element clicking
- **Global (Home navigation)**: URL navigation with domain-specific custom home URLs
- Choose based on website stability and reliability

## Hotkeys-js Integration

All keyboard shortcuts use `hotkeys-js` library:
- Supports multiple modifier keys: `ctrl`, `command`, `alt`, `shift`
- Multiple key combinations: `ctrl+k, cmd+k` (OR logic)
- Use `event.preventDefault()` to prevent browser defaults
- Keyboard events are registered at document level

Example:
```typescript
hotkeys("command+k, ctrl+k", (event) => {
  event.preventDefault();
  // Handle shortcut
});
```
