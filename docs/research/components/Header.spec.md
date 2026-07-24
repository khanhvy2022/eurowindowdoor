# Header Specification

## Overview
- **Target file:** `src/components/Header.tsx`
- **Interaction model:** Sticky header on scroll with logo shrink and shadow effect.

## Computed Styles
- Primary color: `#005ba7`
- Background: White with border-bottom `#e5e7eb`
- Menu text: Uppercase, font-size 15px, font-weight 600, color `#333` (hover `#005ba7`)
- "Nhận tư vấn" button: background `#005ba7`, padding 8px 18px, border-radius 4px, color white.

## States & Behaviors
- **Top state (scroll = 0):** Full header height, logo 245x45px.
- **Scrolled state (scroll > 50px):** Fixed top, logo shrinks to 186x34px, box-shadow `0 2px 10px rgba(0,0,0,0.1)`.
