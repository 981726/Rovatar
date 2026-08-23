# Avatar Explorer

# Roblox Avatar Viewer — Product & Design Direction

Build a polished web application for exploring Roblox player avatars and outfits.

This is intended to become a real, continuously developed Roblox community tool — **not a disposable AI-generated landing page or generic SaaS dashboard**.

The core product is:

**Search a Roblox username → see their avatar → browse their outfits → select an outfit → inspect the individual items → open those items directly on Roblox.**

The visual direction should feel like a **modern Roblox ecosystem product**.

Use the current Roblox website / Marketplace / Avatar Editor as the primary visual reference for information density, navigation patterns, typography, iconography, card proportions, and overall visual language.

Do NOT simply copy Roblox's UI or branding. Create an original product inspired by its current design language.

---

# VERY IMPORTANT: VISUAL DIRECTION

The attached reference screenshot shows the type of Roblox UI density and visual language this product should complement.

The target is:

**Roblox Marketplace / Avatar Editor + modern independent web application**

Not:

**generic SaaS dashboard + Roblox colors**

The site should immediately feel like:

> "Someone who understands Roblox built this."

rather than:

> "An AI website builder made a dark-themed dashboard."

---

# Design Principles

## 1. Prioritize the content

The avatars, outfits, clothing, and item thumbnails ARE the interface.

Do not bury them under giant marketing sections.

The homepage can be simple.

Once a user searches someone, the application should become visually dense and useful.

Think:

**Marketplace → Avatar Editor → Outfit browser**

rather than:

**Marketing website → dashboard**

---

## 2. Match the visual density of modern Roblox

Modern Roblox interfaces often display many visual items at once.

Use:

- Compact cards
- Tight but intentional spacing
- Strong image prominence
- Clear category navigation
- Short labels
- Subtle separators
- Horizontal category bars
- Dense grids

Do not make every component enormous.

The user should be able to see **many outfits/items simultaneously**.

For example, an outfit grid should feel closer to a modern Roblox Marketplace grid than a portfolio gallery.

---

## 3. Do not over-round the interface

This is extremely important.

Do NOT make:

- giant pill-shaped cards
- excessive rounded rectangles
- every button a pill
- every container heavily rounded
- floating glassmorphism panels everywhere

Use corner radii selectively.

Cards can have modest rounding.

Buttons should often be compact and rectangular/subtly rounded.

Inputs should feel like actual application controls.

The interface should have some sharper structure.

---

# Color System

Default to a dark interface.

Use a dark neutral base similar to the current Roblox experience.

Do not make everything pure black.

Suggested hierarchy:

- Main background: very dark neutral
- Secondary surfaces: slightly lighter
- Cards: distinct but restrained
- Borders: subtle
- Text: high contrast
- Secondary text: muted
- Accent: restrained and purposeful

Do not use:

- neon purple gradients
- rainbow gradients
- excessive blue glow
- giant colored backgrounds
- "AI startup" gradient aesthetics

The interface should primarily derive its character from **layout, typography, imagery, and spacing**, not flashy colors.

---

# Typography

Typography should feel clean, compact, and modern.

Use a strong sans-serif.

Prioritize:

- readable item names
- compact metadata
- clear hierarchy
- strong headings
- restrained font sizes

Do not make every heading gigantic.

Roblox's interfaces tend to prioritize usability and information density.

Follow that philosophy.

---

# Navigation

Create a compact application navigation bar.

Left:

**Avatar Viewer**

Center / primary navigation:

- Explore
- Search

Optional:

- About
- GitHub

Right:

- Search
- Theme/settings if eventually needed

Keep navigation visually quiet.

Do not create a giant SaaS-style navbar.

---

# HOMEPAGE

The homepage should be extremely simple.

The product does not need a huge marketing landing page.

Primary content:

# Explore Roblox Avatars

Search a Roblox player and explore their avatar, outfits, and items.

Large but not oversized search field:

**Search Roblox username...**

Search button.

Below it, optionally show a few recently searched/example users once real functionality exists.

Do not fabricate statistics such as:

"10M+ avatars viewed"

"50K users"

etc.

---

# SEARCH EXPERIENCE

Searching should feel instantaneous and native.

Input:

**Search username**

Support:

- Enter to search
- Search button
- Loading state
- Clear button
- Error state

The search bar should be reusable throughout the application.

Users should not have to return to the homepage to search another player.

---

# USER PAGE

After searching:

Display a compact player header.

Example:

**@username**

Display name

[View Roblox Profile ↗]

Then immediately show the avatar.

Avoid wasting half the screen on a profile banner.

---

# AVATAR AREA

The avatar should be the visual centerpiece.

