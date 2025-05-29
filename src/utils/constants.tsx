import {
  ArrowUpRight,
  AtSign,
  Book,
  Bookmark,
  Code2,
  Compass,
  Github,
  Globe,
  Heart,
  Home,
  Instagram,
  Laptop2,
  Linkedin,
  LogOut,
  MessageCircle,
  Newspaper,
  Palette,
  Pencil,
  Search,
  Settings,
  Table2,
  TrendingUp,
  Twitter,
  User,
  Youtube
} from "lucide-react";
import { v4 as uuid } from "uuid";
import { env } from "~/env.mjs";
import { Dailydev, Discord, LogonoText, Mastodon } from "~/svgs";
import { type Session } from "next-auth";

export const slugSetting = {
  lower: true,
  replacement: "-",
  strict: true,
  trim: true,
  locale: "en",
};

export const asideItems = (session?: Session | null) => {
  const baseItems = [
    {
      name: "Home",
      icon: (
        <Home className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
      ),
      href: "/",
      type: "link",
    },
    {
      name: "Explore",
      icon: (
        <Compass className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
      ),
      href: "/explore",
      type: "link",
    },
    {
      name: "Bookmarks",
      icon: (
        <Bookmark className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
      ),
      href: "/bookmarks",
      type: "link",
    },
  ];
  
  // Only add Posts item if user is logged in and has startup role
  if (session?.user?.role === "startup") {
    baseItems.push({
      name: "Posts",
      icon: (
        <Laptop2 className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
      ),
      href: "#",
      type: "link",
    });
  }
  
  // Only add Mentors item if user is logged in and has startup role
  // if (session?.user?.role === "startup") {
  //   baseItems.push({
  //     name: "Mentors",
  //     icon: (
  //       <User className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
  //     ),
  //     href: "#",
  //     type: "link",
  //   });
  // }
  
  return baseItems;
};

const environmentUrl = env.NEXT_PUBLIC_VERCEL_URL;

export const baseUrl = environmentUrl
  ? environmentUrl
  : `http://localhost:3000`;

enum Type {
  all = "all",
  articles = "article",
  comments = "comment",
  likes = "like",
}

export const notificationNavigation = (notificationType: Type) => {
  return [
    {
      id: 123,
      name: "all" as Type,
      label: "All Notifications",
      icon: null,
    },
    {
      id: 345,
      name: "comment" as Type,
      label: "Comments",
      icon: (name: Type) => (
        <MessageCircle
          className={`h-4 w-4 fill-none ${notificationType === name
            ? "stroke-secondary"
            : "stroke-gray-700 dark:stroke-text-secondary"
            }`}
        />
      ),
    },
    {
      id: 567,
      name: "like" as Type,
      label: "Likes",
      icon: (name: Type) => (
        <Heart
          className={`h-4 w-4 fill-none ${notificationType === name
            ? "stroke-secondary"
            : "stroke-gray-700 dark:stroke-text-secondary"
            }`}
        />
      ),
    },
    {
      id: 789,
      name: "article" as Type,
      label: "Articles",
      icon: (name: Type) => (
        <Newspaper
          className={`h-4 w-4 fill-none ${notificationType === name
            ? "stroke-secondary"
            : "stroke-gray-700 dark:stroke-text-secondary"
            }`}
        />
      ),
    },
  ];
};

export const others = [
  [
    {
      id: uuid(),
      name: "Feature Requests",
      link: "https://roadmap.grower.vercel.app/feature-requests",
    },
    {
      id: uuid(),
      name: "Changelog",
      link: "https://roadmap.grower.vercel.app/changelog",
    },
    {
      id: uuid(),
      name: "Grower APIs",
      link: "api.grower.vercel.app",
    },
  ],
  [
    {
      id: uuid(),
      name: "About",
      link: "https://grower.vercel.app/about",
    },
    {
      id: uuid(),
      name: "Service Status",
      link: "https://grower.vercel.app/status",
    },
    {
      id: uuid(),
      name: "Official Idea",
      link: "https://grower.vercel.app/blog",
    },
    {
      id: uuid(),
      name: "Press Kit",
      link: "https://grower.vercel.app/press",
    },
    {
      id: uuid(),
      name: "Support",

      link: "https://grower.vercel.app/support",
    },
    {
      id: uuid(),
      name: "Careers",

      link: "https://grower.vercel.app/careers",
    },
    {
      id: uuid(),
      name: "OSS ACK",
      link: "https://grower.vercel.app/oss-ack",
    },
  ],
  [
    {
      id: uuid(),
      name: "Privacy Policy",
      link: "https://grower.vercel.app/privacy",
    },
    {
      id: uuid(),
      name: "Terms of Service",
      link: "https://grower.vercel.app/terms",
    },
  ],
];

