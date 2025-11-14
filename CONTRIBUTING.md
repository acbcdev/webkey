# Contributing to WebKey

## Project Structure

```
webkey/
├── entrypoints/
│   ├── gmail.content.ts           # Gmail keyboard shortcuts
│   ├── platzi.content.ts          # Platzi main site shortcuts
│   ├── platzi-quiz.content.ts     # Platzi quiz/exam navigation
│   ├── platzi-cursos.content.ts   # Platzi course content copying
│   ├── notion.content.ts          # Notion gallery management
│   └── background.ts              # Background script (placeholder)
├── lib/
│   └── query.ts                   # Shared DOM query utilities ($, $$)
├── wxt.config.ts                  # WXT extension configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── CLAUDE.md                       # Claude Code guidelines
```

## Development Setup

### Prerequisites
- Node.js 16+ and pnpm
- Chrome/Edge or Firefox browser

### Commands

```bash
# Install dependencies
pnpm install

# Start development (Chrome with hot reload)
pnpm dev

# Development for Firefox
pnpm dev:firefox

# Type checking
pnpm compile

# Production build (Chrome)
pnpm build

# Production build (Firefox)
pnpm build:firefox

# Create distribution package
pnpm zip          # Creates chrome-mv3.zip
pnpm zip:firefox  # Creates firefox-mv3.zip
```

## Adding New Website Support

1. Create a new file: `entrypoints/{website}.content.ts`
2. Define your shortcuts:

```typescript
import { defineContentScript } from 'wxt/sandbox'
import hotkeys from 'hotkeys-js'

export default defineContentScript({
  matches: ['*://example.com/*'],
  main() {
    hotkeys('ctrl+k', (e) => {
      e.preventDefault()
      // Your custom functionality
    })
  },
})
```

3. Build with `pnpm build` - the script is automatically registered in the manifest
4. No manual configuration needed!

## Key Development Patterns

**Platform Detection:**
```typescript
const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
const modifier = isMac ? 'command' : 'ctrl'
```

**DOM Selection with Type Safety:**
```typescript
import { $, $$ } from '@/lib/query'

const button = $<HTMLButtonElement>('button.save')
const allOptions = $$<HTMLOptionElement>('select option')
```

**Visual Feedback:**
```typescript
element.style.backgroundColor = '#4CAF50'
setTimeout(() => {
  element.style.backgroundColor = ''
}, 300)
```

## Making Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `pnpm compile` to check for TypeScript errors
5. Test the extension in your browser
6. Commit with clear messages
7. Push and open a Pull Request

## Ideas for Contributions

- Add shortcuts for new websites
- Improve existing shortcuts
- Fix bugs or selector issues
- Add tests
- Improve documentation

## Technologies

- **Framework**: [WXT](https://wxt.dev/) - Modern web extension build tool
- **Language**: TypeScript
- **Keyboard Library**: [hotkeys-js](https://wangchujiang.com/hotkeys/)
- **Build System**: Vite
