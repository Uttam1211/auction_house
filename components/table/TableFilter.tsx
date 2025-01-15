interface TableFilterProps<T> {
  fields: { value: keyof T; label: string }[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export default function TableFilter<T>({
  fields,
  onFilterChange,
}: TableFilterProps<T>) {
  return (
    <div className="flex gap-2">
      {fields.map((field) => (
        <input
          key={String(field.value)}
          type="text"
          placeholder={`Filter by ${field.label}`}
          onChange={(e) =>
            onFilterChange({ [String(field.value)]: e.target.value })
          }
          className="border rounded-md p-2"
        />
      ))}
    </div>
  );
}
