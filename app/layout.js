export const metadata = {
  title: "Projeto Loki",
  description: "Sistema multi-agentes Aurix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body style={{ fontFamily: "sans-serif", padding: 20 }}>
        {children}
      </body>
    </html>
  );
}
