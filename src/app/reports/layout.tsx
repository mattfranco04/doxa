import Sidebar from '@/components/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <div className="flex flex-1">
                <Sidebar />
                <main className="max-h-screen w-full overflow-y-hidden p-4">{children}</main>
            </div>
        </div>
    );
}
