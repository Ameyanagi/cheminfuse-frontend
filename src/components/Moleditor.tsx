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
            How to use: <br />
            1. Draw your molecule in the editor or enter SMILES in the textbox. <br />
            2. Press "Submit Structure". <br />
            3. Wait for the results to be generated. This might take few minutes. (It might take ~10min for large molecule) <br />
            4. csv file containing the optimized structures will be downloaded. <br />
          </div>
          <div className='p-4'>
            <Jsme height="50vh" width="100%" options="oldlook,star" onChange={handleSmiles} />
            <form action="https://cheminfuse.com/torchaniapi/gen_conf_csv" method='POST'>
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
          <div className="py-10 text-xl">
            Disclaimer: <br />
            This tool is currently under development. <br />
            Current setting will perform generation of 4000 random conformers, mmff94 energy minimization, clustering (10 groups at maximum), and then energy minimization using torchani ANI-1ccx, or ANI-2x depending on the elements. <br />
            Elements supported for ANI-1ccx: H, C, N, O. <br />
            Elements supported for ANI-2x: H, C, N, O, S, F, Cl. <br />
            Charges are not supported.
          </div>
          <div className="text-xl">
            Blog post explaining the tool: I am working on it.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;