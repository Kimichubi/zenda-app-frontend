"use client";

import { useState } from "react";
import { useCheckout, useClients, useProducts } from "@/hooks";
import { Button, Card, CardContent, Input, useToast, Modal } from "@/components/ui";
import { Loader2, ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, DollarSign, User, Package } from "lucide-react";
import { formatCurrency, cn } from "@/utils";
import { Badge } from "@/components/ui";

export default function PdvPage() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: clientsData } = useClients({ page: 1, limit: 100 });
  const checkout = useCheckout();
  const { showToast } = useToast();

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      showToast(`O produto ${product.name} está sem estoque.`, "error");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast("Quantidade máxima em estoque atingida.", "warning");
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (product && newQty > product.stock) {
          showToast("Quantidade indisponível no estoque.", "warning");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = (method: string) => {
    if (cart.length === 0) return;

    checkout.mutate({
      customerId: selectedClientId || undefined,
      paymentMethod: method,
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
    }, {
      onSuccess: () => {
        showToast("Venda realizada com sucesso!", "success");
        setCart([]);
        setSelectedClientId("");
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || "Erro ao processar venda.", "error");
      },
    });
  };

  if (isLoadingProducts) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-180px)] animate-in fade-in duration-500">
      {/* Product Selection Area */}
      <div className="flex-1 space-y-6 overflow-hidden flex flex-col">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest text-primary/80">
            <ShoppingCart className="h-3 w-3" />
            Terminal de Vendas
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">PDV Zenda</h1>
        </header>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Pesquisar produto no inventário..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 pl-12 rounded-2xl bg-card/10 backdrop-blur-sm border-border/40 focus:border-primary/30"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
          {products.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-20 flex flex-col items-center">
              <Package className="h-12 w-12 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Nenhum produto cadastrado</p>
            </div>
          ) : (
            products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
              <Card 
                key={product.id}
                className={cn(
                  "border border-border/40 bg-card/10 hover:border-primary/30 transition-all cursor-pointer group rounded-2xl overflow-hidden",
                  product.stock <= 0 && "opacity-50 grayscale cursor-not-allowed"
                )}
                onClick={() => product.stock > 0 && addToCart(product)}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Plus className="h-6 w-6" />
                    </div>
                    <Badge variant={product.stock < 5 ? "destructive" : "outline"} className="text-[8px] font-black uppercase px-2 py-0.5">
                      Estoque: {product.stock}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm line-clamp-1">{product.name}</h3>
                    <p className="text-lg font-black text-primary mt-1">{formatCurrency(product.price)}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Cart Area */}
      <Card className="w-full lg:w-[400px] border border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden">
        <CardContent className="p-8 flex flex-col h-full space-y-8">
          <div className="flex items-center justify-between border-b border-border/20 pb-6">
            <h2 className="text-xl font-black tracking-tight uppercase italic">Carrinho</h2>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black">
              {cart.reduce((acc, i) => acc + i.quantity, 0)} itens
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <User className="h-3 w-3" /> Vincular Cliente
            </label>
            <select 
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full h-12 rounded-xl bg-primary/5 border border-border/20 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
            >
              <option value="">Consumidor Final (Sem cadastro)</option>
              {clientsData?.data.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 py-12">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Aguardando itens...</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-foreground truncate">{item.name}</p>
                    <p className="text-xs font-bold text-primary mt-0.5">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary transition-colors"><Minus className="h-3 w-3" /></button>
                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary transition-colors"><Plus className="h-3 w-3" /></button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-2 text-rose-500 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-border/20 space-y-6">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Total</span>
              <span className="text-3xl font-black tracking-tighter text-foreground">{formatCurrency(total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleCheckout("DINHEIRO")}
                disabled={cart.length === 0 || checkout.isPending}
                variant="outline"
                className="h-14 rounded-2xl gap-2 border-primary/10 hover:bg-primary/5 text-primary text-[10px] font-black uppercase"
              >
                <DollarSign className="h-4 w-4" /> Dinheiro
              </Button>
              <Button 
                onClick={() => handleCheckout("CARTAO")}
                disabled={cart.length === 0 || checkout.isPending}
                variant="outline"
                className="h-14 rounded-2xl gap-2 border-primary/10 hover:bg-primary/5 text-primary text-[10px] font-black uppercase"
              >
                <CreditCard className="h-4 w-4" /> Cartão
              </Button>
            </div>
            
            <Button 
              onClick={() => handleCheckout("PIX")}
              disabled={cart.length === 0 || checkout.isPending}
              className="w-full h-16 rounded-[1.5rem] gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
            >
              {checkout.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              Finalizar Venda (Pix)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
