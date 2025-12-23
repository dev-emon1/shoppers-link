import IconButton from "../ui/IconButton";
import { RiFileEditLine } from "react-icons/ri";
import { CiTrash } from "react-icons/ci";

const TableActions = ({ onEdit, onDelete }) => (
  <div className="flex items-center gap-2 md:gap-3">
    {/* Edit Button */}
    {onEdit && (
      <IconButton
        icon={RiFileEditLine}
        bgColor="bg-main"
        hoverBgColor="bg-mainHover"
        onClick={onEdit} // ✅ Attach handler
        title="Edit"
      />
    )}

    {/* Delete Button */}
    {onDelete && (
      <IconButton
        icon={CiTrash}
        bgColor="bg-red"
        hoverBgColor="bg-deepRed"
        onClick={onDelete} // ✅ Attach handler
        title="Delete"
      />
    )}
  </div>
);

export default TableActions;
