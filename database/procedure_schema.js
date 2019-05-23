const mongoosePaginate = require('mongoose-paginate');
const timeZone = require('mongoose-timezone');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let ProcedureSchema = mongoose.Schema({
        procedure_name: {type: String, required: true}
        , procedure_category: {type: String, required: true}
        , procedure_price: {type: Number, required: true}
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('ProcedureSchema 정의함.');

    ProcedureSchema.plugin(mongoosePaginate);
    ProcedureSchema.plugin(timeZone, { paths: ['created_at'] });


    return ProcedureSchema;
};

module.exports = Schema;

