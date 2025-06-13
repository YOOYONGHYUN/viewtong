import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaMobile } from "@/lib/mediaQuery";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MyPageLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMediaMobile = useMediaMobile();
  const pathname = location.pathname;
  const [mdMypageTab, setMdMypageTab] = useState<string>(
    localStorage.getItem("md-mypage-tab") || "company"
  );

  useEffect(() => {
    if (pathname === "/md/mypage/company") {
      setMdMypageTab("company");
    }
  }, [location]);

  const handleSaveTab = (tab: string) => {
    localStorage.setItem("md-mypage-tab", tab);
    setMdMypageTab(tab);
  };

  return (
    <div className="h-full flex-row mt-[4rem] bg-gray-100">
      <div className="text-2xl font-bold border-b border-gray-200 px-6 py-6">
        마이페이지
      </div>
      <Tabs
        value={mdMypageTab}
        className="flex-row gap-0"
        onValueChange={handleSaveTab}
      >
        <div
          className={cn(
            "min-w-[300px] flex flex-col border-r border-gray-200 px-8 pt-12 gap-6",
            isMediaMobile && "hidden"
          )}
        >
          <div className="flex flex-col justify-center items-center">
            <div className="font-bold mb-2 text-2xl">내 정보관리</div>
            <TabsList className="w-full h-auto flex-col">
              <TabsTrigger
                value="company"
                className="w-full text-lg data-[state=active]:bg-transparent data-[state=active]:text-[#4a81d4] data-[state=active]:shadow-none px-10 py-2"
                onClick={() => navigate("/md/mypage/company")}
              >
                회사 정보
              </TabsTrigger>
              <TabsTrigger
                value="inquiry"
                className="w-full text-lg data-[state=active]:bg-transparent data-[state=active]:text-[#4a81d4] data-[state=active]:shadow-none px-10 py-2"
                onClick={() => navigate("/md/mypage/inquiry")}
              >
                1:1 문의하기
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <Outlet />
      </Tabs>
    </div>
  );
};

export default MyPageLayout;
