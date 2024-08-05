<template>
  <v-row justify="center">
    <v-dialog
      v-model="isDialogOpen"
      max-width="600px"
      persistent
    >
      <v-form
        ref="formRef"
        lazy-validation
        @submit.prevent="handleSubmit"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Crear Cambio</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="amount"
                    label="Monto"
                    :rules="[v => !!v || 'Monto es obligatorio']"
                  />
                  <v-combobox
                    v-model="sourceCurrency"
                    :items="['USD', 'PEN']"
                    label="Moneda Origen"
                    :rules="[v => !!v || 'Moneda Origen es obligatorio']"
                  />
                  <v-combobox
                    v-model="targetCurrency"
                    :items="targetCurrencyItems"
                    label="Moneda Destino"
                    :rules="[v => !!v || 'Moneda Destino es obligatorio']"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" @click="closeDialog">
              Cerrar
            </v-btn>
            <v-btn color="blue darken-1" :loading="isLoading" type="submit">
              Crear
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-snackbar v-model="isSnackbarVisible">
      {{ snackbarText }}
      <template #actions>
        <v-btn :color="snackbarColor" variant="text" @click="isSnackbarVisible = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import ApiBackend from '@/api/ApiBackend'

  const emit = defineEmits(['onDialogCreateFinish'])

  const isLoading = ref(false)
  const isSnackbarVisible = ref(false)
  const snackbarColor = ref('success')
  const isDialogOpen = ref(false)
  const amount = ref<string | null>(null)
  const snackbarText = ref('')
  const sourceCurrency = ref('')
  const targetCurrency = ref('')
  const formRef = ref()
  const targetCurrencyItems = ref(['PEN', 'USD'])

  const closeDialog = () => {
    isDialogOpen.value = false
    formRef.value?.reset()
    resetForm()
  }

  const openDialog = () => {
    isDialogOpen.value = true
  }

  const resetForm = () => {
    targetCurrencyItems.value = ['PEN', 'USD']
    isLoading.value = false
    targetCurrency.value = ''
  }

  const handleSubmit = async () => {
    if (formRef.value && formRef.value.validate()) {
      isLoading.value = true
      const payload = {
        monedaOrigen: sourceCurrency.value,
        monedaDestino: targetCurrency.value,
        monto: amount.value,
      }

      try {
        const response = await ApiBackend.post('/exchange', payload)
        if (response.data.success) {
          closeDialog()
          showSnackbar('Cambio creado correctamente', 'success')
          emit('onDialogCreateFinish')
        }
      } catch (error) {
        showSnackbar('Error al crear el cambio', 'error')
        isLoading.value = false
      }
    }
  }

  const showSnackbar = (message: string, color: string) => {
    snackbarText.value = message
    snackbarColor.value = color
    isSnackbarVisible.value = true
  }

  watch(sourceCurrency, newVal => {
    if (newVal === 'USD') {
      targetCurrency.value = 'PEN'
      targetCurrencyItems.value = ['PEN']
    } else {
      targetCurrency.value = 'USD'
      targetCurrencyItems.value = ['USD']
    }
  })

  defineExpose({
    openDialog,
  })
</script>
