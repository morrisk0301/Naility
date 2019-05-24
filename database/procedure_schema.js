const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment-fix');
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
    ProcedureSchema.plugin(autoIncrement.plugin, {model: 'ProcedureModel', field: 'procedure_id'});

    return ProcedureSchema;
};

module.exports = Schema;

