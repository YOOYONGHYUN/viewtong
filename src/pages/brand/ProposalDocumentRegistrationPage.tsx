import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentFormData {
  proposalChannelName: string;
  proposalChannelDate: string;
  mainColor: string;
  font: string;
  logo: File | null;
  relatedImage: File | null;
  companyLogo: File | null;
  business: string;
  companyName: string;
  ceo: string;
  companyDate: string;
}

const fontOptions = [
  { label: "기본", value: "Arial" },
  { label: "맑은 고딕", value: "Malgun Gothic" },
  { label: "굴림", value: "굴림" },
  { label: "궁서", value: "궁서" },
  { label: "돋움", value: "돋움" },
  { label: "바탕", value: "바탕" },
];

interface CoverSectionProps {
  watch: ReturnType<typeof useForm<DocumentFormData>>["watch"];
  setValue: ReturnType<typeof useForm<DocumentFormData>>["setValue"];
  register: ReturnType<typeof useForm<DocumentFormData>>["register"];
  errors: ReturnType<typeof useForm<DocumentFormData>>["formState"]["errors"];
}

const CoverSection = ({
  watch,
  setValue,
  register,
  errors,
}: CoverSectionProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // 로고 업로드
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue("logo", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  // 로고 삭제
  const handleLogoDelete = () => {
    setValue("logo", null);
    setLogoPreview(null);
  };

  return (
    <section className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">표지</h2>
        <span className="text-gray-500">0-1/6</span>
      </div>
      <div className="flex flex-col gap-6">
        {/* 메인색상 */}
        <div>
          <Label className="block text-sm font-medium mb-1">메인색상</Label>
          <Input
            type="color"
            className="w-full"
            {...register("mainColor")}
            defaultValue="#7eb3e7"
            onChange={(e) => {
              setValue("mainColor", e.target.value);
            }}
          />
        </div>
        {/* 폰트 */}
        <div>
          <Label className="block text-sm font-medium mb-1">폰트</Label>
          <Select
            value={watch("font")}
            onValueChange={(value) => setValue("font", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="폰트 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {fontOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* 로고 업로드/삭제 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">Logo 입력</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogoDelete}
              disabled={!logoPreview}
            >
              삭제
            </Button>
          </div>
          <Input type="file" accept="image/*" onChange={handleLogoChange} />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="로고 미리보기"
              className="mt-2 h-16 object-contain"
            />
          )}
        </div>
        {/* 제안채널명 */}
        <div>
          <label className="block text-sm font-medium mb-1">제안채널명</label>
          <Input
            placeholder="제안채널명을 입력하세요"
            {...register("proposalChannelName", {
              required: "제안채널명을 입력해주세요",
            })}
            aria-invalid={!!errors.proposalChannelName}
          />
          {errors.proposalChannelName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.proposalChannelName.message}
            </p>
          )}
        </div>
        {/* 날짜 */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            {...register("proposalChannelDate", {
              required: "날짜를 선택해주세요",
            })}
            aria-invalid={!!errors.proposalChannelDate}
          />
           
          {errors.proposalChannelDate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.proposalChannelDate.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

// 목차(TocSection) 섹션 추가
interface TocSectionProps {
  watch: ReturnType<typeof useForm<DocumentFormData>>["watch"];
  setValue: ReturnType<typeof useForm<DocumentFormData>>["setValue"];
  register: ReturnType<typeof useForm<DocumentFormData>>["register"];
  errors: ReturnType<typeof useForm<DocumentFormData>>["formState"]["errors"];
}

const TocSection = ({ watch, setValue, register, errors }: TocSectionProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 이미지 업로드
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue("relatedImage", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // 이미지 삭제
  const handleImageDelete = () => {
    setValue("relatedImage", null);
    setImagePreview(null);
  };

  return (
    <section className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">목차</h2>
      </div>
      <div className="flex flex-col gap-6">
        {/* 관련 이미지 업로드/삭제 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">관련 이미지</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImageDelete}
              disabled={!imagePreview}
            >
              삭제
            </Button>
          </div>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="관련 이미지 미리보기"
              className="mt-2 h-32 object-contain"
            />
          )}
        </div>
      </div>
    </section>
  );
};

const ProposalDocumentRegistrationPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(6);
  const form = useForm<DocumentFormData>({
    defaultValues: {
      mainColor: "#7eb3e7",
      font: "Arial",
      proposalChannelName: "",
      proposalChannelDate: "",
      logo: null,
      relatedImage: null,
      companyLogo: null,
      business: "",
    },
  });

  const handleChangePage = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onSubmit = (data: DocumentFormData) => {
    console.log(data);
    // TODO: API 호출하여 문서 등록
  };

  // 미리보기 값
  const mainColor = form.watch("mainColor");
  const selectedFont = form.watch("font");
  const logo = form.watch("logo");
  const proposalChannelName = form.watch("proposalChannelName");
  const proposalChannelDate = form.watch("proposalChannelDate");
  const relatedImage = form.watch("relatedImage");

  return (
    <div className="flex bg-gray-50 h-screen">
      {/* 사이드바 */}
      <div className="w-96 bg-gray-200 p-4">
        <Select
          value={currentPage.toString()}
          onValueChange={(value) => setCurrentPage(parseInt(value))}
        >
          <SelectTrigger className="w-full bg-white text-black">
            <SelectValue placeholder="페이지 선택" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            <SelectItem value="1">표지</SelectItem>
            <SelectItem value="2">목차</SelectItem>
            <SelectItem value="3">본문</SelectItem>
            <SelectItem value="4">참고자료</SelectItem>
          </SelectContent>
        </Select>
        {currentPage === 1 && (
          <CoverSection
            watch={form.watch}
            setValue={form.setValue}
            register={form.register}
            errors={form.formState.errors}
          />
        )}
        {currentPage === 2 && (
          <TocSection
            watch={form.watch}
            setValue={form.setValue}
            register={form.register}
            errors={form.formState.errors}
          />
        )}
      </div>

      {/* 미리보기 영역 */}
      <div className="flex-1 p-8">
        <div className="h-full bg-white rounded-lg shadow-lg p-8 ">
          {/* TODO: 문서 미리보기 구현 */}
          {currentPage === 1 && (
            <div
              style={{ fontFamily: selectedFont }}
              className="h-full flex flex-col gap-20 items-center justify-center"
            >
              {logo ? (
                <img
                  src={URL.createObjectURL(logo)}
                  alt="로고"
                  className="h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 bg-gray-200 rounded-lg" />
              )}

              <div className="w-full flex flex-col gap-4 items-center">
                <Input
                  type="text"
                  className="w-1/2 h-12 text-center md:text-3xl font-bold border-transparent"
                  value={proposalChannelName}
                  onChange={(e) =>
                    form.setValue("proposalChannelName", e.target.value)
                  }
                  placeholder="제안 채널을 입력해주세요"
                />
                <Input
                  type="text"
                  className="w-1/2 h-12 text-center md:text-3xl font-bold border-transparent"
                  value={proposalChannelDate}
                  onChange={(e) =>
                    form.setValue("proposalChannelDate", e.target.value)
                  }
                  placeholder="제안 날짜를 입력해주세요"
                />
              </div>
            </div>
          )}
          {currentPage === 2 && (
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
              <div style={{ fontFamily: selectedFont }}>
                <h1 className="text-3xl font-bold mb-8">목차</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDocumentRegistrationPage;
