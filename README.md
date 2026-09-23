# TUANTHOI — Dialog Refero Design System for Antigravity

This package replaces the previous Shop-style setup with the uploaded Dialog-style source.

## Install

Copy `.agents/` into the root of the Antigravity workspace.

Final structure:

.agents/
├── rules/
│   └── dialog-ui-rule.md
└── skills/
    └── dialog-design-system/
        ├── SKILL.md
        └── references/
            ├── 01-foundation.md
            ├── 02-components.md
            ├── 03-guidelines.md
            ├── 04-layout-imagery.md
            ├── 05-tokens-css.md
            └── refero-source.md

Also use `MASTER-PROMPT.md` as the initial Antigravity prompt.

## Source integrity

`refero-source.md` is an exact copy of the uploaded DESIGN.md.
The categorized references are copies of exact source line ranges.

The Always On rule is intentionally compact so it stays below the Rule limit.
The full source lives in the Skill references instead of inside the Rule.

## Important

The visual system is adapted to TUANTHOI e-commerce. Do not clone the source
site's branding, content, or unrelated business-specific structure.
