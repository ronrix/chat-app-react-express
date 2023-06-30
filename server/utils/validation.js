module.exports.ValidatePassword = (password) => {
    if (!password.length || !password) {
        throw new Error('Password is empty, Please fill up the field!');
    }

    if(password.length < 8) {
        throw new Error('Password must be at least 8 characters long!');
    }
    return true;
}

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
module.exports.ValidateEmail = (email) => {
    if (!email || !email.length) {
        throw new Error('Email is empty, Please fill up the field!');
    }

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid) {
        throw new Error('Email is inavlid!');
    }

    return true;
}