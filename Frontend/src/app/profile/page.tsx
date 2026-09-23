import type { Metadata } from "next";
import { ProfilePage } from "@/views/profile";

export const metadata: Metadata = {
  title: "Hesabım — TIK TAK",
};

export default function Page() {
  return <ProfilePage />;
}
