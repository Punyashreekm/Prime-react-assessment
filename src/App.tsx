import { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { useSearchParams } from "react-router";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { useGetArtWorksQuery } from "./api/services";
import { unionBy } from "lodash";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const op = useRef<any>(null);
  //maintain page state in url
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [selectionCompleted, setSelectionCompleted] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(false);
  //auto fetch data on page change
  const { data, isLoading, isFetching } = useGetArtWorksQuery(page);

  const onPageChange = (event: { first: number; rows: number; page: number }) => {
    //update page state in url
    setSearchParams((prev) => {
      prev.set("page", (event.page + 1).toString());
      return prev;
    });
  };

  useEffect(() => {
    //if no data, return
    if (!data?.data) return;

    //if pending selection and not selection completed, add remaining rows
    if (pendingSelection && !selectionCompleted) {
      const remaining = +inputValue - selectedProducts.length;

      if (remaining > 0) {
        const toAdd = (data?.data as any[]).slice(0, remaining);
        //union by id to avoid duplicates
        setSelectedProducts((prev) => unionBy([...prev, ...toAdd], "id"));
      }
    }
  }, [data, pendingSelection, selectionCompleted]);

  useEffect(() => {
    //set selection completed when all rows are selected
    if (+inputValue > 0 && selectedProducts.length >= +inputValue) {
      setSelectionCompleted(true);
      setPendingSelection(false);
    }
  }, [selectedProducts, inputValue]);

  //handle submit button click
  const handleSubmit = () => {
    //reset selection before new bulk select
    setSelectedProducts([]);
    setSelectionCompleted(false);
    setPendingSelection(true);
    op.current?.hide();
  };

  //selection header template
  const selectionHeaderTemplate = () => {
    return (
      <div className="flex items-center justify-start gap-2">
        <div style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}>
          <Button
            type="button"
            icon="pi pi-chevron-down"
            className="p-button-text p-button-sm"
            onClick={(e) => op.current?.toggle(e)}
          />
        </div>

        <OverlayPanel ref={op} dismissable>
          <div className="p-2 flex flex-col gap-2 w-48">
            <InputText value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter value" />
            <Button label="Submit" size="small" onClick={handleSubmit} />
          </div>
        </OverlayPanel>
      </div>
    );
  };

  return (
    <div className="card">
      <DataTable
        loading={isLoading || isFetching}
        value={data?.data as any[]}
        selectionMode="multiple"
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column selectionMode="multiple" header={selectionHeaderTemplate} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of origin" />
        <Column field="artist_display" header="Artist display" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date start" />
        <Column field="date_end" header="Date end" />
      </DataTable>

      <Paginator
        first={(+data?.pagination?.current_page - 1) * 12 || 0}
        rows={12}
        totalRecords={+data?.pagination?.total || 0}
        onPageChange={onPageChange}
      />
    </div>
  );
}
