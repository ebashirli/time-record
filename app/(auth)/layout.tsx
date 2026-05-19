// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Kolin Construction | SPP2 Project",
//   description: "SPP2 Project",
// };

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
