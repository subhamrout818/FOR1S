import { redirect } from "next/navigation";

/** Keep the legacy signup URL working while /register remains canonical. */
export default function SignupRedirectPage() {
  redirect("/register");
}
