import { useCallback, useEffect, useState } from "react";
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
import {
  AlignJustify,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  MoreVertical,
  Table as TableIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  CategoryResponseDto,
  PaginationResponseDto,
  ProductResponseDto,
} from "@/queries/model";
import { productsControllerFindAll, productsControllerRemove } from "@/queries";
import { useCategoryStore } from "@/stores/category";
import { CircularProgress, Pagination, Tooltip } from "@mui/material";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductStore } from "@/stores/product";
import toast from "react-hot-toast";
import { useMediaMobile } from "@/lib/mediaQuery";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getColumns = (
  productCategory: CategoryResponseDto[],
  applyStatus: { name: string; checked: boolean }[],
  handleToggleApplyStatus: (index: number) => void,
  handleNavigate: (path: string) => void
): ColumnDef<ProductResponseDto>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);

          // if (value) {
          //   // "03"이 아닌 row만 선택
          //   const selectableRowIds = table
          //     .getRowModel()
          //     .rows.filter((row) => row.original.ansYn === "N")
          //     .map((row) => row.id);

          //   table.setRowSelection(
          //     Object.fromEntries(selectableRowIds.map((id) => [id, true]))
          //   );
          // } else {
          //   // 전체 해제
          //   table.setRowSelection({});
          // }
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ctgrCd",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            카테고리
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {productCategory.find((cat) => cat.cd === row.getValue("ctgrCd"))?.cdNm}
      </div>
    ),
  },
  {
    accessorKey: "brandNm",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            브랜드명
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("brandNm")}</div>
    ),
  },
  {
    accessorKey: "prdctNm",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            상품명
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <Tooltip
        title="상품 상세보기"
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
        <div
          className="text-center cursor-pointer text-[#4a81d4]"
          onClick={() =>
            handleNavigate(`/brand/product/view/detail/${row.original.prdctId}`)
          }
        >
          {row.getValue("prdctNm")}
        </div>
      </Tooltip>
    ),
  },
  {
    accessorKey: "prdctAmt",
    header: () => <div className="text-center">상품가격</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("prdctAmt")}</div>
    ),
  },

  {
    accessorKey: "regDt",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            등록일
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {dayjs(row.getValue("regDt")).format("YYYY년 MM월 DD일")}
      </div>
    ),
  },
  {
    accessorKey: "mdfcnDt",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            최종변경일
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {dayjs(row.getValue("mdfcnDt")).format("YYYY년 MM월 DD일")}
      </div>
    ),
  },
];

