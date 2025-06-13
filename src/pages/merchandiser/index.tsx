import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaMobile } from "@/lib/mediaQuery";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MdProductLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isMediaMobile = useMediaMobile();
  const [tab, setTab] = useState<string>(
    localStorage.getItem("product-tab") || "apply"
  );

  useEffect(() => {
    if (pathname === "/md/product/apply") {
      setTab("apply");
    }
  }, [location]);

  const handleSaveTab = (tab: string) => {
    localStorage.setItem("product-tab", tab);
    setTab(tab);
  };

  return (
    <div className="h-full flex-row mt-[4rem] bg-gray-100">
      <div className="text-2xl font-bold border-b border-gray-200 px-6 py-6">
        상품발굴
      </div>
      <Tabs
        value={tab}
        className="flex-row gap-0"
        onValueChange={handleSaveTab}
      >
        <div
          className={cn(
            "flex flex-col border-r border-gray-200 px-8 pt-12 gap-6",
            isMediaMobile && "hidden"
          )}
        >
          <div className="flex flex-col justify-center items-center">
            <div className="font-bold mb-2 text-2xl">상품발굴의뢰관리</div>
            <TabsList className="w-full h-auto flex-col">
              <TabsTrigger
                value="apply"
                className="w-full text-lg data-[state=active]:bg-transparent data-[state=active]:text-[#4a81d4] data-[state=active]:shadow-none px-10 py-2"
                onClick={() => navigate("/md/product/apply")}
              >
                상품발굴의뢰관리 신청
              </TabsTrigger>
              <TabsTrigger
                value="apply-status"
                className="w-full text-lg data-[state=active]:bg-transparent data-[state=active]:text-[#4a81d4] data-[state=active]:shadow-none px-10 py-2"
                onClick={() => navigate("/md/product/apply/status")}
              >
                상품발굴의뢰 신청 현황
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="font-bold mb-2 text-2xl">상품보기</div>
            <TabsList className="w-full h-auto flex-col">
              <TabsTrigger
                value="matching-product"
                className="w-full text-lg data-[state=active]:bg-transparent data-[state=active]:text-[#4a81d4] data-[state=active]:shadow-none px-10 py-2"
                onClick={() => navigate("/md/product/list/matching")}
              >
                매칭상품보기
              </TabsTrigger>
              <TabsTrigger
                value="all-product"
                className="w-full text-lg data-[state=active]:bg-transparent data-[state=active]:text-[#4a81d4] data-[state=active]:shadow-none px-10 py-2"
                onClick={() => navigate("/md/product/list/all")}
              >
                전체상품보기
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <Outlet />
      </Tabs>
    </div>
  );
};

export default MdProductLayout;
