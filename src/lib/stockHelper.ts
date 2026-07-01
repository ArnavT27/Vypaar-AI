import { productsAPI, billsAPI } from './api';
import { toast } from 'sonner';

export interface CartItem {
    product: {
        _id?: string;
        id?: string;
        name: string;
        price: number;
        emoji: string;
        stock: number;
    };
    qty: number;
}

export interface BillItem {
    productId: string;
    name: string;
    emoji: string;
    price: number;
    qty: number;
}

// Validate stock availability before creating bill
export const validateStock = async (items: CartItem[]): Promise<boolean> => {
    try {
        const { data } = await productsAPI.getAll();
        const products = data.data || [];

        for (const item of items) {
            const productId = item.product._id || item.product.id;
            const product = products.find((p: any) => p._id === productId);

            if (!product) {
                toast.error(`Product "${item.product.name}" not found in inventory`);
                return false;
            }

            if (product.stock < item.qty) {
                toast.error(`Insufficient stock for "${item.product.name}". Available: ${product.stock}, Required: ${item.qty}`);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error validating stock:', error);
        toast.error('Failed to validate stock');
        return false;
    }
};

// Reduce stock after bill creation
export const reduceStock = async (items: CartItem[] | BillItem[]): Promise<boolean> => {
    try {
        for (const item of items) {
            const productId = 'product' in item ? (item.product._id || item.product.id) : item.productId;
            const qty = item.qty;

            await productsAPI.updateStock(productId, {
                quantity: qty,
                operation: 'subtract'
            });
        }

        return true;
    } catch (error) {
        console.error('Error reducing stock:', error);
        toast.error('Failed to update inventory');
        return false;
    }
};

// Create bill with stock validation and reduction
export const createBillWithStockUpdate = async (
    items: CartItem[],
    subtotal: number,
    gst: number,
    discount: number,
    total: number,
    customerName?: string,
    customerPhone?: string
): Promise<string | null> => {
    try {
        // Fetch current products from database to get _id and validate stock
        const { data: productsData } = await productsAPI.getAll();
        const dbProducts = productsData.data || [];

        // Validate stock and prepare bill items
        const billItems = [];
        for (const item of items) {
            // Try to match by _id first, then by name
            const dbProduct = dbProducts.find((p: any) =>
                p._id === (item.product._id || item.product.id) ||
                p.name === item.product.name
            );

            if (!dbProduct) {
                toast.error(`Product "${item.product.name}" not found in database`);
                return null;
            }

            if (dbProduct.stock < item.qty) {
                toast.error(`Insufficient stock for "${item.product.name}". Available: ${dbProduct.stock}, Required: ${item.qty}`);
                return null;
            }

            billItems.push({
                product: dbProduct._id,
                name: item.product.name,
                emoji: item.product.emoji,
                price: item.product.price,
                qty: item.qty,
                total: item.product.price * item.qty, // Add item total
            });
        }

        // Create bill in database (backend calculates subtotal, gst, total)
        const { data } = await billsAPI.create({
            items: billItems,
            discount,
            customerName,
            customerPhone,
        });

        const billId = data.data._id;
        return billId;
    } catch (error: any) {
        console.error('Error creating bill:', error);
        console.error('Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to create bill');
        return null;
    }
};
