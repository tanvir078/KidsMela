import { useState, useEffect } from 'react';

export default function CountdownTimer({ endDate, onExpire }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endDate) - new Date();
            
            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                if (onExpire) onExpire();
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endDate, onExpire]);

    const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    if (isExpired) return null;

    return (
        <div className="flex items-center gap-2">
            {timeLeft.days > 0 && (
                <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 px-2 py-1 text-center">
                    <p className="text-lg font-black text-white">{timeLeft.days}</p>
                    <p className="text-[10px] font-bold text-white/80">DAYS</p>
                </div>
            )}
            <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 px-2 py-1 text-center">
                <p className="text-lg font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</p>
                <p className="text-[10px] font-bold text-white/80">HRS</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 px-2 py-1 text-center">
                <p className="text-lg font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</p>
                <p className="text-[10px] font-bold text-white/80">MIN</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 px-2 py-1 text-center">
                <p className="text-lg font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</p>
                <p className="text-[10px] font-bold text-white/80">SEC</p>
            </div>
        </div>
    );
}
