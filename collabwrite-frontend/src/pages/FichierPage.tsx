"use client"

import * as React from "react"
import { useState } from "react"
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RenameFolderDialog } from "@/components/dialogs/RenameFolderDialog"
import { DeleteFolderDialog } from "@/components/dialogs/DeleteFolderDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Dossier = {
    id: string,
    name: string,
    owner: string,
    createAt: string,
    updatedAt: string
}

const data: Dossier[] = [
  {
    id: "m5gr84i9",
    name: "Dossier 1",
    owner: "Pierre Braem",
    createAt: "21/10/2025",
    updatedAt: "25/10/2025",
  },
  {
    id: "3u1reuv4",
    name: "Dossier 2",
    owner: "Pierre Braem",
    createAt: "23/10/2025",
    updatedAt: "24/10/2025",
  },
  {
    id: "derv1ws0",
    name: "Dossier 3",
    owner: "Alexis Metton",
    createAt: "19/10/2025",
    updatedAt: "27/10/2025",
  },
]

export const columns: ColumnDef<Dossier>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nom
                <ArrowUpDown />
            </Button>
        )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Propriétaire
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("owner")}</div>,
  },
  {
    accessorKey: "createAt",
    header: "Date de création",
    cell: ({ row }) => <div className="capitalize">{row.getValue("createAt")}</div>
  },
  {
    accessorKey: "updatedAt",
    header: "Date de la dernière modification",
    cell: ({ row }) => <div className="capitalize">{row.getValue("updatedAt")}</div>
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
        const [modifier, setModifier] = useState(false);
        const [supprimer, setSupprimer] = useState(false);
        const [nomDossier, setNomDossier] = useState("");
        return (
            <>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={e => {
                        e.preventDefault()
                        setModifier(true)
                        setNomDossier(row.original.name)
                    }}>
                        Renommer
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={e => {
                        e.preventDefault()
                        setSupprimer(true)
                        setNomDossier(row.original.name)
                    }}
                    >Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>

                <RenameFolderDialog 
                    open={modifier}
                    onOpenChange={setModifier}
                    folderName={nomDossier}
                />
                <DeleteFolderDialog 
                    open={supprimer}
                    onOpenChange={setSupprimer}
                    folderName={nomDossier}
                />
            </>
        )
    },
  },
]

export function FichierPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par nom"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
