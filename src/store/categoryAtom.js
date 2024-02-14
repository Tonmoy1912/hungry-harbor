"use client";
import { atom, selector } from "recoil";

export const categoryAtom=atom({
    key:"catagoriesAtom",
    default:selector({
        key:"categoriesSelector",
        get:async ()=>{
            let res=await fetch("/api/category/get-all-categories",{
                cache:"no-store",
            });
            res=await res.json();
            let total=0;
            for( let x of res.categories){
                total+=x.total;
            }
            return [{category:"ALL",total:total},...res.categories];
        }
    })
}) 