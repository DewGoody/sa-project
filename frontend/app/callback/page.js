// // pages/index.js
// "use client";
// // pages/redirect.js
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const RedirectPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const token = searchParams.get("token");
//     // Store the token (e.g., in localStorage or cookies)
//     localStorage.setItem("token", token);

//     // Redirect to the homepage
//     router.push("/services/prakan");
//   }, [searchParams.get("token")]);

//   return (
//     <div>
//       <p>Redirecting...</p>
//     </div>
//   );
// };

// export default RedirectPage;
