const mongoosePaginate = require('mongoose-paginate');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let AppointmentSchema = mongoose.Schema({
        ap_member_id: {type: Number, required: true}
        , ap_member_name: {type: String, required: true}
        , ap_member_phone: {type: String, required: true}
        , ap_procedure_name: {type: String, required: true}
        , ap_date: {type: Date, required: true}
        , ap_price: {type: Number, required: true}
        , ap_discount_price: {type: Number}
        , ap_payment_method: {type: String}
        , ap_detail: {type: String, 'default': ""}
        , ap_blacklist: {type: Boolean}
        , ap_is_finished: {type: Boolean, 'default': false}
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('AppointmentSchema 정의함.');

    AppointmentSchema.plugin(mongoosePaginate);

    return AppointmentSchema;
};

module.exports = Schema;

