const mongoosePaginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-auto-increment-fix');
let Schema = {};

Schema.createSchema = function(mongoose) {

    let MemberSchema = mongoose.Schema({
        member_name: {type: String, required: true}
        , member_phone: {type: String, required: true}
        , member_membership: {type: Number, 'default': 0}
        , created_at: {type: Date, 'default': Date.now}
    });

    console.log('MemberSchema 정의함.');

    MemberSchema.plugin(mongoosePaginate);
    MemberSchema.plugin(autoIncrement.plugin, {model: 'MemberModel', field: 'member_id'});

    return MemberSchema;
};

module.exports = Schema;

