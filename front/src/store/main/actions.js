
let actions = {

    GET_SALES: (context, { page, rows }) => {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:5000/analytics/sales?page=${page}&limit=${rows}`)
                .then(response => response.json())
                .then(sales => {
                    context.commit("SAVE_SALES", sales);
                    resolve(sales);
                }).catch((err) => {
                reject(err);
            });
        });
    },

    GET_ALLSALES: (context, { page, rows }) => {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:5000/analytics/allsales`)
                .then(response => response.json())
                .then(sales => {
                    context.commit("SAVE_ALLSALES", sales);
                    resolve(sales);
                }).catch((err) => {
                reject(err);
            });
        });
    },

    GET_PRODUCTS: (context) => {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:5000/analytics/products`)
                .then(response => response.json())
                .then(products => {
                    context.commit("SAVE_PRODUCTS", products);
                    resolve(products);
                }).catch((err) => {
                reject(err);
            });
        });
    },

    GET_CATEGORY: (context) => {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:5000/analytics/category_sales`)
                .then(response => response.json())
                .then(category => {
                    context.commit("SAVE_CATEGORY", category);
                    resolve(category);
                }).catch((err) => {
                reject(err);
            });
        });
    },

    GET_TRENDPROD: (context) => {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:5000/analytics/trending_products`)
                .then(response => response.json())
                .then(trendprod => {
                    context.commit("SAVE_TRENDPROD", trendprod);
                    resolve(trendprod);
                }).catch((err) => {
                reject(err);
            });
        });
    },
};

export default actions;
