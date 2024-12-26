"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    if (storedEmail && storedRole) {
      onLogin(storedEmail, storedRole);
      toast.success(`Welcome back, ${storedRole}!`);
    }
  }, [onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let role;
    if (email === "bitecart@superadmin.com" && password === "password") {
      role = "superadmin";
    } else if (email === "bitecart@admin.com" && password === "password") {
      role = "admin";
    } else if (email === "bitecart@employee.com" && password === "password") {
      role = "employee";
    } else {
      setIsLoading(false);
      toast.error("Invalid email or password. Please try again.");
      return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);

    onLogin(email, role);
    setIsLoading(false);
    toast.success(`Welcome, ${role}!`);
  };

  const quickLogin = (role) => {
    const email = `bitecart@${role}.com`;
    setEmail(email);
    setPassword("password");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-orange-200 blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-center">
                <span className="text-orange-600">bite</span>
                <span className="text-orange-500">Cart</span>
                <span className="text-orange-400"> Admin</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Enter your credentials to access the dashboard
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className={cn(
                  "w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white transition-all duration-300",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.login className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
              <div className="w-full text-center text-sm text-gray-500 my-2">
                Quick Login for Demo
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => quickLogin("superadmin")}
                >
                  Superadmin
                </Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => quickLogin("admin")}
                >
                  Admin
                </Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => quickLogin("employee")}
                >
                  Employee
                </Button>
              </div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
