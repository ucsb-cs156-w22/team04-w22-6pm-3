import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AdminEditCommonsPage from "main/pages/AdminEditCommonsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CommonsEditPage tests", () => {

    describe("when the backend doesn't return a common", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/commons", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit Common")).toBeInTheDocument());
            expect(queryByTestId("CreateCommonsForm-name")).not.toBeInTheDocument();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/commons", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "abc",
                cowPrice: 123,
                milkPrice: 123,
                startingBalance: 123,
                startingDate: "2022-03-05T12:00:00"
            });
            axiosMock.onPut('/api/commons/update').reply(200);
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("CreateCommonsForm-name")).toBeInTheDocument());

            //const idField = getByTestId("CreateCommonsForm-id");
            const nameField = getByTestId("CreateCommonsForm-name");
            const cowPriceField = getByTestId("CreateCommonsForm-cowPrice");
            const milkPriceField = getByTestId("CreateCommonsForm-milkPrice");
            const startingBalanceField = getByTestId("CreateCommonsForm-startingBalance");
            const startingDateField = getByTestId("CreateCommonsForm-startingDate");
            const submitButton = getByTestId("CreateCommonsForm-Create-Button");

            //expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("abc");
            expect(cowPriceField).toHaveValue(123);
            expect(milkPriceField).toHaveValue(123);
            expect(startingBalanceField).toHaveValue(123);
            expect(startingDateField).toHaveValue("2022-03-05");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AdminEditCommonsPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("CreateCommonsForm-name")).toBeInTheDocument());

            //const idField = getByTestId("CreateCommonsForm-id");
            const nameField = getByTestId("CreateCommonsForm-name");
            const cowPriceField = getByTestId("CreateCommonsForm-cowPrice");
            const milkPriceField = getByTestId("CreateCommonsForm-milkPrice");
            const startingBalanceField = getByTestId("CreateCommonsForm-startingBalance");
            const startingDateField = getByTestId("CreateCommonsForm-startingDate");
            const submitButton = getByTestId("CreateCommonsForm-Create-Button");

            //expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("abc");
            expect(cowPriceField).toHaveValue(123);
            expect(milkPriceField).toHaveValue(123);
            expect(startingBalanceField).toHaveValue(123);
            expect(startingDateField).toHaveValue("2022-03-05");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'cba' } });
            fireEvent.change(cowPriceField, { target: { value: '321' } });
            fireEvent.change(milkPriceField, { target: { value: '321' } });
            fireEvent.change(startingBalanceField, { target: { value: '321' } });
            fireEvent.change(startingDateField, { target: { value: '2022-03-07T12:00:00' } });

            fireEvent.click(submitButton);

            waitFor(() => expect(mockNavigate).toBeCalledWith({ "to": "/admin/listcommons" }));
            waitFor(() => expect(mockToast).toBeCalled);
            waitFor(() => expect(mockToast).toBeCalledWith("Commons with identifier 17 updated."));

            // HTTP PUT does not reply with a response body.
            waitFor(() => expect(axiosMock.history.put.length).toBe(1)); // times called
        });


    });
});
