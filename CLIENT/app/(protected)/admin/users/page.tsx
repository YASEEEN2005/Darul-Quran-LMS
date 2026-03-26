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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View and approve student registrations.</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm" className="hidden sm:flex">Refresh List</Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Syncing Users...</span>
                  </div>
                </TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="font-bold">No Records</span>
                    <span className="text-xs uppercase tracking-widest">Database is currently empty</span>
                  </div>
                </TableCell></TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-bold text-gray-900">{u.name}</TableCell>
                    <TableCell className="font-medium text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u.approved ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Approved</span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      {!u.approved && (
                        <Button size="sm" onClick={() => handleApprove(u.id)} className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-600/20">Approve User</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
