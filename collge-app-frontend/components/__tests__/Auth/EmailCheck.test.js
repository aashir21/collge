// EmailCheck.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EmailCheck from '../../Auth/EmailCheck';
import { useToast } from 'react-native-toast-notifications';
import { router } from 'expo-router';

jest.mock('react-native-toast-notifications', () => ({
    useToast: jest.fn(),
}));

jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        setParams: jest.fn(),
    },
}));

describe('EmailCheck Component', () =>
{
    let toast;

    beforeEach(() =>
    {
        toast = {
            show: jest.fn(),
        };
        useToast.mockReturnValue(toast);
        jest.clearAllMocks();
    });

    it('renders correctly', () =>
    {
        const { getByPlaceholderText, getByText } = render(<EmailCheck />);
        expect(getByPlaceholderText('Your student email')).toBeTruthy();
        expect(
            getByText("It happens, dont worry. Let's get you sorted.")
        ).toBeTruthy();
        expect(getByText('Next')).toBeTruthy();
    });

    // it('disables the button when isDisabled is true', async () =>
    // {
    //     const { getByRole } = render(<EmailCheck />);
    //     const submitButton = getByRole('next-btn');
    //     expect(submitButton.props.style).toContainEqual({ opacity: 1 });

    //     // Simulate state where isDisabled is true
    //     fireEvent.press(submitButton);
    //     await waitFor(() =>
    //     {
    //         expect(submitButton.props.style).toContainEqual({ opacity: 0.2 });
    //     });
    // });

    it('shows an error when email is invalid', async () =>
    {
        const { getByPlaceholderText, getByText, queryByText } = render(
            <EmailCheck />
        );
        const emailInput = getByPlaceholderText('Your student email');
        const submitButton = getByText('Next');

        fireEvent.changeText(emailInput, 'invalid-email');
        fireEvent.press(submitButton);

        await waitFor(() =>
        {
            expect(
                queryByText('Please enter a valid email address.')
            ).toBeTruthy();
        });
    });

    it('displays a toast when starting email check', async () =>
    {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        userId: 1,
                        email: 'test@example.com',
                        username: 'testuser',
                    }),
            })
        );

        const { getByPlaceholderText, getByText } = render(<EmailCheck />);
        const emailInput = getByPlaceholderText('Your student email');
        const submitButton = getByText('Next');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.press(submitButton);

        await waitFor(() =>
        {
            expect(toast.show).toHaveBeenCalledWith('Checking email...', {
                placement: 'top',
                type: 'normal',
                duration: 3500,
            });
        });
    });

    it('navigates to OTP screen on successful email check', async () =>
    {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        userId: 1,
                        email: 'test@example.com',
                        username: 'testuser',
                    }),
            })
        );

        const { getByPlaceholderText, getByText } = render(<EmailCheck />);
        const emailInput = getByPlaceholderText('Your student email');
        const submitButton = getByText('Next');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.press(submitButton);

        await waitFor(() =>
        {
            expect(router.push).toHaveBeenCalledWith('/auth/otp');
            expect(router.setParams).toHaveBeenCalledWith({
                userId: 1,
                email: 'test@example.com',
                username: 'testuser',
            });
        });
    });

    it('displays an error message on 400 response', async () =>
    {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 400,
            })
        );

        const { getByPlaceholderText, getByText, queryByText } = render(
            <EmailCheck />
        );
        const emailInput = getByPlaceholderText('Your student email');
        const submitButton = getByText('Next');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.press(submitButton);

        await waitFor(
            () =>
            {
                expect(
                    queryByText("We could'nt find an account with this email.")
                ).toBeTruthy();
            },
            { timeout: 3000 }
        );
    });

    it('displays an error toast on network error', async () =>
    {
        global.fetch = jest.fn(() => Promise.reject('Network error'));

        const { getByPlaceholderText, getByText } = render(<EmailCheck />);
        const emailInput = getByPlaceholderText('Your student email');
        const submitButton = getByText('Next');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.press(submitButton);

        await waitFor(() =>
        {
            expect(toast.show).toHaveBeenCalledWith('Something went wrong...', {
                placement: 'top',
                type: 'normal',
                duration: 3500,
                swipeEnabled: true,
            });
        });
    });

    it('tests the email regex comprehensively', () =>
    {
        const emailRegex = /^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

        const validEmails = [
            'test@example.com',
            'user.name+tag+sorting@example.com',
            'user_name@example.co.uk',
            'user-name@example.org',
            'user.name123@example.io',
            'user@subdomain.example.com',
            'mas391@student.aru.ac.uk',
            '22003346010@skt.umt.edu.pk',
            "mohammadabdullah.gfx@gmail.com",
            "some-email@superior.edu.pk",
            "zaid.sajjad24@nixorcollege.edu.pk"
        ];

        const invalidEmails = [
            'plainaddress',
            '@no-local-part.com',
            'Outlook Contact <outlook-contact@domain.com>',
            'no-at.domain.com',
            'no-tld@domain',
            ';beginning-semicolon@domain.co.uk',
            'middle-semicolon@domain.co;uk',
            'trailing-semicolon@domain.com;',
            '"email+leading-quotes@domain.com',
            'email+middle"-quotes@domain.com',
            '"quoted-local-part"@domain.com',
            '"quoted@domain.com',
            'two-dots..in-local@domain.com',
            'multiple@domains@domain.com',
            'spaces in local@domain.com',
            'spaces-in-domain@dom ain.com',
            'underscores-in-domain@dom_ain.com',
            'pipe-in-domain@example.com|gov.uk',
            'comma,in-local@domain.com',
            'comma-in-domain@domain,com',
            'pound-sign-in-local£@domain.com',
            'local-with-’-apostrophe@domain.com',
            'local-with-”-quotes@domain.com',
            'domain-starts-with-a-dot@.domain.com',
            'brackets(in)local@domain.com',
            'lots-of-dots@domain..gov..uk'
        ];

        validEmails.forEach((email) =>
        {
            expect(emailRegex.test(email)).toBe(true);
        });

        invalidEmails.forEach((email) =>
        {
            expect(emailRegex.test(email)).toBe(false);
        });
    });
});
