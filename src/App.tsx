import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import ContactUsPage from "./pages/ContactUsPage";
import KakaoSelectUserTypePage from "./pages/auth/KakaoSelectUserTypePage";
import PartnerSignupPage from "./pages/auth/PartnerSignupPage";
import AdditionalInfoPage from "./pages/auth/AdditionalInfoPage";
import ProposalPage from "./pages/ProposalPage";
import MDProductLayout from "./pages/merchandiser";
import Toaster from "./components/Toast";
import MDProductApplyEditPage from "./pages/merchandiser/MDProductApplyEditPage";
import MDProductApplyDetailPage from "./pages/merchandiser/MDProductApplyDetailPage";
import MDProductApplyPage from "./pages/merchandiser/MDProductApplyPage";
import Layout from "./components/layout/Layout";
import MDProductApplyStatusPage from "./pages/merchandiser/MDProductApplyStatusPage";
import MDProductListMatchingPage from "./pages/merchandiser/MDProductListMatchingPage";
import MDProductListAllPage from "./pages/merchandiser/MDProductListAllPage";
import { getToken, saveToken } from "./utils/token";
import SubscriptionPage from "./pages/SubscriptionPage";
import { useUserStore } from "./stores/user";
import { useCategoryStore } from "./stores/category";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useProductStore } from "./stores/product";
import EduPage from "./pages/EduPage";
import ScrollToTop from "./pages/ScrollToTop";
import MyPageLayout from "./pages/mypage";
import MDMyPageCompanyInfo from "./pages/mypage/MDMyPageCompanyInfoPage";
import MDMyPageInquiryCreate from "./pages/mypage/MDMyPageInquiryCreatePage";
import MDMyPageInquiry from "./pages/mypage/MDMyPageInquiryPage";
import BusinessLayout from "./pages/brand";
import ProposalDocumentRegistrationPage from "./pages/brand/ProposalDocumentRegistrationPage";
import BrandChannelProposalStatusPage from "./pages/brand/BrandChannelProposalStatusPage";
import BrandChannelProposalApplyPage from "./pages/brand/BrandChannelProposalApplyPage";
import BusinessPageLayout from "./pages/brand";
import { useMyCompanyStore } from "./stores/myCompany";
import MDMyPageInquiryDetailPage from "./pages/mypage/MDMyPageInquiryDetailPage";
import MDMyPageInquiryEditPage from "./pages/mypage/MDMyPageInquiryEditPage";
import MDMyPageCompanyInfoEditPage from "./pages/mypage/MDMyPageCompanyInfoEditPage";
import BrandProductListPage from "./pages/brand/BrandProductListPage";
import ProductViewDetailPage from "./pages/product/ProductViewDetailPage";
import ProductRegisterAndEditPage from "./pages/product/ProductRegisterAndEditPage";

const notRequireAuth = [
  "/",
  "/signin",
  "/signup",
  "/change-password",
  "/subscription",
  "/contact",
];

const isPublicRoute = (pathname: string) => notRequireAuth.includes(pathname);

const RequireAuth = () => {
  const token = getToken();
  const [refresh, setRefresh] = useState(false);
  const { fetchUser } = useUserStore();
  const { fetchProductCategory, fetchProductTag } = useCategoryStore();
  const { fetchProductListAll } = useProductStore();
  const { fetchMyCompany } = useMyCompanyStore();

  useEffect(() => {
    if (!token) return; // 토큰 없으면 아무것도 하지 않음

    saveToken(token);
    const fetchData = async () => {
      await fetchUser();
      await fetchProductCategory();
      await fetchProductTag();
      await fetchProductListAll();
      await fetchMyCompany();
      setRefresh(true);
    };

    fetchData();

    // eslint-disable-next-line
  }, [token]);

  // 토큰이 없고, 인증이 필요한 경로라면 로그인 페이지로 이동
  if (!token && !isPublicRoute(window.location.pathname)) {
    return <Navigate to="/signin" replace />;
  }

  return refresh ? <Outlet /> : <></>;
};

const App = () => {
  dayjs.locale("ko");

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/edu" element={<EduPage />} />
              <Route
                path="/select-user-kakao"
                element={<KakaoSelectUserTypePage />}
              />
              <Route path="/partner-signup" element={<PartnerSignupPage />} />
              <Route path="/additional-info" element={<AdditionalInfoPage />} />
              <Route path="/proposal" element={<ProposalPage />} />
              <Route element={<MDProductLayout />}>
                <Route
                  path="/md/product/apply"
                  element={<MDProductApplyPage />}
                />
                <Route
                  path="/md/product/apply/status"
                  element={<MDProductApplyStatusPage />}
                />
                <Route
                  path="/md/product/apply/detail/:id"
                  element={<MDProductApplyDetailPage />}
                />
                <Route
                  path="/md/product/apply/edit/:id"
                  element={<MDProductApplyEditPage />}
                />
                <Route
                  path="/md/product/list/matching"
                  element={<MDProductListMatchingPage />}
                />
                <Route
                  path="/md/product/list/all"
                  element={<MDProductListAllPage />}
                />
                <Route
                  path="/md/product/view/detail/:id"
                  element={<ProductViewDetailPage />}
                />
              </Route>
              <Route element={<BusinessPageLayout />}>
                <Route
                  path="/brand/channel/proposal/status"
                  element={<BrandChannelProposalStatusPage />}
                />
                <Route
                  path="/brand/channel/proposal/apply"
                  element={<BrandChannelProposalApplyPage />}
                />
                <Route
                  path="/brand/product/list"
                  element={<BrandProductListPage />}
                />
                <Route
                  path="/brand/product/view/detail/:id"
                  element={<ProductViewDetailPage />}
                />
                <Route
                  path="/brand/product/edit/:id"
                  element={<ProductRegisterAndEditPage />}
                />
                <Route
                  path="/brand/product/register"
                  element={<ProductRegisterAndEditPage />}
                />
              </Route>
              <Route element={<MyPageLayout />}>
                <Route
                  path="/md/mypage/company"
                  element={<MDMyPageCompanyInfo />}
                />
                <Route
                  path="/md/mypage/company/edit"
                  element={<MDMyPageCompanyInfoEditPage />}
                />
                <Route
                  path="/md/mypage/inquiry"
                  element={<MDMyPageInquiry />}
                />
                <Route
                  path="/md/mypage/inquiry/new"
                  element={<MDMyPageInquiryCreate />}
                />
                <Route
                  path="/md/mypage/inquiry/detail/:id"
                  element={<MDMyPageInquiryDetailPage />}
                />
                <Route
                  path="/md/mypage/inquiry/edit/:id"
                  element={<MDMyPageInquiryEditPage />}
                />
              </Route>
            </Route>
            <Route
              path="/brand/proposal/register"
              element={<ProposalDocumentRegistrationPage />}
            />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
};

export default App;
