import { COLORS } from "@/styles/constans";
import { Toaster } from "react-hot-toast";

const Toast = () => (
  <Toaster
    toastOptions={{
      style: {
        maxWidth: "400px",
        fontWeight: "bold",
        fontSize: "16px",
        padding: "8px 20px",
        boxSizing: "border-box",
        boxShadow: "0px 16px 24px 0px #1a1e2729",
      },
      success: {
        style: {
          background: COLORS.positive2,
        },
      },
      error: {
        style: {
          background: COLORS.negative2,
        },
      },
    }}
  />
);
export default Toast;
