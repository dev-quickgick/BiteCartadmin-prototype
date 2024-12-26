import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";

export function EditDialog({ isOpen, onClose, onUpdate, item, type }) {
  const [editedItem, setEditedItem] = useState(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleSubmit = () => {
    onUpdate(type, editedItem);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-brown-900">
            Edit {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-brown-700">
              Name
            </Label>
            <Input
              id="name"
              value={editedItem?.name || ""}
              onChange={(e) =>
                setEditedItem({ ...editedItem, name: e.target.value })
              }
              className="border-orange-200 focus-visible:ring-orange-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-brown-700">
              Description
            </Label>
            <Input
              id="description"
              value={editedItem?.description || ""}
              onChange={(e) =>
                setEditedItem({ ...editedItem, description: e.target.value })
              }
              className="border-orange-200 focus-visible:ring-orange-500"
            />
          </div>
          {(type === "item" || type === "addon") && (
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-brown-700">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={editedItem?.price || ""}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    price: parseFloat(e.target.value),
                  })
                }
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </div>
          )}
          {type === "item" && (
            <div className="grid gap-2">
              <Label className="text-brown-700">Image</Label>
              <ImageUpload
                onImageUpload={(url) =>
                  setEditedItem({ ...editedItem, image: url })
                }
                existingImage={editedItem?.image}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
