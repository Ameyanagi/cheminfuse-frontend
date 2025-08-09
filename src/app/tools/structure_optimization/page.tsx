"use client";
import dynamic from "next/dynamic";

const Editor= dynamic(
  () => import('@/components/ImprovedMolEditor'), //Editor component path
  { ssr: false }
)

const StructureOptPage = () => {
    return (
        <Editor />
    );
};

export default StructureOptPage;