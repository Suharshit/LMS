'use client';

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        name: "Dashboard",
        path: "/",
    },
    {
        icon: Compass,
        name: "Browse",
        path: "/search",
    }
]

const teacherRoutes = [
    {
        icon: List,
        name: "Courses",
        path: "/teacher/courses",
    },
    {
        icon: BarChart,
        name: "Analytics",
        path: "/teacher/analytics",
    }
]

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes('/teacher');
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => {
                return (
                    <SidebarItem
                        key={route.path}
                        icon={route.icon}
                        name={route.name}
                        path={route.path}
                    />
                )
            })}
        </div>
    )
}