const BrandProductListPage = () => {
  const cloudFrontUrl = process.env.REACT_APP_NEW_CLOUDFRONT_URL;
  const navigate = useNavigate();
  const isMediaMobile = useMediaMobile();
  const [openDialog, setOpenDialog] = useState(false);
  const [category, setCategory] = useState<{
    first: { id: number | undefined; cd: string } | undefined;
    second: { id: number | undefined; cd: string } | undefined;
    third: { id: number | undefined; cd: string } | undefined;
    fourth: { id: number | undefined; cd: string } | undefined;
  }>({
    first: { id: undefined, cd: "" },
    second: { id: undefined, cd: "" },
    third: { id: undefined, cd: "" },
    fourth: { id: undefined, cd: "" },
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
  const [layout, setLayout] = useState("table");
  const [hidePagination, setHidePagination] = useState(false);
  const productCategory = useCategoryStore((state) => state.productCategory);
  const productTag = useCategoryStore((state) => state.productTag);
  const productListAll = useProductStore((state) => state.productListAll ?? []);
  const [render, setRender] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchFilter, setSearchFilter] = useState("aplymNm");
  const [applyStatus, setApplyStatus] = useState([
    { name: "의뢰신청", code: "01", checked: true },
    { name: "맞춤 상품 추천", code: "02", checked: true },
    { name: "소싱 상품 유통사 발송", code: "03", checked: true },
    { name: "제안서 검토 제품발주", code: "04", checked: true },
  ]);

  const fetchProductList = useCallback(
    async (pageToFetch: number, isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const response = await productsControllerFindAll({
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
      first: { id: undefined, cd: "" },
      second: { id: undefined, cd: "" },
      third: { id: undefined, cd: "" },
      fourth: { id: undefined, cd: "" },
    });
  };

  const handleChangeCategory = (order: number, value: string) => {
    const orderKey = ["first", "second", "third", "fourth"] as const;
    const selectedKey = orderKey[order];
    const newValue = Number(value);
    const cd = productCategory?.find((cat) => cat.id === newValue)?.cd;

    setCategory((prev) => {
      const updated = { ...prev, [selectedKey]: { id: newValue, cd: cd } };
      orderKey.forEach((key, idx) => {
        if (idx > order) updated[key] = { id: undefined, cd: "" };
      });
      return updated;
    });
  };

  const getCategoryOptions = (step: number, cd: string) => {
    if (!productCategory) return [];

    if (step === 0) {
      return productCategory.filter(
        (cat) => cat.cdLvl === 1
      ) as CategoryResponseDto[];
    }

    return productCategory.filter(
      (cat) => cat.cdLvl === step + 1 && cat.cd.startsWith(cd)
    ) as CategoryResponseDto[];
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
    const categoryId = category.fourth?.id;
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

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 12,
  });

  const handleToggleApplyStatus = (index: number) => {
    setApplyStatus((prev) =>
      prev.map((status, i) =>
        i === index ? { ...status, checked: !status.checked } : status
      )
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleDeleteProduct = async () => {
    try {
      const selectedRowsIds = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.prdctId);

      await Promise.all(
        selectedRowsIds.map((id) => productsControllerRemove(id))
      );
      toast.success("문의 삭제에 성공했습니다.");

      fetchProductList(page, page === 1);
    } catch (error) {
      toast.error("문의 삭제에 실패했습니다.");
    }
  };

  const columns = getColumns(
    productCategory,
    applyStatus,
    handleToggleApplyStatus,
    handleNavigate
  );

  const table = useReactTable({
    data: productList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full min-h-screen py-12 px-10 lg:px-20">
      <div className="space-y-6 bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-[#4a81d4]">
          <div className="flex flex-row justify-between items-center gap-4 w-full md:w-auto">
            <span>상품 리스트</span>
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setLayout("grid");
                }}
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
                onClick={() => setLayout("table")}
                className={
                  layout === "table"
                    ? "bg-[#4a81d4] text-white border-transparent"
                    : ""
                }
              >
                <TableIcon />
              </Button>
            </div>
          </div>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    상품관리
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    상품리스트
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
              <span>카테고리</span>
              <Select
                value={category.first?.id?.toString() ?? ""}
                onValueChange={(value) => handleChangeCategory(0, value)}
              >
                <SelectTrigger className="max-w-[100px] overflow-hidden">
                  <SelectValue placeholder="1차 분류" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {getCategoryOptions(0, "").map((cat) => (
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
              <Select
                disabled={category.first === undefined}
                value={category.second?.id?.toString() ?? ""}
                onValueChange={(value) => handleChangeCategory(1, value)}
              >
                <SelectTrigger className="max-w-[100px] overflow-hidden">
                  <SelectValue placeholder="2차 분류" />
                </SelectTrigger>
                <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                  {getCategoryOptions(1, category.first?.cd || "").map(
                    (cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id.toString()}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {cat.cdNm}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Select
                disabled={category.second === undefined}
                value={category.third?.id?.toString() ?? ""}
                onValueChange={(value) => handleChangeCategory(2, value)}
              >
                <SelectTrigger className="max-w-[100px] overflow-hidden">
                  <SelectValue placeholder="3차 분류" />
                </SelectTrigger>
                <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                  {getCategoryOptions(2, category.second?.cd || "").map(
                    (cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id.toString()}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {cat.cdNm}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Select
                disabled={category.third === undefined}
                value={category.fourth?.id?.toString() ?? ""}
                onValueChange={(value) => handleChangeCategory(3, value)}
              >
                <SelectTrigger className="max-w-[100px] overflow-hidden">
                  <SelectValue
                    placeholder="4차 분류"
                    style={{
                      width: "20px",
                    }}
                  />
                </SelectTrigger>
                <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                  {getCategoryOptions(3, category.third?.cd || "").map(
                    (cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id.toString()}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {cat.cdNm}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <Select
                value={searchType}
                onValueChange={(value) => handleSearchType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="검색 조건" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="product">상품명</SelectItem>
                  <SelectItem value="company">회사명</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="검색어 입력"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClickSearch();
                  }
                }}
              />
              <Button
                className="bg-[#4a81d4] text-white"
                onClick={handleClickSearch}
              >
                검색
              </Button>
              <Button
                className="bg-[#4a81d4] text-white"
                onClick={handleClickReset}
              >
                초기화
              </Button>
            </div>
          </div>
          {layout === "grid" && (
            <div
              className={`overflow-x-auto ${
                !loading && productList.length === 0
                  ? "flex justify-center"
                  : "grid gap-4"
              } grid-cols-1 md:grid-cols-4`}
            >
              {loading &&
                Array.from({ length: 12 }).map((_, index) => (
                  <Card key={index} className={`cursor-pointer px-6`}>
                    <div>
                      <Skeleton className="w-full h-40 rounded-lg bg-gray-200" />
                    </div>
                    <div className={`flex flex-col justify-center`}>
                      <CardHeader>
                        <CardTitle>
                          <Skeleton className="w-[12rem] h-6 rounded-lg bg-gray-200" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={`min-h-[120px]`}>
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
                  <span className="text-gray-500">
                    일치하는 상품이 없습니다.
                  </span>
                </div>
              )}
              {!loading &&
                productList.length > 0 &&
                productList.map((product) => (
                  <Card
                    key={product.prdctId}
                    className={`cursor-pointer px-6`}
                    onClick={() =>
                      navigate(`/brand/product/view/detail/${product.prdctId}`)
                    }
                  >
                    <div>
                      <img
                        src={`${cloudFrontUrl}${product.thumbImgPathVl}`}
                        alt={product.prdctNm}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                    <div className={`flex flex-col justify-center`}>
                      <CardHeader className="px-0">
                        <CardTitle className="text-lg font-bold">
                          {product.brandNm}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={`min-h-[120px] px-0`}>
                        <CardDescription className="font-bold">{`[ ${
                          productCategory?.find(
                            (cat) => cat.cd === product.ctgrCd
                          )?.cdNm
                        } ] ${product.prdctNm}`}</CardDescription>
                        <CardDescription className="text-gray-500 line-clamp-2 break-all mt-2">
                          {getTagList(product.tagCd)}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="px-0">
                        <CardDescription className="text-lg font-bold">
                          {`${product.prdctAmt}원`}
                        </CardDescription>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
            </div>
          )}
          {layout === "table" &&
            (loading ? (
              <div className="rounded-md border flex items-center justify-center h-60">
                <CircularProgress />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}

          {!hidePagination && (
            <div className="flex flex-col md:flex-row items-center md:justify-between py-4 gap-2 md:gap-0">
              <div className="hidden md:block w-[80px] flex-shrink-0"></div>
              <Pagination
                count={totalPage}
                shape="rounded"
                color="primary"
                page={page}
                showFirstButton
                showLastButton
                onChange={(_, value) => {
                  setPage(value);
                  setPagination({ pageIndex: value - 1, pageSize: 12 });
                }}
              />
              <div className="text-sm text-gray-500 flex-shrink-0 mt-2 md:mt-0 md:ml-4 text-center md:text-left w-full md:w-auto">
                총 게시물:{" "}
                <span className="font-bold text-[#4a81d4]">
                  {table.getFilteredRowModel().rows.length}
                </span>
                건
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button
            variant="outline"
            className="bg-red-500 border-red-500 text-white hover:bg-red-600"
            onClick={handleDeleteProduct}
          >
            삭제하기
          </Button>
          <Button
            variant="outline"
            className="bg-blue-500 border-blue-500 text-white  hover:bg-blue-600"
            onClick={() => navigate("/brand/product/register")}
          >
            상품 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandProductListPage;
