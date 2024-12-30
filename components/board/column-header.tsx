"use client";

import { Column } from "@/types/column";
import { useState } from "react";
import { useBoardStore } from "@/store/BoardStore";
import { toast } from "react-toastify";
import { updateColumnTitle, deleteColumn } from ".";
import { MoreHorizontal, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ColumnHeaderProps {
    data: Column
}

export const ColumnHeader = ({ data }: ColumnHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { updateColumnById, removeColumn } = useBoardStore();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onBlur = async () => {
        if (title === data.title) {
            disableEditing();
            return;
        }

        // Optimistically update the column title
        const originalTitle = data.title;
        updateColumnById(data.id, { ...data, title });

        try {
            const response = updateColumnTitle(data.id, title);
            if (!response) {
                throw new Error("Failed to update column");
            }
        } catch (error) {
            // Revert on failure
            updateColumnById(data.id, { ...data, title: originalTitle });
            setTitle(originalTitle);
            toast.error("Failed to update column");
        }

        disableEditing();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onBlur();
        }
        if (e.key === 'Escape') {
            setTitle(data.title);
            disableEditing();
        }
    };

    const handleDelete = async () => {
        setShowDeleteDialog(false);
        
        // Optimistically remove the column
        removeColumn(data.id);
        
        try {
            await deleteColumn(data.id);
            toast.success("Column deleted");
        } catch (error) {
            // Restore the column on failure
            const restoredColumn = { ...data };
            removeColumn(data.id, restoredColumn);
            toast.error("Failed to delete column");
        }
    };

    return (
        <>
            <div className={`text-sm font-semibold flex justify-between items-start gap-x-2 my-2
                ${(isEditing || isPopoverOpen) ? 'ring-2 ring-primary ring-offset-2 rounded-md ring-green-300' : ''}`}>
                {isEditing ? (
                    <input
                        className="w-full text-sm px-2.5 py-1 h-7 font-medium border rounded bg-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                        autoFocus
                    />
                ) : (
                    <>
                        <div 
                            onClick={enableEditing}
                            className="w-full text-md px-2.5 py-1 h-7 font-bold border-transparent cursor-pointer"
                        >
                            {title}
                        </div>
                        <Popover onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="h-auto w-auto p-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                                <div className="text-sm">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="w-full justify-start text-destructive"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Delete Column
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </>
                )}
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Column</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this column? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
                                    
    );
}