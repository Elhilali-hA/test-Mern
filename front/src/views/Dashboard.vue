<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from "vuex";

const store = useStore();
let category = computed(() => store.getters["CATEGORY"]);
let produit = computed(() => store.getters["PRODUCTS"]);
let sales = computed(() => store.getters["SALES"]);
let trendprod = computed(() => store.getters["TRENDPROD"]);

const getCategory = async () => {
    await store.dispatch("GET_CATEGORY", {});
    return category.value
};

const getTRENDPROD = async () => {
    await store.dispatch("GET_TRENDPROD", {});
    return trendprod.value?.result
};

const getProducts = async () => {
    await store.dispatch("GET_PRODUCTS", {});
    totalProducts.value = produit.value.length
};

const getSales = async (startDate, endDate) => {

    await store.dispatch("GET_SALES", { startDate, endDate });
    
    if (sales.value && sales.value.data) {
        totalSales.value = sales.value.totalSales; 
        
        totalVentes(sales.value.data, startDate, endDate);
        
    }
};

const totalVentes = (data, startDate, endDate) => {
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj) || isNaN(endDateObj)) {
        console.error(`Invalid start or end date: ${startDate} - ${endDate}`);
        return; 
    }

    const formattedStartDate = startDateObj.toISOString().split('T')[0];
    const formattedEndDate = endDateObj.toISOString().split('T')[0];

    const filteredSales = data.filter(sale => {
        const saleDate = new Date(sale.Date);
        
        if (isNaN(saleDate)) {
            console.error(`Invalid sale date: ${sale.Date}`);
            return false; 
        }

        const formattedSaleDate = saleDate.toISOString().split('T')[0];

        return formattedSaleDate >= formattedStartDate && formattedSaleDate <= formattedEndDate;
    });

  
    totalsales.value = filteredSales.reduce((total, sale) => {
      
        const unitPrice = sale.Quantity > 0 ? sale.TotalAmount / sale.Quantity : 0;
        return total + (unitPrice * sale.Quantity);
    }, 0);
};



const startDate = ref();
const endDate = ref();

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const products = ref();
const totalProducts = ref(0);
const totalsales = ref(0);
const totalSales = ref(0);
const showcategory = ref(false); 
const showtrendprod = ref(false);
const chartData = ref(null);
const chartOptions = ref(null);
const emptytable = ref(new Array(3));
const trenP = ref();

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);

const getCustomersMedium = () => {
        return Promise.resolve(getTRENDPROD());
}

onMounted(() => {
    getCustomersMedium().then((data) => (products.value = data));
    getCategory()
    getProducts()
    getSales()
    getTRENDPROD()
});


const setChartData = (data) => {
    const categories = data.map(item => item.category);
    const salesPercentages = data.map(item => parseFloat(item.salesPercentage));

    return {
        labels: categories,
        datasets: [
            {
                label: 'Sales Percentage',
                data: salesPercentages,
                backgroundColor: [
                    'rgba(249, 115, 22, 0.2)', 
                    'rgba(6, 182, 212, 0.2)', 
                    'rgb(107, 114, 128, 0.2)', 
                    'rgba(139, 92, 246, 0.2)', 
                    'rgba(54, 162, 235, 0.2)' 
                ],
                borderColor: [
                    'rgb(249, 115, 22)', 
                    'rgb(6, 182, 212)', 
                    'rgb(107, 114, 128)', 
                    'rgb(139, 92, 246)', 
                    'rgb(54, 162, 235)' 
                ],
                borderWidth: 1
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}
watch([getPrimary, getSurface, isDarkTheme], () => {
    chartData.value = setChartData(salesData);
    chartOptions.value = setChartOptions();
});


watch(trendprod, (newtrendprod, oldtrendprod) => {
    if(newtrendprod?.result?.length > 0) {
        showtrendprod.value = true
        trenP.value = trendprod?.result[0]?.productName
    }
}, { deep: true });

watch(category, (newCategory, oldCategory) => {
    if(newCategory.length > 0) {
        showcategory.value = true
        chartData.value = setChartData(newCategory);
        chartOptions.value = setChartOptions();
    }
}, { deep: true });

</script>

<template>
    <div class="grid grid-cols-12 gap-2">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 " >
            <div class="card mb-0" >
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Products</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalProducts }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi  pi-box text-orange-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3 " >
            <div class="card mb-0" >
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Sales</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalSales }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-cyan-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3 " >
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Most selled product</span>
                        <div v-if="showtrendprod" class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ trenP }}</div>
                        <Skeleton v-else width="4rem" class="mb-2"></Skeleton>

                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-cyan-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Trend Products</div>
                <DataTable v-if="showtrendprod" :value="trendprod.result" :rows="3" :paginator="true" responsiveLayout="scroll">
                    <Column field="productName" header="productName" :sortable="true" style="width: 35%">
                        <template #body="{ data }">
                            {{ data.productName }}
                        </template>
                    </Column>
                    <Column field="totalQuantitySold" header="totalQuantitySold" :sortable="true" style="width: 35%">
                        <template #body="{ data }">
                            {{ data.totalQuantitySold }}
                        </template>
                    </Column>
                    <Column field="totalSalesAmount" header="totalSalesAmount" :sortable="true" style="width: 35%">
                        <template #body="{ data }">
                            {{ data.totalSalesAmount }}
                        </template>
                    </Column>
                </DataTable>
                <DataTable v-else :value="emptytable">
                    <Column field="productName" header="productName">
                        <template #body>
                            <Skeleton></Skeleton>
                        </template>
                    </Column>
                    <Column field="totalQuantitySold" header="totalQuantitySold">
                        <template #body>
                            <Skeleton></Skeleton>
                        </template>
                    </Column>
                    <Column field="totalSalesAmount" header="totalSalesAmount">
                        <template #body>
                            <Skeleton></Skeleton>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Chart</div>
                <Chart v-if="showcategory" type="bar" :data="chartData" :options="chartOptions" class="h-80" />
                <Skeleton v-else width="10rem" class="mb-2"></Skeleton>
            </div>
            <div class="card">
                <div class="flex items-center justify-between mb-6">
                    <div class="font-semibold text-xl">Get total Sales by date</div>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items" class="!min-w-40"></Menu>
                    </div>
                </div>
                <div class="flex items-center justify-between ">
                    <div>
                        <span>start date</span>
                        <DatePicker v-model="startDate" showIcon fluid :showOnFocus="false" />
                    </div>
                    <div class="ml-1">
                        <span>end date</span>
                        <DatePicker v-model="endDate" showIcon fluid iconDisplay="input" />
                    </div>
                </div>
                <div class="p-3">
                    <span v-if="totalsales >= 0">total sale : {{ totalsales }}</span>
                    <span v-else>total sale : -</span>
                </div>
                <div class="flex items-center justify-end">
                    <Button type="submit" severity="secondary" label="Submit" @click="getSales(startDate, endDate)" />
                </div>
            </div>
        </div>
    </div>
</template>
