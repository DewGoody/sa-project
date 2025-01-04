import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RedirectOnBack = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handlePopState = () => {
            setLoading(true);
            router.replace('/home').finally(() => setLoading(false)); // Always redirect to "/home"
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [router]); // Dependencies must remain static and consistent

    return loading ? <div>Loading...</div> : null; // Show loading indicator if loading
};

export default RedirectOnBack;
