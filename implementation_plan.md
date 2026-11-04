# KRYVON — Wishlist & Product Tracking Feature

This update adds an autonomous-commerce wishlist system to KRYVON, allowing users to bookmark and monitor items from the catalogue without immediately launching a shopping mission or triggering financial policy evaluations.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following parameters have been confirmed:
> - **Storage Strategy**: Local browser `localStorage` with JSON serialization to ensure saved items persist across page reloads and sessions.
> - **Item Actions**: Three key actions per saved item:
>   1. *Execute Purchase*: Routes directly into the Deterministic Policy Engine and PayPal Sandbox checkout flow.
>   2. *Launch Target Mission*: Pre-populates the AI Shopping Workspace with the product specifications to search for alternatives or price optimizations.
>   3. *Remove*: Instantly unpins the item from the wishlist.
> - **Header Integration**: Integrated into the 4-zone top bar navigation with a live numeric badge indicator (`Wishlist (N)`), preserving the single-line top-bar contract.

---

### 1. Overview & Core Concept

While shopping missions are high-intent autonomous actions, users frequently encounter interesting products during exploration that they want to track or consider later. The Wishlist gives users a personal holding area with:
- Instant toggling directly from product cards (`ProductCard.tsx`).
- Live tracking of product price against the user's global spending limit.
- One-click translation of any bookmarked product into an active shopping mission.
- Direct checkout with deterministic policy enforcement.

---

### 2. User Experience & Visual Design

#### A. Product Card Wishlist Toggle
- A clean, unboxed bookmark/heart affordance on the top-right of every product image slot.
- Active state: Filled bookmark icon with subtle cyan accent; Inactive state: Translucent white pill with hover border.
- Click handler toggles the product in and out of the wishlist with zero page jumps.

#### B. Top Bar Navigation Update
- Clean single-line navigation link: `Wishlist` with a live count badge (e.g. `Wishlist (3)` or clean numerical tag).
- Clicking the link switches the active view to the dedicated Wishlist section.

#### C. Dedicated Wishlist Section
- **Header**: Section title *"Tracked Products & Wishlist"*, total estimated value of saved items, and clear-all option.
- **Empty State**: Elegant empty state when no products are saved with a *"Browse Catalogue"* action.
- **Wishlist Grid**: Visual cards displaying high-res product photo, price in active currency, specs, and three action controls:
  - *Purchase Now*: Evaluates spending policies and launches PayPal Sandbox modal.
  - *Start Mission*: Loads product into AI Shopping Workspace to find deals or accessories.
  - *Remove*: Deletes from wishlist.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side localStorage vs Backend Database**
  - *Chosen Approach*: `localStorage` with reactive React state hook synchronization.
  - *Why*: Instant zero-latency toggling, works offline without authentication barriers, and persists across browser refreshes.
  - *Trade-off*: Device-specific rather than cross-device account sync; ideal for the current client-side user experience.

- **Decision 2: Conversion to Mission**
  - *Chosen Approach*: When a user clicks "Launch Mission" on a wishlisted item, the app sets the mission query to `Find alternatives or accessories for [Product Name]` and sets the budget boundary equal to or slightly below the product price.
  - *Why*: Deepens the synergy between passive bookmarking and active autonomous purchasing.

---

### 4. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────┐
│                        KRYVON                          │
│                                                        │
│  ┌─────────────────────────┐ ┌───────────────────────┐ │
│  │       Header.tsx        │ │    ProductCard.tsx    │ │
│  │  Wishlist (N) counter   │ │  Save/Unsave Bookmark │ │
│  └────────────┬────────────┘ └───────────┬───────────┘ │
│               │                          │             │
│               ▼                          ▼             │
│  ┌───────────────────────────────────────────────────┐ │
│  │          Wishlist State Hook / localStorage       │ │
│  │         ['kry-aud-01', 'kry-kb-01', ...]          │ │
│  └────────────────────────┬──────────────────────────┘ │
│                           │                            │
│                           ▼                            │
│  ┌───────────────────────────────────────────────────┐ │
│  │                 WishlistSection.tsx               │ │
│  │  • Item Grid & Total Value                        │ │
│  │  • Purchase Now ──► PolicyEngine ──► PayPal       │ │
│  │  • Launch Mission ──► AI Shopping Workspace       │ │
│  │  • Remove Item ──► Update LocalStorage            │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

#### Files to Create / Modify
1. `src/components/WishlistSection.tsx`: New dedicated view for tracked items.
2. `src/components/ProductCard.tsx`: Add wishlist toggle button and state.
3. `src/components/Header.tsx`: Add `Wishlist` link with live count badge.
4. `src/App.tsx`: Wire wishlist state with `localStorage`, navigation handler, and mission converter.
