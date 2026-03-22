"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/lib/toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/users");
      if (res.success) setUsers(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/users/${id}/approve`);
      toast({ title: "User Approved", description: "This user can now access the platform." });
      setUsers(users.map(u => u.id === id ? { ...u, approved: true } : u));
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to approve user." });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">View and approve student registrations.</p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading users...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">No users found.</TableCell></TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    {u.approved ? (
                      <span className="text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full text-xs font-semibold">Approved</span>
                    ) : (
                      <span className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!u.approved && (
                      <Button size="sm" onClick={() => handleApprove(u.id)}>Approve</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
