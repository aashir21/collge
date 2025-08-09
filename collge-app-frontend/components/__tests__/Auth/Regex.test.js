// regex.test.js

import { REGEX } from "../../../constants/theme";

describe('Regex Patterns', () =>
{
    const firstNameRegex = REGEX.NAME_REGEX;
    const lastNameRegex = REGEX.NAME_REGEX;
    const usernameRegex = REGEX.USERNAME_REGEX;
    const passwordRegex = REGEX.PASSWORD_REGEX;

    describe('First Name Regex', () =>
    {
        it('should match valid first names', () =>
        {
            expect(firstNameRegex.test('John')).toBe(true);
            expect(firstNameRegex.test('Alice')).toBe(true);
            expect(firstNameRegex.test('Anna Marie')).toBe(true);
            expect(firstNameRegex.test('Aashir')).toBe(true);
            expect(firstNameRegex.test('Ali')).toBe(true);
            expect(firstNameRegex.test('Muhammad Zaryab')).toBe(true); // Too Long
        });

        it('should not match invalid first names', () =>
        {
            expect(firstNameRegex.test('J')).toBe(false); // Too short
            expect(firstNameRegex.test('J0hn')).toBe(false); // Contains a number
            expect(firstNameRegex.test('John!')).toBe(false); // Contains special character
            expect(firstNameRegex.test('Syed Muhammad Ali')).toBe(false); // Too Long
        });
    });

    describe('Last Name Regex', () =>
    {
        it('should match valid last names', () =>
        {
            expect(lastNameRegex.test('Smith')).toBe(true);
            expect(lastNameRegex.test('Johnson')).toBe(true);
            expect(lastNameRegex.test('O Connor')).toBe(true);
        });

        it('should not match invalid last names', () =>
        {
            expect(lastNameRegex.test('Li')).toBe(false); // Too short
            expect(lastNameRegex.test('Smith3')).toBe(false); // Contains a number
            expect(lastNameRegex.test('O\'Connor')).toBe(false); // Contains special character (apostrophe)
        });
    });

    describe('Username Regex', () =>
    {
        it('should match valid usernames', () =>
        {
            expect(usernameRegex.test('_john_doe_')).toBe(true);
            expect(usernameRegex.test('john_doe')).toBe(true);
            expect(usernameRegex.test('user.name')).toBe(true);
            expect(usernameRegex.test('user-name')).toBe(true);
            expect(usernameRegex.test('user123')).toBe(true);
            expect(usernameRegex.test('_user123')).toBe(true);
            expect(usernameRegex.test('user123_')).toBe(true);
            expect(usernameRegex.test('_user_name_')).toBe(true);
            expect(usernameRegex.test('john.21')).toBe(true);
            expect(usernameRegex.test('ali')).toBe(true);
            expect(usernameRegex.test('aashir')).toBe(true);
            expect(usernameRegex.test('carolina')).toBe(true)
        });

        it('should not match invalid usernames', () =>
        {
            expect(usernameRegex.test('__username')).toBe(false); // Multiple underscores at the start
            expect(usernameRegex.test('username__')).toBe(false); // Multiple underscores at the end
            expect(usernameRegex.test('user..name')).toBe(false); // Consecutive dots
            expect(usernameRegex.test('user--name')).toBe(false); // Consecutive hyphens
            expect(usernameRegex.test('user__name')).toBe(false); // Consecutive underscores in the middle
            expect(usernameRegex.test('.username')).toBe(false); // Leading dot
            expect(usernameRegex.test('username.')).toBe(false); // Trailing dot
            expect(usernameRegex.test('john!doe')).toBe(false); // Trailing dot
            expect(usernameRegex.test('john..21.doe')).toBe(false); // Dots in middle
            expect(usernameRegex.test('thisisalongusername')).toBe(false); // Dots in middle
        });
    });

    describe('Password Regex', () =>
    {
        const passwordRegex = REGEX.PASSWORD_REGEX;

        it('should match valid passwords', () =>
        {
            expect(passwordRegex.test('Password1!')).toBe(true);    // Meets all criteria
            expect(passwordRegex.test('StrongPass123@')).toBe(true);
            expect(passwordRegex.test('Valid#Password123')).toBe(true);
            expect(passwordRegex.test('Another$Pass1')).toBe(true);
            expect(passwordRegex.test('A1@abcdefgh')).toBe(true);   // Minimum length with all required elements
            expect(passwordRegex.test('LongValidPassword123!@#')).toBe(true); // Up to max length
        });

        it('should not match invalid passwords', () =>
        {
            expect(passwordRegex.test('password')).toBe(false);      // No uppercase, no digit, no special character
            expect(passwordRegex.test('PASSWORD')).toBe(false);      // No lowercase, no digit, no special character
            expect(passwordRegex.test('Password')).toBe(false);      // No digit, no special character
            expect(passwordRegex.test('Password123')).toBe(false);   // No special character
            expect(passwordRegex.test('Pass!')).toBe(false);         // Too short
            expect(passwordRegex.test('pp')).toBe(false);         // Too short
            expect(passwordRegex.test('a'.repeat(33) + 'A1!')).toBe(false); // Too long
        });
    });
});
