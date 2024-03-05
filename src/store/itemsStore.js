import { atom, selector } from "recoil";
import { selectedCategoryAtom } from "./categoryAtom";

export const allItemsAtom=atom({
    key:"allItemsAtom",
    default:[]
});

export const wishListItemsAtom=atom({
    key:"wishListItemsAtom",
    default:[],
});

export const searchAtom=atom({
    key:"searchAtom",
    default:""
});

export const cartItemsAtom=atom({
    key:"cartItemsAtom",
    default:[]
});

export const filteredItemsSelector=selector({
    key:"filteredItemsSelector",
    get:({get})=>{
        const category=get(selectedCategoryAtom);
        const items=get(allItemsAtom);
        const search=get(searchAtom);
        let filteredItems=[];
        //filtering the items
        if(category=="ALL"){
            filteredItems=items.filter(x=>{
                let name=x.name.toLowerCase();
                return name.includes(search.toLowerCase().trim());
            });
        }
        else{
            filteredItems=items.filter(x=>{
                let name=x.name.toLowerCase();
                return x.category==category && name.includes(search.toLowerCase().trim());
            });
        }
        //sorting the items
        filteredItems=filteredItems.sort(function(a,b){
            if(category=="ALL"){
                return a.global_order-b.global_order;
            }
            else {
                return a.category_order-b.category_order;
            }
        });
        return filteredItems;
    }
});

export const cartSummarySelector=selector({
    key:"cartSummarySelector",
    get:({get})=>{
        const cartItems=get(cartItemsAtom);
        let total_item=0,total_price=0,out_of_stock=0;
        for( let x of cartItems){
            if(x.item.in_stock!=0){
                total_item+=x.quantity;
                total_price+=x.quantity*x.item.price;
            }
            else{
                out_of_stock++;
            }
        }
        return {total_item,total_price,out_of_stock};
    }
});

