import { useEffect, useState } from "react";
import { useRouter,useParams } from "next/navigation";

const RedirectOnBack = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {token} = useParams();

    useEffect(() => {
        const handlePopState = () => {
            setLoading(true);
            router.replace(`/student/${token}/home`).finally(() => setLoading(false)); // Always redirect to "/home"
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [router]); // Dependencies must remain static and consistent

    return loading ? <div>Loading...</div> : null; // Show loading indicator if loading
};

export default RedirectOnBack;
