'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Activity,
  Bell,
  ChartColumn,
  ChartLine,
  FileText,
  LayoutDashboard,
  Leaf,
  Menu,
  Route,
  Truck,
  TriangleAlert,
  UserRound,
  Wrench,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemo } from '@/lib/store'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Visão Geral', icone: LayoutDashboard },
  { href: '/veiculos', label: 'Veículos', icone: Truck },
  { href: '/analises', label: 'Análises', icone: ChartColumn },
  { href: '/alertas', label: 'Alertas', icone: TriangleAlert },
  { href: '/manutencao', label: 'Manutenção', icone: Wrench },
  { href: '/rotas', label: 'Rotas', icone: Route },
  { href: '/relatorios', label: 'Relatórios', icone: FileText },
  { href: '/sustentabilidade', label: 'Sustentabilidade', icone: Leaf },
]

const titulos: Record<string, string> = {
  '/': 'Visão Geral',
  '/veiculos': 'Veículos',
  '/analises': 'Análises',
  '/alertas': 'Alertas',
  '/manutencao': 'Manutenção',
  '/rotas': 'Rotas',
  '/relatorios': 'Relatórios',
  '/sustentabilidade': 'Sustentabilidade',
}

function Marca() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <ChartLine className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">LogiSmart</span>
        <span className="text-[11px] text-muted-foreground">Gestão Inteligente de Frotas</span>
      </span>
    </div>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { resumo } = useDemo()

  return (
    <nav className="flex flex-col gap-1" aria-label="Navegação principal">
      {nav.map((item) => {
        const ativo =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        const Icone = item.icone
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={ativo ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
              ativo
                ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
            )}
          >
            <Icone
              className={cn('size-4 shrink-0', ativo ? 'text-primary' : 'text-muted-foreground')}
              aria-hidden
            />
            <span className="flex-1 truncate">{item.label}</span>
            {item.href === '/alertas' && resumo.alertasPendentes > 0 ? (
              <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-destructive">
                {resumo.alertasPendentes}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)
  const { resumo, ultimaAtualizacao } = useDemo()

  useEffect(() => {
    setMenuAberto(false)
  }, [pathname])

  const titulo =
    titulos[pathname] ?? (pathname.startsWith('/veiculos/') ? 'Detalhes do Veículo' : 'LogiSmart')

  return (
    <div className="flex min-h-screen">
      {/* Menu lateral — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col justify-between border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex flex-col gap-4">
          <div className="px-4 py-4">
            <Marca />
          </div>
          <div className="px-2">
            <NavLinks />
          </div>
        </div>

      </aside>

      {/* Menu lateral — celular */}
      {menuAberto ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMenuAberto(false)}
          />
          <div className="ls-rise absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col justify-between border-r border-sidebar-border bg-sidebar">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-4 py-4">
                <Marca />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Fechar menu"
                  onClick={() => setMenuAberto(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div className="px-2">
                <NavLinks onNavigate={() => setMenuAberto(false)} />
              </div>
            </div>

          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <Button
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setMenuAberto(true)}
          >
            <Menu className="size-4" />
          </Button>

          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">{titulo}</h1>
            <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
              <Activity className="size-3 text-success" aria-hidden />
              Atualizado · {ultimaAtualizacao}
            </span>
          </div>

          <Link
            href="/alertas"
            className="relative grid size-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Notificações: ${resumo.alertasPendentes} alertas pendentes`}
          >
            <Bell className="size-4" aria-hidden />
            {resumo.alertasPendentes > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 font-mono text-[10px] font-semibold text-destructive-foreground">
                {resumo.alertasPendentes}
              </span>
            ) : null}
          </Link>

          <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1">
            <span className="grid size-6 place-items-center rounded-md bg-secondary text-muted-foreground">
              <UserRound className="size-3.5" aria-hidden />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-xs font-medium">Ana Ribeiro</span>
              <span className="text-[10px] text-muted-foreground">Gestora de Frota</span>
            </span>
          </div>
        </header>

        <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
