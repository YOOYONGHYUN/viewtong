import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInForm from "../../components/user/SignInForm";
import { authControllerSignIn, usersControllerGetSelf } from "@/queries";
import { saveToken } from "@/utils/token";
import { useUserStore } from "@/stores/user";
import toast from "react-hot-toast";
import { useCategoryStore } from "@/stores/category";
import { useProductStore } from "@/stores/product";
import { useMyCompanyStore } from "@/stores/myCompany";

const SignInPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchUser } = useUserStore();
  const { fetchProductCategory, fetchProductTag } = useCategoryStore();
  const { fetchProductListAll } = useProductStore();
  const { fetchMyCompany } = useMyCompanyStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    let token = "";
    try {
      const response = await authControllerSignIn({
        email,
        password,
      });

      if (response.accessToken) {
        saveToken(response.accessToken);
        token = response.accessToken;
      }
    } catch (error) {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    if (token) {
      try {
        await fetchUser();
        await fetchProductCategory();
        await fetchProductTag();
        await fetchProductListAll();
        await fetchMyCompany();
        navigate("/");
      } catch (error) {
        toast.error("유저 정보 조회 실패");
      }
    }
  };

  return <SignInForm onSubmit={handleSignIn} errorMessage={errorMessage} />;
};

export default SignInPage;
