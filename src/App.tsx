import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { useSearchParams } from "react-router";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { useGetArtWorksQuery } from "./api/services";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const op = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const [selectedProducts, setSelectedProducts] = useState(null);
  const { data, isLoading, isFetching } = useGetArtWorksQuery(page);

  const onPageChange = (event: { first: number; rows: number; page: number }) => {
    setSearchParams((prev) => {
      prev.set("page", (event.page + 1).toString());
      return prev;
    });
  };

  // ✅ Custom selection column header
  const selectionHeaderTemplate = (options) => {
    return (
      <div className="flex items-center justify-start gap-2">
        {/* force checkbox first */}
        <span className="order-1">{options.checkboxElement}</span>

        {/* force chevron second */}
        <span className="order-2">
          <Button
            type="button"
            icon="pi pi-chevron-down"
            className="p-button-text p-button-sm"
            onClick={(e) => op.current?.toggle(e)}
          />
        </span>

        {/* Overlay */}
        <OverlayPanel ref={op} dismissable>
          <div className="p-2 flex flex-col gap-2 w-48">
            <InputText value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter value" />
            <Button
              label="Submit"
              size="small"
              onClick={() => {
                console.log("Submitted:", inputValue);
                op.current?.hide();
              }}
            />
          </div>
        </OverlayPanel>
      </div>
    );
  };

  return (
    <div className="card">
      <DataTable
        loading={isLoading || isFetching}
        value={data?.data}
        selectionMode={"multiple"}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          headerCheckbox
          header={selectionHeaderTemplate} // 👈 now works with HeaderCheckbox
          headerStyle={{ width: "6rem" }}
        />
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of origin"></Column>
        <Column field="artist_display" header="Artist display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date start"></Column>
        <Column field="date_end" header="Date end"></Column>
      </DataTable>

      <Paginator
        first={(data?.pagination?.current_page - 1) * 12 || 0}
        rows={12}
        totalRecords={data?.pagination?.total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
