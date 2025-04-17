import { useLocation, useNavigate } from "react-router-dom";
import { pageinfo } from "@/pages/pageinfo";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import logo from "@/assets/logo.png";

import { Page } from "@/types/page";

const SidebarItem = ({ page }: { page: Page }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hasSubmenu = page.submenu && page.submenu.length > 0;

  // 현재 경로가 하위 메뉴에 포함되어 있으면 자동으로 열기
  useEffect(() => {
    if (hasSubmenu) {
      const isActive = page.submenu?.some(
        (subItem) => subItem.path === location.pathname
      );
      if (isActive) {
        setIsOpen(true);
      }
    }
  }, [location.pathname, hasSubmenu, page.submenu]);

  const handleClick = () => {
    if (hasSubmenu) {
      setIsOpen(!isOpen);
    } else if (page.path) {
      navigate(page.path);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`${
          location.pathname === page.path
            ? "bg-[var(--primary-background)] text-[var(--primary)]"
            : ""
        } cursor-pointer px-6 py-2 flex flex-row items-center justify-between`}
        onClick={handleClick}
      >
        <div className="flex flex-row items-center gap-2">
          {page.icon}
          {page.title}
        </div>
        {hasSubmenu && (
          <div className="text-gray-500">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </div>

      {hasSubmenu && isOpen && (
        <div className="ml-6 pl-2 pr-6 ">
          {page.submenu?.map((subItem, index) => (
            <div
              key={index}
              className={`${
                location.pathname === subItem.path
                  ? "text-[var(--primary)] bg-[var(--primary-background)]"
                  : "text-gray-500"
              } cursor-pointer px-4 py-2 flex flex-row items-center gap-2 rounded-md`}
              onClick={() => subItem.path && navigate(subItem.path)}
            >
              {subItem.icon}
              {subItem.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = () => {
  return (
    <section className="flex flex-col h-full max-w-[240px] w-[15%] border-r border-border">
      <div className="text-xl font-bold p-6 flex flex-row items-center gap-2 border-b border-border">
        <img src={logo} alt="logo" className="w-8 h-8" />
        Egg Flow
      </div>
      <div className="flex flex-col py-2 gap-2">
        {pageinfo.map((value) => (
          <SidebarItem key={value.title} page={value} />
        ))}
      </div>
    </section>
  );
};
