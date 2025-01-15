interface TableSortProps<T> {
  fields: { value: keyof T; label: string }[];
  currentField: keyof T;
  currentOrder: "asc" | "desc";
  onSortChange: (field: keyof T, order: "asc" | "desc") => void;
}

export default function TableSort<T>({
  fields,
  currentField,
  currentOrder,
  onSortChange,
}: TableSortProps<T>) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={String(currentField)}
        onChange={(e) => onSortChange(e.target.value as keyof T, currentOrder)}
        className="border rounded-md p-2"
      >
        {fields.map((field) => (
          <option key={String(field.value)} value={String(field.value)}>
            {field.label}
          </option>
        ))}
      </select>
      <select
        value={currentOrder}
        onChange={(e) =>
          onSortChange(currentField, e.target.value as "asc" | "desc")
        }
        className="border rounded-md p-2"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
