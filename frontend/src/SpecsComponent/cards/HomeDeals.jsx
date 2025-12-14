import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const HomeDeals = () => {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/deals')
            .then(res => res.json())
            .then(data => setDeals(data))
            .catch(err => console.error(err));
    }, []);

    if (deals.length === 0) return null;

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                🔥 Latest Deals from London
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {deals.map((deal) => (
                    <div key={deal.id} className="relative group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-100 h-48">
                        <img src={deal.image} alt="Deal" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                        <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-sm font-bold text-sky-300 uppercase">One Way</p>
                            <h3 className="text-xl font-bold">{deal.destination}</h3>
                            <p className="font-medium mt-1">From €{deal.price}</p>
                        </div>

                        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeDeals;