import { ChangeEventHandler, FC } from "react";

import ButtonSelection from "src/components/Molecules/ButtonSelection";
import Select from "src/components/Molecules/Select";
import TableDataViewOperations from "src/components/Molecules/TableDataViewOperations";

import { ToursCollectionQueryVariables } from "src/gql/graphql";

const optionsOrderBy: Array<{ label: string; value: string }> = [
  {
    label: "Sort by Date created (Z-A)",
    value: "created_at-DescNullsLast",
  },
  {
    label: "Sort by Date created (A-Z)",
    value: "created_at-AscNullsLast",
  },
  {
    label: "Sort by name (A-Z)",
    value: "name-AscNullsLast",
  },
  {
    label: "Sort by name (Z-A)",
    value: "name-DescNullsLast",
  },
  {
    label: "Sort by price (low first)",
    value: "price-AscNullsFirst",
  },
  {
    label: "Sort by price (high first)",
    value: "price-DescNullsLast",
  },
  {
    label: "Sort by availability (low first)",
    value: "availability-AscNullsFirst",
  },
  {
    label: "Sort by availability (high first)",
    value: "availability-DescNullsLast",
  },
];

const optionsPublishedStatus: Array<{ label: string; value: string }> = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Draft",
    value: "draft",
  },
];

const TableToursDataViewOperations: FC<{
  onButtonSelectionSelect?: (value: string) => void;
  onDropdownSelectChange?: ChangeEventHandler<HTMLSelectElement>;
  queryVariables: ToursCollectionQueryVariables;
}> = ({ onButtonSelectionSelect, onDropdownSelectChange, queryVariables }) => {
  return (
    <TableDataViewOperations>
      <ButtonSelection
        onSelect={(value) => {
          if (onButtonSelectionSelect) {
            onButtonSelectionSelect(value);
          }
        }}
        options={optionsPublishedStatus}
        value={(() => {
          if ("filter" in queryVariables) {
            if (queryVariables.filter?.is_published?.eq === true) {
              return "published";
            } else {
              return "draft";
            }
          } else {
            return "all";
          }
        })()}
      />

      <Select
        name="selectSort"
        onChange={onDropdownSelectChange}
        options={optionsOrderBy}
        value={(() => {
          const orderBy = Object.entries(queryVariables.orderBy as object)[0];

          return orderBy.join("-");
        })()}
      />
    </TableDataViewOperations>
  );
};

export default TableToursDataViewOperations;
