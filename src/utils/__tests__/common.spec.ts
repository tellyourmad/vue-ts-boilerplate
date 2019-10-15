import { responseTransforamtor } from "../common";
describe("Common Utils", () => {
    it("should return empty object if passing value is null", () => {
        // @ts-ignore
        interface IData {
            data: any;
            msg: string;
            success: boolean;
            total: number;
        }
        const beforeObject: IData = {
            data: null,
            msg: "",
            success: false,
            total: 0
        };
        expect(responseTransforamtor(beforeObject, {}).data).toEqual({});
    });
    it("should return empty array if passing value is 0", () => {
        // @ts-ignore
        interface IData {
            data: any;
            msg: string;
            success: boolean;
            total: number;
        }
        const beforeObject: IData = {
            data: 0,
            msg: "",
            success: false,
            total: 0
        };
        expect(responseTransforamtor(beforeObject, []).data).toEqual([]);
    });
    it("should return origin value if passing value is available", () => {
        // @ts-ignore
        interface IData {
            data: any;
            msg: string;
            success: boolean;
            total: number;
        }
        const beforeObject: IData = {
            data: [1, 2, 3, 4],
            msg: "",
            success: false,
            total: 0
        };
        expect(responseTransforamtor(beforeObject, []).data).toEqual([
            1,
            2,
            3,
            4
        ]);
    });
    it("should return original value if passing value is number and value is greater than zero", () => {
        // @ts-ignore
        interface IData {
            data: any;
            msg: string;
            success: boolean;
            total: number;
        }
        const beforeObject: IData = {
            data: 12,
            msg: "",
            success: false,
            total: 0
        };
        expect(responseTransforamtor(beforeObject, 0).data).toEqual(12);
    });
});
