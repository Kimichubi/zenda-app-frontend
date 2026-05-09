"use client";

import { useState } from "react";
import { useUser } from "@/hooks";
import { useWeekAppointments } from "@/hooks";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/utils";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

export default function MinhaAgendaPage() {
  const { data: user } = useUser();
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: appointments = [], isLoading } = useWeekAppointments(
    format(currentDate, "yyyy-MM-dd")
  );

  const myAppointments = appointments.filter(
    (apt) => apt.professionalId === user?.id
  );

  const navigate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => addDays(prev, direction === "next" ? 7 : -7));
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
            <Calendar className="h-3 w-3" />
            Minha Agenda
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {user?.name?.split(" ")[0] || "Profissional"}
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Gerencie seus horários, bloqueios e disponibilidade.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => navigate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 bg-muted/50 rounded-xl text-sm font-bold">
            {format(weekStart, "dd MMM", { locale: ptBR })} - {format(addDays(weekStart, 6), "dd MMM", { locale: ptBR })}
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => navigate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/40 bg-card/50 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Agendamentos</p>
              <p className="text-2xl font-black">{myAppointments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Horas Hoje</p>
              <p className="text-2xl font-black">
                {myAppointments.filter((a) => a.date === format(new Date(), "yyyy-MM-dd")).length}h
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clientes</p>
              <p className="text-2xl font-black">
                {new Set(myAppointments.map((a) => a.clientId)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {weekDates.map((date) => {
          const dayAppointments = myAppointments.filter((a) => a.date === format(date, "yyyy-MM-dd"));
          const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

          return (
            <Card key={date.toISOString()} className={cn(
              "border-border/40 rounded-2xl overflow-hidden",
              isToday && "border-primary/30 ring-1 ring-primary/10"
            )}>
              <div className={cn("p-3 text-center border-b border-border/20", isToday && "bg-primary/5")}>
                <p className="text-[10px] font-black text-muted-foreground uppercase">{format(date, "EEE", { locale: ptBR })}</p>
                <p className={cn("text-xl font-black", isToday ? "text-primary" : "text-foreground")}>
                  {format(date, "dd")}
                </p>
              </div>
              <CardContent className="p-2 space-y-2">
                {dayAppointments.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Livre</p>
                ) : (
                  dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="text-[10px] bg-primary/10 text-primary rounded-lg px-2 py-1.5 font-bold border border-primary/20"
                    >
                      <p>{apt.startTime} - {apt.clientName}</p>
                      <p className="text-muted-foreground font-medium">{apt.serviceName}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
