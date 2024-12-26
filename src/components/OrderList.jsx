import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Flag,
  MessageSquare,
  Package,
  SlidersHorizontal
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {originalDummyOrders} from "../services/order";

const OrderList = ({ role }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [newNote, setNewNote] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
      
          const dummyOrders = originalDummyOrders.map((order) => ({
            ...order,
            status: "Pending",
            statusHistory: [
              {
                status: "Pending",
                timestamp: new Date().toISOString(),
                note: "Order received",
              },
            ],
          }));

          setOrders(dummyOrders);
          localStorage.setItem("orders", JSON.stringify(dummyOrders));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply priority filter
    if (selectedPriority !== "all") {
      filtered = filtered.filter(
        (order) => order.priority === selectedPriority
      );
    }

    // Apply date range filter
    if (selectedDateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        switch (selectedDateRange) {
          case "today":
            return orderDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return orderDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [
    orders,
    statusFilter,
    sortBy,
    searchTerm,
    selectedDateRange,
    selectedPriority,
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const statusUpdate = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `Status updated to ${newStatus}`,
        };
        return {
          ...order,
          status: newStatus,
          statusHistory: [...order.statusHistory, statusUpdate],
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success(`Order #${orderId} marked as ${newStatus}`);
  };

  const addOrderNote = (orderId) => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          notes: [
            ...order.notes,
            {
              text: newNote,
              timestamp: new Date().toISOString(),
              author: role,
            },
          ],
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setNewNote("");
    toast.success("Note added successfully");
  };

  const updateOrderPriority = (orderId, priority) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          priority,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success(`Order #${orderId} priority updated to ${priority}`);
  };

  const exportOrders = () => {
    const exportData = filteredOrders.map((order) => ({
      "Order ID": order.id,
      Service: order.service,
      Status: order.status,
      Priority: order.priority,
      Customer: order.customer.name,
      Room: order.customer.room,
      Total: order.total,
      Date: new Date(order.date).toLocaleString(),
      Items: order.items
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", "),
    }));

    const csv = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Orders exported successfully");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Package className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-brown-600 bg-orange-50";
    }
  };

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-brown-700">Orders</h2>
              <p className="text-orange-600/70">
                {filteredOrders.length} order
                {filteredOrders.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`flex-1 sm:flex-none justify-between px-4 ${
                  statusFilter === "Pending"
                    ? "bg-yellow-200 text-yellow-900 shadow-md hover:bg-yellow-300"
                    : "hover:bg-yellow-100 text-gray-700"
                }`}
                onClick={() =>
                  setStatusFilter(
                    statusFilter === "Pending" ? "all" : "Pending"
                  )
                }
              >
                Pending
                <Badge
                  variant="secondary"
                  className="ml-2 bg-yellow-300 text-yellow-900"
                >
                  {orders.filter((order) => order.status === "Pending").length}
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex-1 sm:flex-none justify-between px-4 ${
                  statusFilter === "In Progress"
                    ? "bg-orange-300 text-orange-900 shadow-md hover:bg-orange-400"
                    : "hover:bg-orange-100 text-gray-700"
                }`}
                onClick={() =>
                  setStatusFilter(
                    statusFilter === "In Progress" ? "all" : "In Progress"
                  )
                }
              >
                In Progress
                <Badge
                  variant="secondary"
                  className="ml-2 bg-orange-400 text-orange-900"
                >
                  {
                    orders.filter((order) => order.status === "In Progress")
                      .length
                  }
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex-1 sm:flex-none justify-between px-4 ${
                  statusFilter === "Completed"
                    ? "bg-green-200 text-green-900 shadow-md hover:bg-green-300"
                    : "hover:bg-green-100 text-gray-700"
                }`}
                onClick={() =>
                  setStatusFilter(
                    statusFilter === "Completed" ? "all" : "Completed"
                  )
                }
              >
                Completed
                <Badge
                  variant="secondary"
                  className="ml-2 bg-green-300 text-green-900"
                >
                  {
                    orders.filter((order) => order.status === "Completed")
                      .length
                  }
                </Badge>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-auto flex gap-2">
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 sm:w-[300px] border-orange-200"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                      >
                        <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Filters</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle className="text-brown-700">
                          Filter Orders
                        </SheetTitle>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select
                            value={selectedPriority}
                            onValueChange={setSelectedPriority}
                          >
                            <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Priority</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Date Range</Label>
                          <Select
                            value={selectedDateRange}
                            onValueChange={setSelectedDateRange}
                          >
                            <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                              <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="week">This Week</SelectItem>
                              <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Sort By</Label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">
                                Newest First
                              </SelectItem>
                              <SelectItem value="oldest">
                                Oldest First
                              </SelectItem>
                              <SelectItem value="highest">
                                Highest Amount
                              </SelectItem>
                              <SelectItem value="lowest">
                                Lowest Amount
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </TooltipTrigger>
                <TooltipContent>Filter and sort orders</TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                  onClick={exportOrders}
                >
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export orders as CSV file</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-orange-600/70 mb-2">No orders found</div>
            <p className="text-sm text-orange-600/50">
              {searchTerm
                ? "Try adjusting your search or filters"
                : "Orders will appear here when created"}
            </p>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden bg-white border-orange-200 hover:border-orange-300 transition-all duration-200"
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 bg-orange-50">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-semibold text-brown-700">
                      Order #{order.id}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-orange-600/70">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${
                        order.status === "Completed"
                          ? "border-green-500 text-green-600"
                          : order.status === "In Progress"
                          ? "border-orange-500 text-orange-600"
                          : "border-yellow-500 text-yellow-600"
                      }`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="grid gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-medium text-brown-700">
                          {order.customer?.name || "Guest"}
                        </div>
                        <div className="text-sm text-orange-600/70">
                          Room {order.customer?.room || "N/A"} •{" "}
                          {order.customer?.phone || "N/A"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-orange-600/70">
                          Total Amount
                        </div>
                        <div className="text-lg font-bold text-brown-700">
                          ₹{order.total}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-brown-700">
                        Items
                      </div>
                      <div className="grid gap-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm py-1 border-b border-orange-100 last:border-0"
                          >
                            <span className="text-brown-600">
                              {item.name}{" "}
                              <span className="text-orange-600/70">
                                x{item.quantity}
                              </span>
                            </span>
                            <span className="font-medium text-brown-700">
                              ₹{item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-brown-700">
                              Add Note to Order #{order.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Textarea
                              placeholder="Enter note..."
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              className="min-h-[100px] border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => addOrderNote(order.id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              Add Note
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                          >
                            <Flag className="h-4 w-4 mr-2" />
                            Set Priority
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-brown-700">
                              Set Priority for Order #{order.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Select
                              value={order.priority}
                              onValueChange={(value) =>
                                updateOrderPriority(order.id, value)
                              }
                            >
                              <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">
                                  High Priority
                                </SelectItem>
                                <SelectItem value="medium">
                                  Medium Priority
                                </SelectItem>
                                <SelectItem value="low">
                                  Low Priority
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {(role === "admin" || role === "superadmin") && (
                        <>
                          {order.status !== "In Progress" &&
                            order.status !== "Completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 sm:flex-none border-orange-500 text-orange-600 hover:bg-orange-50"
                                onClick={() =>
                                  updateOrderStatus(order.id, "In Progress")
                                }
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Mark In Progress
                              </Button>
                            )}
                          {order.status !== "Completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 sm:flex-none border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() =>
                                updateOrderStatus(order.id, "Completed")
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Completed
                            </Button>
                          )}
                        </>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-orange-600/70 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          View History & Notes
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-brown-700">
                            Order History & Notes
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-4">
                            <h4 className="font-medium text-brown-700">
                              Status History
                            </h4>
                            <div className="space-y-2">
                              {order.statusHistory.map((history, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className="h-2 w-2 mt-1.5 rounded-full bg-orange-600" />
                                  <div className="flex-1">
                                    <div className="font-medium text-brown-700">
                                      {history.status}
                                    </div>
                                    <div className="text-orange-600/70">
                                      {formatDate(history.timestamp)}
                                    </div>
                                    {history.note && (
                                      <div className="mt-1 text-orange-600/70">
                                        {history.note}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-medium text-brown-700">
                              Notes
                            </h4>
                            {order.notes.length === 0 ? (
                              <p className="text-sm text-orange-600/70">
                                No notes added yet.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {order.notes.map((note, index) => (
                                  <div
                                    key={index}
                                    className="bg-orange-50 p-3 rounded-md text-sm"
                                  >
                                    <div className="font-medium text-brown-700">
                                      {note.author}
                                    </div>
                                    <div className="text-orange-600/70">
                                      {formatDate(note.timestamp)}
                                    </div>
                                    <div className="mt-1 text-brown-600">
                                      {note.text}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};

export default OrderList;
