import { onDeleteSuccess, cellToAxiosParamsDelete, editCallback } from "main/utils/commonsUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("CommonsUtils", () => {

    describe("onDeleteSuccess", () => {

        test("It puts the message in a toast", () => {
            // act
            onDeleteSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
        });

    });
    describe("cellToAxiosParamsDelete", () => {

        test("It returns the correct params", () => {
            // arrange
            const cell = { row: { values: { id: 17 } } };

            // act
            const result = cellToAxiosParamsDelete(cell);

            // assert
            expect(result).toEqual({
                url: "/api/commons",
                method: "DELETE",
                params: { id: 17 }
            });
        });

    });
});

