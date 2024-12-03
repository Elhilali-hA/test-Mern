

let mutations = {
   
    
    SAVE_SALES: (state, payload) => {
        state.sales = payload;
    },

    SAVE_ALLSALES: (state, payload) => {
        state.allsales = payload;
    },

    SAVE_PRODUCTS: (state, payload) => {
        state.products = payload;
    },

    SAVE_CATEGORY: (state, payload) => {
        state.category = payload;
    },

    SAVE_TRENDPROD: (state, payload) => {
        state.trendprod = payload;
    },
};

export default mutations;
