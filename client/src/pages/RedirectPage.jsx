import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function RedirectPage() {
  const { code } = useParams();
  const [notFound,setNotFound] = useState(false);

  useEffect(() => {
    async function go() {
      try {
        const res = await API.get(`/links/redirect/${code}`);
        window.location.href = res.data.originalUrl;
      } catch (e) {
        console.error(e);
        setNotFound(true);
      }
    }
    go();
  }, [code]);

  if(notFound) return (
    <div className="p-6 text-center">
      Not found
    </div>
  );

  return (
    <div className="p-6 text-center">
      Redirecting...
    </div>
  );
}
