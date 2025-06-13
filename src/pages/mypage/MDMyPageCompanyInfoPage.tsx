import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useMediaMobile } from "@/lib/mediaQuery";
import { useMyCompanyStore } from "@/stores/myCompany";
import { useUserStore } from "@/stores/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MDMyPageCompanyInfoPage = () => {
  const navigate = useNavigate();
  const myCompany = useMyCompanyStore((state) => state.myCompany);
  const user = useUserStore((state) => state.user);
  const isMediaMobile = useMediaMobile();

  const handleClickEdit = () => {
    navigate("/md/mypage/company/edit");
  };

  const formatCompanyNumber = (num?: string) => {
    if (!num || num.length !== 10) return num || "";
    return `${num.slice(0, 3)}-${num.slice(3, 5)}-${num.slice(5)}`;
  };

  const formatPicTelno = (num?: string) => {
    if (!num || num.length !== 11) return num || "";
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };

  return (
    <div className="w-full min-h-screen py-12 px-20">
      <div className="space-y-6 bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-row justify-between items-center text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>회사 정보</span>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    MD, Buyer
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    내 정보관리
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    회사 정보
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 text-base gap-20">
          {myCompany?.coImgPathVl ? (
            <img
              src={myCompany?.coImgPathVl ?? ""}
              alt="회사 로고"
              className="flex-1 object-contain"
            />
          ) : (
            <div className="bg-gray-200 rounded-lg flex flex-col justify-center items-center">
              <span className="text-gray-500">회사 로고 없음</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center">
              <span className="w-1/3">가입 유형</span>
              <span>
                {myCompany?.certSttsCd === "01" ? "브랜드사" : "유통사 MD"}
              </span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">로그인 ID</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">회사명</span>
              <span>{myCompany?.companyName}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">대표자명</span>
              <span>{myCompany?.bossName}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">사업자번호</span>
              <span>{formatCompanyNumber(myCompany?.companyNumber)}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">회사 주소</span>
              <span>{myCompany?.coAddr}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">회사 전화번호</span>
              <span>{myCompany?.coTelno}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">회사 소개</span>
              <span>{myCompany?.coDescCn}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">담당자명</span>
              <span>
                {myCompany?.picFlNm && myCompany?.picNm
                  ? `${myCompany.picFlNm}${myCompany.picNm}`
                  : ""}
              </span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">연락처</span>
              <span>{formatPicTelno(myCompany?.picTelno ?? undefined)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center !mt-20">
          <Button
            className="text-[#4a81d4] font-bold"
            onClick={handleClickEdit}
          >
            회사 정보 수정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MDMyPageCompanyInfoPage;
