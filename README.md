# WebKey - Keyboard Shortcut Extension

A productivity browser extension that adds keyboard shortcuts to Gmail, Platzi, and Notion for faster navigation and content management.

## What It Does

WebKey eliminates the need to use your mouse by providing keyboard shortcuts for common tasks across these platforms.

## Keyboard Shortcuts

### Global (All Websites)

| Shortcut | Action |
|----------|--------|
| `⌘+Shift+H` (Mac) / `Ctrl+Shift+H` (Windows) | Go to website home page |

#### Custom Home Configuration

You can configure custom "home" pages for specific websites:

1. Click the WebKey extension icon in your browser toolbar
2. Add domain → URL mappings (e.g., `github.com` → `https://github.com/dashboard`)
3. When you press the shortcut on that domain, it will go to your custom URL
4. If no custom home is configured, it falls back to the domain root (`/`)

This allows you to set "home" to be your personal dashboard, profile page, or any frequently visited page on each website.

### Gmail (`mail.google.com`)

| Shortcut | Action |
|----------|--------|
| `←` or `<` | Navigate to newer email |
| `→` or `>` | Navigate to older email |
| `Enter` | Click on the highlighted email to open it |
| `1-9` | Quick switch to account 1-9 (goes to inbox) |
| `⌘+Shift+A` (Mac) / `Alt+A` (Windows) | Open account switcher menu |
| `0` | Go to inbox |

### Platzi - Main Site (`platzi.com`)

| Shortcut | Action |
|----------|--------|
| `⌘+K` (Mac) / `Ctrl+K` (Windows) | Focus the search input field |

### Platzi - Quiz/Exam Pages

| Shortcut | Action |
|----------|--------|
| `↓` | Highlight next option |
| `↑` | Highlight previous option |
| `Enter` | Confirm highlighted option or click control buttons |
| `Esc` | Clear selection highlight |
| `A`, `B`, `C`, `D`, `E` | Select option by letter |
| `1`, `2`, `3`, `4`, `5` | Select option by number |

### Platzi - Courses (`platzi.com/cursos/*`)

| Shortcut | Action |
|----------|--------|
| `H` | Copy page heading to clipboard |
| `R` | Copy article content to clipboard |
| `Double-click` | Copy any article element by double-clicking |

### Notion (`notion.so`)

| Shortcut | Action |
|----------|--------|
| `N` | Add new item in gallery view |

## Technologies

- **Framework**: [WXT](https://wxt.dev/) - Web extension build tool
- **Language**: TypeScript
- **Keyboard Library**: [hotkeys-js](https://wangchujiang.com/hotkeys/)

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, project structure, and contribution guidelines.

## License

MIT License
