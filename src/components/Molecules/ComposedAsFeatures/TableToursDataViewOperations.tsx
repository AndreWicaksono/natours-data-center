import ButtonSelection from "src/components/Molecules/ButtonSelection";
import Select from "src/components/Molecules/Select";
import TableDataViewOperations from "src/components/Molecules/TableDataViewOperations";

function TableToursDataViewOperations() {
  return (
    <TableDataViewOperations>
      <ButtonSelection
        defaultSelectedOption="all"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />

      <Select
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by price (low first)" },
          { value: "regularPrice-desc", label: "Sort by price (high first)" },
          { value: "maxCapacity-asc", label: "Sort by capacity (low first)" },
          { value: "maxCapacity-desc", label: "Sort by capacity (high first)" },
        ]}
      />
    </TableDataViewOperations>
  );
}

export default TableToursDataViewOperations;
