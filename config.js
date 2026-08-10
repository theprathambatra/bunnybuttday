/* ============================================================
   BIRTHDAY SITE CONFIG
   ------------------------------------------------------------
   IMPORTANT: The unlock time below is interpreted in EACH
   VISITOR'S LOCAL TIMEZONE by using new Date(year, monthIndex...).
   So it unlocks at 11 Aug 2026, 00:00 wherever the visitor is.
   ============================================================ */

window.BIRTHDAY_CONFIG = {
  target: {
    year: 2026,
    monthIndex: 7, // August (JavaScript months are 0-based)
    day: 11,
    hour: 0,
    minute: 0,
    second: 0,
  },

  // Keep celebration.html inaccessible through normal browsing before midnight.
  lockCelebrationBeforeBirthday: true,

  // If true, visiting index.html after the countdown ends immediately opens
  // celebration.html. This is the closest a static GitHub Pages site can get
  // to "removing" the countdown page automatically after unlock.
  skipCountdownPageAfterUnlock: false,

  // Development-only switch. Leave FALSE when publishing.
  // Set true temporarily if you want to test the celebration page early.
  devPreviewUnlocked: false,

  // Text you can personalize quickly.
  landingHeadline: "Happy birthday hai kya ladder",
  celebrationName: "Birthday Human",
};
