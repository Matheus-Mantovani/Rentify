package com.matheus.rentify.app.shared.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Utility class to convert Brazilian Real (BRL) monetary values into their
 * written-out form in Portuguese, following legal and contractual standards.
 *
 * This class handles:
 * - Reais and Centavos.
 * - Singular vs. Plural (real/reais, centavo/centavos).
 * - Special cases like "cem" vs. "cento".
 * - Correct scale names (mil, milhão, milhões, etc.).
 * - Follows the rule of "mil" instead of "um mil" for 1000.
 */
public final class MonetaryConverter {

    private static final String[] UNIDADES = {
            "", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
            "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete",
            "dezoito", "dezenove"
    };

    private static final String[] DEZENAS = {
            "", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta",
            "oitenta", "noventa"
    };

    private static final String[] CENTENAS = {
            "", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",
            "seiscentos", "setecentos", "oitocentos", "novecentos"
    };

    private static final String[] ESCALA_SINGULAR = {"", "mil", "milhão", "bilhão", "trilhão"};
    private static final String[] ESCALA_PLURAL = {"", "mil", "milhões", "bilhões", "trilhões"};

    /**
     * Private constructor to prevent instantiation of utility class.
     */
    private MonetaryConverter() {
    }

    /**
     * Main method to convert a BigDecimal value to its full written form.
     * Example: 1500.50 -> "mil e quinhentos reais e cinquenta centavos"
     *
     * @param value The BigDecimal monetary value.
     * @return The value written in full (por extenso).
     */
    public static String convert(BigDecimal value) {
        if (value == null) {
            return "";
        }

        // Ensure we are working with 2 decimal places
        value = value.setScale(2, RoundingMode.HALF_UP);

        long reais = value.longValue();
        int centavos = value.remainder(BigDecimal.ONE).multiply(new BigDecimal(100)).intValue();

        if (reais == 0 && centavos == 0) {
            return "zero reais";
        }

        String reaisStr = numberToString(reais);
        String centavosStr = numberToString(centavos);

        StringBuilder result = new StringBuilder();

        // --- Part 1: Reais ---
        if (reais > 0) {
            result.append(reaisStr);
            // FIX: Add " de" for round million/billion/etc.
            if (reais % 1000000 == 0 && reais >= 1000000) {
                result.append(" de");
            }
            result.append(reais == 1 ? " real" : " reais");
        }

        // --- Part 2: Centavos ---
        if (centavos > 0) {
            if (reais > 0) {
                result.append(" e ");
            }
            result.append(centavosStr);
            result.append(centavos == 1 ? " centavo" : " centavos");
        }

        return result.toString();
    }

    /**
     * Converts a positive number (long) into its written-out form.
     * This is the core recursive logic.
     *
     * @param n The number to convert.
     * @return The number as a string (e.g., "cento e vinte e três").
     */
    private static String numberToString(long n) {
        if (n == 0) {
            return "zero"; // Should only be hit if called directly with 0
        }

        if (n < 0) {
            return "menos " + numberToString(-n);
        }

        StringBuilder sb = new StringBuilder();
        int escala = 0;
        long lastTriplet = -1; // FIX: Track the last processed triplet

        while (n > 0) {
            int triplet = (int) (n % 1000);

            if (triplet > 0) {
                String tripletStr = convertTriplet(triplet);

                // Handle scale (mil, milhão...)
                if (escala > 0) {
                    // REGRA REMOVIDA: A regra especial que transformava "um mil" em "mil" foi removida.
                    /*
                    // Special rule: "mil" not "um mil"
                    if (triplet == 1 && escala == 1) {
                        tripletStr = ""; // We just want "mil", not "um mil"
                    }
                    */

                    tripletStr += " " + (triplet > 1 ? ESCALA_PLURAL[escala] : ESCALA_SINGULAR[escala]);
                }

                // Add "e" connector
                // FIX: Use "," or "e" based on the last triplet's value
                if (sb.length() > 0) {
                    // Use "e" if the last part was zero, 100, or < 100
                    if (lastTriplet != -1 && (lastTriplet == 0 || lastTriplet == 100 || (lastTriplet > 0 && lastTriplet < 100))) {
                        sb.insert(0, " e ");
                    } else if (lastTriplet != -1) {
                        // Use "," for connecting larger parts
                        sb.insert(0, ", ");
                    }
                }
                sb.insert(0, tripletStr);
            }

            lastTriplet = triplet; // Update lastTriplet regardless of it being > 0
            n /= 1000;
            escala++;
        }
        return sb.toString().trim();
    }

    /**
     * Converts a 3-digit number (0-999) into its written-out form.
     *
     * @param n The 3-digit number.
     * @return The number as a string.
     */
    private static String convertTriplet(int n) {
        if (n < 20) {
            return UNIDADES[n];
        }

        if (n == 100) {
            return "cem";
        }

        StringBuilder sb = new StringBuilder();

        // Handle hundreds
        if (n >= 100) {
            sb.append(CENTENAS[n / 100]);
            if (n % 100 > 0) {
                sb.append(" e ");
            }
        }

        // Handle tens and units
        int resto = n % 100;
        if (resto > 0) {
            if (resto < 20) {
                sb.append(UNIDADES[resto]);
            } else {
                sb.append(DEZENAS[resto / 10]);
                if (resto % 10 > 0) {
                    sb.append(" e ").append(UNIDADES[resto % 10]);
                }
            }
        }

        return sb.toString();
    }
}