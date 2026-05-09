"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth";
import { isValidPhone } from "@/utils/validations";
import { AlertCircle, Eye, EyeOff, Check, X } from "lucide-react";
import { cn, maskPhoneInput } from "@/utils";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter DDD + numero (11 digitos)")
    .refine((v) => isValidPhone(v), { message: "Formato invalido. Use (XX) XXXXX-XXXX" }),
  email: z.string().min(1, "Email invalido").email("Email invalido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas nao conferem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Fraca", color: "bg-rose-500" };
  if (score <= 2) return { score, label: "Razoavel", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Boa", color: "bg-blue-500" };
  return { score, label: "Forte", color: "bg-emerald-500" };
}

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password") || "";
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const passwordRequirements = [
    { label: "Minimo 8 caracteres", met: password.length >= 8 },
    { label: "Uma letra maiuscula", met: /[A-Z]/.test(password) },
    { label: "Um numero", met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      const response = await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      localStorage.setItem("zenda_token", response.accessToken);
      localStorage.setItem("zenda_refresh_token", response.refreshToken || "");
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Seu nome completo"
          label="Nome Completo"
          error={errors.name?.message}
          className="h-12 rounded-xl"
          autoComplete="name"
        />

        <Input
          {...register("phone", {
            onChange: (e) => {
              e.target.value = maskPhoneInput(e.target.value);
            },
          })}
          placeholder="(11) 99999-9999"
          label="Telefone"
          error={errors.phone?.message}
          className="h-12 rounded-xl"
          autoComplete="tel"
        />

        <Input
          {...register("email")}
          type="email"
          placeholder="seu@email.com"
          label="Email"
          error={errors.email?.message}
          className="h-12 rounded-xl"
          autoComplete="email"
        />

        <div className="space-y-3">
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Crie uma senha forte"
              label="Senha"
              error={errors.password?.message}
              className="h-12 rounded-xl pr-12"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[calc(50%+0.75rem)] -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password && (
            <div className="space-y-2 px-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-300", passwordStrength.color)} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{passwordStrength.label}</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    {req.met ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground/40" />}
                    <span className={req.met ? "text-emerald-600" : "text-muted-foreground"}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirme sua senha"
          label="Confirmar Senha"
          error={errors.confirmPassword?.message}
          className="h-12 rounded-xl"
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/20 mt-4" loading={isSubmitting}>
        Criar minha conta
      </Button>
    </form>
  );
}
