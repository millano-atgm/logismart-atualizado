'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/shared'
import { CONSUMO_MEDIO_FROTA, type Vehicle } from '@/lib/data'
import { cn } from '@/lib/utils'

function consumoTexto(v: Vehicle) {
  return v.consumo === null ? '—' : `${v.consumo.toFixed(1).replace('.', ',')} km/L`
}

function consumoClasse(v: Vehicle) {
  if (v.consumo === null) return 'text-muted-foreground'
  if (v.consumo < CONSUMO_MEDIO_FROTA * 0.9) return 'text-destructive'
  if (v.consumo < CONSUMO_MEDIO_FROTA) return 'text-warning'
  return 'text-success'
}

export function VehicleTable({ veiculos }: { veiculos: Vehicle[] }) {
  if (veiculos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
        Nenhum veículo encontrado com os filtros selecionados.
      </div>
    )
  }

  return (
    <>
      {/* Tabela — tablet e desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-2.5 font-medium">
                Veículo
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Motorista
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Rota
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Consumo
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-2.5">
                <span className="sr-only">Abrir detalhes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((v) => (
              <tr
                key={v.id}
                className="border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/40"
              >
                <td className="px-4 py-3">
                  <Link href={`/veiculos/${v.id}`} className="flex flex-col">
                    <span className="font-medium">{v.nome}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{v.placa}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{v.motorista}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.rota}</td>
                <td className={cn('px-4 py-3 font-mono', consumoClasse(v))}>{consumoTexto(v)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/veiculos/${v.id}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Detalhes
                    <ChevronRight className="size-3.5" aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartões — celular */}
      <ul className="flex flex-col gap-2 md:hidden">
        {veiculos.map((v) => (
          <li key={v.id}>
            <Link
              href={`/veiculos/${v.id}`}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{v.nome}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{v.placa}</span>
                </div>
                <StatusBadge status={v.status} />
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col">
                  <dt className="text-muted-foreground">Motorista</dt>
                  <dd className="truncate">{v.motorista}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-muted-foreground">Rota</dt>
                  <dd className="truncate">{v.rota}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-muted-foreground">Consumo</dt>
                  <dd className={cn('font-mono', consumoClasse(v))}>{consumoTexto(v)}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-muted-foreground">Km total</dt>
                  <dd className="font-mono">{v.kmTotal.toLocaleString('pt-BR')}</dd>
                </div>
              </dl>
              <span className="inline-flex items-center gap-1 text-xs text-primary">
                Ver detalhes
                <ChevronRight className="size-3.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
