import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <footer className="py-1">
      <p
        className="text-center text-light mt-1"
        style={{ backgroundColor: `${isAdmin ? "#232f3e" : "#fff"}` }}
      >
        JVLcart - 2022-2023, All Rights Reserved
      </p>
    </footer>
  );
}