export const dashboardNavigations = [
  {
    id: uuid(),
    name: "General",
    icon: (state: boolean) => (
      <Settings
        className={`h-5 w-5 ${state ? "stroke-white" : "stroke-gray-700 dark:stroke-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/general",
  },
  {
    id: uuid(),
    name: "Appearance",
    icon: (state: boolean) => (
      <Palette
        className={`h-5 w-5 ${state ? "stroke-white" : "stroke-gray-700 dark:stroke-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/appearance",
  },
  {
    id: uuid(),
    name: "Navbar",
    icon: (state: boolean) => (
      <Table2
        className={`h-5 w-5 ${state ? "stroke-white" : "stroke-gray-700 dark:stroke-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/navbar",
  },
  {
    id: uuid(),
    name: "Articles",
    icon: (state: boolean) => (
      <Newspaper
        className={`h-5 w-5 ${state ? "stroke-white" : "stroke-gray-700 dark:stroke-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/articles",
  },
  {
    id: uuid(),
    name: "Series",
    icon: (state: boolean) => (
      <Book
        className={`h-5 w-5 ${state ? "stroke-white" : "stroke-gray-700 dark:stroke-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/series",
  },
];

export const generalSettingsSocials = [
  {
    id: uuid(),
    label: "Twitter Profile",
    placeholder: "https://twitter.com/username",
    name: "twitter",
    icon: (
      <Twitter className="h-5 w-5 fill-gray-500 stroke-none dark:fill-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Mastodon Profile",
    placeholder: "https://mastodon.social/@username",
    name: "mastodon",
    icon: <Mastodon className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
  },
  {
    id: uuid(),
    label: "Instagram Profile",
    placeholder: "https://www.instagram.com/user_07/",
    name: "instagram",
    icon: (
      <Instagram className="h-5 w-5 stroke-gray-500 dark:stroke-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Github Profile",
    placeholder: "https://github.com/user07",
    name: "github",
    icon: (
      <Github className="h-5 w-5 fill-none stroke-gray-500 dark:stroke-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Your Website",
    placeholder: "https://something.com",
    name: "website",
    icon: (
      <Globe className="h-5 w-5 stroke-gray-500 dark:stroke-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Linkedin Profile",
    placeholder: "https://www.linkedin.com/in/user/",
    name: "linkedin",
    icon: (
      <Linkedin className="h-5 w-5 stroke-gray-500 dark:stroke-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Youtube Channel",
    placeholder: "https://youtube.com/@user",
    name: "youtube",
    icon: (
      <Youtube className="h-5 w-5 stroke-gray-500 dark:stroke-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Daily.dev Profile",
    placeholder: "https://app.daily.dev/user",
    name: "dailydev",
    icon: (
      <Dailydev className="h-5 w-5 stroke-gray-500 dark:stroke-text-primary" />
    ),
  },
];

export const HashnodeSocials = [
  {
    name: "Twitter",
    icon: (
      <Twitter className="h-5 w-5 fill-slate-500 stroke-none dark:fill-text-primary" />
    ),
    link: "https://twitter.com/user35734378",
  },
  {
    name: "Github",
    icon: (
      <Github className="h-5 w-5 fill-none stroke-slate-500 dark:stroke-text-primary" />
    ),
    link: "https://github.com/user07",
  },
  {
    name: "Discord",
    icon: <Discord className="h-5 w-5 fill-slate-500 dark:fill-text-primary" />,
    link: "https://discord.com/users/1054977669781012490",
  },
  {
    name: "Grower",
    icon: (
      <LogonoText className="h-5 w-5 fill-slate-500 dark:fill-text-primary" />
    ),
    link: "https://grower.com/@user",
  },
];

export const selectArticleCard = {
  with: {
    comments: {
      with: {
        user: {
          columns: {
            id: true,
            image: true,
          },
        },
      },
    },
    tags: {
      columns: {
        articleId: false,
        tagId: false,
      },
      with: {
        tag: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    },
    series: {
      columns: {
        title: true,
        slug: true,
      },
    },
    user: {
      columns: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        stripeSubscriptionStatus: true,
      },
      with: {
        handle: {
          columns: {
            id: true,
            handle: true,
            name: true,
            about: true,
          },
        },
      },
    },
  },
  columns: {
    id: true,
    title: true,
    slug: true,
    subContent: true,
    cover_image: true,
    disabledComments: true,
    readCount: true,
    likesCount: true,
    commentsCount: true,
    createdAt: true,
    read_time: true,
  },
} as const;

export function displayUniqueObjects(
  objects: Array<{ id: string; image: string | null }>,
) {
  // Create a set to store the unique IDs.
  const uniqueIds = new Set();
  // Create an array to store the unique objects.
  const uniqueObjects = [];

  // Iterate over the objects and add them to the set if they are not already present.
  for (const object of objects) {
    const id = object.id;
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueObjects.push(object);
    }
  }

  // Return the list of unique objects.
  return uniqueObjects;
}

export const profileDropdownList = [
  {
    type: "divider",
  },
  {
    name: "My Bookmarks",
    icon: (
      <Bookmark className="h-4 w-4 stroke-gray-900 dark:stroke-text-secondary" />
    ),
    link: () => "/bookmarks",
    hiddenItem: false,
    danger: false,
  },
  {
    name: "Account Settings",
    icon: (
      <User className="h-4 w-4 stroke-gray-900 dark:stroke-text-secondary" />
    ),
    link: () => "/settings",
    hiddenItem: false,
    danger: false,
  },
  {
    name: "Manage your ideas",
    icon: (
      <Table2 className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-secondary" />
    ),
    link: (userId: string) => `/${userId}/dashboard`,
    hiddenItem: false,
    danger: false,
  },
  {
    name: "Search",
    icon: (
      <Search className="h-4 w-4 stroke-gray-900 dark:stroke-text-secondary" />
    ),
    link: null,
    hiddenItem: true,
    danger: false,
    onClick: (
      setOpened: React.Dispatch<React.SetStateAction<boolean>>,
      setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      setOpened(false);
      setSearchOpen(true);
    },
  },
  {
    type: "divider",
  },
  {
    name: "Log out",
    icon: <LogOut className="h-4 w-4 stroke-red" />,
    hiddenItem: false,
    link: null,
    danger: true,
  },
];

export const articleimageDropdownList = [
  {
    type: "divider",
  },
  {
    name: "Dashboard",
    icon: (
      <Settings className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
    ),
    link: (userId: string) => `/${userId}/dashboard`,
    hiddenItem: false,
    danger: false,
  },
  {
    name: "New IDEA",
    icon: (
      <Pencil className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
    ),
    link: () => `/article/new`,
    hiddenItem: false,
    danger: false,
  },
  {
    name: "My Bookmarks",
    icon: (
      <Bookmark className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
    ),
    link: () => "/bookmarks",
    hiddenItem: false,
    danger: false,
  },
  {
    type: "divider",
  },
  {
    name: "Back to Grower",
    icon: <LogonoText className="h-4 w-4 fill-secondary" />,
    link: () => "/",
    hiddenItem: false,
    danger: false,
  },
  {
    name: "Profile settings",
    icon: (
      <User className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />
    ),
    link: () => "/settings",
    hiddenItem: false,
    danger: false,
  },
  {
    type: "divider",
  },
  {
    name: "Log out",
    icon: <LogOut className="h-4 w-4 stroke-red" />,
    hiddenItem: false,
    link: null,
    danger: true,
  },
];
