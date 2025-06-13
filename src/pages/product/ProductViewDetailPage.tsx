import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Divider } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { productsControllerFindOne } from "@/queries";
import { ProductResponseDto } from "@/queries/model";
import { useCategoryStore } from "@/stores/category";
import { useMediaMobile } from "@/lib/mediaQuery";
import DOMPurify from "dompurify";
import { useUserStore } from "@/stores/user";
import { Button } from "@/components/ui/button";

const ProductViewDetailPage = () => {
  const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;
  const cloudFrontUrl2 = process.env.REACT_APP_NEW_CLOUDFRONT_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [render, setRender] = useState(false);
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string>("");
  const category = useCategoryStore((state) => state.productCategory);
  const productTag = useCategoryStore((state) => state.productTag);
  const isMediaMobile = useMediaMobile();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (id) {
      getProduct();
    }
    window.scrollTo(0, 0);
  }, [id]);

  const getProduct = async () => {
    try {
      const product = await productsControllerFindOne(Number(id));
      if (product.data) {
        setProduct(product.data);
        setThumbnailImage(
          user?.mbrSeCd === "01"
            ? `${cloudFrontUrl}${product.data.thumbImgPathVl}`
            : `${cloudFrontUrl2}${product.data.thumbImgPathVl}`
        );
        setRender(true);
      }
    } catch (error) {
      toast.error("상품 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleThumbnailImage = (path: string) => {
    setThumbnailImage(
      user?.mbrSeCd === "01"
        ? `${cloudFrontUrl}${path}`
        : `${cloudFrontUrl2}${path}`
    );
  };

  const getTagList = (tagCd: string | null | undefined) => {
    if (!tagCd) return "태그 미등록";
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
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-blue-500">
          <span>상품 상세보기</span>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    {user?.mbrSeCd === "01" ? "상품보기" : "상품 관리"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer font-normal"
                    onClick={() =>
                      navigate(
                        user?.mbrSeCd === "01"
                          ? "/md/product/list/all"
                          : "/brand/product/list"
                      )
                    }
                  >
                    {user?.mbrSeCd === "01" ? "전체상품보기" : "상품 리스트"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    상품 상세보기
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        {/* 상품 상세 */}
        <div className="flex flex-col gap-10">
          <span className="text-lg md:text-2xl font-bold">상품 상세</span>
          <div className="w-full flex flex-col md:flex-row gap-4 md:gap-10">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              {render && (
                <img
                  src={thumbnailImage}
                  alt={product?.prdctNm}
                  className="w-full h-60 md:h-[400px] object-contain"
                />
              )}
              <div className="flex flex-row gap-4 justify-center">
                {product?.thumbImgPathVl && (
                  <div
                    className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                    onMouseEnter={() =>
                      handleThumbnailImage(product?.thumbImgPathVl ?? "")
                    }
                  >
                    <img
                      src={`${
                        user?.mbrSeCd === "01"
                          ? `${cloudFrontUrl}${product?.thumbImgPathVl}`
                          : `${cloudFrontUrl2}${product?.thumbImgPathVl}`
                      }`}
                      alt={"thumbnailImg1"}
                      className="w-[100px] h-[100px] object-contain"
                    />
                  </div>
                )}
                {product?.thumbImgPath2Vl && (
                  <div
                    className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                    onMouseEnter={() =>
                      handleThumbnailImage(product?.thumbImgPath2Vl ?? "")
                    }
                  >
                    <img
                      src={`${
                        user?.mbrSeCd === "01"
                          ? `${cloudFrontUrl}${product?.thumbImgPath2Vl}`
                          : `${cloudFrontUrl2}${product?.thumbImgPath2Vl}`
                      }`}
                      alt={"thumbnailImg2"}
                      className="w-[100px] h-[100px] object-contain"
                    />
                  </div>
                )}
                {product?.addImgPath1Vl && (
                  <div
                    className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                    onMouseEnter={() =>
                      handleThumbnailImage(product?.addImgPath1Vl ?? "")
                    }
                  >
                    <img
                      src={`${
                        user?.mbrSeCd === "01"
                          ? `${cloudFrontUrl}${product?.addImgPath1Vl}`
                          : `${cloudFrontUrl2}${product?.addImgPath1Vl}`
                      }`}
                      alt={"additionalImg1"}
                      className="w-[100px] h-[100px] object-contain"
                    />
                  </div>
                )}
                {product?.addImgPath2Vl && (
                  <div
                    className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                    onMouseEnter={() =>
                      handleThumbnailImage(product?.addImgPath2Vl ?? "")
                    }
                  >
                    <img
                      src={`${
                        user?.mbrSeCd === "01"
                          ? `${cloudFrontUrl}${product?.addImgPath2Vl}`
                          : `${cloudFrontUrl2}${product?.addImgPath2Vl}`
                      }`}
                      alt={"additionalImg2"}
                      className="w-[100px] h-[100px] object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between">
                <span
                  className={`text-sm md:text-base ${
                    product?.prdctNm ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.prdctNm || "상품명 미등록"}
                </span>
                <span
                  className={`text-sm md:text-base ${
                    product?.ctgrCd ? "text-black" : "text-gray-500"
                  }`}
                >
                  {category?.find((c) => c.cd === product?.ctgrCd)?.cdWholNm ||
                    "카테고리 미등록"}
                </span>
              </div>
              <Divider />
              <span
                className={`text-lg md:text-2xl font-bold mt-4 ${
                  product?.brandNm ? "text-black" : "text-gray-500"
                }`}
              >{`[${product?.brandNm || "브랜드명 미등록"}] ${
                product?.prdctNm || "상품명 미등록"
              }`}</span>
              <table className="w-full h-full mt-4">
                <tbody>
                  <tr className="h-[60px] border-t border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      용량(ml, g)
                    </td>
                    <td
                      className={`w-full h-full flex justify-center items-center px-4 text-sm md:text-base ${
                        product?.cpctVl ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {product?.cpctVl || "용량 미등록"}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      판매가
                    </td>
                    <td
                      className={`w-full h-full flex justify-center items-center px-4 text-sm md:text-base ${
                        product?.prdctAmt ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {`${product?.prdctAmt}원` || "판매가 미등록"}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      제안가
                    </td>
                    <td
                      className={`w-full h-full flex justify-center items-center px-4 text-sm md:text-base ${
                        product?.prpslAmt ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {product?.prpslAmt || "제안가 미등록"}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      입수량(소박스)
                    </td>
                    <td
                      className={`w-full h-full flex justify-center items-center px-4 text-sm md:text-base ${
                        product?.rcvQntVl ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {product?.rcvQntVl || "입수량 미등록"}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      입수량(1box 아웃박스)
                    </td>
                    <td
                      className={`w-full h-full flex justify-center items-center px-4 text-sm md:text-base ${
                        product?.inRcvQntVl ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {product?.inRcvQntVl || "입수량 미등록"}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      유통기한 및 사용기한
                    </td>
                    <td
                      className={`w-full h-full flex justify-center items-center px-4 text-sm md:text-base ${
                        product?.rtlTermYmd ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {product?.rtlTermYmd || "유통기한 미등록"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col gap-6 mt-10 md:mt-20">
          <span className="text-lg md:text-2xl font-bold">상품 정보</span>
          <table className="w-full h-full">
            <tbody>
              <tr className="h-[60px] border-t border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  제조국
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.mnftrNtnNm ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.mnftrNtnNm || "제조국 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  용기 형태
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.bttlShp ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.bttlShp || "용기 형태 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  구성
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.cmpsVl ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.cmpsVl || "구성 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  제품 규격
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.prdctSpcfctVl ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.prdctSpcfctVl || "제품 규격 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  출시일
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.rlsDt ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.rlsDt || "출시일 미등록"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 사용 정보 */}
        <div className="flex flex-col gap-6 mt-10 md:mt-20">
          <span className="text-lg md:text-2xl font-bold">사용 정보</span>
          <table className="w-full h-full">
            <tbody>
              <tr className="h-[60px] border-t border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  사용 방법
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.useMthdCn ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.useMthdCn || "사용 방법 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  주요 성분
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.mainIgdVl ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.mainIgdVl || "주요 성분 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  주요 효능
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.mainEffcncVl ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.mainEffcncVl || "주요 효능 미등록"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 판매 정보 */}
        <div className="flex flex-col gap-6 mt-10 md:mt-20">
          <span className="text-lg md:text-2xl font-bold">판매 정보</span>
          <table className="w-full h-full">
            <tbody>
              <tr className="h-[60px] border-t border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  권유 고객
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.rcmdtnCustNm ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.rcmdtnCustNm || "권유 고객 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  셀링 포인트
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.rcmdtnPntCn ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.rcmdtnPntCn || "셀링 포인트 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  상품 판매 채널
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.prdctNtslChnVl ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.prdctNtslChnVl || "상품 판매 채널 미등록"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 기타 정보 */}
        <div className="flex flex-col gap-6 mt-10 md:mt-20">
          <span className="text-lg md:text-2xl font-bold">기타 정보</span>
          <table className="w-full h-full">
            <tbody>
              <tr className="h-[60px] border-t border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  인허가인증파일
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.rcmdtnCustNm ? (
                    <a
                      href={
                        user?.mbrSeCd === "01"
                          ? `${cloudFrontUrl}${product?.rcmdtnCustNm}`
                          : `${cloudFrontUrl2}${product?.rcmdtnCustNm}`
                      }
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-bold"
                    >
                      다운로드
                    </a>
                  ) : (
                    <span className="text-gray-500">
                      등록된 파일이 없습니다.
                    </span>
                  )}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  소개자료
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.explnAtchFilePathVl ? (
                    <a
                      href={
                        user?.mbrSeCd === "01"
                          ? `${cloudFrontUrl}${product?.explnAtchFilePathVl}`
                          : `${cloudFrontUrl2}${product?.explnAtchFilePathVl}`
                      }
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-bold"
                    >
                      다운로드
                    </a>
                  ) : (
                    <span className="text-gray-500">
                      등록된 파일이 없습니다.
                    </span>
                  )}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  제안문서
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.prdctNtslChnVl ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.prdctNtslChnVl ? "제안문서보기" : "제안문서 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  태그
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.tagCd ? "text-black" : "text-gray-500"
                  }`}
                >
                  {getTagList(product?.tagCd)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 추가 정보 */}
        <div className="flex flex-col gap-6 mt-10 md:mt-20">
          <span className="text-lg md:text-2xl font-bold">추가 정보</span>
          <table className="w-full h-full">
            <tbody>
              <tr className="h-[60px] border-t border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  제조사
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.company?.companyName
                      ? "text-black"
                      : "text-gray-500"
                  }`}
                >
                  {product?.company?.companyName || "제조사 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  회사 소개
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.company?.coDescCn ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.company?.coDescCn || "회사 소개 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  대표자
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.company?.bossName ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.company?.bossName || "대표자 미등록"}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  연락처
                </td>
                <td
                  className={`w-full h-full flex justify-center items-center px-6 text-sm md:text-base ${
                    product?.company?.coTelno ? "text-black" : "text-gray-500"
                  }`}
                >
                  {product?.company?.coTelno || "연락처 미등록"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col gap-6 mt-10 md:mt-20">
          <span className="text-lg md:text-2xl font-bold">상품 설명</span>
          {product?.prdctCn !== "<p><br></p>" ? (
            <div
              className="w-full h-full flex flex-col justify-center items-center bg-gray-100 rounded-lg p-12 text-sm md:text-base"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product?.prdctCn ?? ""),
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 rounded-lg p-12 text-sm md:text-base">
              <span className="text-gray-500">상품 설명이 없습니다.</span>
            </div>
          )}
        </div>

        <div className="flex flex-row justify-center items-center gap-4 mt-10 md:mt-20">
          {user?.mbrSeCd === "02" && (
            <Button
              className="text-blue-500 hover:text-blue-600 font-bold"
              onClick={() => {
                navigate(`/brand/product/edit/${product?.prdctId}`);
              }}
            >
              수정하기
            </Button>
          )}
          <Button
            className="text-blue-500 hover:text-blue-600 font-bold"
            onClick={() =>
              navigate(
                user?.mbrSeCd === "01"
                  ? "/md/product/list/all"
                  : "/brand/product/list"
              )
            }
          >
            목록으로
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewDetailPage;
