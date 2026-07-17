/**
 * drift-yaw site configuration
 * Edit prices, links, and brand tokens here.
 * Feature lists mirror debug_7.lua sidebar tabs.
 */
window.DRIFT_YAW = {
  product: {
    name: "drift-yaw",
    version: "DEBUG 7",
    versionShort: "v7",
    tagline: "Angles that don't sit still.",
    platform: "Neverlose",
  },

  links: {
    purchase: "#pricing",
    discord: "https://discord.gg/your-invite",
  },

  pricing: {
    currency: "€",
    price: "7.99",
    name: "Lifetime",
    period: "one payment · lifetime",
    blurb: "Full debug_7 script for Neverlose CS:GO. All four tabs unlocked.",
    cta: "Get Lifetime Access",
    badge: "Neverlose · CS:GO",
    notes: [
      "Neverlose only · CS:GO",
      "Tabs: anti aim, misc, visuals, config",
      "Updates while the product is active",
    ],
    // Matches script sidebars + group labels from debug_7.lua
    includes: [
      {
        title: "anti aim",
        items: [
          "Mode: Disabled / drift-yaw / Conditional",
          "9 states: Builder → No Exploits",
          "Manual Yaw, Freestanding, Bombsite Fix",
          "Defensive AA + Force Break LC",
        ],
      },
      {
        title: "misc",
        items: [
          "Defense: Auto Retreat, Warmup AA, Avoid Backstab",
          "Safe Head + Disable Fake Lag",
          "AI: Automatic Peek, Auto Throw, Supertoss",
          "Animation Breakers, Aspect Ratio, Clantag",
        ],
      },
      {
        title: "visuals",
        items: [
          "Indicators: Title, State, Damage, Slowed",
          "Positions + Reset Positions",
          "Hitlogs (Screen / Console / Markers)",
          "Custom Scope (length, gap, colors)",
        ],
      },
      {
        title: "config",
        items: [
          "Saved Configurations list",
          "Name, Save, Load, Delete",
          "Clipboard Import / Export",
        ],
      },
    ],
  },

  brand: {
    accent: "180, 130, 255",
    accentIce: "180, 200, 255",
  },
};
