import "./globals.css";
import QueryProviders from "../Provider/QueryProviders";
import ToastProvider from "../Provider/ToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <QueryProviders>
          {children}
          <ToastProvider />
        </QueryProviders>
      </body>
    </html>
  );
}