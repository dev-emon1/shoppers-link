import React from "react";
import { BarLoader } from "react-spinners";
import { overRideSpinner } from "../../utils/spinners";

const Button = ({ title, isLoading = false }) => {
  return (
    <button
      type="submit"
      //  disabled={isLoading ? true : false}
      className="bg-main hover:bg-mainHover transition-all ease-in-out duration-150 w-full hover:shadow-md text-white rounded-md px-7 py-2 my-4"
    >
      {isLoading ? (
        <BarLoader color="#ffffff" width={100} cssOverride={overRideSpinner} />
      ) : (
        title
      )}
    </button>
  );
};

export default Button;
