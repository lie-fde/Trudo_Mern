
import React from "react";

export default function BuggyComponent() {
    
  throw new Error("This component crashed!");

}
