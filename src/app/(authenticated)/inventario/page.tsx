"use client";

import { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useLowStockProducts,
  useRestock,
} from "@/hooks";
import { Button, Input, Card, CardContent, Modal, useToast, Badge } from "@/components/ui";
import { Loader2, PackagePlus, Package, BarChart3, AlertTriangle, Edit2, Trash2, ArrowDownUp, AlertCircle } from "lucide-react";
import { formatCurrency, cn } from "@/utils";
import type { Product } from "@/types/enterprise";

export default function InventarioPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: lowStockProducts = [] } = useLowStockProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const restock = useRestock();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    costPrice: "",
    stock: "0",
    minStock: "5",
  });

  const [restockData, setRestockData] = useState({
    quantity: "",
    reason: "",
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", sku: "", price: "", costPrice: "", stock: "0", minStock: "5" });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku || "",
      price: String(product.price),
      costPrice: product.costPrice != null ? String(product.costPrice) : "",
      stock: String(product.stock),
      minStock: String(product.minStock),
    });
    setIsModalOpen(true);
  };

  const openRestockModal = (product: Product) => {
    setRestockProduct(product);
    setRestockData({ quantity: "", reason: "" });
    setIsRestockModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseRestockModal = () => {
    setIsRestockModalOpen(false);
    setRestockProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      sku: formData.sku || undefined,
      price: Number(formData.price),
      costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
    };

    const options = {
      onSuccess: () => {
        showToast(editingProduct ? "Produto atualizado!" : "Produto cadastrado!", "success");
        handleCloseModal();
      },
      onError: () => showToast("Erro na operação", "error"),
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data: payload }, options);
    } else {
      createProduct.mutate(payload, options);
    }
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      deleteProduct.mutate(product.id, {
        onSuccess: () => showToast("Produto removido!", "success"),
        onError: () => showToast("Erro ao remover", "error"),
      });
    }
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;
    restock.mutate(
      { productId: restockProduct.id, quantity: Number(restockData.quantity), reason: restockData.reason },
      {
        onSuccess: () => {
          showToast("Estoque reposicionado!", "success");
          handleCloseRestockModal();
        },
        onError: () => showToast("Erro ao reabastecer", "error"),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando inventário...</p>
      </div>
    );
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
            <Package className="h-3 w-3" />
            Gestão de Estoque
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Inventário</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Total de <span className="text-foreground font-bold">{products.length}</span> produtos cadastrados
          </p>
        </div>
        <Button onClick={openCreateModal} className="h-10 px-6 gap-2 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider transition-all">
          <PackagePlus className="h-4 w-4" />
          Novo Produto
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4 !pt-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.15em]">Total de Itens</p>
              <p className="text-3xl font-black tracking-tighter text-foreground">{products.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-amber-500/5 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4 !pt-6">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.15em]">Estoque Baixo</p>
              <p className={cn("text-3xl font-black tracking-tighter", lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-foreground")}>{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4 !pt-6">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.15em]">Valor em Estoque</p>
              <p className="text-3xl font-black tracking-tighter text-foreground">{formatCurrency(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Pesquisar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10"
          />
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Nome</th>
                  <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">SKU</th>
                  <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Preço</th>
                  <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Custo</th>
                  <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Estoque</th>
                  <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Estoque Mín</th>
                  <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Package className="h-8 w-8 opacity-40" />
                        <p className="text-sm font-medium">Nenhum produto encontrado</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock = product.stock <= product.minStock;
                    return (
                      <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-foreground">{product.name}</p>
                            {isLowStock && (
                              <Badge variant="warning" className="text-[9px] px-1.5 py-0">Baixo</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{product.sku || "---"}</td>
                        <td className="px-4 py-3 font-bold text-primary text-sm">{formatCurrency(product.price)}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.costPrice != null ? formatCurrency(product.costPrice) : "---"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={isLowStock ? "destructive" : "outline"} className="font-bold text-[10px]">
                            {product.stock} un
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.minStock}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openRestockModal(product)}
                              className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              title="Reabastecer"
                            >
                              <ArrowDownUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditModal(product)}
                              className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all"
                              title="Editar"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(product)}
                              className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Editar produto" : "Cadastrar novo produto"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Produto"
            placeholder="Ex: Pomada Efeito Matte"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="SKU"
            placeholder="Ex: PROD-001"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço de Venda (R$)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Preço de Custo (R$)"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estoque Atual"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <Input
              label="Estoque Mínimo"
              type="number"
              min="0"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={createProduct.isPending || updateProduct.isPending}>
              {editingProduct ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={isRestockModalOpen}
        onClose={handleCloseRestockModal}
        title="Reabastecer Estoque"
        description={restockProduct ? `Adicionar quantidade ao estoque de "${restockProduct.name}"` : undefined}
      >
        <form onSubmit={handleRestockSubmit} className="space-y-4">
          <Input
            label="Quantidade"
            type="number"
            min="1"
            placeholder="Unidades a adicionar"
            value={restockData.quantity}
            onChange={(e) => setRestockData({ ...restockData, quantity: e.target.value })}
            required
          />
          <Input
            label="Motivo"
            placeholder="Ex: Compra de fornecedor"
            value={restockData.reason}
            onChange={(e) => setRestockData({ ...restockData, reason: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseRestockModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={restock.isPending}>
              Reabastecer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}