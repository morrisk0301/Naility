const mongoosePaginate = require('mongoose-paginate');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let ProfitSchema = mongoose.Schema({
        pf_member_id: {type: Number, required: true}
        , pf_member_name: {type: String, required: true}
        , pf_member_phone: {type: String, required: true}
        , pf_value: {type: Number, required: true}
        , pf_type: {type: String, required: true}
        , pf_category: {type: String, required: true}
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('ProfitSchema 정의함.');

    ProfitSchema.plugin(mongoosePaginate);

    return ProfitSchema;
};

module.exports = Schema;

