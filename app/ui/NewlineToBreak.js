import React from "react";

// Replace a new line with a <br/> element

export default function NewlineToBreak({children}) {
  return <span>{ children.split(/\n/).map((item, i) => (i === 0) ? item : [<br/>, item]) } </span>;
}
