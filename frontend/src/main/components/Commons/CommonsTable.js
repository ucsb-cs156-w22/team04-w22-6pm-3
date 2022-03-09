import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/commonsUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function CommonsTable({ commons, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/commons/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
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
            Header:'name',
            accessor: 'name',
        },
        {
            Header:'day',
            accessor:'day',
        },
        {
            Header:'startDate',
            accessor:'startDate',
        },
        {
            Header:'endDate',
            accessor:'endDate',
        },
        {
            Header:'totalPlayers',
            accessor:'totalPlayers',
        },
        {
            Header:'cowPrice',
            accessor:'cowPrice',
        },
        {
            Header:'milkPrice',
            accessor:'milkPrice',
        },
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "CommonsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "CommonsTable"));
    } 

    

    return <OurTable
        data={commons}
        columns={columns}
        testid={"CommonsTable"}
    />;
};
