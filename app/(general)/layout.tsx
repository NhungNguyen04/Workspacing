export default function GeneralLayout({children}:{children:React.ReactNode}) {
    return (
        <div className="grid w-full h-screen">
        {children}
        </div>
    );
}