import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout/Layout";
import {
  Input,
  Select,
  FileInput,
  Checkbox,
} from "@/components/common/FormElements";
import { formatCurrency } from "@/utils/formatters";

interface ProductFormData {
  category1: string;
  category2: string;
  category3: string;
  category4: string;
  brandName: string;
  productName: string;
  thumbnailImage: File | null;
  clipImage: File | null;
  additionalImage1: File | null;
  additionalImage2: File | null;
  capacity: string;
  price: string;
  proposalPrice: string;
  smallBoxQuantity: string;
  outboxQuantity: string;
  expirationDate: string;
  countryOfOrigin: string;
  containerTypes: string[];
}

const ProductRegistrationPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();
  const [categories, setCategories] = useState<any>({
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  });

  useEffect(() => {
    // TODO: API로 카테고리 데이터 로드
    // fetchCategories();
  }, []);

  const onSubmit = (data: ProductFormData) => {
    console.log(data);
    // TODO: API 호출하여 제품 등록
  };

  const containerTypeOptions = [
    { label: "Pump", value: "Pump" },
    { label: "Tube", value: "Tube" },
    { label: "Glass", value: "Glass" },
    { label: "Stick", value: "Stick" },
    { label: "Jar", value: "Jar" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 메인 정보 섹션 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6 bg-gray-50 p-2">메인 정보</h2>

          {/* 카테고리 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select
              label="1차분류"
              options={categories.level1}
              {...register("category1", { required: true })}
              error={errors.category1?.message}
            />
            <Select
              label="2차분류"
              options={categories.level2}
              {...register("category2")}
            />
            <Select
              label="3차분류"
              options={categories.level3}
              {...register("category3")}
            />
            <Select
              label="4차분류"
              options={categories.level4}
              {...register("category4")}
            />
          </div>

          {/* 브랜드명 & 상품명 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="브랜드명"
              required
              {...register("brandName", {
                required: "브랜드명을 입력해주세요",
              })}
              error={errors.brandName?.message}
            />
            <Input
              label="상품명"
              required
              {...register("productName", {
                required: "상품명을 입력해주세요",
              })}
              error={errors.productName?.message}
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">
              대표이미지
              <span className="text-gray-500 text-xs ml-2">
                권장사이즈: 1000 x 1000px
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileInput
                label="연출컷"
                required
                accept=".gif,.jpg,.png"
                {...register("thumbnailImage", {
                  required: "연출컷을 업로드해주세요",
                })}
                error={errors.thumbnailImage?.message}
              />
              <FileInput
                label="제품 누끼컷"
                required
                accept=".gif,.jpg,.png"
                {...register("clipImage", {
                  required: "제품 누끼컷을 업로드해주세요",
                })}
                error={errors.clipImage?.message}
              />
              <FileInput
                label="추가이미지1"
                accept=".gif,.jpg,.png"
                {...register("additionalImage1")}
              />
              <FileInput
                label="추가이미지2"
                accept=".gif,.jpg,.png"
                {...register("additionalImage2")}
              />
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input label="용량(ml,g)" {...register("capacity")} />
            <Input
              label="판매가(정가) VAT+"
              {...register("price")}
              onChange={(e) =>
                setValue("price", formatCurrency(e.target.value))
              }
            />
            <Input
              label="제안가(유통사 납품가VAT-)"
              {...register("proposalPrice")}
              placeholder="제안가 *추후협의"
            />
          </div>

          {/* 입수량 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="입수량[소박스]"
              {...register("smallBoxQuantity")}
              placeholder="1개의 소박스 내, 입수된 상품수"
            />
            <Input
              label="인입수량[1box 아웃박스]"
              {...register("outboxQuantity")}
              placeholder="1개의 아웃박스 내, 총 상품수"
            />
          </div>

          {/* 유통기한 */}
          <div className="mt-6">
            <Input
              label="유통기한 및 사용기한"
              required
              {...register("expirationDate", {
                required: "유통기한을 입력해주세요",
              })}
              placeholder="유통기한 : 2025.12.25, 개봉 후 사용기한 : 36개월"
              error={errors.expirationDate?.message}
            />
          </div>
        </div>

        {/* 상품 정보 섹션 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6 bg-gray-50 p-2">상품 정보</h2>

          <Input label="제조국" {...register("countryOfOrigin")} />

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              용기 형태
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border rounded-md">
              {containerTypeOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  {...register("containerTypes")}
                  value={option.value}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            제품 등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductRegistrationPage;
