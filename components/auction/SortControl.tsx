interface SortControlProps {
  sortField: string;
  sortOrder: string;
  onSortFieldChange: (field: string) => void;
  onSortOrderChange: (order: string) => void;
}

export default function SortControl({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
}: SortControlProps) {
  return (
    <div className="mb-4">
      <label className="mr-2 font-semibold">Sort by:</label>
      <select
        value={sortField}
        onChange={(e) => onSortFieldChange(e.target.value)}
        className="border rounded-md p-1 mr-2"
      >
        <option value="title">Name</option>
        <option value="currentBid">Current Bid</option>
      </select>
      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value)}
        className="border rounded-md p-1"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
