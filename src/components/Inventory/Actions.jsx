"use client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
const Actions = ({ data, setShowSuccess, setShowError, setFoodItems }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-row justify-between items-center mt-2 gap-2">
        <Button
          aria-label="updateEntry"
          className="font-semibold font-mono bg-amber-400 text-gray-900 cursor-pointer hover:bg-amber-500 transition-colors"
          onClick={() => {
            router.push(`/inventory/edit?editId=${data._id || data.id}`);
          }}
        >
          Edit
        </Button>

        <AlertDialog >
          <AlertDialogTrigger asChild>
            <Button
              className="font-semibold font-mono bg-red-400 text-gray-900  cursor-pointer hover:bg-red-500 transition-colors"
              aria-label="deleteEntry"
            >
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm" className="z-999">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                item and it's all detail from servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/delete/${data._id || data.id}`,
                    {
                      method: "DELETE",
                    },
                  )
                    .then((response) => {
                      if (response.ok) {
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 2000);
                        setFoodItems((prev) =>
                          prev.filter(
                            (item) =>
                              item._id !== data._id && item.id !== data.id,
                          ),
                        );
                      } else {
                        setShowError(true);
                        setTimeout(() => setShowError(false), 2000);
                      }
                    })
                    .catch((error) => {
                      console.error("Error deleting item:", error);
                      setShowError(true);
                      setTimeout(() => setShowError(false), 2000);
                    });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Actions;
