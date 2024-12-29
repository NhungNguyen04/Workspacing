"use client";

import { Column } from "@/types/column";
import { useState } from "react";
import { useBoardStore } from "@/store/BoardStore";
import { toast } from "react-toastify";

interface ColumnHeaderProps {
    data: Column
}

export const ColumnHeader = ({ data }: ColumnHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title);
    const { updateColumnById } = useBoardStore();

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
            const response = await fetch(`/api/columns?columnId=${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error();
            }

            toast.success("Column updated");
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

    return (
        <div className="text-sm font-semibold flex justify-between items-start- gap-x-2">
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
                <div 
                    onClick={enableEditing}
                    className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent cursor-pointer"
                >
                    {title}
                </div>
            )}
        </div>
    )
}