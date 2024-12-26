import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ClipboardList,
  LayoutGrid,
  LogOut,
  Menu,
  Search
} from "lucide-react";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import OrderList from "./OrderList";
import ServiceList from "./ServiceList";

const Dashboard = ({ role, onLogout, userName = "Admin" }) => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    onLogout();
    toast.success("Logged out successfully");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-brown-900 dark:to-black">
        <header className="bg-white dark:bg-brown-800 border-b border-orange-200 dark:border-brown-700 p-4 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => setIsSheetOpen(true)}
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open Menu</TooltipContent>
                  </Tooltip>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Button
                      onClick={() => {
                        setActiveTab("services");
                        setIsSheetOpen(false);
                      }}
                      className={`justify-start gap-2 ${
                        activeTab === "services"
                          ? "bg-orange-600 hover:bg-orange-600 text-white"
                          : "text-orange-600 hover:bg-orange-50 bg-white"
                      }`}
                    >
                      <LayoutGrid className="h-5 w-5" />
                      Manage Services
                    </Button>
                    <Button
                      onClick={() => {
                        setActiveTab("orders");
                        setIsSheetOpen(false);
                      }}
                      className={`justify-start gap-2 ${
                        activeTab === "orders"
                          ? "bg-orange-600 hover:bg-orange-600 text-white"
                          : "bg-white text-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      <ClipboardList className="h-5 w-5" />
                      Manage Orders
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-bold text-orange-600 hidden md:block">
                biteCart
              </h1>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1 max-w-xl mx-4 hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400" />
                    <Input
                      placeholder="Search services or orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Search across all services and orders
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                onClick={() =>
                  setActiveTab(activeTab === "services" ? "orders" : "services")
                }
              >
                {activeTab === "services" ? (
                  <ClipboardList className="h-4 w-4" />
                ) : (
                  <LayoutGrid className="h-4 w-4" />
                )}
                {activeTab === "services" ? "View Orders" : "View Services"}
              </Button>

              <div className="flex items-center gap-2 border-l pl-4 border-orange-200">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`}
                  />
                  <AvatarFallback>{userName[0]}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-brown-700">
                    {userName}
                  </p>
                  <p className="text-xs text-orange-500">{role}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="md:hidden mb-4">
            <Input
              placeholder="Search services or orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          <div className="transition-all duration-300 ease-in-out">
            {activeTab === "services" ? (
              <ServiceList role={role} searchTerm={searchTerm} />
            ) : (
              <OrderList role={role} searchTerm={searchTerm} />
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
