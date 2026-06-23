import { redirect } from "next/navigation";

// Supplier + careers logins are now unified at /login.
export default function SupplierLoginRedirect() {
  redirect("/login");
}
