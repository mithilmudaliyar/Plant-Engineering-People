import { redirect } from "next/navigation";

// Supplier + careers registration are now unified at /register.
export default function SupplierRegisterRedirect() {
  redirect("/register");
}
