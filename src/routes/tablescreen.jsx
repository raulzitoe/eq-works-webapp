import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useGlobalFilter, useTable } from "react-table";
import { Table, Card } from "react-bootstrap";
import { GlobalFilter } from "../components/GlobalFilter";

export default function TableScreen(props) {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const response = await axios
      .get("https://gelatinous-crystalline-guppy.glitch.me/events/hourly")
      .catch((err) => console.log(err));

    if (response) {
      const events = response.data;

      console.log("Events: ", events);
      setEvents(events);
    }
  };

  const eventsData = useMemo(() => [...events], [events]);

  const eventsColumns = useMemo(
    () =>
      events[0]
        ? Object.keys(events[0]).map((key) => {
            return { Header: key, accessor: key };
          })
        : [],
    [events]
  );
  console.log(events);

  const tableInstance = useTable(
    { columns: eventsColumns, data: eventsData },
    useGlobalFilter
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = tableInstance;

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-primary p-5">
      <Card className="shadow-lg m-1 p-5 mx-auto">
        <h2 className="mx-auto mb-4">Table Screen</h2>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
        <Table {...getTableProps()} reponsive="true" striped hover size="sm bg-white">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
