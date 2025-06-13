import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlignJustify, LayoutGrid } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CategoryResponseDto, ProductResponseDto } from "@/queries/model";
import {
  productsControllerFindAll,
  productSourcingMatchControllerFindMyMatchedProducts,
} from "@/queries";
import { useCategoryStore } from "@/stores/category";
import { Pagination } from "@mui/material";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductStore } from "@/stores/product";
import toast from "react-hot-toast";
import { useMediaMobile } from "@/lib/mediaQuery";

const MDProductListMatchingPage = () => {
  const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;
  const navigate = useNavigate();
  const isMediaMobile = useMediaMobile();
  const [openDialog, setOpenDialog] = useState(false);
  const [category, setCategory] = useState<{
    first: number | undefined;
    second: number | undefined;
    third: number | undefined;
    fourth: number | undefined;
  }>({
    first: undefined,
    second: undefined,
    third: undefined,
    fourth: undefined,
  });
  const [productList, setProductList] = useState<ProductResponseDto[]>([]);
  const [originalProductList, setOriginalProductList] = useState<
    ProductResponseDto[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("product");
  const [layout, setLayout] = useState("grid");
  const [hidePagination, setHidePagination] = useState(false);
  const productCategory = useCategoryStore((state) => state.productCategory);
  const productTag = useCategoryStore((state) => state.productTag);
  const productListAll = useProductStore((state) => state.productListAll);

  const fetchProductList = useCallback(
    async (pageToFetch: number, isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const response =
          await productSourcingMatchControllerFindMyMatchedProducts({
            page: pageToFetch,
            limit: 12,
          });
        setProductList(response.data ?? []);
        if (isInitial) {
          setOriginalProductList(response.data ?? []);
          setTotalPage(response.metadata?.pagination?.totalPages ?? 1);
        }
      } catch (error) {
        toast.error("상품 목록을 불러오는데 실패했습니다.");
      } finally {
        if (isInitial) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProductList(page, page === 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, fetchProductList]);

  useEffect(() => {
    if (openDialog) {
      setTimeout(() => {
        setOpenDialog(false);
        resetCategory();
      }, 3000);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }, 3100);
    }
  }, [openDialog]);

  const resetCategory = () => {
    setCategory({
      first: undefined,
      second: undefined,
      third: undefined,
      fourth: undefined,
    });
  };

  const handleCategory = (order: number, value: string) => {
    const orderKey = ["first", "second", "third", "fourth"] as const;
    const selectedKey = orderKey[order];
    const newValue = Number(value);

    setCategory((prev) => {
      const updated = { ...prev, [selectedKey]: newValue };
      orderKey.forEach((key, idx) => {
        if (idx > order) updated[key] = undefined;
      });
      return updated;
    });
  };

  const getCategoryOptions = (step: number) => {
    return (
      (productCategory?.filter(
        (cat) => cat.cdLvl === step + 1
      ) as CategoryResponseDto[]) || []
    );
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

  const resetState = () => {
    setProductList(originalProductList);
    setSearch("");
    setSearchType("product");
    resetCategory();
    setHidePagination(false);
  };

  const filterProducts = () => {
    const categoryId =
      category.fourth || category.third || category.second || category.first;
    const categoryFilter = productCategory?.find(
      (cat) => cat.id === categoryId
    )?.cd;

    let filtered = productListAll;

    if (!categoryId && !search) {
      setProductList(originalProductList);
      setHidePagination(false);
      return;
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.ctgrCd === categoryFilter
      );
    }

    if (search) {
      filtered = filtered.filter((product) =>
        searchType === "product"
          ? product.prdctNm.includes(search)
          : product.brandNm.includes(search)
      );
    }

    setProductList(filtered);
    setHidePagination(!!search || !!categoryFilter);
  };

  const handleSearchType = (value: string) => {
    setSearchType(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleClickSearch = () => {
    filterProducts();
  };

  const handleClickReset = () => {
    resetState();
  };

  return (
    <div className="w-full min-h-screen py-12 px-10 lg:px-20">
      <div className="space-y-6 bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-[#4a81d4]">
          <div className="flex flex-row justify-between md:justify-start items-center gap-4 w-full md:w-auto">
            <span>매칭상품보기</span>
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setLayout("grid")}
                className={
                  layout === "grid"
                    ? "bg-[#4a81d4] text-white border-transparent"
                    : ""
                }
              >
                <LayoutGrid />
              </Button>
              <Button
                variant="outline"
                onClick={() => setLayout("list")}
                className={
                  layout === "list"
                    ? "bg-[#4a81d4] text-white border-transparent"
                    : ""
                }
              >
                <AlignJustify />
              </Button>
            </div>
          </div>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    상품보기
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    매칭상품보기
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="space-y-6">
          {/* <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex flex-row items-center gap-2 w-full md:w-auto">
              <span className="w-full md:w-auto">상품발굴의뢰 리스트</span>
              <Select
                value={category.first ? category.first.toString() : ""}
                onValueChange={(value) => handleCategory(0, value)}
              >
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="1차 분류" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {getCategoryOptions(0).map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id.toString()}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {cat.cdNm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div> */}
          <div
            className={`overflow-x-auto ${
              !loading && productList.length === 0
                ? "flex justify-center"
                : "grid gap-4"
            } ${
              layout === "grid" ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {loading &&
              Array.from({ length: 12 }).map((_, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer ${
                    layout === "list" ? "flex flex-row" : ""
                  }`}
                >
                  <div className="px-6">
                    <Skeleton className="w-full h-40 rounded-lg bg-gray-200" />
                  </div>
                  <div
                    className={`flex flex-col ${
                      layout === "list" ? "justify-center" : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="w-[12rem] h-6 rounded-lg bg-gray-200" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className={`${
                        layout === "list" ? "min-h-[60px]" : "min-h-[120px]"
                      }`}
                    >
                      <CardDescription className="font-bold">
                        <Skeleton className="w-full h-6 rounded-lg bg-gray-200" />
                      </CardDescription>
                      <CardDescription>
                        <Skeleton className="w-full h-6 rounded-lg bg-gray-200 mt-2" />
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="w-full h-6 rounded-lg bg-gray-200" />
                    </CardFooter>
                  </div>
                </Card>
              ))}
            {!loading && productList.length === 0 && (
              <div className="min-h-[300px] flex justify-center items-center">
                <span className="text-gray-500">일치하는 상품이 없습니다.</span>
              </div>
            )}
            {!loading &&
              productList.length > 0 &&
              productList.map((product) => (
                <Card
                  key={product.prdctId}
                  className={`cursor-pointer ${
                    layout === "list" ? "flex flex-row" : ""
                  } max-w-[300px] md:max-w-full`}
                  onClick={() =>
                    navigate(`/md/product/view/detail/${product.prdctId}`)
                  }
                >
                  <div className="px-6">
                    <img
                      src={`${cloudFrontUrl}${product.thumbImgPathVl}`}
                      alt={product.prdctNm}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div
                    className={`flex flex-col ${
                      layout === "list" ? "justify-center" : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">
                        {product.brandNm}
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className={`${
                        layout === "list" ? "min-h-[60px]" : "min-h-[120px]"
                      }`}
                    >
                      <CardDescription className="font-bold">{`[ ${
                        productCategory?.find(
                          (cat) => cat.cd === product.ctgrCd
                        )?.cdNm
                      } ] ${product.prdctNm}`}</CardDescription>
                      <CardDescription className="text-gray-500 line-clamp-2 break-all mt-2">
                        {getTagList(product.tagCd)}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <CardDescription className="text-lg font-bold">
                        {`${product.prdctAmt}원`}
                      </CardDescription>
                    </CardFooter>
                  </div>
                </Card>
              ))}
          </div>
        </div>
        {!hidePagination && (
          <div className="flex justify-center">
            <Pagination
              count={totalPage}
              shape="rounded"
              color="primary"
              page={page}
              showFirstButton
              showLastButton
              onChange={(_, value) => setPage(value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MDProductListMatchingPage;
