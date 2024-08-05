<template>
  <v-row class="align-center mx-4 my-4">
    <div class="text-h6 text-lg-h4 text-md-h4 text-sm-h6">Cambios realizados</div>
    <v-spacer />
    <v-btn color="primary" small @click="handleOpenDialogCreate">Generar Cambios</v-btn>
  </v-row>
  <v-col class="mt-4">
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="tableHeaders"
      item-value="name"
      :items="exchangeRates"
      :items-length="totalExchangeRates"
      :loading="isLoading"
      @update:options="handleFetchData"
    />
  </v-col>
  <DialogCreateComponent ref="dialogCreateRef" @on-dialog-create-finish="handleDialogCreateFinish" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ApiBackend from '@/api/ApiBackend'
  import { ExchangeRate, ResponseExchangeRate } from '../interfaces/ExchangeRate.interface'
  import DialogCreateComponent from './DialogCreateComponent.vue'

  const itemsPerPage = ref(10)
  const tableHeaders = ref<readonly { title: string; key: string; align?: string }[]>([
    { title: 'Moneda Origen', key: 'monedaOrigen' },
    { title: 'Monto Destino', key: 'monedaDestino' },
    { title: 'Monto', key: 'monto' },
    { title: 'Monto Cambiado', key: 'montoCambiado' },
    { title: 'Tipo de Cambio', key: 'tipoCambio' },
    { title: 'Fecha', key: 'fecha' },
  ])
  const exchangeRates = ref<ExchangeRate[]>([])
  const isLoading = ref(true)
  const dialogCreateRef = ref()
  const totalExchangeRates = ref<number>(0)
  const paginationOptions = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
  })

  const fetchExchangeRates = async () => {
    isLoading.value = true
    const { page, itemsPerPage } = paginationOptions.value

    try {
      const response = await ApiBackend.get<ResponseExchangeRate>('/exchange', {
        params: {
          page,
          limit: itemsPerPage,
        },
      })

      if (response.data.success) {
        exchangeRates.value = response.data.data.exchangeRates
        totalExchangeRates.value = response.data.data.total || 0
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
    } finally {
      isLoading.value = false
    }
  }

  const handleDialogCreateFinish = () => {
    fetchExchangeRates()
    console.log('Dialog create finished')
  }

  const handleOpenDialogCreate = () => {
    if (dialogCreateRef.value) {
      dialogCreateRef.value.openDialog()
    } else {
      console.error('DialogCreateComponent reference is not available')
    }
  }

  const handleFetchData = async () => {
    await fetchExchangeRates()
  }
</script>
