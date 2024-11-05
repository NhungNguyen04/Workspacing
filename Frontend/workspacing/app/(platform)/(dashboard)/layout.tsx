import Navbar from '@/components/Navbar';
const DashboardLayout = ({children}: {
    children: React.ReactNode
}) => {

    return (
        <html lang="en" >
        <body >
        <header className="h-20">
            <Navbar/>
        </header>
            <main>{children}</main>
        </body>
        </html>
    )
}


export default DashboardLayout;