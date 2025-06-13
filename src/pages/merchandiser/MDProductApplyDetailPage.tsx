import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { sourcingControllerFindOne } from "@/queries";
import { ResponseProductSourcingDto } from "@/queries/model";
import { useUserStore } from "@/stores/user";
import { Step, StepLabel, Stepper } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  BrandModelUsage,
  model,
  offline,
  OfflineUsage,
  popupStore,
  PopupStoreUsage,
  ProductApplyForm,
  reviewProduct,
  salesChannel,
  SalesChannelUsage,
  trendProduct,
} from "./MDProductApplyPage";
import { useMediaMobile } from "@/lib/mediaQuery";
import { useCategoryStore } from "@/stores/category";

interface ProductApplyDetailProps {
  showProductApplyDetail?: boolean;
  onHandleShowProductApplyDetail?: (id: string) => void;
}

const applyStatus = [
  { name: "의뢰신청", code: "01" },
  { name: "맞춤 상품 추천", code: "02" },
  { name: "소싱 상품 유통사 발송", code: "03" },
  { name: "제안서 검토 제품발주", code: "04" },
];

const MDProductApplyDetailPage = ({}: ProductApplyDetailProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productApplyDetail, setProductApplyDetail] =
    useState<ResponseProductSourcingDto | null>(null);
  const [productApplyCn, setProductApplyCn] = useState<ProductApplyForm | null>(
    null
  );
  const isMediaMobile = useMediaMobile();
  const { productTag } = useCategoryStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    getProductApplyDetail(id ?? "");
  }, []);

  const getProductApplyDetail = async (id: string | undefined) => {
    try {
      const response = await sourcingControllerFindOne(Number(id));
      if (response.data) {
        setProductApplyDetail(response.data);
        setProductApplyCn(JSON.parse(response.data.aplyCn));
      }
    } catch (error) {
      toast.error("상품발굴의뢰 상세보기 조회에 실패했습니다.");
    }
  };

  const getReviewProduct = (data: string[]) => {
    if (!data || data.length === 0) return "";

    return data
      .map((item) => {
        switch (item) {
          case "review":
            return (
              reviewProduct.find((product) => product.id === item)?.name ?? ""
            );
          case "star":
            return (
              reviewProduct.find((product) => product.id === item)?.name ?? ""
            );
          case "recommend":
            return (
              reviewProduct.find((product) => product.id === item)?.name ?? ""
            );
          case "sns":
            return (
              reviewProduct.find((product) => product.id === item)?.name ?? ""
            );
          default:
            return "";
        }
      })
      .join(", ");
  };

  const getTrendProduct = (data: string[]) => {
    if (!data || data.length === 0) return "";

    return data
      .map((item) => {
        switch (item) {
          case "instagram":
            return (
              trendProduct.find((product) => product.id === item)?.name ?? ""
            );
          case "youtube":
            return (
              trendProduct.find((product) => product.id === item)?.name ?? ""
            );
          case "tiktok":
            return (
              trendProduct.find((product) => product.id === item)?.name ?? ""
            );
          case "blog":
            return (
              trendProduct.find((product) => product.id === item)?.name ?? ""
            );
          case "community":
            return (
              trendProduct.find((product) => product.id === item)?.name ?? ""
            );
          default:
            return "";
        }
      })
      .join(", ");
  };

  const getModel = (data: BrandModelUsage | undefined): string => {
    if (!data?.type) return "";

    switch (data.type) {
      case "modelUse":
        return model.find((item) => item.id === data.type)?.name ?? "";
      case "modelNotUse":
        return model.find((item) => item.id === data.type)?.name ?? "";
      case "customInput":
        return data.customInput ?? "";
      default:
        return "";
    }
  };

  const getOffline = (data: OfflineUsage | undefined): string => {
    if (!data?.type || data.type.length === 0) return "";

    return data.type
      .map((type) => {
        switch (type) {
          case "offlineHb":
          case "offlineDepartment":
          case "offlineMart":
          case "offlineHoliday":
          case "offlineConvenience":
            return offline.find((item) => item.id === type)?.name ?? "";
          case "customInput":
            return data.customInput ?? "";
          default:
            return "";
        }
      })
      .filter((item) => item)
      .join(", ");
  };

  const getPopupStore = (data: PopupStoreUsage | undefined): string => {
    if (!data?.type || data.type.length === 0) return "";

    return data.type
      .map((type) => {
        switch (type) {
          case "popupStoreDepartment":
          case "popupStoreRoad":
          case "popupStoreNone":
            return popupStore.find((item) => item.id === type)?.name ?? "";
          case "customInput":
            return data.customInput ?? "";
          default:
            return "";
        }
      })
      .filter((item) => item)
      .join(", ");
  };

  const getSalesChannel = (data: SalesChannelUsage | undefined): string => {
    if (!data?.type || data.type.length === 0) return "";

    return data.type
      .map((type) => {
        switch (type) {
          case "salesChannelOnline":
          case "salesChannelOffline":
            return salesChannel.find((item) => item.id === type)?.name ?? "";
          case "customInput":
            return data.customInput ?? "";
          default:
            return "";
        }
      })
      .filter((item) => item)
      .join(", ");
  };

  const getTagList = (tagCd: string | null | undefined) => {
    if (!tagCd || typeof tagCd !== "string") return "태그 미등록";
    const convertToList = tagCd.split(",").map((tag) => tag.trim());
    const tagList = convertToList.map((tag) => {
      return `#${
        productTag?.find((productTag) => productTag.cd === tag)?.cdNm
      }`;
    });

    return tagList.join(", ");
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
                    상품발굴
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className="cursor-pointer font-normal"
                  onClick={() => navigate("/md/product/apply/status")}
                >
                  <BreadcrumbLink>상품발굴의뢰 신청 현황</BreadcrumbLink>
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 flex flex-col justify-between gap-2 border border-gray-200 p-4">
            <span className="text-base md:text-lg font-bold">의뢰자 정보</span>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <span className="min-w-[60px] font-[500] text-sm md:text-base">
                  성함
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyDetail?.company.picFlNm
                    ? productApplyDetail?.company.picFlNm +
                      productApplyDetail?.company.picNm
                    : ""}
                </span>
              </div>
              <div className="flex flex-row gap-4">
                <span className="min-w-[60px] font-[500] text-sm md:text-base">
                  연락처
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyDetail?.company.picTelno?.slice(0, 3) +
                    "-" +
                    productApplyDetail?.company.picTelno?.slice(3, 6) +
                    "-" +
                    productApplyDetail?.company.picTelno?.slice(6)}
                </span>
              </div>
              <div className="flex flex-row gap-4">
                <span className="min-w-[60px] font-[500] text-sm md:text-base">
                  이메일
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyDetail?.user.email}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-2 border border-gray-200 p-4">
            <span className="text-base md:text-lg font-bold">신청 현황</span>
            <Stepper
              alternativeLabel
              activeStep={
                applyStatus.findIndex(
                  (status) => status.code === productApplyDetail?.aplyStts
                ) === 3
                  ? applyStatus.findIndex(
                      (status) => status.code === productApplyDetail?.aplyStts
                    ) + 1
                  : applyStatus.findIndex(
                      (status) => status.code === productApplyDetail?.aplyStts
                    )
              }
              sx={{
                marginTop: "30px",
              }}
            >
              {applyStatus.map((status) => (
                <Step key={status.code}>
                  <StepLabel>{status.name}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row mt-16">
          <div className="w-full md:w-1/2 flex flex-col gap-2 border border-gray-200 p-4">
            <div className="flex flex-row justify-between gap-4">
              <span className="font-[500] text-sm md:text-base">신청서명</span>
              <span className="text-sm md:text-base">{`[${productApplyDetail?.prdctClsfVl
                .split(">")
                .pop()}] 상품을 찾고 있습니다`}</span>
            </div>
            <div className="flex flex-row justify-between gap-4">
              <span className="font-[500] text-sm md:text-base">
                유통채널명
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyDetail?.aplymNm}
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-2 border-l md:border-l-0 border-r md:border-t border-b border-gray-200 p-4">
            <div className="flex flex-row justify-between gap-4">
              <span className="font-[500] text-sm md:text-base">접수 일자</span>
              <span className="font-[500] text-sm md:text-base">
                {dayjs(productApplyDetail?.regDt).format(
                  "YYYY년 M월 D일 a h시 m분"
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row mt-4">
          <div className="w-full md:w-1/2 flex flex-col gap-2 border border-gray-200 p-4">
            <span className="text-base md:text-lg font-bold underline">
              상품 상세
            </span>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                상품분류군
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyDetail?.prdctClsfVl.split(">").pop()}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                구체적인 신청사항
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.description}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                평균 판매 가격
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.price}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                타겟 소비자층
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.target}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                보유 SKU 수
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.sku}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">샘플 운영</span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.sample}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                특정 시즌, 이벤트용
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.event}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                유통기한, 보존성
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.preservation}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                안정성, 인증테스트
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.verification}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                유사 브랜드
              </span>
              <span className="font-[500] text-sm md:text-base">
                {productApplyCn?.competitor}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                리뷰&평점 관련 상품
              </span>
              <span className="font-[500] text-sm md:text-base">
                {getReviewProduct(productApplyCn?.review || [])}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                SNS 트렌드 관련 상품
              </span>
              <span className="font-[500] text-sm md:text-base">
                {getTrendProduct(productApplyCn?.trend || [])}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                브랜드 모델 유무
              </span>
              <span className="font-[500] text-sm md:text-base">
                {getModel(productApplyCn?.model)}
              </span>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
              <span className="font-[500] text-sm md:text-base">
                오프라인 매장 입점 레퍼런스
              </span>
              <span className="font-[500] text-sm md:text-base">
                {getOffline(productApplyCn?.offline)}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-[500] text-sm md:text-base">
                팝업스토어 행사
              </span>
              <span className="font-[500] text-sm md:text-base">
                {getPopupStore(productApplyCn?.popupStore)}
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-8 border-l md:border-l-0 border-r md:border-t border-b border-gray-200 p-4">
            <div className="flex flex-col gap-2">
              <span className="text-base md:text-lg font-bold underline">
                상품 판매 전략
              </span>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">태그</span>
                <span className="font-[500] text-sm md:text-base">
                  {getTagList(productApplyCn?.tag || "")}
                </span>
              </div>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  마케팅 플랜
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyCn?.marketingPlan}
                </span>
              </div>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  단독 기획 구성
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyCn?.concept}
                </span>
              </div>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  유통채널 컨셉
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyCn?.request}
                </span>
              </div>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  기획 요청 사항
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyCn?.request}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base md:text-lg font-bold underline">
                상품 판매 계획
              </span>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  초도 매입 수량
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyCn?.quantity}
                </span>
              </div>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  판매 예정 채널
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {getSalesChannel(productApplyCn?.salesChannel)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base md:text-lg font-bold underline">
                추가 내용
              </span>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  브랜드 스토리, 철학, 세계관, 가치관
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyCn?.brandStory}
                </span>
              </div>
              <div className="flex flex-row justify-between border-b border-gray-200 pb-2">
                <span className="font-[500] text-sm md:text-base">
                  추가내용
                </span>
                <span className="font-[500] text-sm md:text-base">
                  {productApplyCn?.etc}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Button
            className="text-[#4a81d4] mt-8 font-bold"
            onClick={() => navigate(`/md/product/apply/edit/${id}`)}
          >
            수정하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MDProductApplyDetailPage;
