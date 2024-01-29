import { atom } from "recoil";

export const navAtom=atom({
    key:"navAtom",
    default:{
        open:false,
        curTab:"none"
    }
});
