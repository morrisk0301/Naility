const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment-fix');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let MembershipDetailSchema = mongoose.Schema({
        msd_value: {type: Number, required: true}
        , msd_type: {type: String, required: true}
        , msd_method: {type: String, required: true}
        , msd_date: {type: Date, 'default': Date.now}
    });

    let MembershipSchema = mongoose.Schema({
        ms_data: [MembershipDetailSchema]
        , ms_init_value: {type: Number, required: true}
        , ms_exp_date: {type: Date, required: true}
        , ms_is_expired: {type: Boolean, 'default': false}
        , member_data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }]
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('MembershipSchema 정의함.');

    MembershipSchema.plugin(mongoosePaginate);
    MembershipSchema.plugin(autoIncrement.plugin, {model: 'MembershipModel', field: 'ms_id'});
    MembershipDetailSchema.plugin(autoIncrement.plugin, {model: 'MembershipModel', field: 'msd_id'});

    return MembershipSchema;
};

module.exports = Schema;

