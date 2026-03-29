# FSD-lite Architecture Refactoring Plan

**Date**: 2026-03-29
**Task**: Refactor project structure to follow FSD-lite (Feature-Sliced Design lite) conventions

## Overview

Refactor the current flat `src/` structure into a feature-sliced architecture with clear separation between features, shared UI, layout, and global hooks.

## Current Structure Issues

- All components defined inline in `App.tsx` (no separation of concerns)
- Empty `components/` and `lib/` directories
- No feature-based organization
- Hooks mixed between global (Telegram) and feature-specific (useSettings)

## Target Architecture

```
src/
├── api/                    # Keep existing (generated + wrappers)
├── features/
│   ├── ModeSelection/      # Mode dashboard, mode switching
│   │   ├── index.ts        # Public API
│   │   ├── ui/
│   │   │   ├── ModeDashboard.tsx
│   │   │   └── ModeCard.tsx
│   │   └── model/
│   │       └── useModeSelection.ts
│   └── Settings/           # Settings screens, forms
│       ├── index.ts        # Public API
│       ├── ui/
│       │   ├── SettingsScreen.tsx
│       │   ├── LLMConfig.tsx
│       │   ├── VaultConfig.tsx
│       │   ├── ObsidianConfig.tsx
│       │   ├── LanguageConfig.tsx
│       │   └── DesignTokens.tsx
│       └── model/
│           └── useSettingsForm.ts
├── shared/
│   ├── ui/                 # Pure primitives
│   │   ├── Button.tsx
│   │   ├── InputGroup.tsx
│   │   ├── Badge.tsx
│   │   ├── ScreenWrapper.tsx
│   │   └── FolderTree.tsx
│   └── layout/
│       └── BottomNav.tsx
├── contexts/
│   └── QueryClientContext/ # If extracted (currently in App.tsx)
├── hooks/                  # Global hooks only
│   ├── useTelegram.ts
│   └── useOAuthSSE.ts
├── lib/                    # Pure functions (currently empty)
├── types.ts                # Global types (keep)
├── App.tsx                 # Root, navigation state orchestration
├── main.tsx                # Entry point (keep)
└── theme.css               # Styles (keep)
```

## Implementation Steps

### Step 1: Create Directory Structure
- Create `features/ModeSelection/{ui,model}`
- Create `features/Settings/{ui,model}`
- Create `shared/ui/`
- Create `shared/layout/`
- Create `contexts/`

### Step 2: Extract Shared UI Primitives
Move from `App.tsx` to `shared/ui/`:
- `Button` → `shared/ui/Button.tsx`
- `InputGroup` → `shared/ui/InputGroup.tsx`
- `Badge` → `shared/ui/Badge.tsx`
- `ScreenWrapper` → `shared/ui/ScreenWrapper.tsx`
- `FolderTree` → `shared/ui/FolderTree.tsx`

### Step 3: Extract Layout Components
- `BottomNav` → `shared/layout/BottomNav.tsx`

### Step 4: Create Feature Modules

**ModeSelection Feature:**
- Extract `ModeDashboard` component
- Extract mode selection logic into `useModeSelection` hook

**Settings Feature:**
- Extract all settings views (LLM, Vault, Obsidian, Language, DesignTokens)
- Create `useSettingsForm` hook for form state management

### Step 5: Update App.tsx
- Import from feature modules and shared UI
- Keep only navigation state orchestration
- Remove inline component definitions

### Step 6: Update Imports
- Update all imports to use new paths
- Use `@/` alias consistently
- Create barrel exports in feature `index.ts` files

### Step 7: Verify
- Run `npm run lint`
- Run `npm run build`
- Fix any type errors or import issues

## Files to Create

1. `src/features/ModeSelection/index.ts`
2. `src/features/ModeSelection/ui/ModeDashboard.tsx`
3. `src/features/ModeSelection/ui/ModeCard.tsx`
4. `src/features/ModeSelection/model/useModeSelection.ts`
5. `src/features/Settings/index.ts`
6. `src/features/Settings/ui/SettingsScreen.tsx`
7. `src/features/Settings/ui/LLMConfig.tsx`
8. `src/features/Settings/ui/VaultConfig.tsx`
9. `src/features/Settings/ui/ObsidianConfig.tsx`
10. `src/features/Settings/ui/LanguageConfig.tsx`
11. `src/features/Settings/ui/DesignTokens.tsx`
12. `src/features/Settings/model/useSettingsForm.ts`
13. `src/shared/ui/Button.tsx`
14. `src/shared/ui/InputGroup.tsx`
15. `src/shared/ui/Badge.tsx`
16. `src/shared/ui/ScreenWrapper.tsx`
17. `src/shared/ui/FolderTree.tsx`
18. `src/shared/ui/index.ts` (barrel)
19. `src/shared/layout/BottomNav.tsx`
20. `src/shared/layout/index.ts` (barrel)

## Files to Modify

1. `src/App.tsx` - Main refactoring target
2. `src/types.ts` - May need to add new types

## Files to Delete

- `src/components/` (empty, just remove)
- `src/lib/` (empty, just remove)

## Success Criteria

- [ ] All components properly organized in FSD-lite structure
- [ ] No import errors
- [ ] Lint passes
- [ ] Build passes
- [ ] App functions identically to before refactoring