Use the highest quality Roblox-provided avatar representation available.

If an actual interactive 3D avatar renderer can be implemented reliably, use it.

If not:

Use high-quality Roblox avatar thumbnails.

DO NOT create fake 3D functionality.

The avatar area should feel similar in importance to the Avatar Editor's character preview.

Potential layout:

┌──────────────────────┬───────────────────────────────────┐
│ │ │
│ │ username │
│ AVATAR │ Display Name │
│ │ │
│ │ Current Avatar │
│ │ │
│ │ [Outfits] [Items] [Overview] │
│ │ │
└──────────────────────┴───────────────────────────────────┘

The exact layout can change if a better composition is found.

---

# CATEGORY NAVIGATION

This is one of the most important parts.

Use a navigation system inspired by the Roblox Avatar Editor / Marketplace.

For example:

**Overview | Outfits | Clothing | Accessories | Body**

Categories should feel like real application navigation rather than generic dashboard tabs.

Use compact typography and subtle active indicators.

Do not turn them into giant rounded pills.

---

# OUTFITS PAGE

This should be one of the primary pages.

Show a dense responsive outfit grid.

Each outfit card should prioritize:

1. Avatar image
2. Outfit name
3. Small metadata
4. Hover/click affordance

Example:

┌──────────────┐
│ │
│ AVATAR │
│ │
├──────────────┤
│ Outfit Name │
│ 7 items │
└──────────────┘

Cards should not contain excessive text.

The image should do most of the work.

---

# OUTFIT GRID DENSITY

Desktop should display several outfits per row.

Do not create gigantic cards that show only 2–3 outfits on a desktop monitor.

Aim for the visual density of Roblox's Marketplace / Avatar Editor item grids.

Images should be large enough to identify the avatar but compact enough to browse quickly.

Responsive behavior:

Desktop:

4–6 depending on viewport width

Tablet:

3–4

Mobile:

2 or 1 depending on available width

Let CSS determine the exact layout naturally.

---

# OUTFIT DETAIL

Selecting an outfit should transition into a focused outfit view.

Show:

## Outfit Name

Large avatar preview.

Then:

**Items**

Display the individual assets in categories.

Example:

### Clothing

Shirt
Pants
T-Shirt

### Accessories

Hair
Hat
Face
Neck
Shoulder
Front
Back
Waist

### Body

Head
Torso
Left Arm
Right Arm
Left Leg
Right Leg

Only display categories that actually contain assets.

Do not show empty sections.

---

# ITEM GRID

Item cards should visually resemble Roblox Marketplace item cards more than generic ecommerce cards.

Show:

- Thumbnail
- Item name
- Item type
- Optional creator
- Asset ID if useful

Keep metadata compact.

The thumbnail should dominate.

---

# ITEM INTERACTION

Clicking an item should open a clean item detail panel/modal.

Show:

- Large thumbnail
- Item name
- Type
- Asset ID
- Creator if available

Actions:

**View on Roblox ↗**

**Copy Asset ID**

The Roblox action should take the user directly to the appropriate Roblox catalog/item page.

Do not download clothing textures.

Do not imply ownership.

This is an **avatar/outfit discovery tool**.

---

# HOVER STATES

Desktop item/outfit cards should have subtle interaction.

On hover:

- Slight elevation
- Slight image scale
- Border/highlight change
- Action appears if appropriate

Keep it fast.

Do not make cards bounce or dramatically enlarge.

The interaction should feel like a polished application.

---

# MODALS / DRAWERS

Use modals or side panels only when they improve the workflow.

Do not stack giant floating cards on top of giant floating cards.

Panels should feel like part of the application.

Keep backgrounds opaque enough that the underlying content remains visually controlled.

Avoid excessive glass blur.

---

# ICONOGRAPHY

Use a consistent modern icon library.

Icons should be:

- Simple
- Compact
- Consistent in stroke weight
- Similar to modern Roblox application UI

Do not randomly mix icon styles.

Do not use emojis as UI icons.

---

# LOADING STATES

This needs to look polished.

Use skeleton loading for:

- Player information
- Avatar
- Outfit cards
- Item cards

The skeleton should match the actual content layout.

Do not display a generic spinner in the center of the page for every API request.

---

# ERROR STATES

Never expose raw API errors.

Bad:

`HTTP 400`

Good:

**Couldn't load this avatar**

Roblox didn't return the avatar information. Try again.

[Retry]

User not found:

**User not found**

We couldn't find a Roblox player with that username.

[Search again]

---

# EMPTY STATES

Make empty states feel intentional.

Example:

**No outfits found**

This player doesn't have any outfits available to display.

Do not leave a blank page.

