# socialTech — Refero Shop Design System for Antigravity

## Install
Copy the `.agents` folder into the root of the Antigravity workspace.

Copy the `design-system` folder (or its contents) into:
`.agents/skills/shop-design-system/`

Recommended final structure:

.agents/
├── rules/
│   └── shop-ui-rule.md
└── skills/
    └── shop-design-system/
        ├── SKILL.md
        └── references/
            ├── 01-foundation.md
            ├── 02-components.md
            ├── 03-guidelines.md
            ├── 04-layout-imagery.md
            └── 05-tokens-css.md
            └── refero-source.md

## Why this structure
The Always On rule is deliberately compact. The complete Refero DESIGN.md is not placed inside the rule, avoiding the 12,000-character Rule limit.

The original Refero source is preserved unchanged as `refero-source.md`.
The other five files are organized copies of the source's original line ranges.

The skill uses progressive disclosure: the agent reads only the reference needed for the current UI task.

## Important
Do not delete `refero-source.md`. It is the canonical fallback when a detail is ambiguous.
