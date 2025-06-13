import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
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

interface ProductData {
  prdct_id: string;
  brand_nm: string;
  prdct_nm: string;
  add_img_path1_vl: string;
  add_img_path2_vl: string;
  cpct_vl: string;
  prdct_amt: string;
  prpsl_amt: string;
  rcv_qnt_vl: string;
  in_rcv_qnt_vl: string;
  // ... 기타 필요한 필드들
}

const ProductEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<any>({
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  });

  useEffect(() => {
    // TODO: API로 카테고리 데이터 로드
    // fetchCategories();
    // TODO: API로 제품 데이터 로드
    // fetchProductData(productId);
  }, [productId]);

  const onSubmit = (data: ProductFormData) => {
    console.log(data);
    // TODO: API 호출하여 제품 정보 수정
  };

  const handleFileRemove = (fieldName: string) => {
    setValue(fieldName as keyof ProductFormData, null);
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
          <h2 className="text-xl font-bold mb-6 bg-gray-50 p-2">상품 수정</h2>

          {/* 카테고리 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select
              label="1차분류"
              options={categories.level1}
              {...register("category1")}
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
              {...register("brandName")}
              defaultValue={productData?.brand_nm}
            />
            <Input
              label="상품명"
              {...register("productName")}
              defaultValue={productData?.prdct_nm}
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
                {...register("thumbnailImage")}
              />
              <FileInput
                label="제품 누끼컷"
                required
                accept=".gif,.jpg,.png"
                {...register("clipImage")}
              />

              {/* 추가 이미지 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가이미지1
                  <span className="text-gray-500 text-xs ml-2">
                    권장사이즈: 1000 x 1000px
                  </span>
                </label>
                {productData?.add_img_path1_vl ? (
                  <div className="flex items-center justify-between p-2 border rounded-md mb-2">
                    <span className="text-sm text-gray-600 truncate">
                      {productData.add_img_path1_vl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFileRemove("additionalImage1")}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  // <FileInput
                  //   accept=".gif,.jpg,.png"
                  //   {...register("additionalImage1")}
                  // />
                  <></>
                )}
              </div>

              {/* 추가 이미지 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가이미지2
                  <span className="text-gray-500 text-xs ml-2">
                    권장사이즈: 1000 x 1000px
                  </span>
                </label>
                {productData?.add_img_path2_vl ? (
                  <div className="flex items-center justify-between p-2 border rounded-md mb-2">
                    <span className="text-sm text-gray-600 truncate">
                      {productData.add_img_path2_vl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFileRemove("additionalImage2")}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  // <FileInput
                  //   accept=".gif,.jpg,.png"
                  //   {...register("additionalImage2")}
                  // />
                  <></>
                )}
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="용량(ml,g)"
              {...register("capacity")}
              defaultValue={productData?.cpct_vl}
            />
            <Input
              label="판매가(정가) VAT+"
              {...register("price")}
              defaultValue={productData?.prdct_amt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue("price", formatCurrency(e.target.value))
              }
            />
            <Input
              label="제안가(유통사 납품가VAT-)"
              {...register("proposalPrice")}
              defaultValue={productData?.prpsl_amt}
              placeholder="제안가 *추후협의"
            />
          </div>

          {/* 입수량 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="입수량[소박스]"
              {...register("smallBoxQuantity")}
              defaultValue={productData?.rcv_qnt_vl}
              placeholder="1개의 소박스 내, 입수된 상품수"
            />
            <Input
              label="인입수량[1box 아웃박스]"
              {...register("outboxQuantity")}
              defaultValue={productData?.in_rcv_qnt_vl}
              placeholder="1개의 아웃박스 내, 총 상품수"
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;
