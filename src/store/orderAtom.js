import { atom } from "recoil";

export const userActiveOrderAtom=atom({
    key:"userActiveOrderAtom",
    default:[]
});

export const adminActiveOrderAtom=atom({
    key:"adminActiveOrderAtom",
    default:[]
});