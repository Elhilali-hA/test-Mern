<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from "vuex";


const store = useStore();
const sales = ref();
const table = ref(); 
const totalPage = ref(0);   
const loading = ref(true);
const filters = ref();
const productNames = ref({})

const getProductByid = async (id) => {
  if (!productNames.value[id]) { 
    try {
      const response = await fetch(`http://localhost:5000/analytics/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const product = await response.json();
      productNames.value[id] = product;
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  }
};

const getSales = async (pageNumber = 1, rows) => {
  const data = await store.dispatch("GET_SALES", {page: pageNumber, rows: rows });
  sales.value = data.data; 
  for (const sale of sales.value) {
    getProductByid(sale?.ProductID)
  }
  totalPage.value = store.getters["SALES"].totalPages;  
};

const getMedium = () => {
        return Promise.resolve(getSales());
    }

onMounted(() => {
    getMedium().then((data) => (table.value = data))
    loading.value = false;
});


const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};


const nextPage = (event) => {
  const { page, first, rows } = event;

      const numberofPage = page + 1
      getSales(numberofPage, rows);
};




</script>

<template>
  <div class="card">  
    <h1 class="font-extrabold text-lg">Sales :</h1>
    <DataTable @page="nextPage" v-model:filters="filters" :value="sales"  showGridlines :rows="30" dataKey="id"
                filterDisplay="menu" :loading="loading" :globalFilterFields="['ProductID', 'Quantity', 'TotalAmount']">
            
            <template #empty> No products found. </template>
            <template #loading> Loading products data. Please wait. </template>
            <Column field="ProductID" header="ProductID" style="min-width: 12rem">
                <template #body="{ data }">
                    <span v-if="productNames[data.ProductID]">{{ productNames[data.ProductID]?.ProductName }}</span>
                    <span v-else>Loading...</span>
                </template>
            </Column>
            <Column header="Quantity" filterField="Quantity" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.Quantity }}</span>
                    </div>
                </template>
            </Column>
            <Column header="TotalAmount" dataType="numeric" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatCurrency(data.TotalAmount) }}
                </template>
            </Column>
    </DataTable>

    <Paginator @page="nextPage" :rows="30" :totalRecords="totalPage" :rowsPerPageOptions="[30, 60, 90]">
      <template #start="slotProps">
        Page: {{ slotProps.state.page + 1 }} 
      </template>
      <template #end>
      </template>
    </Paginator>
  </div>
</template>
