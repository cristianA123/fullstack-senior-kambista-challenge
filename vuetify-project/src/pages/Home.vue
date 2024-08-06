<template>
  <v-row class="align-center mx-4 my-4">
    <div class="text-h6 text-lg-h4 text-md-h4 text-sm-h6">Solicitudes de Cambios realizados</div>
    <v-spacer />
    <v-btn color="primary" small @click="handleOpenDialogCreate">Generar Cambios</v-btn>
  </v-row>
  <v-col class="mt-4">
    <v-form
      ref="formRef"
      lazy-validation
      @submit.prevent="handleFetchData"
    >

      <v-row>
        <v-col cols="5">
          <v-text-field
            v-model="startDate"
            label="Fecha Inicio"
            placeholder="05-08-2024"
            :rules="[validateDate]"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="endDate"
            label="Fecha Fin"
            placeholder="06-08-2024"
            :rules="[validateDate]"
          />
        </v-col>
        <v-col cols="2">
          <v-btn color="primary" @click="handleFetchData">Buscar</v-btn>
        </v-col>
      </v-row>

    </v-form>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="tableHeaders"
      item-value="name"
      :items="exchangeRates"
      :items-length="totalExchangeRates"
      :loading="isLoading"
      @update:options="handleFetchData"
    >
      <template #[`item.fecha`]="{ item }">
        {{ formatDate(item.fecha) }}
      </template>
    </v-data-table-server>
  </v-col>
  <DialogCreateComponent ref="dialogCreateRef" @on-dialog-create-finish="handleDialogCreateFinish" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ApiBackend from '@/api/ApiBackend'
  import { ExchangeRate, ParamsExchangeRate, ResponseExchangeRate } from '../interfaces/ExchangeRate.interface'
  import DialogCreateComponent from './DialogCreateComponent.vue'
  import moment from 'moment'

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
  const startDate = ref('')
  const endDate = ref('')
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
      const params: ParamsExchangeRate = {
        page,
        limit: itemsPerPage,
      }

      if (startDate.value) {
        params.startDate = startDate.value
      }

      if (endDate.value) {
        params.endDate = endDate.value
      }

      const response = await ApiBackend.get<ResponseExchangeRate>('/exchange', { params })

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

  const formatRegex = /^\d{2}-\d{2}-\d{4}$/

  const validateDate = (value: string) => {
    if (!value) {
      return 'Fecha es obligatoria'
    }

    if (!formatRegex.test(value)) {
      return 'El formato de la fecha debe ser dd-mm-yyyy'
    }

    const [day, month, year] = value.split('-').map(Number)

    const date = new Date(year, month - 1, day)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return 'La fecha no es válida'
    }

    return true
  }

  const formatDate = (date: Date) => {
    return moment(date).format('DD-MM-YYYY')
  }

</script>
