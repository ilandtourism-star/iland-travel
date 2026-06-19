import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../components/common/Toast';
import UniversalContactDetails from './UniversalContactDetails';
import { secureFetch } from '../../lib/api';

// Mock the secureFetch function directly
jest.mock('../../lib/api', () => ({
    secureFetch: jest.fn()
}));

describe('UniversalContactDetails Component Rendering', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock return value for secureFetch
        secureFetch.mockImplementation(() => Promise.resolve({
            json: () => Promise.resolve({
                sku: "joy-play-kapas",
                name: "3. Joy & Playfulness",
                island: "kapas",
                category: "snorkeling",
                features: '[{"icon":"fas fa-fish","text":"Marine Park Trip"},{"icon":"fas fa-vest","text":"LIFE JACKET (FULL DAY)"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT (FULL DAY)"},{"icon":"fas fa-ship","text":"BOAT TRANSFER"}]'
            })
        }));
    });

    test('renders with valid state', () => {
        const mockState = {
            vacation_sku: "joy-play-kapas",
            date: new Date("2026-06-20"),
            adults: 2,
            children: 1,
            totalPrice: "138.00",
            packageName: "3. Joy & Playfulness",
            originalPrice: "151.80"
        };

        const { container } = render(
            <MemoryRouter initialEntries={[{ pathname: '/contact-details/3-joy-play-kapas', state: mockState }]}>
                <ToastProvider>
                    <UniversalContactDetails />
                </ToastProvider>
            </MemoryRouter>
        );
        expect(container).toBeTruthy();
    });

    test('renders with null state (no crash on initial render before redirect)', () => {
        const { container } = render(
            <MemoryRouter initialEntries={[{ pathname: '/contact-details/3-joy-play-kapas', state: null }]}>
                <ToastProvider>
                    <UniversalContactDetails />
                </ToastProvider>
            </MemoryRouter>
        );
        expect(container).toBeTruthy();
    });
});
