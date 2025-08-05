import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { eightiesTheme } from './theme/eighties-theme'

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: 'Rick Roll Call',
    description: 'Rick Roll Call'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body>
                <ThemeProvider theme={eightiesTheme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
