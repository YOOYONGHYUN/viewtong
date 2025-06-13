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
import { Textarea } from "@/components/ui/textarea";
import { useMediaMobile } from "@/lib/mediaQuery";
import { mediaFileControllerInitializeUpload } from "@/queries";
import { useMyCompanyStore } from "@/stores/myCompany";
import { useUserStore } from "@/stores/user";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MDMyPageCompanyInfoEditPage = () => {
  const navigate = useNavigate();
  const { myCompany, setMyCompany } = useMyCompanyStore();
  const isMediaMobile = useMediaMobile();
  const [form, setForm] = useState({
    companyName: myCompany?.companyName ?? "",
    bossName: myCompany?.bossName ?? "",
    companyNumber: myCompany?.companyNumber ?? "",
    coAddr: myCompany?.coAddr ?? "",
    coTelno: myCompany?.coTelno ?? "",
    coDescCn: myCompany?.coDescCn ?? "",
    picFlNm: myCompany?.picFlNm ?? "",
    picNm: myCompany?.picNm ?? "",
    picTelno: myCompany?.picTelno ?? "",
    certSttsCd: myCompany?.certSttsCd ?? "",
    coImgPathVl: myCompany?.coImgPathVl ?? "",
    file: null as File | null,
  });
  const [fileError, setFileError] = useState(false);
  const handleClickEdit = async () => {
    try {
      //TODO 회사정보 수정 api
      navigate("/md/mypage/company");
    } catch (error) {
      toast.error("회사 정보 수정에 실패했습니다.");
    }
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const response = await mediaFileControllerInitializeUpload({
          entityType: "company",
          fileName: e.target.files[0].name,
          mimeType: e.target.files[0].type,
          size: e.target.files[0].size,
        });

        await uploadFileToS3(e.target.files[0], response.data?.uploadUrl || "");

        setForm({
          ...form,
          file: e.target.files[0],
          coImgPathVl: response.data?.imgSrc || "",
        });
        setFileError(false);
      } catch (error) {
        toast.error("파일 업로드에 실패했습니다.");
        setFileError(true);
        setForm({
          ...form,
          file: null,
          coImgPathVl: "",
        });
      }
    } else {
      setForm({
        ...form,
        file: null,
        coImgPathVl: "",
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

  const formatCompanyNumber = (num?: string) => {
    if (!num || num.length !== 10) return num || "";
    return `${num.slice(0, 3)}-${num.slice(3, 5)}-${num.slice(5)}`;
  };

  const formatPicTelno = (num?: string) => {
    if (!num || num.length !== 11) return num || "";
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };

  return (
    <div className="w-full min-h-screen py-12 px-20">
      <div className="space-y-6 bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-row justify-between items-center text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>회사 정보</span>
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
                    onClick={() => navigate("/md/mypage/company")}
                  >
                    회사 정보
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    회사 정보 수정
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 text-base gap-20">
          <div className="flex flex-col gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleChangeFile}
              className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0"
            />
            {fileError && (
              <p className="text-red-500 text-sm mt-1">
                파일 업로드에 실패했습니다.
              </p>
            )}
            {form.file && form.file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(form.file)}
                alt="회사 로고"
                className="flex-1 object-contain"
              />
            ) : form.coImgPathVl ? (
              <img
                src={form.coImgPathVl ?? ""}
                alt="회사 로고"
                className="flex-1 object-contain"
              />
            ) : (
              <div className="h-full bg-gray-200 rounded-lg flex flex-col justify-center items-center">
                <span className="text-gray-500">회사 로고 없음</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center">
              <span className="w-1/3">회사명</span>
              <span>{form.companyName}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">대표자명</span>
              <span>{form.bossName}</span>
            </div>
            <div className="flex flex-row items-center">
              <span className="w-1/3">사업자번호</span>
              <span>{formatCompanyNumber(form.companyNumber)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>회사 주소</span>
              <Input
                type="text"
                value={form.coAddr}
                onChange={(e) => setForm({ ...form, coAddr: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>회사 전화번호</span>
              <Input
                type="text"
                value={form.coTelno}
                onChange={(e) => setForm({ ...form, coTelno: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>회사 소개</span>
              <Textarea
                value={form.coDescCn}
                rows={4}
                onChange={(e) => setForm({ ...form, coDescCn: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>담당자 성별</span>
              <Input
                type="text"
                value={form.picFlNm}
                onChange={(e) => setForm({ ...form, picFlNm: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>담당자 이름</span>
              <Input
                type="text"
                value={form.picNm}
                onChange={(e) => setForm({ ...form, picNm: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span>연락처</span>
              <Input
                type="text"
                value={form.picTelno}
                onChange={(e) => setForm({ ...form, picTelno: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center !mt-20">
          <Button
            className="text-[#4a81d4] font-bold"
            onClick={handleClickEdit}
          >
            수정하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MDMyPageCompanyInfoEditPage;
