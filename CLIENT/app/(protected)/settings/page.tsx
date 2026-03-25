"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  LogOut, 
  Save, 
  UserCircle2,
  CheckCircle2,
  Camera,
  Layout,
  Palette
} from "lucide-react";
import { useToast } from "@/lib/toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    notifications: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Settings Updated",
            description: "Your institute profile has been successfully synchronized."
        });
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24">
       <div className="space-y-4 px-4 md:px-0">
          <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
             <Shield size={14} />
             Institute Security Group
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Settings & Profile</h1>
          <p className="text-gray-500 font-medium max-w-lg">
             Manage your academic credentials and system preferences for the Darul-Quran LMS.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar Tabs (Visual) */}
          <div className="space-y-2 px-4 md:px-0">
             <SettingsTab icon={<UserCircle2 size={18} />} label="Personal Profile" active />
             <SettingsTab icon={<Lock size={18} />} label="Security & Password" />
             <SettingsTab icon={<Bell size={18} />} label="Notifications" />
             <SettingsTab icon={<Palette size={18} />} label="Appearance" />
             <SettingsTab icon={<Layout size={18} />} label="Curriculum Display" />
             <div className="pt-6">
                <Button 
                    variant="ghost" 
                    onClick={logout}
                    className="w-full justify-start h-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 font-black gap-3"
                >
                    <LogOut size={18} />
                    Institute Log-out
                </Button>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 px-4 md:px-0 text-white">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#022c26] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-white"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-3xl bg-emerald-500 flex items-center justify-center text-4xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500">
                             {user?.name?.charAt(0) || "U"}
                        </div>
                        <button className="absolute -bottom-2 -right-2 bg-white text-emerald-950 p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                            <Camera size={18} />
                        </button>
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-black tracking-tight">{user?.name}</h3>
                        <p className="text-emerald-100/40 text-sm font-bold uppercase tracking-widest">{user?.role} Access Protocol</p>
                    </div>
                </div>
             </motion.div>

             <Card className="bg-white rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="p-10 pb-4 border-b border-gray-50 mb-6">
                   <CardTitle className="text-2xl font-black tracking-tight text-gray-900">Profile Information</CardTitle>
                   <CardDescription className="text-gray-400 font-medium tracking-tight">Update your public institute identity.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 ml-1">Full Name</label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                             <Input 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" 
                                placeholder="Enter full name" 
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 ml-1">Email Address</label>
                          <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                             <Input 
                                value={user?.email || ""} 
                                disabled
                                className="h-14 pl-12 rounded-2xl bg-gray-50 border-gray-100 font-bold text-gray-400 cursor-not-allowed" 
                                placeholder="Email" 
                             />
                          </div>
                       </div>
                   </div>

                   <div className="space-y-3 pt-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 ml-1">Institute Identification (Role)</label>
                      <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                         <CheckCircle2 size={24} className="text-emerald-600" />
                         <div>
                            <span className="text-xs font-black text-emerald-950 block tracking-tight">Verified Academic Status</span>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">{user?.role} Clearance Level</span>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-white rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="p-10 pb-4 border-b border-gray-50 mb-6">
                   <CardTitle className="text-2xl font-black tracking-tight text-gray-900">Security Access</CardTitle>
                   <CardDescription className="text-gray-400 font-medium tracking-tight">Maintain the integrity of your account.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 ml-1">Change Access Password</label>
                          <div className="relative">
                             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                             <Input 
                                type="password"
                                className="h-14 pl-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" 
                                placeholder="New Password" 
                             />
                          </div>
                       </div>
                   </div>

                   <div className="flex justify-end pt-6">
                      <Button 
                        disabled={isSaving}
                        onClick={handleSave}
                        className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xl shadow-emerald-500/10 gap-3"
                      >
                         <Save size={18} />
                         {isSaving ? "Synchronizing..." : "Finalize Updates"}
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
       </div>
    </div>
  );
}

function SettingsTab({ icon, label, active = false }: any) {
    return (
        <button className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
            active 
                ? "bg-emerald-600 text-white shadow-xl shadow-emerald-900/10" 
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        )}>
            {icon}
            <span className="text-sm font-bold tracking-tight">{label}</span>
        </button>
    );
}
