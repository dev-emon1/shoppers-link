import { Link } from "react-router-dom";

const LinkButton = ({ link, title }) => {
  return (
    <Link
      to={link}
      className={`text-white dark:text-white p-2 bg-main hover:bg-mainHover hover:shadow-md rounded`}
    >
      {title}
    </Link>
  );
};

export default LinkButton;
