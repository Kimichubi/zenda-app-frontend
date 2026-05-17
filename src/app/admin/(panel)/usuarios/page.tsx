"use client";

import { useState, useCallback } from "react";
import { useAdminUsers, useUpdateUserRole, useDeleteUser, useResetPassword, useVerificationCodes } from "@/hooks/use-admin";
import { useToast, Button, Modal, Input, Card, CardContent, Badge } from "@/components/ui";
import { Search, Users, Trash2, KeyRound, Loader2, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/utils";

export default function UsuariosPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "codes">("users");
  const [codeSearch, setCodeSearch] = useState("");
  const { showToast } = useToast();

  const { data: users = [], isLoading } = useAdminUsers(debouncedSearch);
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();
  const { data: verificationCodes = [], isLoading: codesLoading } = useVerificationCodes(codeSearch || undefined);

  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => setDebouncedSearch(value), 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleRoleChange = (id: string, role: string) => {
    updateRole.mutate({ id, role }, {
      onSuccess: () => showToast("Role atualizada!", "success"),
      onError: () => showToast("Erro ao atualizar role", "error"),
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir ${name}?`)) {
      deleteUser.mutate(id, {
        onSuccess: () => showToast("Usuario removido!", "success"),
        onError: () => showToast("Erro ao remover usuario", "error"),
      });
    }
  };

  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      showToast("Senha deve ter pelo menos 6 caracteres", "error");
      return;
    }
    resetPassword.mutate({ id: selectedUser.id, password: newPassword }, {
      onSuccess: () => {
        showToast("Senha resetada!", "success");
        setShowResetModal(false);
        setNewPassword("");
        setSelectedUser(null);
      },
      onError: () => showToast("Erro ao resetar senha", "error"),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} usuario{users.length !== 1 ? "s" : ""} na plataforma</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border/40">
        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "px-4 py-2 text-sm font-bold transition-colors border-b-2",
            activeTab === "users" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab("codes")}
          className={cn(
            "px-4 py-2 text-sm font-bold transition-colors border-b-2",
            activeTab === "codes" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Codigos de Verificacao
        </button>
      </div>

      {activeTab === "users" && (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome, email, negocio..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Card className="border-border/50 bg-card overflow-hidden rounded-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Negocio</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Criado</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Acoes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{user.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/20"
                            >
                              <option value="PLATFORM_ADMIN">PLATFORM_ADMIN</option>
                              <option value="OWNER">OWNER</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="PROFESSIONAL">PROFESSIONAL</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {user.businessName ? (
                              <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck className="h-3 w-3 text-primary" />
                                {user.businessName}
                              </span>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">Onboarding</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setSelectedUser(user); setShowResetModal(true); }}
                                className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                title="Resetar senha"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id, user.name)}
                                className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            Nenhum usuario encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeTab === "codes" && (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value)}
              placeholder="Filtrar por email..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {codesLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Card className="border-border/50 bg-card overflow-hidden rounded-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Codigo</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Expira em</th>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Criado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {verificationCodes.map((code: any) => (
                        <tr key={code.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{code.email}</td>
                          <td className="px-4 py-3 font-mono text-primary font-bold">{code.code}</td>
                          <td className="px-4 py-3">
                            {code.used ? (
                              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200">Usado</Badge>
                            ) : new Date(code.expiresAt) < new Date() ? (
                              <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20">Expirado</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200">Ativo</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(code.expiresAt).toLocaleString("pt-BR")}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(code.createdAt).toLocaleString("pt-BR")}</td>
                        </tr>
                      ))}
                      {verificationCodes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                            <KeyRound className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            Nenhum codigo de verificacao encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} title={`Resetar senha de ${selectedUser?.name}`}>
        <div className="space-y-4 p-2">
          <Input
            label="Nova senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimo 6 caracteres"
            className="h-12 rounded-xl"
          />
          <Button onClick={handleResetPassword} className="w-full h-12 rounded-xl font-bold" loading={resetPassword.isPending}>
            Resetar Senha
          </Button>
        </div>
      </Modal>
    </div>
  );
}
