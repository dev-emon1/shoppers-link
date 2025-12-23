const SelectPerPage = ({ perPage, onChange }) => (
  <select
    value={perPage}
    onChange={onChange}
    className="text-xs border border-border rounded-md outline-none px-2 py-1.5 cursor-pointer text-gray-700"
  >
    {[5, 10, 20, 50].map((num) => (
      <option key={num} value={num}>
        Show {num}
      </option>
    ))}
  </select>
);
export default SelectPerPage;
