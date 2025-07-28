import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User, LoginData, RegisterData } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        // For demo purposes, return a mock user if not authenticated
        const storedRole = localStorage.getItem("selectedRole");
        const storedUserName = localStorage.getItem("userName");
        
        if (storedRole) {
          return {
            id: "demo-user",
            email: "demo@sectorintelligence.ai",
            firstName: storedUserName?.split(" ")[0] || "Demo",
            lastName: storedUserName?.split(" ")[1] || "User",
            selectedRole: storedRole,
            phoneNumber: "+1-555-0123",
            emailNotifications: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        throw error;
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.clear();
    },
  });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user && !error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}