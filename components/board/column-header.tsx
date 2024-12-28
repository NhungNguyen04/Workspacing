"use client";

import { Column } from "@/types/column";

interface ColumnHeaderProps {
    data: Column
}

export const ColumnHeader = ({ data }: ColumnHeaderProps) => {
    return (
        <div className="text-sm font-semibold flex justify-between items-start- gap-x-2">
            <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
            {data.title}
            </div>
        </div>
    )
}