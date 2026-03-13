import "./globals.css"

export const metadata = {
  title: "BLVE Console",
  description: "Admin console for BLVE",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
