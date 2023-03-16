"use client";
import React, { useState } from "react";
import Next3Dmol from "@/components/Next3Dmol";
import Papa from "papaparse";
import Link from "next/link";


const StructureVisPage = () => {

  const [parsedData, setParsedData] = useState<any>([]);
  const [tableRows, setTableRows] = useState<any>([]);
  const [values, setValues] = useState<any>([]);
  const [structureID, setStructureID] = useState<number>(0);
  const [plotTorch, setPlotTorch] = useState<boolean>(true);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    if (event.target.files === null) {
      return;
    }

    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: any[]; }) => {
        const rowsArray: any[] = [];
        const valuesArray: unknown[] = [];

        // Iterating data to get column name and their values
        results.data.map((d: { [s: string]: unknown; } | ArrayLike<unknown>) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
      },
    });
  };

  const plotMolecule = (moleculeId: number) => {

    if (parsedData.length === 0) {
      return <></>;
    }

    if (parsedData.length < moleculeId) {
      return <></>;
    }

    const molecule = parsedData[moleculeId];
    const xyz = molecule.torch_xyz;
    // const mol2 = molecule.torch_molblock;

    return (
      <>
        <Next3Dmol
          className='relative w-[50vh] h-[50vh] mx-auto'
          structure={xyz}
          format="xyz"
        />
      </>
    );
  };

  const changeStructureID = (id: number) => {
    if (parsedData.length === 0) {
      setStructureID(0);
      return;
    }

    if (id < 0) {
      setStructureID(0);
    } else if (id > parsedData.length - 1) {
      setStructureID(parsedData.length - 1);
    } else {
      setStructureID(id);
    }
  };

  const StructureSelector = () => {

    // let tags = [];

    // if (structureID > 0) {
    //   tags.push(<a className="text-xl p-4 hover:cursor-pointer" onClick={() => setStructureID(structureID - 1)}> &lt; </a>);
    // }

    // tags.push(<input className="text-xl p-4 w-20" type="number" value={structureID} onChange={(e) => setStructureID(parseInt(e.target.value))} />);

    // if (structureID < parsedData.length - 1) {
    //   tags.push(<a className="text-xl p-4" onClick={() => setStructureID(structureID + 1)}> &gt; </a>);
    // }

    return (
      <>
        <a className="text-xl p-4 text-blue-600 hover:cursor-pointer hover:border-b" onClick={() => changeStructureID(structureID - 1)}> &lt; </a>
        <input className="text-xl p-4 w-20 text-center bg-transparent appearance-none outline-none" type="number" value={structureID} min="0" onChange={(e) => setStructureID(parseInt(e.target.value))} />
        <a className="text-xl p-4 text-blue-600 hover:cursor-pointer hover:border-b" onClick={() => changeStructureID(structureID + 1)}> &gt; </a>
      </>
    );
  }




  return (
    <div className="w-full text-left">

      <div className="w-full p-10">

        <div className="max-w-[1240px] mx-auto">
          <p className="text-xl text-[#5651e5] py-4">
            VISUALIZATION TOOL for  <Link href="/tools/structure-optimization" className=" hover:cursor-pointer underline underline-offset-4 hover:border-b"> Structure Optimization Tool using NN potential </Link>
          </p>

          <div>
            {/* File Uploader */}
            <input
              type="file"
              className="w-100"
              name="file"
              onChange={changeHandler}
              accept=".csv"
              style={{ display: "block", margin: "10px auto" }}
            />
            {/* <input
              type="radio"
              className="w-4 h-4 my-auto text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              id="torch"
              name="plot"
              value="torch"
              checked={plotTorch}
              onChange={() => setPlotTorch(true)}
            />
            <label htmlFor="torch" className="mx-2 my-auto">Torch Optimized Structure</label>
            <input
              type="radio"
              id="torch"
              name="plot"
              value="torch"
              checked={!plotTorch}
              onChange={() => setPlotTorch(false)}
            />
            <label htmlFor="torch" className="mx-2 my-auto">Initial Structure</label>
            <br /> */}

          </div>
          <div className="mx-auto text-center">
            <StructureSelector />
          </div>
          <div className="max-w-[1240px] mx-auto items-center text-center">
            {plotMolecule(structureID)}
          </div>

          <div className="max-w-[1240px] mx-auto">
            <p className="text-ml tracking widget uppercase text-[#5651e5] py-4">
              How to use
            </p>

            <ul className="text-ml">
              <li>1. Upload a csv file generated by <Link href="/tools/structure-optimization" className="text-blue-600 hover:cursor-pointer hover:border-b">Structure Optimization</Link> page. </li>
              <li>2. Select the number of the structure you want to visualize.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>

  );
};

export default StructureVisPage;