const mongoosePaginate = require('mongoose-paginate');
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

    return ProcedureSchema;
};

module.exports = Schema;

