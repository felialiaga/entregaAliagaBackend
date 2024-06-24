const socket = io();
const form = document.getElementById('productForm');
const container = document.getElementById('products');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const response = await fetch('/api/products', {
        method: 'POST',
        body: data
    });

    if(!response.ok) {
        const error = await response.text();
        console.log('Error: ', error);
    } else {
        const responseData = await response.json();

        socket.emit('addProduct', responseData.message);

        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        await Toast.fire({
            icon: 'success',
            title: responseData.message
        })

    }

});


socket.on('productAdded', async () => {
    try {
        const response = await fetch('/api/products');
        if(!response.ok) {
            throw new Error('Error');
        }
        const products = await response.json();

        container.innerHTML = '';

        products.payload.forEach(prod => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <h2 class='productCardTitle '>${prod.name}</h2>
                ${prod.thumbnails.length > 0
                    ? prod.thumbnails.filter(th => th.main).map( th => `<img src="${th.path}" class="productCardMainImage">`).join('')
                : ``
                }
                <a href='/products/${prod.id}' class="productCardSeeMore" >See more</a>
                <button onClick='eliminar(${prod.id})' class="deleteBtn" >Delete</button>

            `;
            container.appendChild(productElement);
        })
    } catch (error) {
        console.log(`Eror: ${error}`);
        container.innerHTML = `
            <div id='container'>
                <p>Error trying to get products</p>
            </div>
        `;
    }
});


async function eliminar(id) {
    const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
    });

    if(!response.ok) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occured",
        });
    } else {
        let timerInterval;
        Swal.fire({
            title: 'Product deleted',
            html: 'Wait please',
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then(result => {
            if(result.dismiss === Swal.DismissReason.timer) {
                console.log('Alert closed');
            }
        });
    }
}