// utils/withAuth.ts
import { GetServerSidePropsContext } from "next";

export const withAuth = async (context: GetServerSidePropsContext) => {
  const { req } = context;

  // Call the `/api/auth-check` endpoint
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth-check`,
    {
      method: "GET",
      headers: {
        cookie: req.headers.cookie || "", // Forward cookies from the request
      },
    }
  );

  if (response.status === 401) {
    // Redirect to login if the user is not authenticated
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const data = await response.json();

  if (data.authenticated) {
    return { user: data.user }; // Pass user details to the page
  }

  // Redirect as a fallback
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};
