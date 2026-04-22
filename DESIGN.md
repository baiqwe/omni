# Seedance 2 DESIGN.md

## 1. Visual Theme & Atmosphere

Seedance 2 should feel like a cinematic production interface, not a playful AI toy. The design language is primarily inspired by RunwayML from the `awesome-design-md` collection:

- dark editorial canvas
- visual output and media references as the primary storytelling device
- minimal interface chrome
- restrained color use
- typography that feels like film titles and production notes

To keep the product usable as a real tool, borrow one secondary trait from MiniMax:

- rounded but controlled module grouping for workflow blocks

The blend is:

- Runway for atmosphere and hierarchy
- MiniMax only for usability touches such as grouping and button clarity

## 2. Color Palette & Roles

- Canvas Black: `#060811`
- Surface Black: `#0b1020`
- Panel Black: `#101726`
- Border Dark: `#232938`
- Primary Text: `#ffffff`
- Secondary Text: `#767d88`
- Tertiary Text: `#9399a3`
- Accent Cyan: `#7dd3fc`
- Accent Pink: `#f9a8d4`
- Accent Emerald: `#86efac`

Rules:

- Interface backgrounds stay dark and neutral
- Accent colors appear in small, intentional moments only
- Gradients are allowed only as subtle atmospheric overlays or preview-media lighting
- The UI should never look candy-colored or dashboard-gamified

## 3. Typography Rules

- Display: serif with cinematic density
- UI/body: clean sans-serif

Hierarchy:

- Hero display: 56–80px, line-height 1.0–1.05, tight tracking
- Section heading: 32–48px, line-height 1.0–1.1
- Card heading: 20–28px, line-height 1.1
- Body: 15–17px, line-height 1.5
- Labels: 11–13px uppercase, positive tracking

Rules:

- Prefer compressed display typography over oversized UI chrome
- Small uppercase labels organize the page
- Avoid multiple decorative font switches

## 4. Components

- Buttons: compact, high-contrast, not oversized, not bubbly
- Cards: subtle radius, almost invisible borders, minimal or no shadows
- Nav: lightweight, transparent, should not compete with hero media
- Inputs: dark, quiet, readable, no loud outlines
- Media preview: dominant, cinematic, should carry the emotional weight

## 5. Layout Principles

- Tool-first homepage
- Large cinematic hero band
- Dense but calm interior spacing
- Wide containers on desktop
- Mixed rhythm between large feature blocks and tight tool controls

## 6. Depth & Elevation

- Prefer flat surfaces and border separation
- Shadows should be rare and soft
- Depth should come from contrast, layered backgrounds, and preview media

## 7. Do

- Keep the interface visually quiet
- Let media previews and generated results dominate
- Use dark surfaces with editorial typography
- Make the product feel production-grade

## 8. Do Not

- Do not use bright SaaS gradients as the primary look
- Do not overuse pills, glows, or large rounded corners
- Do not make it look like a crypto dashboard
- Do not let the UI feel heavier than the media

## 9. Implementation Prompt Guide

- “Use a Runway-inspired cinematic dark interface with restrained cyan/pink accents.”
- “Prioritize output media and workspace structure over decorative UI.”
- “Keep cards nearly flat with subtle borders and low-radius geometry.”
