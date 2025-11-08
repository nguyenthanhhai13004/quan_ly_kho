import { BiError } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function AccessDeniedView() {
  return (
  <div>
    <div className="flex gap-5 w-[400px] mx-auto">
      <BiError size={60} />
      <div className="mt-2">
        <h1 className="mb-3 text-xl font-medium">Access Denied (403)</h1>
        <p className="mb-2">
          
        </p>
        <Link className="hover:underline text-blue-500" to="/">
          Go back to home page
        </Link>
      </div>
    </div>
  </div>
  )
}
