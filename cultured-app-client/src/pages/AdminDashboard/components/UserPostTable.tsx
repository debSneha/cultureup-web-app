import { PostTable } from "../../../types/Post";
import { useEffect, useState, useMemo, MouseEvent } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "../../../components";
import TablePagination from "../components/TablePagination";
import { useDeletePost, useUpdatePost } from "../../../api/post";
import { toast } from "react-toastify";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/Modal/Modal";

interface Props {
  tabData: PostTable[];
}

const UserPostTable = ({ tabData }: Props) => {
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();
  const data = useMemo(() => tabData, [tabData]);
  const navigate = useNavigate();

  let rejectReason = "";

  const columnHelper = createColumnHelper<PostTable>();

  const columns = useMemo<ColumnDef<PostTable>[]>(
    () => [
      {
        accessorFn: "title",
        header: "Title",
        cell: (info) => titleDisplay(info),
      },
      {
        accessorKey: "author",
        header: "Author",
      },
      columnHelper.accessor("status", {
        id: "status",
        header: "Status",
        cell: (info) => statusDisplay(info),
      }),
      columnHelper.display({
        id: "approve",
        cell: (props) => approveFilter(props?.row?.original),
      }),
      columnHelper.display({
        id: "reject",
        cell: (props) => rejectFilter(props?.row?.original),
      }),
      columnHelper.display({
        id: "edit",
        cell: (props) => (
          <button onClick={() => handleEdit(props?.row?.original)}>
            <PencilSquareIcon className='h-6 w-6 text-gray-500 hover:text-umeed-beige' />
          </button>
        ),
      }),
      columnHelper.display({
        id: "delete",
        cell: (props) => (
          <Modal
            icon={
              <TrashIcon className='h-6 w-6 text-gray-500 hover:text-umeed-beige' />
            }
            title='Delete Post'
            body={
              <div>{`Are you sure you want to permanantly delete the post "${props?.row?.original?.title}" ?`}</div>
            }
            action='Delete'
            onClick={() => handleDelete(props)}></Modal>
        ),
      }),
    ],
    [tabData]
  );

  const titleDisplay = (rowData: any) => {
    return (
      <div
        className='font-regular text-slate-600 underline cursor-pointer overflow-hidden max-w-md flex-nowrap text-ellipsis'
        onClick={() => handleClick(rowData.row.original)}>
        {rowData.row.original.title}
      </div>
    );
  };

  const statusDisplay = (rowData: any) => {
    if (rowData.getValue() === "APPROVED") {
      return (
        <span className='bg-umeed-cyan text-gray-500 text-xs font-medium mr-2 px-2.5 py-0.5'>
          {rowData.getValue()}
        </span>
      );
    } else if (rowData.getValue() == "REJECTED") {
      return (
        <Modal
          icon={
            <div className='bg-umeed-tangerine-100 text-umeed-tangerine-500 text-xs font-medium mr-2 px-2.5 py-0.5'>
              {rowData.getValue()}{" "}
            </div>
          }
          title='Rejection Reason:'
          body={<div>{rowData?.row?.original?.rejectDsc}</div>}
          action={""}
          onClick={() => {
            handleRejectClick(rowData?.row?.original);
          }}></Modal>
      );
    } else {
      return (
        <span className='bg-gray-200 text-gray-500 text-xs font-medium mr-2 px-2.5 py-0.5 '>
          {"IN REVIEW"}
        </span>
      );
    }
  };

  const approveFilter = (rowData: any) => {
    if (rowData.status === "IN_REVIEW" || rowData.status === "REJECTED") {
      return (
        <Button
          className='bg-umeed-cyan hover:bg-cyan-200 text-gray-600 px-5 py-1 rounded'
          onClick={() => handleApproveClick(rowData)}>
          Approve
        </Button>
      );
    } else {
      return <></>;
    }
  };

  const rejectFilter = (rowData: any) => {
    if (rowData.status === "IN_REVIEW" || rowData.status === "APPROVED") {
      return (
        <Modal
          icon={
            <div className='bg-umeed-tangerine-100 hover:bg-umeed-tangerine-300 text-gray-600 px-5 py-1 rounded text-center'>
              Reject
            </div>
          }
          title='Give a reason'
          body={
            <input
              className='border border-gray-300 rounded-none p-2 text-md w-full text-gray-700 font-light outline-gray-300 placeholder:text-gray-400'
              onChange={(event) => {
                rejectReason = event.target.value;
              }}
            />
          }
          action='Submit'
          onClick={() => {
            handleRejectClick(rowData);
          }}></Modal>
      );
    } else {
      return <></>;
    }
  };

  const handleApproveClick = async (rowData: any) => {
    updatePost({
      status: "APPROVED",
      id: rowData.id,
    });
    toast.success(`Post "${rowData.title}" is approved! `);
  };

  const handleRejectClick = async (rowData: any) => {
    console.log("reasonn", rejectReason);
    if (rejectReason === "") {
      toast.error("No rejection reason given. Aborting reject.");
      return;
    }
    updatePost({
      status: "REJECTED",
      id: rowData.id,
      rejectDsc: rejectReason,
    });
    toast.success(`Post "${rowData.title}" is rejected! `);
  };

  const handleClick = (rowData: any) => {
    navigate(`/post/${rowData.id}`);
  };

  const handleEdit = (rowData: any) => {
    navigate(`/admin/post?postId=${rowData.id}`);
  };

  const handleDelete = (data: any) => {
    deletePost({ postId: data?.row?.original?.id });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
    debugTable: true,
  });

  return (
    <div className='w-full text-gray-700'>
      <div className='overflow-scroll'>
        <table className='w-full table-auto my-10 border-collapse rounded-md border'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className='border-b bg-gray-50 text-left'
                key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className='py-4 px-12'
                      key={header.id}
                      colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className='border-b border-gray-200 py-2 px-12'
                      key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TablePagination table={table}></TablePagination>
    </div>
  );
};

export default UserPostTable;
