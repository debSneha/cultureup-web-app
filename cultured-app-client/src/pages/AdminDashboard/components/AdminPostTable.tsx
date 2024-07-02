import { Post } from "../../../types/Post";
import React, { useMemo } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import TablePagination from "./TablePagination";
import Modal from "../../../components/Modal/Modal";
import { useDeletePost } from "../../../api/post";
import { useNavigate } from "react-router-dom";

interface Props {
  tabData: Post[];
}

const MyPostTable = ({ tabData }: Props) => {
  const { mutate: deletePost } = useDeletePost();
  const navigate = useNavigate();

  const handleDelete = (data: any) => {
    deletePost({ postId: data?.row?.original?.id });
  };

  const handleEdit = (data: any) => {
    navigate(`/admin/post?postId=${data?.row?.original?.id}`);
  };

  const data = useMemo(() => tabData, [tabData]);
  const columnHelper = createColumnHelper<Post>();

  const columns = React.useMemo<ColumnDef<Post>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
      },
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Author",
        accessorKey: "author",
      },
      columnHelper.display({
        id: "edit",
        cell: (props) => (
          <button onClick={() => handleEdit(props)}>
            <PencilSquareIcon className="h-6 w-6 text-gray-500 hover:text-umeed-beige" />
          </button>
        ),
      }),
      columnHelper.display({
        id: "delete",
        cell: (props) => (
          <Modal
            icon={
              <TrashIcon className="h-6 w-6 text-gray-500 hover:text-umeed-beige" />
            }
            title="Delete Post"
            body= {<div>{`Are you sure you want to permanantly delete the post "${props?.row?.original?.title}" ?`}</div>}
            action="Delete"
            onClick={() => handleDelete(props)}
          ></Modal>
        ),
      }),
    ],
    []
  );
  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
    state: {
      columnVisibility: { id: false },
    },
    //
    debugTable: true,
  });

  return (
    <div className="w-full text-gray-700">
      <table className="w-full table-auto my-10 border-collapse rounded-md border">
        <thead className="text-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className="border-b bg-gray-50 text-left"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((column) => (
                <th key={column.id} className="py-4 px-12">
                  {column.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        column.column.columnDef.header,
                        column.getContext()
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="border-b border-gray-200 py-2 px-12"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div />
      <TablePagination table={table}></TablePagination>
    </div>
  );
};

export default MyPostTable;
