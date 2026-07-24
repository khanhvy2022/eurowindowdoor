# Eurowindow.biz Behaviors Specification

## Scroll Behaviors
- **Header Fixed Navigation:**
  - Initial state (top): White/transparent background top section, full logo size (245x45), search box visible.
  - Scrolled state (>50px): Header fixes to top with shadow, logo switches to `logo_scroll` (186x34).
- **Hero Slider:**
  - Auto-play carousel cycling through 6 banner images every 5 seconds with pagination dots and smooth fade/slide transitions.

## Responsive Behaviors
- **Desktop (>=1024px):**
  - Full top header with language switcher, search input, logo, and "Nhận tư vấn" button.
  - Main navigation bar with dropdown sub-menus on hover.
  - 3-card grid for main products (Cửa nhôm, Cửa uPVC, Cửa gỗ) + product list section.
  - 4-item news grid on left + 1 highlighted featured news slider on right.
- **Mobile (<768px):**
  - Hamburger menu icon on right, compact logo on left, quick call/search action.
  - Product categories stack vertically.
