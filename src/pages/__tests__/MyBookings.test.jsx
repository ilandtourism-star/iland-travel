import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyBookings from '../MyBookings';
import * as api from '../../lib/api';

// Mock the secureFetch function directly
jest.mock('../../lib/api', () => ({
    secureFetch: jest.fn()
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('MyBookings Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders search form correctly', () => {
        renderWithRouter(<MyBookings />);

        // Assert Title is present
        expect(screen.getByText('Semak Status Tempahan')).toBeInTheDocument();

        // Assert toggle tabs exist
        expect(screen.getByText('🔖 ID Tempahan')).toBeInTheDocument();
        expect(screen.getByText('✉️ Emel')).toBeInTheDocument();

        // Assert input field and search button exist
        const input = screen.getByPlaceholderText('Contoh: k5dnhb5vi');
        expect(input).toBeInTheDocument();

        const button = screen.getByRole('button', { name: /CARI/i });
        expect(button).toBeInTheDocument();
    });

    test('shows an error network message when secureFetch fails', async () => {
        api.secureFetch.mockRejectedValue(new Error('Network error'));

        renderWithRouter(<MyBookings />);
        const input = screen.getByPlaceholderText('Contoh: k5dnhb5vi');
        const button = screen.getByRole('button', { name: /CARI/i });

        fireEvent.change(input, { target: { value: 'invalid123' } });
        fireEvent.click(button);

        // Expect the text "..." loading state
        expect(button).toHaveTextContent('...');

        // Wait for failure
        await waitFor(() => {
            expect(screen.getByText(/Ralat rangkaian\. Pastikan server berjalan\./i)).toBeInTheDocument();
        });
    });

    test('renders fetched bookings successfully', async () => {
        api.secureFetch.mockResolvedValueOnce({
            json: async () => ({
                success: true,
                bookings: [
                    {
                        id: 'B123',
                        packageName: 'Pakej Cuti Hebat',
                        status: 'confirmed',
                        date: '2027-12-01',
                        pax: 2,
                        totalPrice: 1500
                    }
                ]
            })
        });

        renderWithRouter(<MyBookings />);
        const input = screen.getByPlaceholderText('Contoh: k5dnhb5vi');
        const button = screen.getByRole('button', { name: /CARI/i });

        fireEvent.change(input, { target: { value: 'B123' } });
        fireEvent.click(button);

        await waitFor(() => {
            // Check if the mock results render in the component
            expect(screen.getByText('1 tempahan dijumpai')).toBeInTheDocument();
            expect(screen.getByText('Pakej Cuti Hebat')).toBeInTheDocument();
            expect(screen.getByText('RM 1500')).toBeInTheDocument();
        });
    });
});
