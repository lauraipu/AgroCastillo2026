package com.agrocastillo.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {

    @Email(message = "{auth.email.invalid}")
    @NotBlank(message = "{auth.email.required}")
    private String email;

    @NotBlank(message = "{auth.password.required}")
    private String password;
}