export interface NavLink {
  title: string;
  url: string;
  public?: boolean; // Whether this link should be shown in public navbar
}

export interface NavGroup {
  title: string;
  items: NavLink[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    title: "Productivity",
    items: [
      {
        title: "Home",
        url: "/",
        public: true,
      },
      {
        title: "All Blogs",
        url: "/blogs",
        public: true,
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        title: "Canvases",
        url: "/canvases",
        public: true,
      },
      {
        title: "Todo Planner",
        url: "/todos",
        public: true,
      },
      {
        title: "My Blogs",
        url: "/dashboard/blogs",
        public: true,
      },
    ],
  },
];

// Flatten for navbar usage (public links only)
export const PUBLIC_NAV_LINKS: NavLink[] = NAVIGATION_CONFIG
  .flatMap(group => group.items)
  .filter(link => link.public)
  .map(({ public: _, ...link }) => link);
