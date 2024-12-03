<script setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { computed, onMounted, ref } from 'vue';
import { useStore } from "vuex";

const store = useStore();
let product = computed(() => store.getters["PRODUCTS"]);

const getProducts = async () => {
          const data = await store.dispatch("GET_PRODUCTS", {});
           return product.value
        };
        
const getProductsMedium = () => {
        return Promise.resolve(getProducts());
    }

onMounted(() => {
    getProductsMedium().then((data) => (products.value = data));

});

const products = ref();

const filters = ref();

const loading = ref(true);

onMounted(() => {
    getProductsMedium().then((data) => {
        products.value = getFilterP(data);
        loading.value = false;
    });
});


const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'ProductName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'Category': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'Price': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    };
};

initFilters();

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const clearFilter = () => {
    initFilters();
};
const getFilterP = (data) => {
    return [...(data || [])].map((d) => {
        d.date = new Date(d.date);

        return d;
    });
};

</script>

<template>
    <div class="card">
    <h1 class="font-extrabold text-lg">Products :</h1>

        <DataTable v-model:filters="filters" :value="products" paginator showGridlines :rows="10" dataKey="id"
                filterDisplay="menu" :loading="loading" :globalFilterFields="['ProductName', 'Category', 'price']">
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No products found. </template>
            <template #loading> Loading products data. Please wait. </template>
            <Column field="ProductName" header="ProductName" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.ProductName }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="Category" filterField="Category" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.Category }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>
                <template #filterfooter>
                    <div class="px-4 pt-0 pb-4 text-center">Customized Buttons</div>
                </template>
            </Column>
            <Column header="Price" filterField="Price" dataType="numeric" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatCurrency(data.Price) }}
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
