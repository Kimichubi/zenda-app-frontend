"use client";

import { useState } from "react";
import { useProducts, useCreateProduct } from "@/hooks";
import { Button, Input, Card, CardContent, Modal, useToast, Badge, Table } from "@/components/ui";
import { Loader2, PackagePlus, Search, Edit2, Trash2, Package, BarChart3, AlertTriangle } from "lucide-react";
import { formatCurrency, cn } from "@/utils";
import type { Product } from "@/types/enterprise";

export default function InventarioPage() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const { showToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingAppointment] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    sku: "",
    minStock: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutate(formData, {
      onSuccess: () => {
        showToast("Produto registrado no estoque!", "success");
        setIsModalOpen(false);
        setFormData({ name: "", price: 0, stock: 0, sku: "", minStock: 5 });
      },
      onError: (err: any) => showToast(err.message, "error"),
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Sincronizando estoque...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest text-primary/80">
            <Package className="h-3 w-3" />
            Supply Chain
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventário</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Controle total sobre seu <span className="text-primary font-semibold">fluxo de mercadorias</span>.
          </p>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 gap-2 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PackagePlus className="h-4 w-4" />
          Novo Produto
        </Button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total de Itens</p>
              <p className="text-2xl font-black text-foreground">{products.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-amber-500/5 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estoque Baixo</p>
              <p className="text-2xl font-black text-amber-500">{products.filter(p => p.stock <= p.minStock).length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-primary/5 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valor em Estoque</p>
              <p className="text-2xl font-black text-foreground">{formatCurrency(products.reduce((acc, p) => acc + (p.price * p.stock), 0))}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <div className="space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Pesquisar por nome ou SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 pl-12 rounded-2xl bg-card/10 backdrop-blur-sm border-border/40 focus:border-primary/30"
          />
        </div>

        <Card className="border border-border/40 bg-card/20 backdrop-blur-sm shadow-sm rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-primary/5">
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">SKU</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Produto</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Preço</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Estoque</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-primary/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground uppercase">{product.sku || "---"}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-foreground">{product.name}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-primary text-sm">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.stock <= product.minStock ? "destructive" : "outline"} className="font-black text-[10px] uppercase tracking-tighter px-2">
                        {product.stock} un
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Produto"
        className="max-w-md rounded-[2.5rem]"
      >
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Nome do Produto</label>
              <Input 
                placeholder="Ex: Pomada Efeito Matte" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-14 rounded-2xl bg-primary/5 border-border/20 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Preço Venda (R$)</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  className="h-14 rounded-2xl bg-primary/5 border-border/20 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Estoque Inicial</label>
                <Input 
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  required
                  className="h-14 rounded-2xl bg-primary/5 border-border/20 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Estoque Mínimo (Alerta)</label>
              <Input 
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                className="h-14 rounded-2xl bg-primary/5 border-border/20 font-bold"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 rounded-[1.5rem] shadow-2xl shadow-primary/20 font-black uppercase tracking-[0.2em] text-[10px] gap-3 mt-4"
            loading={createProduct.isPending}
          >
            Salvar no Inventário
          </Button>
        </form>
      </Modal>
    </div>
  );
}
