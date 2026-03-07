import React, { useState } from 'react';
import { useToast } from '../../components/common/Toast';
import { secureFetch } from '../../lib/api';

const AddVacation = () => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        price: '',
        childPrice: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.sku || !formData.name || !formData.description || !formData.price) {
            addToast('Sila isi semua maklumat wajib.', 'error');
            return;
        }

        try {
            const response = await secureFetch('/api/v1/vacation', {
                method: 'POST',
                // Content-Type is handled automatically for JSON
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    childPrice: formData.childPrice ? parseFloat(formData.childPrice) : undefined
                }),
                credentials: 'include' // Penting untuk hantar cookie session
            });

            const data = await response.json();

            if (response.ok) {
                addToast('Pakej berjaya ditambah!', 'success');
                // Reset form
                setFormData({
                    sku: '',
                    name: '',
                    description: '',
                    price: '',
                    childPrice: ''
                });
            } else {
                addToast(data.message || 'Gagal menambah pakej.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('Ralat sambungan server.', 'error');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Tambah Pakej Percutian Baru</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* SKU */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="sku">
                            KOD SKU (Unik)
                        </label>
                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="contoh: pakej-mewah-kapas"
                            required
                        />
                        <p className="text-gray-500 text-sm mt-1">Kod ini mesti unik dan tiada jarak (space).</p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                            Nama Pakej
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="contoh: Pakej Mewah 3H2M"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                            Penerangan
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Penerangan ringkas mengenai pakej..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Price */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
                                Harga Dewasa (RM)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Child Price */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="childPrice">
                                Harga Kanak-kanak (RM)
                            </label>
                            <input
                                type="number"
                                id="childPrice"
                                name="childPrice"
                                value={formData.childPrice}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Simpan Pakej
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddVacation;
