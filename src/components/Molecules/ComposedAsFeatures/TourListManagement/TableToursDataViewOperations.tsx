import { ChangeEventHandler, FC } from "react";

import {
  FunnelIcon,
  Bars3BottomLeftIcon,
  CalendarDaysIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import ButtonSelection from "src/components/Molecules/ButtonSelection";
import Select from "src/components/Molecules/Select";
import TableDataViewOperations, {
  FilterGroup,
  FilterLabel,
  Divider,
} from "src/components/Molecules/TableDataViewOperations";

import { ToursCollectionQueryVariables } from "src/gql/graphql";

// ─── Sort Options with Emojis ─────────────────────────────────────────────────

const optionsOrderBy = [
  {
    label: "Date created (newest)",
    value: "created_at-DescNullsLast",
    icon: CalendarDaysIcon,
  },
  {
    label: "Date created (oldest)",
    value: "created_at-AscNullsLast",
    icon: CalendarDaysIcon,
  },
  {
    label: "Name (A → Z)",
    value: "name-AscNullsLast",
    icon: BarsArrowDownIcon,
  },
  {
    label: "Name (Z → A)",
    value: "name-DescNullsLast",
    icon: BarsArrowUpIcon,
  },
  {
    label: "Price (low → high)",
    value: "price-AscNullsFirst",
    icon: CurrencyDollarIcon,
  },
  {
    label: "Price (high → low)",
    value: "price-DescNullsLast",
    icon: CurrencyDollarIcon,
  },
  {
    label: "Availability (low → high)",
    value: "availability-AscNullsFirst",
    icon: ChartBarIcon,
  },
  {
    label: "Capacity (low → high)",
    value: "capacity-AscNullsFirst",
    icon: UsersIcon,
  },
  {
    label: "City (A → Z)",
    value: "city-AscNullsFirst",
    icon: MapPinIcon,
  },
];

// ─── Filter Options ───────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

const TableToursDataViewOperations: FC<{
  onButtonSelectionSelect?: (value: string) => void;
  onDropdownSelectChange?: ChangeEventHandler<HTMLSelectElement>;
  queryVariables: ToursCollectionQueryVariables;
}> = ({ onButtonSelectionSelect, onDropdownSelectChange, queryVariables }) => {
  return (
    <TableDataViewOperations>
      {/* Filter Group */}
      <FilterGroup>
        <FilterLabel>
          <FunnelIcon />
          Filter
        </FilterLabel>

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
      </FilterGroup>

      {/* Divider */}
      <Divider />

      {/* Sort Group */}
      <FilterGroup>
        <FilterLabel>
          <Bars3BottomLeftIcon />
          Sort
        </FilterLabel>

        <Select
          name="selectSort"
          onChange={onDropdownSelectChange}
          options={optionsOrderBy}
          value={(() => {
            const orderBy = Object.entries(queryVariables.orderBy as object)[0];
            return orderBy.join("-");
          })()}
        />
      </FilterGroup>
    </TableDataViewOperations>
  );
};

export default TableToursDataViewOperations;
