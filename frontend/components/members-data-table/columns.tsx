"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import dayjs from "dayjs";

import { Member } from "@/interfaces/member";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Member>[] = [
  /* {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, */
  // Nombre Completo (Filtro principal y ordenable)
  {
    id: "fullName",
    accessorFn: (row) => `${row.first_name} ${row.first_surname}`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const member = row.original;
      const fullName =
        `${member.first_name} ${member.second_name || ""} ${member.first_surname} ${member.second_surname || ""}`.trim();
      return <div className="font-medium">{fullName}</div>;
    },
  },
  // Club (Traído mediante expand)
  {
    id: "club",
    accessorFn: (row) => row.expand?.club?.name || "No Club",
    header: "Club",
    cell: ({ row }) => {
      const clubName = row.original.expand?.club?.name;
      return (
        <div>
          {clubName || (
            <span className="text-muted-foreground italic">None</span>
          )}
        </div>
      );
    },
  },
  // Roles
  {
    id: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.expand?.roles || [];
      if (roles.length === 0)
        return <span className="text-muted-foreground text-xs">No roles</span>;

      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role.id} variant="secondary" className="text-xs">
              {role.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  // Estado (Activo / Inactivo)
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;

      return isActive ? (
        <Badge
          variant="outline"
          className="border-emerald-500 text-emerald-600 bg-emerald-50/50 gap-1"
        >
          <CheckCircle2 className="h-3 w-3" /> Active
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-rose-500 text-rose-600 bg-rose-50/50 gap-1"
        >
          <XCircle className="h-3 w-3" /> Inactive
        </Badge>
      );
    },
  },
  // Fecha de nacimiento formateada
  {
    accessorKey: "birth_date",
    header: "Birth Date",
    cell: ({ row }) => {
      const date = row.getValue("birth_date") as string;
      return <div>{date ? dayjs(date).format("DD/MM/YYYY") : "-"}</div>;
    },
  },
  // Acciones (Ver perfil, copiar ID)
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(member.id)}
              >
                Copy Member ID
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href={`/profile/${member.id}`}>View Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
