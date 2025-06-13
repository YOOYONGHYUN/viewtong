import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  mediaFileControllerInitializeUpload,
  questionsControllerCreate,
  questionsControllerFindOneBy,
  questionsControllerUpdate,
} from "@/queries";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useUserStore } from "@/stores/user";
import { useNavigate, useParams } from "react-router-dom";
import { InquiryDetail } from "./MDMyPageInquiryDetailPage";
import { useMyCompanyStore } from "@/stores/myCompany";
import { useMediaMobile } from "@/lib/mediaQuery";

const MDMyPageCreateInquiryPage = () => {
  const { id } = useParams();
  const myCompany = useMyCompanyStore((state) => state.myCompany);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isMediaMobile = useMediaMobile();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    picNm:
      myCompany?.picFlNm && myCompany?.picNm
        ? `${myCompany.picFlNm}${myCompany.picNm}`
        : "",
    email: user?.email ?? "",
    message: "",
    file: null as File | null,
    imgSrc: "",
  });
  const [errors, setErrors] = useState({
    title: false,
    message: false,
  });
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    getInquiryDetail(id ?? "");
  }, []);

  const getInquiryDetail = async (id: string | undefined) => {
    try {
      const response = await questionsControllerFindOneBy(Number(id));
      if (response.data) {
        setFormData({
          title: response.data.ttl as string,
          picNm: response.data.picNm as string,
          email: response.data.picEmail as string,
          message: response.data.cn as string,
          file: null,
          //cloudfront url
          imgSrc: response.data.attchFilePathVl ?? "",
        });
      }
    } catch (error) {
      toast.error("문의 상세 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const idToStateKey: Record<string, keyof typeof formData> = {
      ttl: "title",
      cn: "message",
    };
    const stateKey = idToStateKey[id] || id;
    setFormData({
      ...formData,
      [stateKey]: value,
    });
    if (value) {
      setErrors({
        ...errors,
        [stateKey]: false,
      });
    }
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const response = await mediaFileControllerInitializeUpload({
          entityType: "question",
          fileName: e.target.files[0].name,
          mimeType: e.target.files[0].type,
          size: e.target.files[0].size,
        });

        await uploadFileToS3(e.target.files[0], response.data?.uploadUrl || "");

        setFileError(false);
        setFormData({
          ...formData,
          file: e.target.files[0],
          imgSrc: response.data?.imgSrc || "",
        });
      } catch (error) {
        toast.error("파일 업로드에 실패했습니다.");
        setFileError(true);
        setFormData({
          ...formData,
          file: null,
          imgSrc: "",
        });
      }
    } else {
      setFormData({
        ...formData,
        file: null,
        imgSrc: "",
      });
    }
  };

  const uploadFileToS3 = async (file: File, uploadUrl: string) => {
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        toast.error("파일 업로드에 실패했습니다.");
      }

      return true;
    } catch (error) {
      toast.error("파일 업로드에 실패했습니다.");
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: !formData.title,
      message: !formData.message,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleOpenDialog = () => {
    if (!validateForm()) return;
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await questionsControllerUpdate(Number(id), {
        attchFilePathVl: formData.imgSrc,
        cn: formData.message,
        picEmail: formData.email,
        picNm: formData.picNm,
        qstnTypeCd: "01",
        ttl: formData.title,
      });

      toast.success("문의 수정에 성공했습니다.");
      handleCloseDialog();
      navigate(`/md/mypage/inquiry/detail/${id}`);
    } catch (error) {
      toast.error("문의 수정에 실패했습니다.");
    }
  };

  return (
    <div className="w-full min-h-screen py-12 px-20">
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
                  <BreadcrumbLink
                    className="cursor-pointer font-normal"
                    onClick={() => navigate("/md/mypage/inquiry")}
                  >
                    1:1 문의하기
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />{" "}
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer font-normal"
                    onClick={() => navigate(`/md/mypage/inquiry/detail/${id}`)}
                  >
                    상세보기
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    수정하기
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="space-y-6">
          {/* 업체명 */}
          <div>
            <Label htmlFor="ttl" className="font-bold mb-2">
              제목
              <span className="text-red-500 mt-1">*</span>
            </Label>
            <Input
              id="ttl"
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
              className={cn(errors.title && "border-red-500")}
              placeholder="제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">제목을 입력해주세요.</p>
            )}
          </div>
          <div className="flex flex-row gap-8 w-full">
            {/* 담당자명 */}
            <div className="w-1/2">
              <Label htmlFor="picNm" className="font-bold mb-2">
                담당자명
              </Label>
              <Input
                id="picNm"
                value={formData.picNm}
                onChange={handleChange}
                placeholder="담당자명을 입력하세요"
              />
            </div>
            {/* 이메일 */}
            <div className="w-1/2">
              <Label htmlFor="picEmail" className="font-bold mb-2">
                이메일
              </Label>
              <Input
                id="picEmail"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
              />
            </div>
          </div>
          {/* 내용 */}
          <div>
            <Label htmlFor="cn" className="font-bold mb-2">
              내용<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cn"
              maxLength={2000}
              value={formData.message}
              onChange={handleChange}
              className={cn(errors.message && "border-red-500")}
              placeholder="문의 내용을 입력하세요"
              rows={5}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">내용을 입력해주세요.</p>
            )}
          </div>
          {/* 파일첨부 */}
          <div>
            <Label htmlFor="attchFile" className="font-bold mb-2">
              파일첨부 Attachment
            </Label>
            <div className="w-full flex flex-col items-start cursor-pointer">
              <Input
                id="attchFile"
                type="file"
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={handleChangeFile}
                className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0"
              />
              {fileError && (
                <p className="text-red-500 text-sm mt-1">
                  파일 업로드에 실패했습니다.
                </p>
              )}
              {formData.file && formData.file.type.startsWith("image/") && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.file)}
                    alt="첨부 이미지 미리보기"
                    className="max-h-40 rounded border"
                  />
                </div>
              )}
              {formData.file && !formData.file.type.startsWith("image/") && (
                <div className="mt-2 text-sm text-gray-600">
                  첨부파일: {formData.file.name}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
            onClick={handleOpenDialog}
          >
            수정하기
          </Button>
        </div>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="rounded-2xl p-8 max-w-xs md:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-2">
              수정하기
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 mb-6 text-base">
            입력하신 문의 내용을 수정하시겠습니까?
          </div>
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              className="w-24 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-24 bg-[#4c6aff] text-white font-semibold hover:bg-[#3751c9]"
              autoFocus
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MDMyPageCreateInquiryPage;
