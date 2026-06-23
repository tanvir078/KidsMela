import { apiRequest } from '@/lib/api';
import { errorHandler } from '@/lib/errorHandler';

export async function getProducts(params = {}) {
    try {
        const payload = await apiRequest('/storefront/products', { params });
        return payload.products ?? payload.data ?? [];
    } catch (error) {
        errorHandler.logError('GET_PRODUCTS_ERROR', error, 'Failed to load products');
        throw error;
    }
}

export async function getProduct(id) {
    try {
        const payload = await apiRequest(`/storefront/products/${id}`);
        return payload.product ?? payload.data;
    } catch (error) {
        errorHandler.logError('GET_PRODUCT_ERROR', error, `Failed to load product ${id}`);
        throw error;
    }
}
