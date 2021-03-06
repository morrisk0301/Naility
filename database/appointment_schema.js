const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment-fix');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let AppointmentSchema = mongoose.Schema({
        ap_procedure_name: {type: String, required: true}
        , ap_procedure_arr: {type: Array, required: true}
        , ap_date: {type: Date, required: true}
        , ap_date_end: {type: Date, required: true}
        , ap_price: {type: Number, required: true}
        , ap_discount_price: {type: Number}
        , ap_payment_method: {type: String}
        , ap_ms_id: {type: Number}
        , ap_detail: {type: String, 'default': ""}
        , ap_blacklist: {type: Boolean}
        , ap_no_show: {type: Boolean}
        , ap_is_finished: {type: Boolean, 'default': false}
        , member_data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }]
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('AppointmentSchema 정의함.');

    AppointmentSchema.plugin(mongoosePaginate);
    AppointmentSchema.plugin(autoIncrement.plugin, {model: 'AppointmentModel', field: 'ap_id'});

    return AppointmentSchema;
};

module.exports = Schema;

