package food.truck.api.validation;

import food.truck.api.data.user.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserValidatorTest {
    @Test
    void isPasswordValid() {
        assertTrue(UserValidator.isPasswordValid("P@ssw0rd"));
        assertTrue(UserValidator.isPasswordValid("s3V#ncha"));

        assertFalse(UserValidator.isPasswordValid(""));
        assertFalse(UserValidator.isPasswordValid("short"));
        assertFalse(UserValidator.isPasswordValid("s3V#nch"));
        assertFalse(UserValidator.isPasswordValid("Passw0rd"));
        assertFalse(UserValidator.isPasswordValid("p@ssw0rd"));
        assertFalse(UserValidator.isPasswordValid("P@ssword"));
        assertFalse(UserValidator.isPasswordValid("P@SSW0RD"));
    }

    @Test
    void isFirstNameValid() {
        assertFalse(UserValidator.isFirstNameValid(""));
        assertTrue(UserValidator.isFirstNameValid("Ab"));
        assertTrue(UserValidator.isFirstNameValid("123"));
        assertTrue(UserValidator.isFirstNameValid("Matthew"));
    }

    @Test
    void isLastNameValid() {
        assertFalse(UserValidator.isLastNameValid(""));
        assertTrue(UserValidator.isLastNameValid("Ab"));
        assertTrue(UserValidator.isLastNameValid("123"));
        assertTrue(UserValidator.isLastNameValid("McCaskill"));
    }

    @Test
    void isEmailAddressValid() {
        assertTrue(UserValidator.isEmailAddressValid("me@example.com"));
        assertTrue(UserValidator.isEmailAddressValid("me@abc.def.ghi"));
        assertTrue(UserValidator.isEmailAddressValid("a.b@c.com"));
        assertTrue(UserValidator.isEmailAddressValid("x@gmail.com"));
        assertFalse(UserValidator.isEmailAddressValid("abc.def.ghi"));
        assertFalse(UserValidator.isEmailAddressValid("me+abc.def.ghi"));
        assertFalse(UserValidator.isEmailAddressValid("@gmail.com"));
        assertFalse(UserValidator.isEmailAddressValid("me@"));
    }
}