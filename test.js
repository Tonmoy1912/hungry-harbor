function isEmailValid(email) {
    // Regular expression for a basic email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the regex
    return emailRegex.test(email);
}

// // Example usage:
// const emailToCheck = 'example@emailcom';

// console.log(isEmailValid("tonmy@gmail.com"));

console.log(new Date().toUTCString());