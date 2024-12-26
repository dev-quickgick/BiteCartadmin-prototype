import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    FolderIcon,
    FolderPlusIcon,
    LayoutGridIcon,
    PencilIcon,
    PlusCircleIcon,
    PlusIcon,
    Trash2Icon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import services from "../services/data";
import { EditDialog } from "./edit-dialog";
import ImageUpload from "./ImageUpload";

const ButtonGroup = ({ children, className }) => {
  return (
    <div
      className={cn(
        "absolute top-3 right-3 flex gap-1 p-1 rounded-lg bg-white backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

const IconButton = ({ icon: Icon, onClick, variant = "default" }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 hover:scale-105 transition-transform",
        variant === "danger" && "hover:text-red-500",
        variant === "default" && "hover:text-blue-500"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

const ServiceList = ({ role, searchTerm }) => {
  const [localServices, setLocalServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
  });
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });
  const [newAddon, setNewAddon] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingAddon, setIsAddingAddon] = useState(false);
  const [view, setView] = useState("services");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setLocalServices(JSON.parse(storedServices));
    } else {
      setLocalServices(services);
      localStorage.setItem("services", JSON.stringify(services));
    }
  }, []);

  const getCurrentService = () => {
    return localServices.find((service) => service.id === selectedService);
  };

  const getCurrentSubCategory = () => {
    const service = getCurrentService();
    return service?.subCategories.find((sub) => sub.id === selectedSubCategory);
  };

  const handleBack = () => {
    if (view === "items") {
      setView("subcategories");
      setSelectedSubCategory(null);
    } else if (view === "subcategories") {
      setView("services");
      setSelectedService(null);
    }
  };

  const handleAddService = () => {
    if (!newService.name) {
      toast.error("Please enter a service name");
      return;
    }

    const newServiceObj = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      subCategories: [],
    };

    setLocalServices([...localServices, newServiceObj]);
    localStorage.setItem(
      "services",
      JSON.stringify([...localServices, newServiceObj])
    );
    setNewService({ name: "", description: "" });
    setIsAddingService(false);
    toast.success("Service added successfully!");
  };

  const handleAddSubCategory = () => {
    if (!newSubCategory.name) {
      toast.error("Please enter a subcategory name");
      return;
    }

    const updatedServices = localServices.map((service) => {
      if (service.id === selectedService) {
        return {
          ...service,
          subCategories: [
            ...service.subCategories,
            {
              id: Date.now().toString(),
              name: newSubCategory.name,
              description: newSubCategory.description,
              items: [],
              addons: [],
            },
          ],
        };
      }
      return service;
    });

    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    setNewSubCategory({ name: "", description: "" });
    setIsAddingSubCategory(false);
    toast.success("Subcategory added successfully!");
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.image) {
      toast.error("Please fill all required fields");
      return;
    }

    const updatedServices = localServices.map((service) => {
      if (service.id === selectedService) {
        return {
          ...service,
          subCategories: service.subCategories.map((subCat) => {
            if (subCat.id === selectedSubCategory) {
              return {
                ...subCat,
                items: [
                  ...subCat.items,
                  {
                    id: Date.now().toString(),
                    ...newItem,
                    price: parseFloat(newItem.price),
                  },
                ],
              };
            }
            return subCat;
          }),
        };
      }
      return service;
    });

    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    setNewItem({ name: "", price: "", image: "", description: "" });
    setIsAddingItem(false);
    toast.success("Item added successfully!");
  };

  const handleAddAddon = () => {
    if (!newAddon.name || !newAddon.price) {
      toast.error("Please fill all required fields");
      return;
    }

    const updatedServices = localServices.map((service) => {
      if (service.id === selectedService) {
        return {
          ...service,
          subCategories: service.subCategories.map((subCat) => {
            if (subCat.id === selectedSubCategory) {
              return {
                ...subCat,
                addons: [
                  ...subCat.addons,
                  {
                    id: Date.now().toString(),
                    ...newAddon,
                    price: parseFloat(newAddon.price),
                  },
                ],
              };
            }
            return subCat;
          }),
        };
      }
      return service;
    });

    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    setNewAddon({ name: "", price: "", description: "" });
    setIsAddingAddon(false);
    toast.success("Add-on added successfully!");
  };

  const handleDeleteService = (serviceId) => {
    const updatedServices = localServices.filter(
      (service) => service.id !== serviceId
    );
    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    toast.success("Service deleted successfully!");
  };

  const handleDeleteSubCategory = (serviceId, subCategoryId) => {
    const updatedServices = localServices.map((service) => {
      if (service.id === serviceId) {
        return {
          ...service,
          subCategories: service.subCategories.filter(
            (sub) => sub.id !== subCategoryId
          ),
        };
      }
      return service;
    });
    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    toast.success("Subcategory deleted successfully!");
  };

  const handleDeleteItem = (serviceId, subCategoryId, itemId) => {
    const updatedServices = localServices.map((service) => {
      if (service.id === serviceId) {
        return {
          ...service,
          subCategories: service.subCategories.map((subCat) => {
            if (subCat.id === subCategoryId) {
              return {
                ...subCat,
                items: subCat.items.filter((item) => item.id !== itemId),
              };
            }
            return subCat;
          }),
        };
      }
      return service;
    });
    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    toast.success("Item deleted successfully!");
  };

  const handleDeleteAddon = (serviceId, subCategoryId, addonId) => {
    const updatedServices = localServices.map((service) => {
      if (service.id === serviceId) {
        return {
          ...service,
          subCategories: service.subCategories.map((subCat) => {
            if (subCat.id === subCategoryId) {
              return {
                ...subCat,
                addons: subCat.addons.filter((addon) => addon.id !== addonId),
              };
            }
            return subCat;
          }),
        };
      }
      return service;
    });
    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    toast.success("Add-on deleted successfully!");
  };

  const handleUpdate = (type, updatedItem) => {
    const updatedServices = localServices.map((service) => {
      if (type === "service" && service.id === updatedItem.id) {
        return { ...service, ...updatedItem };
      } else if (type === "subcategory" && service.id === selectedService) {
        return {
          ...service,
          subCategories: service.subCategories.map((sub) =>
            sub.id === updatedItem.id ? { ...sub, ...updatedItem } : sub
          ),
        };
      } else if (
        (type === "item" || type === "addon") &&
        service.id === selectedService
      ) {
        return {
          ...service,
          subCategories: service.subCategories.map((sub) => {
            if (sub.id === selectedSubCategory) {
              if (type === "item") {
                return {
                  ...sub,
                  items: sub.items.map((item) =>
                    item.id === updatedItem.id
                      ? { ...item, ...updatedItem }
                      : item
                  ),
                };
              } else {
                return {
                  ...sub,
                  addons: sub.addons.map((addon) =>
                    addon.id === updatedItem.id
                      ? { ...addon, ...updatedItem }
                      : addon
                  ),
                };
              }
            }
            return sub;
          }),
        };
      }
      return service;
    });

    setLocalServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
    setIsEditing(false);
    setEditingItem(null);
    toast.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`
    );
  };

  const filteredServices = localServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  const renderNavigation = () => {
    const currentService = getCurrentService();
    const currentSubCategory = getCurrentSubCategory();

    return (
      <div className="flex items-center gap-2 mb-6 text-brown-700">
        <div className="flex items-center gap-3 text-lg">
          {view !== "services" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 text-brown-700 hover:text-brown-900 hover:bg-orange-100 px-0"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </Button>
              <span className="text-orange-400">/</span>
            </>
          )}
          {view === "subcategories" && (
            <span className="text-sm font-medium">{currentService?.name}</span>
          )}
          {view === "items" && (
            <>
              <span className="text-sm font-medium">
                {currentService?.name}
              </span>
              <span className="text-orange-400">/</span>
              <span className="text-sm font-medium">
                {currentSubCategory?.name}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderServices = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredServices.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-brown-600 mb-2">No services found</div>
          <p className="text-sm text-orange-500">
            {searchTerm
              ? "Try adjusting your search"
              : "Start by adding a service category"}
          </p>
        </div>
      )}
      {filteredServices.map((service) => (
        <Card
          key={service.id}
          className="relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-orange-200 hover:border-orange-300 group"
          onClick={() => {
            setSelectedService(service.id);
            setView("subcategories");
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors">
                <FolderIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-brown-800 group-hover:text-orange-700 transition-colors">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-sm text-brown-600">
                    {service.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-brown-600">
              <span>{service.subCategories.length}</span>
              <span>categories</span>
            </div>
            {(role === "admin" || role === "superadmin") && (
              <ButtonGroup>
                <IconButton
                  icon={PencilIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setEditingItem(service);
                  }}
                />
                <IconButton
                  icon={Trash2Icon}
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteService(service.id);
                  }}
                />
              </ButtonGroup>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSubCategories = () => {
    const service = getCurrentService();
    if (!service) return null;

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {service.subCategories.map((subCategory) => (
          <Card
            key={subCategory.id}
            className="relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-orange-200 hover:border-orange-300 group"
            onClick={() => {
              setSelectedSubCategory(subCategory.id);
              setView("items");
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <LayoutGridIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-brown-800 group-hover:text-orange-700 transition-colors">
                    {subCategory.name}
                  </h3>
                  {subCategory.description && (
                    <p className="text-sm text-brown-600">
                      {subCategory.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-4 text-sm text-brown-600">
                <div className="flex items-center gap-2">
                  <span>{subCategory.items.length}</span>
                  <span>items</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{subCategory.addons?.length || 0}</span>
                  <span>add-ons</span>
                </div>
              </div>
              {(role === "admin" || role === "superadmin") && (
                <ButtonGroup>
                  <IconButton
                    icon={PencilIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setEditingItem(subCategory);
                    }}
                  />
                  <IconButton
                    icon={Trash2Icon}
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubCategory(service.id, subCategory.id);
                    }}
                  />
                </ButtonGroup>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderItems = () => {
    const subCategory = getCurrentSubCategory();
    if (!subCategory) return null;

    return (
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="mb-6 bg-orange-100/50 p-1">
          <TabsTrigger
            value="items"
            className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
          >
            Items
          </TabsTrigger>
          <TabsTrigger
            value="addons"
            className="data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
          >
            Add-ons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subCategory.items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden relative bg-white border-orange-200 group hover:border-orange-300"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {(role === "admin" || role === "superadmin") && (
                    <ButtonGroup>
                      <IconButton
                        icon={PencilIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setEditingItem(item);
                        }}
                      />
                      <IconButton
                        icon={Trash2Icon}
                        variant="danger"
                        onClick={() =>
                          handleDeleteItem(
                            selectedService,
                            selectedSubCategory,
                            item.id
                          )
                        }
                      />
                    </ButtonGroup>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg text-brown-800 group-hover:text-orange-700 transition-colors">
                      {item.name}
                    </h4>
                    <p className="font-bold text-orange-600">₹{item.price}</p>
                  </div>
                  <p className="text-sm text-brown-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="addons">
          <div className="space-y-3">
            {subCategory.addons?.map((addon) => (
              <Card
                key={addon.id}
                className="overflow-hidden bg-white border-orange-200 hover:border-orange-300 group relative"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-brown-800 group-hover:text-orange-700 transition-colors">
                        {addon.name}
                      </h4>
                      <p className="text-sm text-brown-600">
                        {addon.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-orange-600">
                        ₹{addon.price}
                      </span>
                      {(role === "admin" || role === "superadmin") && (
                        <ButtonGroup className="!relative !top-0 !right-0 !bg-transparent">
                          <IconButton
                            icon={PencilIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditing(true);
                              setEditingItem(addon);
                            }}
                          />
                          <IconButton
                            icon={Trash2Icon}
                            variant="danger"
                            onClick={() =>
                              handleDeleteAddon(
                                selectedService,
                                selectedSubCategory,
                                addon.id
                              )
                            }
                          />
                        </ButtonGroup>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-8xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">
            {view === "services" && "Categories"}
            {view === "subcategories" && "Categories"}
            {view === "items" && "Items & Add-ons"}
          </h1>
          {renderNavigation()}
        </div>

        {(role === "admin" || role === "superadmin") && (
          <div className="flex flex-wrap gap-3">
            {view === "services" && (
              <Button
                onClick={() => setIsAddingService(true)}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
              >
                <FolderPlusIcon className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            )}
            {view === "subcategories" && (
              <Button
                onClick={() => setIsAddingSubCategory(true)}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Subcategory
              </Button>
            )}
            {view === "items" && (
              <>
                <Button
                  onClick={() => setIsAddingItem(true)}
                  className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                <Button
                  onClick={() => setIsAddingAddon(true)}
                  className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Add Add-on
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="transition-all duration-300">
        {view === "services" && renderServices()}
        {view === "subcategories" && renderSubCategories()}
        {view === "items" && renderItems()}
      </div>

      <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-brown-900">
              Add New Category
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceName" className="text-brown-700">
                Name
              </Label>
              <Input
                id="serviceName"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                placeholder="Enter category name"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="serviceDescription" className="text-brown-700">
                Description
              </Label>
              <Input
                id="serviceDescription"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
                placeholder="Enter category description"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingService(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddService}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingSubCategory} onOpenChange={setIsAddingSubCategory}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-brown-900">
              Add New Category
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subCategoryName" className="text-brown-700">
                Name
              </Label>
              <Input
                id="subCategoryName"
                value={newSubCategory.name}
                onChange={(e) =>
                  setNewSubCategory({ ...newSubCategory, name: e.target.value })
                }
                placeholder="Enter category name"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="subCategoryDescription"
                className="text-brown-700"
              >
                Description
              </Label>
              <Input
                id="subCategoryDescription"
                value={newSubCategory.description}
                onChange={(e) =>
                  setNewSubCategory({
                    ...newSubCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Enter category description"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingSubCategory(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubCategory}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-brown-900">Add New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="itemName" className="text-brown-700">
                Name
              </Label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                placeholder="Enter item name"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemDescription" className="text-brown-700">
                Description
              </Label>
              <Input
                id="itemDescription"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder="Enter item description"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemPrice" className="text-brown-700">
                Price
              </Label>
              <Input
                id="itemPrice"
                type="number"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                placeholder="Enter item price"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-brown-700">Image</Label>
              <ImageUpload
                onImageUpload={(url) => setNewItem({ ...newItem, image: url })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingItem(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingAddon} onOpenChange={setIsAddingAddon}>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-brown-900">Add New Add-on</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="addonName" className="text-brown-700">
                Name
              </Label>
              <Input
                id="addonName"
                value={newAddon.name}
                onChange={(e) =>
                  setNewAddon({ ...newAddon, name: e.target.value })
                }
                placeholder="Enter add-on name"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addonDescription" className="text-brown-700">
                Description
              </Label>
              <Input
                id="addonDescription"
                value={newAddon.description}
                onChange={(e) =>
                  setNewAddon({ ...newAddon, description: e.target.value })
                }
                placeholder="Enter add-on description"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addonPrice" className="text-brown-700">
                Price
              </Label>
              <Input
                id="addonPrice"
                type="number"
                value={newAddon.price}
                onChange={(e) =>
                  setNewAddon({ ...newAddon, price: e.target.value })
                }
                placeholder="Enter add-on price"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAddon(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAddon}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add Add-on
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <EditDialog
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setEditingItem(null);
        }}
        onUpdate={handleUpdate}
        item={editingItem}
        type={
          view === "services"
            ? "service"
            : view === "subcategories"
            ? "subcategory"
            : view === "items"
            ? editingItem?.image !== undefined
              ? "item"
              : "addon"
            : "addon"
        }
      />
    </div>
  );
};

export default ServiceList;
