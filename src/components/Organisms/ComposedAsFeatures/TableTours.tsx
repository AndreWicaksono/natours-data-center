import Heading from "src/components/Atoms/Heading";
import TableToursDataViewOperations from "src/components/Molecules/ComposedAsFeatures/TableToursDataViewOperations";
import Table from "src/components/Organisms/Table/Table";
import TableRow, {
  ImgThumbnail,
  Label,
  LabelDiscount,
  LabelPrice,
} from "src/components/Organisms/Table/TableRow";
import { LayoutRow } from "src/global.css";

function TableTours() {
  return (
    <>
      <LayoutRow type="horizontal">
        <Heading as="h1">All tours</Heading>
        <TableToursDataViewOperations />
      </LayoutRow>

      <LayoutRow>
        <Table role="table">
          <Table.Header>
            <div></div>
            <div>Tour</div>
            <div>Capacity</div>
            <div>Price</div>
            <div>Discount</div>
            <div></div>
          </Table.Header>

          <Table.Body isNoData={false}>
            <TableRow idRow="row-jogja-istimewa">
              <ImgThumbnail
                src={
                  "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg"
                }
              />
              <Label>{"Jogja Istimewa"}</Label>
              <div>Fits up to 5 guests</div>
              <LabelPrice>{1500000}</LabelPrice>
              <LabelDiscount>{30}</LabelDiscount>
              {/* {discount ? <Discount>{discount}</Discount> : <span>&mdash;</span>} */}
            </TableRow>

            <TableRow idRow="row-cerita-pangandaran">
              <ImgThumbnail
                src={
                  "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-004.jpg"
                }
              />
              <Label>{"Cerita Pangandaran"}</Label>
              <div>Fits up to 8 guests</div>
              <LabelPrice>{3500000}</LabelPrice>
              <LabelDiscount>{20}</LabelDiscount>
              {/* {discount ? <Discount>{discount}</Discount> : <span>&mdash;</span>} */}
            </TableRow>
          </Table.Body>
        </Table>
      </LayoutRow>
    </>
  );
}

export default TableTours;
