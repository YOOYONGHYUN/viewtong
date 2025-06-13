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
} from "@/queries";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DialogHeader } from "@/components/ui/dialog";
import { useMyCompanyStore } from "@/stores/myCompany";

const ContactUsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    phone: "",
    email: "",
    retailer: "",
    message: "",
    file: null as File | null,
    imgSrc: "",
    agreed: false,
  });
  const [errors, setErrors] = useState({
    companyName: false,
    name: false,
    phone: false,
    email: false,
    retailer: false,
    message: false,
    agreed: false,
  });
  const [fileError, setFileError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const idToStateKey: Record<string, keyof typeof formData> = {
      ttl: "companyName",
      picNm: "name",
      picTelno: "phone",
      picEmail: "email",
      chnNm: "retailer",
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      agreed: e.target.checked,
    });
    if (e.target.checked) {
      setErrors({
        ...errors,
        agreed: false,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      companyName: !formData.companyName,
      name: !formData.name,
      phone: !formData.phone,
      email: !formData.email,
      retailer: !formData.retailer,
      message: !formData.message,
      agreed: !formData.agreed,
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
      await questionsControllerCreate({
        attchFilePathVl: formData.imgSrc,
        chnNm: formData.retailer,
        cn: formData.message,
        picEmail: formData.email,
        picNm: formData.name,
        picTelno: formData.phone,
        qstnTypeCd: "02",
        ttl: formData.companyName,
      });

      setFormData({
        companyName: "",
        name: "",
        phone: "",
        email: "",
        retailer: "",
        message: "",
        file: null,
        imgSrc: "",
        agreed: false,
      });

      toast.success("문의 등록에 성공했습니다.");
      handleCloseDialog();

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }, 100);
    } catch (error) {
      toast.error("문의 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] py-10 px-2 mt-16">
      <Card className="w-full max-w-4xl rounded-2xl shadow-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary mb-1">
            CONTACT US
          </CardTitle>
          <div className="text-lg font-semibold">서비스 문의</div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 업체명 */}
          <div>
            <Label htmlFor="ttl" className="font-bold mb-2">
              업체명 / 브랜드명 Company / Brand Name
              <span className="text-red-500 mt-1">*</span>
            </Label>
            <Input
              id="ttl"
              maxLength={100}
              value={formData.companyName}
              onChange={handleChange}
              className={cn(errors.companyName && "border-red-500")}
              placeholder="업체명 또는 브랜드명을 입력하세요"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                업체명/브랜드명을 입력해주세요.
              </p>
            )}
          </div>
          {/* 담당자명 */}
          <div>
            <Label htmlFor="picNm" className="font-bold mb-2">
              담당자명 Name<span className="text-red-500 mt-1">*</span>
            </Label>
            <Input
              id="picNm"
              value={formData.name}
              onChange={handleChange}
              className={cn(errors.name && "border-red-500")}
              placeholder="담당자명을 입력하세요"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                담당자명을 입력해주세요.
              </p>
            )}
          </div>
          {/* 연락처 */}
          <div>
            <Label htmlFor="picTelno" className="font-bold mb-2">
              연락처 Phone Number<span className="text-red-500 mt-1">*</span>
            </Label>
            <Input
              id="picTelno"
              value={formData.phone}
              onChange={handleChange}
              className={cn(errors.phone && "border-red-500")}
              placeholder="연락처를 입력하세요"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                연락처를 입력해주세요.
              </p>
            )}
          </div>
          {/* 이메일 */}
          <div>
            <Label htmlFor="picEmail" className="font-bold mb-2">
              이메일 Email<span className="text-red-500 mt-1">*</span>
            </Label>
            <Input
              id="picEmail"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={cn(errors.email && "border-red-500")}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                이메일을 입력해주세요.
              </p>
            )}
          </div>
          {/* 희망 유통채널 */}
          <div>
            <Label htmlFor="chnNm" className="font-bold mb-2">
              희망 유통채널 Requested Retailer
              <span className="text-red-500 mt-1">*</span>
            </Label>
            <Textarea
              id="chnNm"
              maxLength={100}
              value={formData.retailer}
              onChange={handleChange}
              className={cn(errors.retailer && "border-red-500")}
              placeholder="희망 유통채널을 입력하세요"
              rows={3}
            />
            {errors.retailer && (
              <p className="text-red-500 text-sm mt-1">
                희망 유통채널을 입력해주세요.
              </p>
            )}
          </div>
          {/* 내용 */}
          <div>
            <Label htmlFor="cn" className="font-bold mb-2">
              내용 Message<span className="text-red-500">*</span>
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
          {/* 개인정보 동의 */}
          <div>
            <Label className="font-bold mb-2">
              개인정보 수집 및 이용 동의 Privacy Policy
              <span className="text-red-500 mt-1">*</span>
            </Label>
            <div className="border border-gray-300 h-40 overflow-y-auto p-2 rounded bg-gray-50 text-sm mb-2">
              <p className="mb-1">
                뷰통월드는 유통채널 입점 문의 처리를 위해 아래와 같이 개인정보를
                수집하며 처리 목적 달성시까지 개인정보를 보유 및 이용합니다.
              </p>
              <p className="mb-1">1. 개인정보의 수집·이용 목적</p>
              <p className="mb-1">
                회사는 수집된 개인정보를 아래와 같은 목적으로 활용합니다.
              </p>
              <p className="mb-1">- 고객문의 상담을 위하여 이용됩니다.</p>
              <p className="mb-1">2. 수집하려는 개인정보의 항목</p>
              <p className="mb-1">
                회사는 유통채널 입점 문의 처리 서비스 제공을 위해 아래와 같은
                정보를 수집합니다.
              </p>
              <p className="mb-1">- 업체명, 브랜드명, 성명, 전화번호, 이메일</p>
              <p className="mb-1">3. 개인정보의 보유 및 이용 기간</p>
              <p className="mb-1">
                회사는 이용자의 개인정보에 대해 개인정보의 수집·이용 목적이
                달성을 위한 기간동안 개인정보를 보유 및 이용합니다.
              </p>
              <p className="mb-1">4. 동의 거부 시 불이익</p>
              <p className="mb-1">
                개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 그러나
                동의를 거부할 경우 유통채널 입점 문의 서비스를 받을 수 없습니다.
              </p>
            </div>
            <div className="flex items-center mt-2">
              <Checkbox
                id="agreeContact"
                checked={formData.agreed}
                onCheckedChange={(checked) =>
                  handleCheckboxChange({
                    target: { checked } as any,
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
              <Label htmlFor="agreeContact" className="ml-2 text-sm">
                개인정보 수집 및 이용에 동의합니다.
              </Label>
            </div>
            {errors.agreed && (
              <p className="text-red-500 text-sm mt-1">
                개인정보 수집 및 이용에 동의해주세요.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center mt-4">
          <Button
            className="w-40 h-12 bg-[#4c6aff] text-white hover:bg-[#3751c9]"
            onClick={handleOpenDialog}
          >
            작성
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={openDialog}>
        <DialogContent className="rounded-2xl p-8 max-w-xs md:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-2">
              문의하기
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-600 mb-6 text-base">
            입력하신 문의 내용을 전송하시겠습니까?
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

export default ContactUsPage;
