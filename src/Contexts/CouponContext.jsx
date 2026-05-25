import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'progotix_coupon';

const CouponContext = createContext(null);

const COUPONS = {
    'SAVE10': { discount: 0.10, type: 'percentage', description: '10% off' },
    'SAVE20': { discount: 0.20, type: 'percentage', description: '20% off' },
    'FLAT5': { discount: 5, type: 'fixed', description: '$5 off' },
    'FLAT10': { discount: 10, type: 'fixed', description: '$10 off' },
};

export const CouponProvider = ({ children }) => {
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const applyCoupon = useCallback((code) => {
        const coupon = COUPONS[code.toUpperCase()];
        if (coupon) {
            setAppliedCoupon({ code: code.toUpperCase(), ...coupon });
            return true;
        }
        return false;
    }, []);

    const removeCoupon = useCallback(() => {
        setAppliedCoupon(null);
    }, []);

    const calculateDiscount = useCallback((subtotal) => {
        if (!appliedCoupon) return 0;
        
        if (appliedCoupon.type === 'percentage') {
            return subtotal * appliedCoupon.discount;
        } else if (appliedCoupon.type === 'fixed') {
            return Math.min(appliedCoupon.discount, subtotal);
        }
        return 0;
    }, [appliedCoupon]);

    return (
        <CouponContext.Provider
            value={{
                appliedCoupon,
                applyCoupon,
                removeCoupon,
                calculateDiscount,
                availableCoupons: COUPONS,
            }}
        >
            {children}
        </CouponContext.Provider>
    );
};

export const useCoupon = () => {
    const context = useContext(CouponContext);
    if (!context) {
        throw new Error('useCoupon must be used within a CouponProvider');
    }
    return context;
};
