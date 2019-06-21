const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment-fix');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let MemberSchema = mongoose.Schema({
        member_name: {type: String, required: true}
        , member_phone: {type: String, required: true}
        , member_contact: {type: String}
        , ms_data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'membership' }]
        , created_at: {type: Date, 'default': Date.now}
    });


    MemberSchema.plugin(mongoosePaginate);
    MemberSchema.plugin(autoIncrement.plugin, {model: 'MemberModel', field: 'member_id'});

    return MemberSchema;
};

module.exports = Schema;

