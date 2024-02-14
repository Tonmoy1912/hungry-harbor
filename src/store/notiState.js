import { atom } from "recoil";

export const notiAtom=atom({
    key:"notiAtom",
    default:{ message:"", type:"",  show:false }
}) 

