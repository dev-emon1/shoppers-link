import Link from "next/link";

export default function ViewAllButton({ href }) {
  return (
    <div className="flex justify-center mt-6">
      <Link
        href={href}
        prefetch
        className="text-main underline-offset-1 hover:underline transition-all duration-300 text-sm font-medium"
      >
        View all
      </Link>
    </div>
  );
}
