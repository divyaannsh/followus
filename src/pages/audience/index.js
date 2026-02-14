import { useState, useEffect } from "react";
import DialogModal from "@/components/common/dialogModal";
import PagesList from "@/components/common/pagesList";

export default function AudiencePage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
    <PagesList/>
      <DialogModal open={open} setOpen={setOpen} />
    </>
  );
}