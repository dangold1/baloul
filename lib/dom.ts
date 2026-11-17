/** DOM selectors shared across client code, so a markup change is made in one place. */
export const DOM = {
  site: ".site",
  header: ".b-header",
  reviews: "#reviews",
  mobileMenu: "#bMobileMenu",
  openDialog: ".b-modal.open, .b-consent[data-open='true']",
} as const;
