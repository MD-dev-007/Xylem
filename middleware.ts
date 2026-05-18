export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin",
    "/admin/products/:path*",
    "/admin/leads/:path*",
    "/admin/portfolio/:path*",
    "/admin/settings/:path*",
    "/admin/dashboard/:path*"
  ]
};
