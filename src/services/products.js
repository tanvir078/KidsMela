export async function getProducts() {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/storefront/products`, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Products could not be loaded.');
    }

    const payload = await response.json();
    return payload.products ?? payload.data ?? [];
}

export async function getProduct(id) {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/storefront/products/${id}`, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Product could not be loaded.');
    }

    const payload = await response.json();
    return payload.product ?? payload.data;
}
