import useSWR from "swr";
import { useState, useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type User = {
  id: string;
  name: string;
  email: string;
  type: string;
  requestedType: string | null;
  image_url?: string | null;
  first_name?: string;
  last_name?: string;
};

type Pagination = {
  limit: number;
  offset: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export function useUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  // Define pagination state
  const [pagination, setPagination] = useState<Pagination>({
    limit: 10,
    offset: 0,
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
  });

  // SWR for fetching users with pagination
  const {
    data,
    mutate,
    isLoading: isFetching,
  } = useSWR<{
    users: User[];
    pagination: Pagination;
  }>(
    `/api/admin/user?limit=${pagination.limit}&offset=${pagination.offset}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Create a new user
  const inviteUser = async (newUser: {
    email_address: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_address: newUser.email_address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSuccess(false);
        setError(errorData.error?.errors[0]?.long_message || "Failed to invite user");
        return;
      }

      setSuccess(true);

      await mutate(); // Refresh user data after creation
    } catch (err: any) {
      setSuccess(false);
      setError(err.error || "Failed to invite user");
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      await mutate(); // Refresh user data after deletion
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
      offset: (page - 1) * prev.limit,
    }));
  };

  return {
    users: data?.users,
    pagination: data?.pagination,
    isLoading: isFetching || loading,
    error,
    success,
    inviteUser,
    deleteUser,
    handlePageChange,
  };
}
