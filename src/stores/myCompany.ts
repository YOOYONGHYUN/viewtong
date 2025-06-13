import {
  companiesControllerFindOneByUser,
  usersControllerGetSelf,
} from "@/queries";
import { ResponseCompanyDto, UserResponseDto } from "@/queries/model";
import { create } from "zustand";

interface MyCompanyStore {
  myCompany: ResponseCompanyDto | null;
  setMyCompany: (myCompany: ResponseCompanyDto) => void;
  fetchMyCompany: () => Promise<void>;
}

export const useMyCompanyStore = create<MyCompanyStore>((set) => ({
  myCompany: null,
  setMyCompany: (myCompany) => set({ myCompany }),
  fetchMyCompany: async () => {
    const myCompany = await companiesControllerFindOneByUser();
    set({ myCompany: myCompany.data });
  },
}));
