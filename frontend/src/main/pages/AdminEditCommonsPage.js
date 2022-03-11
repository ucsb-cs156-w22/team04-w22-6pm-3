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
      url: `/api/commons/update?id=${common.id}`,
      method: "PUT",
      params: {
        id: common.id,
      },
      data: {
       name: common.name,
       cowPrice: common.cowPrice,
       milkPrice: common.milkPrice,
       startingBalance: common.startingBalance,
       startingDate: common.startingDate
      }
    });

    const onSuccess = () => {
      toast(`Common with identifier ${id} updated.`)
    }

    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      [`/api/commons/update?id=${id}`]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (data) => {
      // Tack on the identifier property for the PUT method.
      data.id = id;
      mutation.mutate(data);
    }

    if (isSuccess) {
      return <Navigate to="/admin/listcommons" />
    }

    // TODO: Not quite sure what to do if the backend fails to fetch before we get here. We get the
    // date to feed to the HTML date input.

    if (common) {
      common.startingDate = common.startingDate.substring(0, 10);
    }

    return(
      <BasicLayout>
        <div className = "pt-2">
          <h1>Edit Common</h1>
          {common &&
            <CreateCommonsForm defaultValues={common} onSubmit={onSubmit} /*buttonLabel="Update"*/ />
          }
        </div>
      </BasicLayout>
    )
}
