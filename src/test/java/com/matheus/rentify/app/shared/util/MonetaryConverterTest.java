package com.matheus.rentify.app.shared.util;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for the {@link MonetaryConverter} utility.
 * Validates the conversion of BigDecimal values into their written-out form in Portuguese.
 */
@ActiveProfiles("test")
class MonetaryConverterTest {

    @Test
    void shouldReturnEmptyStringWhenValueIsNull() {
        String result = MonetaryConverter.convert(null);
        assertThat(result).isEmpty();
    }

    @Test
    void shouldConvertZero() {
        String result = MonetaryConverter.convert(BigDecimal.ZERO);
        assertThat(result).isEqualTo("zero reais");
    }

    @Test
    void shouldConvertOneCentavo() {
        String result = MonetaryConverter.convert(new BigDecimal("0.01"));
        assertThat(result).isEqualTo("um centavo");
    }

    @Test
    void shouldConvertPluralCentavos() {
        String result = MonetaryConverter.convert(new BigDecimal("0.50"));
        assertThat(result).isEqualTo("cinquenta centavos");
    }

    @Test
    void shouldConvertOneReal() {
        String result = MonetaryConverter.convert(new BigDecimal("1.00"));
        assertThat(result).isEqualTo("um real");
    }

    @Test
    void shouldConvertPluralReais() {
        String result = MonetaryConverter.convert(new BigDecimal("2.00"));
        assertThat(result).isEqualTo("dois reais");
    }

    @Test
    void shouldConvertDezenas() {
        String result = MonetaryConverter.convert(new BigDecimal("35.00"));
        assertThat(result).isEqualTo("trinta e cinco reais");
    }

    @Test
    void shouldConvertSpecialCaseCem() {
        String result = MonetaryConverter.convert(new BigDecimal("100.00"));
        assertThat(result).isEqualTo("cem reais");
    }

    @Test
    void shouldConvertCentenas() {
        String result = MonetaryConverter.convert(new BigDecimal("101.00"));
        assertThat(result).isEqualTo("cento e um reais");
    }

    @Test
    void shouldConvertCentenasComplexas() {
        String result = MonetaryConverter.convert(new BigDecimal("875.00"));
        assertThat(result).isEqualTo("oitocentos e setenta e cinco reais");
    }

    @Test
    void shouldConvertUmMil_AsRequested() {
        String result = MonetaryConverter.convert(new BigDecimal("1000.00"));
        assertThat(result).isEqualTo("um mil reais");
    }

    @Test
    void shouldConvertPluralMil() {
        String result = MonetaryConverter.convert(new BigDecimal("2000.00"));
        assertThat(result).isEqualTo("dois mil reais");
    }

    @Test
    void shouldConvertMilharesComplexos() {
        String result = MonetaryConverter.convert(new BigDecimal("1988.00"));
        assertThat(result).isEqualTo("um mil, novecentos e oitenta e oito reais");
    }

    @Test
    void shouldConvertCentenasDeMilhar() {
        String result = MonetaryConverter.convert(new BigDecimal("150000.00"));
        assertThat(result).isEqualTo("cento e cinquenta mil reais");
    }

    @Test
    void shouldConvertUmMilhao() {
        String result = MonetaryConverter.convert(new BigDecimal("1000000.00"));
        assertThat(result).isEqualTo("um milhão de reais");
    }

    @Test
    void shouldConvertDoisMilhoes() {
        String result = MonetaryConverter.convert(new BigDecimal("2000000.00"));
        assertThat(result).isEqualTo("dois milhões de reais");
    }

    @Test
    void shouldConvertRealAndCentavos() {
        String result = MonetaryConverter.convert(new BigDecimal("1.50"));
        assertThat(result).isEqualTo("um real e cinquenta centavos");
    }

    @Test
    void shouldConvertReaisAndCentavo() {
        String result = MonetaryConverter.convert(new BigDecimal("120.01"));
        assertThat(result).isEqualTo("cento e vinte reais e um centavo");
    }

    @Test
    void shouldConvertValorComplexo_ExemploContrato1() {
        String result = MonetaryConverter.convert(new BigDecimal("875.30"));
        assertThat(result).isEqualTo("oitocentos e setenta e cinco reais e trinta centavos");
    }

    @Test
    void shouldConvertValorComplexo_ExemploContrato2() {
        String result = MonetaryConverter.convert(new BigDecimal("12345678.90"));
        assertThat(result).isEqualTo("doze milhões, trezentos e quarenta e cinco mil, seiscentos e setenta e oito reais e noventa centavos");
    }


    @Test
    void shouldHandleRoundingUp() {
        String result = MonetaryConverter.convert(new BigDecimal("10.555"));
        assertThat(result).isEqualTo("dez reais e cinquenta e seis centavos");
    }

    @Test
    void shouldHandleRoundingDown() {
        String result = MonetaryConverter.convert(new BigDecimal("10.554"));
        assertThat(result).isEqualTo("dez reais e cinquenta e cinco centavos");
    }
}