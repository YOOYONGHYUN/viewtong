import { questionsControllerFindOneBy } from "@/queries";
import {
  GenericResponseData,
  ResponseQuestionAnswerDto,
} from "@/queries/model";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Stepper, Step, StepLabel } from "@mui/material";
import dayjs from "dayjs";
import { useMediaMobile } from "@/lib/mediaQuery";
import dompurify from "dompurify";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

export type InquiryDetail = {
  ansYn: string;
  chnNm: string | null;
  cn: string;
  coNm: string | null;
  id: number;
  mdfcnDt: string;
  mdfrId: number | null;
  picEmail: string | null;
  picNm: string | null;
  picTelno: string | null;
  qstnTypeCd: string;
  regDt: string;
  rgtrId: number | null;
  ttl: string;
  upId: number | null;
  user: {
    email: string;
    id: number;
    isActive: boolean;
    isAdmin: boolean;
    isSuperuser: boolean;
    joinDate: string;
    lastLogin: string | null;
    mbrSeCd: string;
  };
  userId: number;
};

const MDMyPageInquiryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMediaMobile = useMediaMobile();
  const [inquiryDetail, setInquiryDetail] =
    useState<ResponseQuestionAnswerDto | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    getInquiryDetail(id ?? "");
  }, []);

  const getInquiryDetail = async (id: string | undefined) => {
    try {
      const response = await questionsControllerFindOneBy(Number(id));
      setInquiryDetail(response.data as ResponseQuestionAnswerDto);
    } catch (error) {
      toast.error("문의 상세 정보를 불러오는데 실패했습니다.");
    }
  };

  return (
    <div className="w-full min-h-screen py-12 px-10 lg:px-20">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>상품발굴의뢰 상세보기</span>
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
                  <BreadcrumbPage
                    className="font-normal cursor-pointer"
                    onClick={() => navigate("/md/mypage/inquiry")}
                  >
                    1:1 문의하기
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    상세보기
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-sm md:text-base">제목</span>
            <span className="text-sm md:text-base text-gray-500">
              {inquiryDetail?.ttl}
            </span>
          </div>
          <Separator className="my-4 bg-gray-200" />
          <div className="flex flex-col gap-4">
            <span className="font-bold text-sm md:text-base">내용</span>
            <span
              className="text-sm md:text-base text-gray-500"
              dangerouslySetInnerHTML={{
                __html: dompurify.sanitize(inquiryDetail?.cn ?? ""),
              }}
            />
          </div>
          <Separator className="my-4 bg-gray-200" />
          <div className="flex flex-col gap-4">
            <span className="font-bold text-sm md:text-base">답변</span>
            {inquiryDetail?.ansYn === "Y" ? (
              <span
                className="text-sm md:text-base text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: dompurify.sanitize(inquiryDetail?.ansYn ?? ""),
                }}
              />
            ) : (
              <span className="text-sm md:text-base text-gray-500">
                등록된 답변이 없습니다.
              </span>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Button
            className="text-[#4a81d4] mt-8 font-bold"
            onClick={() => navigate(`/md/mypage/inquiry/edit/${id}`)}
          >
            수정하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MDMyPageInquiryDetailPage;
