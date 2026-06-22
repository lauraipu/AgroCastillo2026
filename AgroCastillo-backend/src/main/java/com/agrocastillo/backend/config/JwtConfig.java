package com.agrocastillo.backend.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@ConfigurationProperties(prefix = "jwt")
@Validated
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class JwtConfig {

    @NotBlank(message = "jwt.secret no puede estar vacío")
    private String secret;

    @Positive(message = "jwt.expiration debe ser un valor positivo en milisegundos")
    private Long expiration;
}