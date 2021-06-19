//get form
const form = document.querySelector('form');

// const format = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const emailValidator = (email) => {
    const format = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(format) ? true : false;
}
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    //get form values
    const email = form.email.value;
    const password = form.password.value;
    const error = document.querySelector('.error')
    const serverError = document.querySelector('.server-response');
    serverError.innerHTML = ""

    if (emailValidator(email)) {
        error.innerHTML = ""
            //make a fetch request to /login
        const result = await fetch('login', {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await result;
        if (data.status == 200) {
            location.assign('/')
        } else if (data.status == 401) {
            const dataBody = await result.json();
            serverError.innerHTML = `<p>${dataBody.message}</p>`
        } else if (data.status == 500) {
            const dataBody = await result.json();
            serverError.innerHTML = `<p>${dataBody.message}</p>`
        } else if (data.status == 404) {
            const dataBody = await result.json();
            serverError.innerHTML = `<p>${dataBody.message}</p>`
        }
    } else {
        error.innerHTML = "<p>please enter a invalid email</p>"
    }
})


// console.log(email.match(format))