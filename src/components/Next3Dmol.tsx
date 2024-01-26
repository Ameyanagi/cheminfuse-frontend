"use client";

import $ from "jquery";
// import * as $3Dmol from '3dmol/build/3Dmol.js';
import React, { useEffect, useState } from "react";

type Next3DmolProps = {
  className?: string;
  structure?: string;
  format?: string;
  href?: string;
};

const Next3Dmol = ({ className, structure, format, href }: Next3DmolProps) => {
  const [structureString, setStructureString] = useState(structure);
  const [formatString, setFormatString] = useState(format);

  const next3DmolId = Math.random().toString(36).slice(-8);

  useEffect(() => {
    if (href) {
      fetch(href)
        .then((response) => response.text())
        .then((data) => {
          setStructureString(data);
        });
    } else {
      setStructureString(structure);
      setFormatString(format);
    }
  }, [href, format, structure, format]);

  useEffect(() => {
    if (!structureString) {
      return;
    }

    if (!formatString) {
      return;
    }

    import("3dmol/build/3Dmol.js").then(($3Dmol) => {
      let element = $("#" + next3DmolId);
      element.empty();
      let config = { backgroundColor: "white", backgroundAlpha: 0 };
      let viewer = $3Dmol.createViewer(element, config);
      viewer.addModel(structureString, formatString);
      switch (formatString) {
        case "xyz":
          viewer.setStyle({}, { stick: {} });
          break;
        case "pdb":
          viewer.setStyle({}, { cartoon: {} });
          break;
        case "mol2":
          viewer.setStyle({}, { stick: {} });
          break;
        case "sdf":
          viewer.setStyle({}, { stick: {} });
          break;
        case "cif":
          viewer.setStyle({}, { sphere: {} });
          break;
        default:
          break;
      }
      console.log("viewer", viewer);
      viewer.zoomTo();
      viewer.render();
    });

    // $3Dmol.download("pdb:1MO8", viewer, { multimodel: true, frames: true }, function () {
    //     viewer.setStyle({}, { stick: { color: "spectrum" } });
    //     viewer.render();
    // });
  }, [structureString, formatString]);

  return <div id={next3DmolId} className={className}></div>;
};

export default Next3Dmol;

