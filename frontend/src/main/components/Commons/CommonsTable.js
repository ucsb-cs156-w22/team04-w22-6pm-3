import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/commonsUtils"
import { useNavigate } from "react-router-dom";

export default function CommonsTable({ commons }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/admin/editcommons/${cell.row.values.id}`)
        //navigate(`/commons/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: (data) => onDeleteSuccess(data.message) },
        ["/api/commons/all"]
    );
    // Stryker enable all

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data

        },
        {
            Header:'Name',
            accessor: 'name',
        },
        {
            Header:'Cow Price',
            accessor: row => String(row.cowPrice),
            id: 'cowPrice'
        },
        {
            Header:'Milk Price',
            accessor: row => String(row.milkPrice),
            id: 'milkPrice'
        },
        {
            Header:'Starting Balance',
            accessor: row => String(row.startingBalance),
            id: 'startingBalance'
        },
        {
            Header:'Starting Date',
            accessor: row => String(row.startingDate),
            id: 'startingDate'
        }
    ];

    columns.push(ButtonColumn("Edit", "primary", editCallback, "CommonsTable"));
    columns.push(ButtonColumn("Delete", "danger", deleteCallback, "CommonsTable"));

    return <OurTable
        data={commons}
        columns={columns}
        testid={"CommonsTable"}
    />;
};
