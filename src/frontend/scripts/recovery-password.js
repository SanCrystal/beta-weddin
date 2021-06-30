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
    const error = document.querySelector('#error-results')
        // const serverError = document.querySelector('.server-response');
        // serverError.innerHTML = ""
    console.log(email)
    if (emailValidator(email)) {
        error.innerHTML = ""
        error.classList.add('d-none');
        //make a fetch request to /login
        const result = await fetch('recovery-auth-pass', {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email
            })
        });
        const data = await result;


        if (data.status == 200) {
            const dataBody = await result.json();
            location.assign(dataBody.url)
        } else if (data.status == 500) {
            const dataBody = await result.json();
            if (dataBody.message.code === 'EDNS') {
                return error.innerHTML = `<p>Could not  establish connection, check your network connection and try again</p>`
            }
            console.log(dataBody.message.code === 'EDNS')
            error.classList.remove('d-none')
            error.innerHTML = `<p>${dataBody.message}</p>`
        } else if (data.status == 404) {
            const dataBody = await result.json();
            error.classList.remove('d-none');
            error.innerHTML = `<p>${dataBody.message}</p>`
        }
    } else {
        error.classList.remove('d-none')
        error.innerHTML = "<p>please enter a invalid email</p>"
    }
})


// console.log(email.match(format))