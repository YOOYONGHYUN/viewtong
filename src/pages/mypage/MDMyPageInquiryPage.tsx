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
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { alpha, CircularProgress, Tooltip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  questionsControllerDelete,
  questionsControllerFindAll,
  sourcingControllerFindAll,
} from "@/queries";
import { GenericResponseData, PaginationResponseDto } from "@/queries/model";
import toast from "react-hot-toast";
import { useMediaMobile } from "@/lib/mediaQuery";

// 문의 데이터의 사용자 정보 타입
type InquiryUser = {
  email: string;
  id: number;
  isActive: boolean;
  isAdmin: boolean;
  isSuperuser: boolean;
  joinDate: string;
  lastLogin: string | null;
  mbrSeCd: string;
};

// 문의 데이터 타입
type InquiryData = {
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
  user: InquiryUser;
  userId: number;
};

// 페이지네이션 정보 타입
type PaginationMeta = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

// 전체 응답 타입
type InquiryListResponse = {
  data: InquiryData[];
  metadata: {
    pagination: PaginationMeta;
  };
};

const getColumns = (
  handleNavigate: (path: string) => void
): ColumnDef<InquiryData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          if (value) {
            // "03"이 아닌 row만 선택
            const selectableRowIds = table
              .getRowModel()
              .rows.filter((row) => row.original.ansYn === "N")
              .map((row) => row.id);

            table.setRowSelection(
              Object.fromEntries(selectableRowIds.map((id) => [id, true]))
            );
          } else {
            // 전체 해제
            table.setRowSelection({});
          }
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
    accessorKey: "ttl",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            문의제목
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <Tooltip
        title="문의 상세보기"
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
            handleNavigate(`/md/mypage/inquiry/detail/${row.original.id}`)
          }
        >
          {row.getValue("ttl")}
        </div>
      </Tooltip>
    ),
  },
  {
    accessorKey: "ansYn",
    header: ({ column }) => {
      return (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            답변여부
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("ansYn") === "Y" ? "답변완료" : "답변대기"}
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
            등록일
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {dayjs(row.getValue("mdfcnDt")).format("YYYY년 MM월 DD일 a h시 mm분")}
      </div>
    ),
  },
];

const MDMyPageInquiryPage = () => {
  const navigate = useNavigate();
  const isMediaMobile = useMediaMobile();
  const [render, setRender] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
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
  const [inquiryDatas, setInquiryDatas] = useState<InquiryData[]>([]);

  useEffect(() => {
    getInquiryDatas();
  }, []);

  const getInquiryDatas = async () => {
    try {
      const data = await questionsControllerFindAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });
      setInquiryDatas(
        (data.data as unknown as InquiryData[]).filter(
          (item: InquiryData) => item.qstnTypeCd === "01"
        ) ?? []
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

  const handleNavigate = (path: string) => {
    navigate(path);
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

  const handleDeleteInquiry = async () => {
    try {
      const selectedRowsIds = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);

      await Promise.all(
        selectedRowsIds.map((id) => questionsControllerDelete(id))
      );
      toast.success("문의 삭제에 성공했습니다.");

      getInquiryDatas();
    } catch (error) {
      toast.error("문의 삭제에 실패했습니다.");
    }
  };

  const handleNewInquiry = () => {
    navigate("/md/mypage/inquiry/new");
  };

  const columns = getColumns(handleNavigate);

  const table = useReactTable({
    data: inquiryDatas,
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
        <div className="flex flex-row justify-between items-center text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>1:1 문의하기</span>
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
                    1:1 문의하기
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="w-full">
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
        <div className="flex flex-row justify-end gap-2">
          <Button
            variant="outline"
            className="bg-red-500 border-red-500 text-white hover:bg-red-600"
            onClick={handleDeleteInquiry}
          >
            삭제하기
          </Button>
          <Button
            variant="outline"
            className="bg-blue-500 border-blue-500 text-white  hover:bg-blue-600"
            onClick={handleNewInquiry}
          >
            새로 문의하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MDMyPageInquiryPage;
