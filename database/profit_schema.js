const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment-fix');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let ProfitSchema = mongoose.Schema({
        pf_value: {type: Number, required: true}
        , pf_type: {type: String, required: true}
        , pf_category: {type: String, required: true}
        , pf_method: {type: String, required: true}
        , member_data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }]
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('ProfitSchema 정의함.');

    ProfitSchema.plugin(mongoosePaginate);
    ProfitSchema.plugin(autoIncrement.plugin, {model: 'ProfitModel', field: 'pf_id'});

    return ProfitSchema;
};

module.exports = Schema;

