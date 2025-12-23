const StatusBadge = ({ status }) => {
  const isActive = status === "active";
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        isActive ? "bg-green/15 text-green" : "bg-red/15 text-red"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};
export default StatusBadge;
