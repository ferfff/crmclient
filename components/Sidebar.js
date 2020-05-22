import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {

    // Routing
    const router = useRouter();

    return (
        <aside className="bg-red-700 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <div>
                <p className="text-white text-2xl">CRM Customers</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === '/' ? "bg-green-800 p-1" : "p-1"}>
                    <Link href="/">
                        <a className="text-white block">
                            Customers
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === '/orders' ? "bg-green-800 p-1" : "p-1"}>
                    <Link href="/orders">
                        <a className="text-white block">
                            Orders
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === '/products' ? "bg-green-800 p-1" : "p-1"}>
                    <Link href="/products">
                        <a className="text-white block">
                            Products
                        </a>
                    </Link>
                </li>
            </nav>
        </aside>    
    );
}

export default Sidebar;