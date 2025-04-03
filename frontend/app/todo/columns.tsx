"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import React from "react";

export type Todo = {
  id: number;
  name: string;
  created_at: string;
};

export const getColumns = (
  onEdit: (todo: Todo) => void,
  onDelete: (id: number) => void
): ColumnDef<Todo>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id");
      return <div className="text-sm font-medium text-gray-900">{id}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return <div className="text-sm font-medium text-gray-900">{name}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const created_at = row.getValue("created_at");
      return (
        <div className="text-sm font-medium text-gray-900">{created_at}</div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const todo = row.original;
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(todo)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
