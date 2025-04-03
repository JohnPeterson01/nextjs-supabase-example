"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getColumns, Todo } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

export default function TodoManager() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [nameInput, setNameInput] = useState("");

  const supabase = createClient();

  // Fetch todos from Supabase
  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todo")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data ?? []);
    }
  }

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open modal for creating a new todo
  function handleCreate() {
    setEditingTodo(null);
    setNameInput("");
    setModalOpen(true);
  }

  // Open modal for editing a todo
  function handleEdit(todo: Todo) {
    setEditingTodo(todo);
    setNameInput(todo.name);
    setModalOpen(true);
  }

  // Delete a todo
  async function handleDelete(id: number) {
    const { error } = await supabase.from("todo").delete().eq("id", id);
    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      fetchTodos();
    }
  }

  // Save (create or update) a todo
  async function handleSave() {
    if (nameInput.trim() === "") return;

    if (editingTodo) {
      // Update existing todo
      const { error } = await supabase
        .from("todo")
        .update({ name: nameInput })
        .eq("id", editingTodo.id);
      if (error) {
        console.error("Error updating todo:", error);
      }
    } else {
      // Create new todo
      const { error } = await supabase.from("todo").insert({ name: nameInput });
      if (error) {
        console.error("Error creating todo:", error);
      }
    }
    setModalOpen(false);
    fetchTodos();
  }

  // Get columns with edit and delete handlers bound
  const columns = getColumns(handleEdit, handleDelete);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <Button onClick={handleCreate}>New Todo</Button>
      </div>
      <DataTable columns={columns} data={todos} />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTodo ? "Edit Todo" : "New Todo"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter todo name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTodo ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
