import { productsControllerFindAll, usersControllerGetSelf } from "@/queries";
import { ProductResponseDto, UserResponseDto } from "@/queries/model";
import { create } from "zustand";

interface ProductStore {
  productListAll: ProductResponseDto[];
  setProductListAll: (productList: ProductResponseDto[]) => void;
  fetchProductListAll: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  productListAll: [],
  setProductListAll: (productListAll) => set({ productListAll }),
  fetchProductListAll: async () => {
    const productList = await productsControllerFindAll({
      page: 1,
      limit: 100,
    });
    set({ productListAll: productList.data });
  },
}));
