import { Table as ReactTable } from "@tanstack/react-table";
import { Post, PostTable } from "../../../types/Post";
import { Button } from "../../../components";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from "@heroicons/react/24/solid";

interface Props {
  table: ReactTable<Post> | ReactTable<PostTable>;
}

const TablePagination = ({ table }: Props) => {
  return (
    <div className='flex justify-between items-center w-full '>
      <div>
        <Button
          styles='ml-0'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          <div className='flex align-center gap-1'>
            <ArrowSmallLeftIcon className='w-6 h-6' />
            Previous Page
          </div>
        </Button>
      </div>
      <div>
        <span>
          {` Page `}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span>
          {` | Go to page: `}
          <input
            type='number'
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className='border p-1 rounded w-16 outline-umeed-tangerine-300'
          />
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className='h-8 mx-2 border outline-umeed-tangerine-300'>
          {[5, 10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          <div className='flex align-center gap-1'>
            Next Page
            <ArrowSmallRightIcon className='w-6 ' />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