---

# PLAYER DATA

Use official Roblox APIs wherever possible.

The application should ultimately retrieve real Roblox data.

Conceptual flow:

Username

↓

Roblox User ID

↓

Avatar information

↓

Outfits

↓

Outfit assets

↓

Asset metadata/thumbnails

↓

UI

Do not invent fake Roblox APIs.

Do not build the production experience around third-party data unless absolutely necessary.

Before implementing each API integration, verify the current Roblox API requirements, browser accessibility, CORS behavior, and authentication requirements.

If a backend is necessary, isolate it behind a clean service layer.

---

# API ARCHITECTURE

Do not put Roblox API calls directly inside visual React components.

Create a clean service abstraction.

For example:

`services/roblox/users`

`services/roblox/avatar`

`services/roblox/outfits`

`services/roblox/assets`

`services/roblox/thumbnails`

Components should ask for data.

They should not care where the data came from.

This allows the API implementation to change later without rebuilding the UI.

---

# MOCK DATA

Mock data is acceptable while constructing the interface.

However:

- Keep mock services separate.
- Clearly identify mock data.
- Do not hard-code fake Roblox users throughout components.
- Do not make the final application dependent on mock data.

The UI should be designed around realistic Roblox data structures.

---

# URL STRUCTURE

Use shareable routes.

Examples:

`/`

`/user/username`

`/user/username/outfits`

`/user/username/outfit/outfit-id`

`/item/asset-id`

A user should be able to copy an outfit URL and send it to someone else.

---

# RESPONSIVE DESIGN

Desktop is important because avatar exploration benefits from screen space.

But mobile must work properly.

Do not simply shrink the desktop interface.

On mobile:

- Navigation becomes compact
- Avatar preview becomes stacked
- Outfit grids become smaller
- Item details become full-screen panels
- Search remains accessible

Maintain the same visual identity.

---

# ACCESSIBILITY

Use:

- Semantic HTML
- Keyboard navigation
- Proper focus states
- Accessible dialogs
- Meaningful alt text
- Proper button labels
- Good contrast

Do not sacrifice usability for aesthetics.

---

# PERFORMANCE

The application should feel fast.

Use:

- Lazy-loaded images
- Progressive loading
- Cached requests where appropriate
- Debounced username search
- Efficient state management
- Avoid unnecessary API calls
- Avoid unnecessary React re-renders

Do not fetch every possible piece of data immediately.

Fetch what the current page needs.

---

# FUTURE FEATURES

Do not implement these immediately, but structure the application so they can eventually exist:

- Recently viewed users
- Saved users
- Saved outfits
- Outfit comparison
- Outfit sharing
- Outfit history
- Search history
- Item filtering
- Creator information
- Catalog price information
- R6/R15 information
- Avatar rotation
- Multiple avatar angles
- Community discovery
- Public collections

The MVP should remain focused.

---

# MVP

The first functional version must support:

1. Search Roblox username
2. Resolve username to User ID
3. Display player information
4. Display current avatar
5. Display available outfits
6. Select an outfit
7. Display outfit assets
8. Display item thumbnails
9. Display item names
10. Open item on Roblox
11. Copy asset ID
12. Proper loading states
13. Proper error states
14. Responsive design

---

# MOST IMPORTANT VISUAL TEST

When the first version is generated, compare it against the attached Roblox Avatar Editor screenshot.

Do NOT copy the screenshot.

Instead ask:

### Does the interface have the same general qualities?

- Dense visual browsing
- Strong avatar/item imagery
- Compact navigation
- Clear categories
- Dark neutral surfaces
- Restrained borders
- Practical controls
- Strong typography
- Minimal unnecessary decoration
- Lots of useful content visible at once

If the answer is no, redesign the layout.

---

# DO NOT DO THIS

Do not turn the application into:

- A generic SaaS dashboard
- A giant landing page
- A "futuristic AI" website
- A neon gaming website
- An excessive glassmorphism design
- An ecommerce clone
- A giant card with everything inside it
- A page where every element is heavily rounded
- A page full of unnecessary gradients
- A page with huge empty spaces
- A fake Roblox UI replica
- A Roblox logo clone

The goal is an **original application with the design sensibility of modern Roblox products**.

---

# PRODUCT FEEL

The final reaction we want from a Roblox user is:

> "Oh shit, this actually looks like a real Roblox tool."

Not:

> "This looks like a template."

Prioritize **visual hierarchy, density, real data, usability, and polish** over decorative effects.

Build the foundation properly so this can evolve into a genuinely useful Roblox avatar exploration website.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://avatar-explorer-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e9e63144-a651-4b5d-a660-a1ea3a456280).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
