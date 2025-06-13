import { categoryControllerFindAll } from "@/queries";
import { CategoryResponseDto } from "@/queries/model";
import { create } from "zustand";

interface CategoryStore {
  productCategory: CategoryResponseDto[];
  productTag: CategoryResponseDto[];
  setProductCategory: (productCategory: CategoryResponseDto[]) => void;
  setProductTag: (productTag: CategoryResponseDto[]) => void;
  fetchProductCategory: () => Promise<void>;
  fetchProductTag: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  productCategory: [],
  productTag: [],
  setProductCategory: (productCategory: CategoryResponseDto[]) =>
    set({ productCategory }),
  setProductTag: (productTag: CategoryResponseDto[]) => set({ productTag }),
  fetchProductCategory: async () => {
    const data = await categoryControllerFindAll({
      page: 1,
      limit: 1000,
      cdClsfNm: "category",
    });
    set({ productCategory: data.data });
  },
  fetchProductTag: async () => {
    const data = await categoryControllerFindAll({
      page: 1,
      limit: 1000,
      cdClsfNm: "tag",
    });
    set({ productTag: data.data });
  },
}));
