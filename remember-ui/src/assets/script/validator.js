import Validator from 'validator-biang';

export default new Validator({
    usernameType: {and: ['string', val=>val.length>6 && val.length < 20]},
    passwordType: {and: ['string', val=>val.length>6 && val.length < 20]},
});