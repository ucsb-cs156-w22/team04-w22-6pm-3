import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CreateCommonsForm from "main/components/Commons/CreateCommonsForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify"

export default function AdminEditCommonsPage() {
  let { id } = useParams();

  const { data: common, error: error, status: status } =
    useBackend(
      [`/api/commons?id=${id}`],
      {
        method: "GET",
        url: `/api/commons`,
        params: {
          id
        }
      }
    );

    const objectToAxiosPutParams = (common) => ({
      url: "/api/commons/update",
      method: "PUT",
      params: {
        id
      },
      data: {
       name: common.name,
       cowPrice: common.cowPrice,
       milkPrice: common.milkPrice,
       startingBalance: common.startingBalance,
       startingDate: common.startingDate
      }
    });

    const onSuccess = (common) => {
      toast(`Common Updated - id: ${id}`)
    }

    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      [`/api/commons?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
      mutation.mutate(data);
    }

    if (isSuccess) {
      return <Navigate to = "/admin/listcommons" />
    }

    return(
      <BasicLayout>
        <div className = "pt-2">
          <h1>Edit Common</h1>
          {common &&
            <CreateCommonsForm onSubmit={onSubmit} />
          }  
        </div>
      </BasicLayout>
    )
}
