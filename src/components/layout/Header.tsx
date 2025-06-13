import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { removeToken } from "@/utils/token";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip } from "@mui/material";
import { useMediaMobile } from "@/lib/mediaQuery";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = !!user;
  const userType = user?.mbrSeCd || "";
  const isHome = location.pathname === "/";
  const isMediaMobile = useMediaMobile();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    removeToken();
    useUserStore.setState({ user: null });
    navigate("/", { replace: true });
  };

  // 메뉴 항목 배열화(유저타입별)
  const commonMenu = !user
    ? [
        { to: "/edu", label: "뷰통월드 서비스" },
        { to: "/contact", label: "서비스 문의" },
        { to: "/subscription", label: "구독/결제" },
      ]
    : [{ to: "/edu", label: "뷰통월드 서비스" }];

  const menusByUserType: Record<
    string,
    { to: string; label: string; disabled?: boolean }[]
  > = {
    "01": isMediaMobile
      ? [
          { to: "/md/product/apply", label: "상품발굴" },
          { to: "/md/product/apply/status", label: "상품발굴의뢰 신청 현황" },
          { to: "/md/product/list/matching", label: "매칭 상품 보기" },
          { to: "/md/product/list/all", label: "전체 상품 보기" },
          { to: "/md/mypage/inquiry", label: "1:1 문의하기" },
          { to: "/md/mypage/company", label: "마이페이지" },
        ]
      : [
          { to: "/md/product/apply", label: "상품발굴" },
          { to: "#", label: "MD's PICK", disabled: true },
          { to: "/md/mypage/company", label: "마이페이지" },
        ],
    "02": [
      { to: "/brand/product/list", label: "제안문서 관리" },
      { to: "#", label: "MD's PICK", disabled: true },
      { to: "/brand/product/list", label: "상품관리" },
      { to: "/brand/channel/proposal/status", label: "제안 기획 신청 리스트" },
      { to: "/brand/mypage", label: "마이페이지" },
    ],
    "09": [
      { to: "/prdct/lista", label: "파트너사 상품" },
      { to: "/manage/biz", label: "관리자" },
    ],
  };

  return (
    <header
      className={`text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? isScrolled
            ? "bg-[#415EBF]"
            : "bg-transparent"
          : "bg-[#415EBF]"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="cursor-pointer">
          <Link to="/">
            <img
              src={require("assets/images/logo_w.png")}
              alt="로고"
              className="h-10"
            />
          </Link>
        </div>

        <div>
          <Button
            className="lg:hidden"
            onClick={toggleMenu}
            variant="outline"
            size="icon"
            aria-label="메뉴 열기"
          >
            {showMenu ? <X /> : <Menu />}
          </Button>
          <nav
            className={`
              absolute right-0 top-12 lg:relative lg:top-0
              bg-[#415EBF] lg:bg-transparent z-50 w-full lg:w-auto
              transition-all duration-300 ease-in-out
              ${
                showMenu
                  ? "opacity-100 translate-y-4 visible pointer-events-auto"
                  : "opacity-0 -translate-y-full invisible pointer-events-none"
              }
              lg:opacity-100 lg:translate-y-0 lg:visible lg:pointer-events-auto
            `}
          >
            <ul className="lg:flex space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-0 font-bold">
              {commonMenu.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-gray-300 w-full block text-center"
                    onClick={() => setShowMenu(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {isAuthenticated &&
                menusByUserType[userType]?.map((item) =>
                  item.disabled ? (
                    <Tooltip
                      key={item.label}
                      title="Coming Soon"
                      disableInteractive
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -10],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <li key={item.label} className="relative group">
                        <span
                          className="hover:text-gray-300 cursor-not-allowed w-full block text-center"
                          data-tooltip="Coming Soon"
                        >
                          {item.label}
                        </span>
                      </li>
                    </Tooltip>
                  ) : (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="hover:text-gray-300 w-full block text-center"
                        onClick={() => setShowMenu(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}

              {isAuthenticated ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-300 w-full block text-center"
                  >
                    로그아웃
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/signin"
                      className="hover:text-gray-300 w-full block text-center"
                      onClick={() => setShowMenu(false)}
                    >
                      로그인
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="hover:text-gray-300 w-full block text-center"
                      onClick={() => setShowMenu(false)}
                    >
                      회원가입
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
