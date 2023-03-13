"use client";
import Link from "next/link";
import  React, { useState } from "react";
import dynamic from "next/dynamic";

const Editor= dynamic(
  () => import('@/components/Moleditor'), //Editor component path
  { ssr: false }
)

const StructureOptPage = () => {
    return (
        <Editor />
    );
};

export default StructureOptPage;