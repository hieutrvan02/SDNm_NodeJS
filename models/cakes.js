const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

var cakeSchema = new Schema({
    type: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Currency,
        require: true,
        min: 0
    },
    topping: [
        {
            type: {
                type: String
            },
            price_extra: Currency,
        },
    ]
}, {
    timestamps: true
});

var Cakes = mongoose.model('Cake', cakeSchema);
module.exports = Cakes;