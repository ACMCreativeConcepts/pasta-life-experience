import { STRIP_PREFIX } from "@/lib/comics";
import AdminComicsForm from "./AdminComicsForm";

// The client uploads panels straight to Blob storage, so it needs to know
// this environment's strip folder (preview deployments use a prefixed one).
export default function ComicsAdminPage() {
  return <AdminComicsForm stripPrefix={STRIP_PREFIX} />;
}
