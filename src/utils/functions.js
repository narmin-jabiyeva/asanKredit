export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validatePassword = (errors,value) => {
    let validated = true

    let upperCaseLetters = /[A-Z]/g;
    let lowerCaseLetters = /[a-z]/g;
    let numbers = /[0-9]/g;
    const isContainsSymbol = /^(?=.*[@#$%^&*()--+={}\[\]|\\:;"'<>,.?/₹]).*$/;
    const allowedSymbols = /^(?=.*[!_]).*$/;

    if (!isContainsSymbol.test(value) && allowedSymbols.test(value)) {
        errors.simvols.isFixed = true
    } else {
        errors.simvols.isFixed = false
    }

    if (value.length <= 16 && value.length >= 8) {
        errors.passwordLength.isFixed = true
    } else {
        errors.passwordLength.isFixed = false
    }

    if (value.match(upperCaseLetters) && value.match(lowerCaseLetters)) {
        errors.letter.isFixed = true
    } else {
        errors.letter.isFixed = false
    }
    if (value.match(numbers) && value.match(upperCaseLetters) && allowedSymbols.test(value)) {
        errors.required.isFixed = true
        validated = true
    } else {
        errors.required.isFixed = false
    }
    if (errors.required.isFixed &&
        errors.letter.isFixed &&
        errors.passwordLength.isFixed &&
        errors.simvols.isFixed
    ) validated = true
    else validated = false

    return {errors, validated}

}

export const getRandomInt = () => {
    return Math.floor(Math.random() * 5001);
}
