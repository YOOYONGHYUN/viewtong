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

const MDProductViewDetailPage = () => {
  const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [render, setRender] = useState(false);
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string>("");
  const category = useCategoryStore((state) => state.productCategory);
  const productTag = useCategoryStore((state) => state.productTag);
  const isMediaMobile = useMediaMobile();

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
        setThumbnailImage(`${product.data.thumbImgPathVl}`);
        setRender(true);
      }
    } catch (error) {
      toast.error("상품 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleThumbnailImage = (path: string) => {
    setThumbnailImage(`${path}`);
  };

  const getTagList = (tagCd: string | null | undefined) => {
    if (!tagCd) return "태그 미입력";
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
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>상품 상세보기</span>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="cursor-pointer font-normal">
                    상품보기
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer font-normal"
                    onClick={() => navigate("/md/product/list/all")}
                  >
                    전체상품보기
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
                      src={`${product?.thumbImgPathVl}`}
                      alt={product?.prdctNm}
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
                      src={`${product?.thumbImgPath2Vl}`}
                      alt={product?.prdctNm}
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
                      src={`${product?.addImgPath1Vl}`}
                      alt={product?.prdctNm}
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
                      src={`${product?.addImgPath2Vl}`}
                      alt={product?.prdctNm}
                      className="w-[100px] h-[100px] object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between">
                <span className="text-sm md:text-base">{product?.prdctNm}</span>
                <span className="text-sm md:text-base">
                  {category?.find((c) => c.cd === product?.ctgrCd)?.cdWholNm}
                </span>
              </div>
              <Divider />
              <span className="text-lg md:text-2xl font-bold mt-4">{`[${product?.brandNm}] ${product?.prdctNm}`}</span>
              <table className="w-full h-full mt-4">
                <tbody>
                  <tr className="h-[60px] border-t border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      용량(ml, g)
                    </td>
                    <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                      {product?.cpctVl}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      판매가
                    </td>
                    <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                      {`${product?.prdctAmt}원`}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      제안가
                    </td>
                    <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                      {product?.prpslAmt}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      입수량(소박스)
                    </td>
                    <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                      {product?.rcvQntVl}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      입수량(1box 아웃박스)
                    </td>
                    <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                      {product?.inRcvQntVl}
                    </td>
                  </tr>
                  <tr className="h-[60px] border-b border-gray-200">
                    <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                      유통기한 및 사용기한
                    </td>
                    <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                      {product?.rtlTermYmd}
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
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.mnftrNtnNm}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  용기 형태
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.bttlShp}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  구성
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.cmpsVl}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  제품 규격
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.prdctSpcfctVl}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  출시일
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.rlsDt}
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
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.useMthdCn}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  주요 성분
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.mainIgdVl}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  주요 효능
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.mainEffcncVl}
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
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.rcmdtnCustNm}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  셀링 포인트
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.rcmdtnPntCn}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  상품 판매 채널
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.prdctNtslChnVl}
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
                      href={`${product?.rcmdtnCustNm}`}
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
                      href={`${product?.explnAtchFilePathVl}`}
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
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {/* {product?.prdctNtslChnVl ? "제안문서보기" : "미등록"} */}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  태그
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
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
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.company?.companyName}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  회사 소개
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {/* {product?.company?.coDescCn} */}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  대표자
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {product?.company?.bossName}
                </td>
              </tr>
              <tr className="h-[60px] border-b border-gray-200">
                <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                  연락처
                </td>
                <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                  {/* {product?.company?.picTelno?.telno} */}
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
      </div>
    </div>
  );
};

export default MDProductViewDetailPage;
