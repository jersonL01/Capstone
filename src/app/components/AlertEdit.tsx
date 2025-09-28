"use client";

import React from "react";
import Swal from "sweetalert2";

export type AlertEditProps = {
  id: number;
  currentValue: string;
  onEdit: (id: number, newValue: string) => Promise<void>;
};

export default function AlertEdit({ id, currentValue, onEdit }: AlertEditProps) {
  const handleClick = () => {
    Swal.fire({
      title: "Editar usuario",
      input: "text",
      inputLabel: "Nuevo nombre",
      inputValue: currentValue,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "El nombre no puede estar vacío";
        }
        return null;
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await onEdit(id, result.value);
          Swal.fire("Actualizado", "El usuario fue editado.", "success");
        } catch (e: any) {
          Swal.fire("Error", e?.message || "No se pudo editar", "error");
        }
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 rounded-full bg-[#8bc27a] text-black font-semibold hover:brightness-95"
    >
      Editar
    </button>
  );
}
