import { BiError } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function NotFoundView() {
  return (
  <>
    <div className="flex gap-5 w-[400px]">
      <BiError size={60} />
      <div className="mt-2">
        <h1 className="mb-3 text-xl font-medium">Not found (404)</h1>
        <p className="mb-2">
          If you expect this page to be here, please check the URL or contact
          support.
        </p>
        <Link className="hover:underline text-blue-500" to="/">
          Go back to home page
        </Link>
      </div>
    </div>
  </>
  )
}
