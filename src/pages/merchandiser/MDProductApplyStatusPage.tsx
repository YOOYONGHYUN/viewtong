import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { alpha, CircularProgress, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sourcingControllerFindAll } from "@/queries";
import {
  PaginationResponseDto,
  ResponseProductSourcingDto,
} from "@/queries/model";
import toast from "react-hot-toast";
import { useMediaMobile } from "@/lib/mediaQuery";

const getColumns = (
  applyStatus: { name: string; checked: boolean }[],
  handleToggleApplyStatus: (index: number) => void,
  handleNavigate: (path: string) => void
): ColumnDef<ResponseProductSourcingDto>[] => [
  {
    accessorKey: "aplymNm",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            유통채널명
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("aplymNm")}</div>
    ),
  },
  {
    accessorKey: "prdctClsfVl",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            의뢰상품
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <Tooltip
        title="상품발굴의뢰 상세보기"
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
            handleNavigate(`/md/product/apply/detail/${row.original.srcngId}`)
          }
        >
          {row.getValue("prdctClsfVl")}
        </div>
      </Tooltip>
    ),
  },
  {
    accessorKey: "stlmStts",
    header: () => <div className="text-center">결제상태</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("stlmStts")}</div>
    ),
  },
  {
    accessorKey: "aplyStts",
    header: ({ column }) => (
      <div className="flex flex-row items-center justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          의뢰상태
          <ArrowUpDown />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-[-20px]"
              aria-label="의뢰상태 필터"
            >
              <MoreVertical size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-white w-auto px-0">
            {applyStatus.map((status, index) => (
              <div
                key={status.name}
                className="cursor-pointer hover:bg-gray-100 p-2 flex flex-row items-center text-sm"
                onClick={() => handleToggleApplyStatus(index)}
              >
                <Checkbox
                  className="border-gray-300"
                  checked={status.checked}
                />
                <span className="ml-2">{status.name}</span>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("aplyStts")}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(row.getValue(columnId));
      }
      return true;
    },
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
            신청일
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

const MDProductApplyStatusPage = () => {
  const navigate = useNavigate();
  const isMediaMobile = useMediaMobile();
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
  const [paginationMeta, setPaginationMeta] = useState<PaginationResponseDto>({
    total: 0,
    page: 1,
    limit: 0,
    totalPages: 0,
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [applyDatas, setApplyDatas] = useState<ResponseProductSourcingDto[]>(
    []
  );

  useEffect(() => {
    getApplyDatas();
  }, []);

  useEffect(() => {
    const checkedNames = applyStatus
      .filter((status) => status.checked)
      .map((status) => status.code);

    // table.getColumn("aplyStts")?.setFilterValue(checkedNames);
  }, [applyStatus]);

  const getApplyDatas = async () => {
    try {
      const data = await sourcingControllerFindAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });

      setApplyDatas(
        data.data?.map((item) => ({
          ...item,
          prdctClsfVl: item.prdctClsfVl?.split(">").pop() ?? "",
        })) ?? []
      );

      setPaginationMeta(
        data.metadata?.pagination ?? {
          total: 0,
          page: 1,
          limit: 0,
          totalPages: 0,
        }
      );

      setTimeout(() => {
        setRender(true);
      }, 500);
    } catch (error) {
      toast.error("상품발굴의뢰 신청 현황 조회에 실패했습니다.");
    }
  };

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

  const handleSearchFilter = (value: string) => {
    setSearchFilter(value);
  };

  const handleChangePage = (type: "first" | "last" | "prev" | "next") => {
    let newPageIndex = pagination.pageIndex;

    switch (type) {
      case "first":
        newPageIndex = 0;
        break;
      case "last":
        newPageIndex = paginationMeta.totalPages - 1;
        break;
      case "prev":
        newPageIndex = Math.max(0, pagination.pageIndex - 1);
        break;
      case "next":
        newPageIndex = Math.min(
          paginationMeta.totalPages,
          pagination.pageIndex + 1
        );
        break;
      default:
        break;
    }

    setPagination({
      pageIndex: newPageIndex,
      pageSize: 10,
    });
  };

  const columns = getColumns(
    applyStatus,
    handleToggleApplyStatus,
    handleNavigate
  );

  const table = useReactTable({
    data: applyDatas,
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
        <div className="flex flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>상품발굴의뢰 신청 현황</span>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    상품발굴
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    상품발굴의뢰 신청 현황
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center py-4 gap-2 md:gap-4">
            <Select value={searchFilter} onValueChange={handleSearchFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem
                  value="aplymNm"
                  className="cursor-pointer hover:bg-gray-100 text-sm"
                >
                  유통채널명
                </SelectItem>
                <SelectItem
                  value="prdctClsfVl"
                  className="cursor-pointer hover:bg-gray-100 text-sm"
                >
                  의뢰상품
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="검색어를 입력해주세요."
              value={
                searchFilter === "aplymNm"
                  ? (table.getColumn("aplymNm")?.getFilterValue() as string) ??
                    ""
                  : (table
                      .getColumn("prdctClsfVl")
                      ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                searchFilter === "aplymNm"
                  ? table
                      .getColumn("aplymNm")
                      ?.setFilterValue(event.target.value)
                  : table
                      .getColumn("prdctClsfVl")
                      ?.setFilterValue(event.target.value)
              }
              className="max-w-sm text-sm md:text-base"
            />
          </div>
          {render ? (
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
          ) : (
            <div className="rounded-md border flex items-center justify-center h-60">
              <CircularProgress />
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center md:justify-between py-4 gap-2 md:gap-0">
            <div className="hidden md:block w-[80px] flex-shrink-0"></div>
            <div className="flex flex-row items-center justify-center space-x-2 w-full md:w-auto">
              <Button
                size="sm"
                onClick={() => handleChangePage("first")}
                disabled={
                  pagination.pageIndex === 0 || paginationMeta.totalPages === 1
                }
              >
                <ChevronsLeft />
              </Button>
              <Button
                size="sm"
                onClick={() => handleChangePage("prev")}
                disabled={
                  pagination.pageIndex === 0 || paginationMeta.totalPages === 1
                }
              >
                <ChevronLeft />
              </Button>
              <div className="w-8 h-8 flex items-center justify-center text-sm text-white font-bold bg-[#4a81d4] rounded-full">
                {pagination.pageIndex + 1}
              </div>
              <Button
                size="sm"
                onClick={() => handleChangePage("next")}
                disabled={
                  pagination.pageIndex === paginationMeta.totalPages - 1 ||
                  paginationMeta.totalPages === 1
                }
              >
                <ChevronRight />
              </Button>
              <Button
                size="sm"
                onClick={() => handleChangePage("last")}
                disabled={
                  pagination.pageIndex === paginationMeta.totalPages - 1 ||
                  paginationMeta.totalPages === 1
                }
              >
                <ChevronsRight />
              </Button>
            </div>
            <div className="text-sm text-gray-500 flex-shrink-0 mt-2 md:mt-0 md:ml-4 text-center md:text-left w-full md:w-auto">
              총 게시물:{" "}
              <span className="font-bold text-[#4a81d4]">
                {table.getFilteredRowModel().rows.length}
              </span>
              건
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MDProductApplyStatusPage;
