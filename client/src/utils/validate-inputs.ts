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