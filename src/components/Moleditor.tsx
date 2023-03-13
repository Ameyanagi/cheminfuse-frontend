// "use client";
import React, { useState } from "react";
import { Jsme } from "jsme-react";
// import { useForm } from "react-hook-form";

function Editor() {

  const [smiles, setSmiles] = useState("")
  // const { handleSubmit, formState } = useForm();

  // function onSubmit(){
  //   return new Promise(resolve)
  // };

  const handleSmiles = (smiles: string) => {
    setSmiles(smiles)
  };

  const handleSmilesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmiles(e.target.value)
  };

  return (
    <div className="w-full text-left">

      <div className="w-full p-10">

        <div className="max-w-[1240px] mx-auto">
          <p className="text-xl tracking widget uppercase text-[#5651e5] py-4">
            Structure Optimization using NN potential
          </p>
          
          <div className="pb-10 text-xl">
            How to use:
          </div>
          <div className='p-4'>
          <Jsme height="50vh" width="100%" options="oldlook,star" onChange={handleSmiles} />
            <form action="/torchaniapi/gen_conf_csv" method='POST'>
              <div className='flex flex-col'>
                    <label className='uppercase text-sm py-2'>SMILES</label>
                    <input
                      className='border-2 rounded-lg p-3 flex border-gray-300'
                      type='text'
                      name='smiles'
                      value={smiles}
                      onChange={handleSmilesInput}
                    />
                  </div>
                  <button className='w-full p-4 text-gray-100 mt-4'>
                  Submit Structure
                </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Editor;