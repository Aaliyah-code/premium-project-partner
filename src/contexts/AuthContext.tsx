import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for frontend-only auth
const DEMO_USERS = [
  { id: "1", email: "admin@hrms.com", password: "admin123", name: "Admin User", role: "Administrator" },
  { id: "2", email: "hr@hrms.com", password: "hr123", name: "HR Manager", role: "HR Manager" },
  { id: "3", email: "demo@hrms.com", password: "demo123", name: "Demo User", role: "Employee" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("hrms_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const foundUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("hrms_user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hrms_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
