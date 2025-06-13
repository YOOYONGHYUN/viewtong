import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";

// Menu items.
const md = [
  {
    title: "상품발굴의뢰관리",
    menus: [
      {
        title: "상품발굴의뢰 신청",
        url: "#",
        icon: Home,
      },
      {
        title: "상품발굴의뢰 신청 현황",
        url: "#",
        icon: Home,
      },
    ],
  },
  {
    title: "상품보기",
    menus: [
      {
        title: "매칭상품보기",
        url: "#",
        icon: Inbox,
      },
      {
        title: "전체상품보기",
        url: "#",
        icon: Inbox,
      },
    ],
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {md.map((md) => (
              <SidebarMenu key={md.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton>{md.title}</SidebarMenuButton>
                  <SidebarMenuSub>
                    {md.menus.map((menu) => (
                      <SidebarMenuSubItem key={menu.title}>
                        <SidebarMenuSubButton asChild>
                          <Button>{menu.title}</Button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
