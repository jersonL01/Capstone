"use client";

import React from "react";
import Swal from "sweetalert2";

export type AlertDeleteProps = {
  id: number;
  onDelete: (id: number) => Promise<void>;
};

export default function AlertDelete({ id, onDelete }: AlertDeleteProps) {
  const handleClick = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await onDelete(id);
          Swal.fire("Eliminado", "Se confirmó la eliminación.", "success");
        } catch (e: any) {
          Swal.fire("Error", e?.message || "No se pudo eliminar", "error");
        }
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 rounded-full bg-[#e63929] text-white font-semibold hover:brightness-95"
    >
      Eliminar
    </button>
  );
}
