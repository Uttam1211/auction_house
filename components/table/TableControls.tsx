import { useState, useEffect } from "react";
import TableSort from "./TableSort";
import TableFilter from "./TableFilter";
import TablePagination from "./TablePagination";

interface TableControlsProps<T> {
  data: T[];
  sortFields: { value: keyof T; label: string }[];
  filterFields: { value: keyof T; label: string }[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDataChange: (filteredAndSortedData: T[]) => void;
  isLoading?: boolean;
}

export default function TableControls<T>({
  data,
  sortFields,
  filterFields,
  currentPage,
  totalPages,
  onPageChange,
  onDataChange,
  isLoading = false,
}: TableControlsProps<T>) {
  const [sortField, setSortField] = useState<keyof T>(sortFields[0].value);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    processData();
  }, [data, sortField, sortOrder, filters]);

  const processData = () => {
    let processedData = [...data];

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        processedData = processedData.filter((item) =>
          String(item[field as keyof T])
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    processedData.sort((a, b) => {
      const aValue = String(a[sortField]);
      const bValue = String(b[sortField]);
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    onDataChange(processedData);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <TableSort
          fields={sortFields}
          currentField={sortField}
          currentOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field);
            setSortOrder(order);
          }}
        />
        <TableFilter
          fields={filterFields}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            onPageChange(1); // Reset to first page when filtering
          }}
        />
      </div>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
