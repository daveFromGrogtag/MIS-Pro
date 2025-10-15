import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { useState } from "react";

const CoolTable = ({ data, columns }) => {
    const [sorting, setSorting] = useState([]);
    const [search, setSearch] = useState("")


    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    function orderTableFilter(rowIndex) {
        let columnHeads = []
        let searchableRowString = ""

        // First let's grab the column heads by their accessible ids
        columns.forEach(eachColumn => {
            if (eachColumn.accessorKey) {
                columnHeads.push(eachColumn.accessorKey)
            }
        });
        // Then let's grab the searchable info from each row and put it in a single searchable string
        columnHeads.forEach((columnHead) => {
            // Create the searchable string
            let searchableCellString
            // If the header is nested data, we need to split it to search
            if (columnHead.includes(".")) {
                let nestedData = columnHead.split(".")
                searchableCellString = data[rowIndex][nestedData[0]][nestedData[1]]?data[rowIndex][nestedData[0]][nestedData[1]].toString().trim().toLowerCase():""
            } else {
                searchableCellString = data[rowIndex][columnHead]?data[rowIndex][columnHead].toString().trim().toLowerCase():""
            }
            searchableRowString = searchableRowString + " " + searchableCellString
        })
        console.log(search);

        if (searchableRowString.includes(search.toLowerCase())) {
            return ""
        } else {
            return "hideIt"
        }
    }

    return (
        <table>
            <thead>
                <tr>
                    <th colSpan={columns.length}>
                        <div className="searchBarContainer">
                            <input
                                className="orderListSearchBar"
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }} />
                        </div>
                    </th>
                </tr>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                                style={{ cursor: "pointer" }}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === "asc" ? " ▲" : header.column.getIsSorted() === "desc" ? " ▼" : ""}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className={orderTableFilter(row.id)}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default CoolTable