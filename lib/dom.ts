/** DOM selectors shared across client code, so a markup change is made in one place. */
export const DOM = {
  site: ".site",
  header: ".b-header",
  reviews: "#reviews",
  stats: ".b-stats",
  mobileMenu: "#bMobileMenu",
  /** Any dialog, banner or popover on screen (see components/ui/Dialog.tsx). */
  openDialog: "[data-dialog-open]",
} as const;
