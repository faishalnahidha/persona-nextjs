---
description: Rules to prevent excessive token usage and folder-bloat
globs: ["**/*"]
---

# Token Conservation Protocol

- **Never read entire directories:** If I use `@components`, do not attempt to read every file. Start by listing filenames only.
- **Architectural Review:** When asked to "analyze structure," focus on `index.ts` or main layout files first.
- **Concise Responses:** Omit conversational filler ("I'd be happy to help," "Certainly"). 
- **Diffs Only:** When suggesting code changes, provide only the specific lines to change, not the entire file.