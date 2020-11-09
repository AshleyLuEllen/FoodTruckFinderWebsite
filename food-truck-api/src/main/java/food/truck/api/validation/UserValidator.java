package food.truck.api.validation;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserValidator {
    public static boolean isPasswordValid(String password) {
        if (password == null) {
            return false;
        }

        if (password.length() < 8) {
            return false;
        }

        boolean uppercase = false;
        boolean lowercase = false;
        boolean special = false;
        boolean digit = false;

        for (int i = 0; i < password.length(); i++) {
            if (Character.isUpperCase(password.charAt(i))) {
                uppercase = true;
            } else if (Character.isLowerCase(password.charAt(i))) {
                lowercase = true;
            } else if (Character.isDigit(password.charAt(i))) {
                digit = true;
            } else if ("!@#$%^&*()_".contains(String.valueOf(password.charAt(i)))) {
                special = true;
            }
        }

        return uppercase && lowercase && special && digit;
    }

    private static boolean isNameValid(String name) {
        return !name.isEmpty();
    }

    public static boolean isFirstNameValid(String firstName) {
        return isNameValid(firstName);
    }

    public static boolean isLastNameValid(String lastName) {
        return isNameValid(lastName);
    }

    public static boolean isEmailAddressValid(String email) {
        Pattern pattern = Pattern.compile("^.+@.+\\..+$");
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
