"use client";

import { Home, Files, Music, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

type BaseRoute = {
  name: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type NonExpandableRoute = BaseRoute & {
  isExpandable: false;
  href: string;
};

type ExpandableRoute = BaseRoute & {
  isExpandable: true;
  children: NonExpandableRoute[];
};

type Route = NonExpandableRoute | ExpandableRoute;

const ROUTES: Route[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    isExpandable: false,
  },
  {
    name: "Reports",
    icon: Files,
    isExpandable: true,
    children: [
      {
        name: "Create a report",
        href: "/reports/create",
        isExpandable: false,
      },
      {
        name: "Manage past reports",
        href: "/reports/manage",
        isExpandable: false,
      },
    ],
  },
  {
    name: "Songs",
    href: "/songs",
    icon: Music,
    isExpandable: false,
  },
];

export default function Sidebar() {
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());

  const toggleRoute = (routeName: string) => {
    setExpandedRoutes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(routeName)) {
        newSet.delete(routeName);
      } else {
        newSet.add(routeName);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-background flex h-full max-h-screen w-64 shrink-0 flex-col overflow-auto border-r p-4">
      <Link href="/" className="flex">
        <h1 className="text-primary font-gasoek text-6xl">doxa</h1>
      </Link>
      <nav className="mt-8 space-y-5">
        {ROUTES.map((route, index) => (
          <div key={index}>
            {route.isExpandable ? (
              <>
                <motion.div
                  className="hover:text-primary flex cursor-pointer items-center gap-2 text-xl select-none"
                  onClick={() => toggleRoute(route.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {route.icon && <route.icon className="h-6 w-6" />}
                  <span className="flex-1">{route.name}</span>
                  <motion.div
                    animate={{
                      rotate: expandedRoutes.has(route.name) ? 90 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
                <AnimatePresence>
                  {expandedRoutes.has(route.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="-mt-[3px] overflow-hidden"
                    >
                      <div className="border-primary ml-2 space-y-1 border-l-2 px-2 pt-2">
                        {route.children.map((child, childIndex) => (
                          <motion.div
                            key={childIndex}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              delay: childIndex * 0.1,
                              duration: 0.2,
                            }}
                          >
                            <Link href={child.href}>
                              <motion.div
                                className="text-primary hover:text-primary flex items-center gap-2 p-1 transition-colors"
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.15 }}
                              >
                                <span>{child.name}</span>
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link href={route.href}>
                <motion.div
                  className="hover:text-primary flex items-center gap-2 rounded text-xl transition-colors"
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  {route.icon && <route.icon className="h-6 w-6" />}
                  <span>{route.name}</span>
                </motion.div>
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://avatars.githubusercontent.com/u/159507328?v=4" />
          <AvatarFallback>MF</AvatarFallback>
        </Avatar>
        <p>Matthew Franco</p>
      </div>
    </div>
  );
}
