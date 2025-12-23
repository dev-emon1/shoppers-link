const SlidePanel = ({ show, title, children, onClose }) => {
  return (
    <div
      className={`w-[320px] lg:w-5/12 fixed lg:relative ${show ? "right-0" : "-right-[340px]"
        } lg:right-0 top-0 transition-all duration-500 ease-in-out z-[80] lg:z-[8] overflow-y-auto bg-bgPage`}
    >
      <div className="w-full pl-5">
        <div className="bg-white rounded-md shadow-md h-screen lg:h-auto px-3 py-2">
          <div className="flex justify-between items-center py-2 mb-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div
              className="block lg:hidden font-bold cursor-pointer"
              onClick={onClose}
            >
              ✕
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
export default SlidePanel;
