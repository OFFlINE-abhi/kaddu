export const sidebarAnimation = {
  initial: { x: -250, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { x: -250, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};
