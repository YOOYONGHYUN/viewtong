import { useMediaQuery } from "react-responsive";

export const useMediaMobile = () => {
  return useMediaQuery({ query: "(max-width: 768px)" });
};

export const useMediaTablet = () => {
  return useMediaQuery({ query: "(min-width: 768px) and (max-width: 1024px)" });
};

export const useMediaDesktop = () => {
  return useMediaQuery({ query: "(min-width: 1024px)" });
};
