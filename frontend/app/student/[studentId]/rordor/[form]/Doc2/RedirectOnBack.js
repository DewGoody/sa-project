"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const RedirectOnBack = () => {
    const router = useRouter();
    const params = useParams();
    const studentId = params?.studentId;
    const reqId = params?.reqId;
    const form = params?.form;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Push dummy state so that first Back triggers popstate to same page
        history.pushState(null, "", window.location.href);

        const handlePopState = (event) => {
            setLoading(true);
            router.replace(`/student/${studentId}/rordor/${form}/0/checkData2`);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [router, studentId]);

    return loading ? <div>Loading...</div> : null;
};

export default RedirectOnBack;
