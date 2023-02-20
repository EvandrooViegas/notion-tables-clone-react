import React from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import useLocalStorage from "./hooks/useLocalStorage";
export default function App() {
  interface IInput {
    rowId: string;
    columnId: string;
    text: string;
    id: string;
  }
  const [rowsQty, setRowsQty] = useLocalStorage<string[]>("rows", ["r1", "r2"])
  const [columnQty, setColumnQty] = useLocalStorage<string[]>("columns", ["c1", "c2"]);

  const [inputs, setInputs] = useLocalStorage<IInput[]>("inputs", []);
  console.log(inputs)
  function createColumn() {
    setColumnQty([...columnQty, `c${columnQty.length + 1}`]);

    location.reload();
  }

  function createRow() {
    setRowsQty([...rowsQty, `r${rowsQty.length + 1}`]);
    location.reload();
  }


  function getInputValue({ rowId, columnId }: Omit<IInput, "id" | "text">) {
    const inputAlreadyExist = inputs.find(
      (input) => input.columnId === columnId && input.rowId === rowId
    );
    return inputAlreadyExist?.text || " ";
  }

  function removeRow(rowId: string) {
    setRowsQty(rowsQty.filter((id) => rowId !== id));
    setInputs(inputs.filter((input) => input.rowId !== rowId));
  }
  function removeColumn(columnId: string) {
    setColumnQty(columnQty.filter((id) => id !== columnId));
    setInputs(inputs.filter((input) => input.columnId !== columnId));
  }

  function saveCell({ rowId, columnId, text }:Omit<IInput, "id">) {
    const isExistInInputsArr = inputs.some((input) => input.columnId === columnId && input.rowId === rowId)
    console.log(isExistInInputsArr)
    let tempList:IInput[] = []
    if(isExistInInputsArr) {
      tempList = inputs.map(input => {
        if(input.columnId === columnId && input.rowId === rowId) return {...input, text} 
        else return input
      })
    } else {
      tempList = inputs
      tempList.push({
        rowId,
        columnId,
        text,
        id: uuid()
      })
    }
    setInputs([...tempList])
  }

  return (
    <div className="table">
      <button className="before" onClick={createRow}>
        +
      </button>
      <button className="after" onClick={createColumn}>
        +
      </button>
      {columnQty.map((columnId, columnIdx) => (
        <div className="column" key={columnId}>
          <button onClick={() => removeColumn(columnId)} className="rm-col-btn">
            X
          </button>

          {rowsQty.map((rowId, rowIdx) => (
            <div className="row" key={rowId}>
              {columnIdx == 0 && (
                <button onClick={() => removeRow(rowId)} className="rm-row-btn">
                  X
                </button>
              )}
              <input
                type="text"
                className="table-input"
                key={rowId}
                defaultValue={getInputValue({ rowId, columnId })}
                onChange={(e) => saveCell({ rowId, columnId, text: e.target.value })}
              />
            </div>
          ))}
        </div>
      ))}
      {!columnQty.length || !rowsQty.length && (
        <div className="text-white" onClick={() => {
          setColumnQty(["c1", "c2"])
          setRowsQty(["r1", "r2"])
        }}>
          Create Table
        </div>
      )}
    </div>
  );
}
