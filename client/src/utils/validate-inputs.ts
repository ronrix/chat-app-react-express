// validate the email
const emailRegex = /^[-!#$%&'*+\0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
export const ValidateEmail = (email: string) => {
    if(email.length>254)
        return false;

    const valid = emailRegex.test(email);
    if(!valid) {
        return false;
    }

    return true;
}

// form fields validation
export default function ValidateAuthFields(fields: { email: string; password: string }) {
    if(!fields.email.length) {
        return { valid: false, msg: "Please input your email!" };
    }
    if(!fields.password.length) {
        return { valid: false, msg: "Please input your password!" };
    }
    if(fields.password.length < 8) {
        return { valid: false, msg: "Password must at least be 8 characters long!" };
    }

    return { valid : true, msg: "" } ; 
}
