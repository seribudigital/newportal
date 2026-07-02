"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Users, ShieldCheck, UserPlus, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, Role, JenjangId } from "@/types";

export default function AdminUserManagementPage() {
  const { isYayasanAdmin } = useAuth();
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // New Admin Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("admin_jenjang");
  const [jenjangId, setJenjangId] = useState<JenjangId>("tkit");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
      setUserList(list);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSetClaims = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Email admin wajib diisi.");
      setFormLoading(false);
      return;
    }

    try {
      // Direct prompt / instruction for CLI Admin SDK trigger or API route
      setMessage(`Petunjuk: Untuk memproses user ${email} ke role ${role.toUpperCase()} ${role === 'admin_jenjang' ? `(${jenjangId.toUpperCase()})` : ''}, jalankan perintah CLI berikut di terminal:`);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setFormLoading(false);
    }
  };

  if (!isYayasanAdmin) {
    return <div className="p-8 text-center text-muted-foreground font-semibold">Khusus Admin Yayasan</div>;
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-border">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
          Manajemen Akun Admin
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kelola hak akses & penugasan peran admin yayasan dan admin jenjang
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Assignment Form (Col 5) */}
        <div className="lg:col-span-5">
          <Card className="border border-border shadow-md bg-card">
            <CardHeader>
              <CardTitle className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Assign Role Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetClaims} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {message && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instruksi CLI Admin SDK</span>
                    </div>
                    <p>{message}</p>
                    <div className="p-2 bg-emerald-950 text-gold-400 font-mono rounded text-[11px] break-all select-all">
                      npx tsx scripts/setClaims.ts {email} {role} {role === 'admin_jenjang' ? jenjangId : ''}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Email User Admin
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin.sdit@yayasan.sch.id"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Peran (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="admin_jenjang">Admin Jenjang (Terbatas)</option>
                    <option value="admin_yayasan">Admin Yayasan (Penuh)</option>
                  </select>
                </div>

                {role === "admin_jenjang" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Jenjang Khusus</label>
                    <select
                      value={jenjangId}
                      onChange={(e) => setJenjangId(e.target.value as JenjangId)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="tkit">TKIT</option>
                      <option value="sdit">SDIT</option>
                      <option value="mts">MTs</option>
                      <option value="ma">MA</option>
                    </select>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-primary hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 rounded-xl shadow-sm mt-2"
                >
                  Dapatkan Perintah Role Claims
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* User List (Col 7) */}
        <div className="lg:col-span-7">
          <Card className="border border-border shadow-xs bg-card">
            <CardHeader>
              <CardTitle className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-600" />
                <span>Daftar User Admin Terdaftar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-xs">Memuat daftar admin...</span>
                </div>
              ) : userList.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center p-6">Belum ada profil user admin terdaftar di Firestore.</p>
              ) : (
                <div className="divide-y divide-border">
                  {userList.map((u) => (
                    <div key={u.uid} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-xs text-foreground">{u.nama || u.email}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-emerald-950 text-gold-400 border border-gold-500/30">
                        {u.role} {u.jenjangId ? `(${u.jenjangId.toUpperCase()})` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
