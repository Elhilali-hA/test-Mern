
let getters = {

    PRODUCTS: (state) => {
        return state.products;
    },

    SALES: (state) => {
        return state.sales;
    },

    ALLSALES: (state) => {
        return state.allsales;
    },

    CATEGORY: (state) => {
        return state.category;
    },

    TRENDPROD: (state) => {
        return state.trendprod;
    },
   
    MESSAGE: (state) => {
        return state.message;
    },
};

export default getters;
