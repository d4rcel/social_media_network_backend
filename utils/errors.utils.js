module.exports.signUpErrors = (err) => {
    let errors = {pseudo: '', email: '', password: ''}

    if(err.message.includes('pseudo'))
        errors.pseudo = "Pseudo Incorrect ou déjà pris";

    if(err.message.includes('email'))
        errors.email = "Email incorrect"

    if(err.message.includes('password'))
        errors.password = "Le mot de passe doit faire 6 caractères minimum"

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = "Cet pseudo est déjà pris"

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = "Cet email est déjà enregistré"

    return errors
}

module.exports.signInErrors = (err) => {
    let errors = {email: '', password:''}
    if(err.message.includes('email')) errors.email = "Email inconnue"

    if(err.message.includes('password'))
        errors.password = "Le mot de passe ne coorespond pas"

    return errors
}