import mongoose from 'mongoose';


const rateSchema = new mongoose.Schema( {

  compra: {
    type: String,
    required: [ true, 'Compra es requerido' ]
  },
  venta: {
    type: String,
    required: [ true, 'Venta es obligatorio' ],
  },
  origen: {
    type: String,
    required: [ true, 'Origen es obligatorio' ],
  },
  moneda: {
    type: String,
    required: [ true, 'Moneda es obligatorio' ],
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
 } );


export const RateModel = mongoose.model('Rate', rateSchema);

