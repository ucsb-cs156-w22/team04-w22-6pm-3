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

    // TODO: Apparently Date.toISOString converts the Date to UTC from local time. I'm struggling to
    // understand how the form operates, but it appears to be making an ISO string from the date
    // input. That could be a problem. In fact, we shouldn't be using the string constructor `new
    // Date()` ever. The backend does not keep track of time zone information. Come back to this!

    // https://stackoverflow.com/questions/14245339/pre-populating-date-input-field-with-javascript

    if (common) {
      console.log(common.startingDate);
      common.startingDate = new Date(common.startingDate).toISOString().substring(0, 10); // BAD
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
