package com.agrocastillo.backend.config;

import com.agrocastillo.backend.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractAuthenticationFilterConfigurer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Acceso total libre a auth, comunidad y flujos de GOOGLE OAuth2
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                        .requestMatchers("/comunidad/**", "/api/comunidad/**").permitAll()
                        .requestMatchers("/login/**", "/oauth2/**").permitAll()

                        // 2. 🔥 CORRECCIÓN: Rutas de API puras. Eliminamos las rutas sin /api que causaban el NoResourceFoundException
                        .requestMatchers(
                                "/api/perfil-investigador/perfil",
                                "/api/perfil-investigador/perfil/**"
                        ).hasAnyAuthority("INVESTIGADOR", "ADMIN", "ROLE_INVESTIGADOR", "ROLE_ADMIN")

                        // 3. Consultas GET públicas
                        .requestMatchers(HttpMethod.GET, "/investigadores", "/investigadores/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/inicio/**", "/aplicaciones", "/aplicaciones/**").permitAll()

                        // 4. Rutas protegidas generales de usuarios (con y sin prefijo api)
                        .requestMatchers("/api/usuarios/**", "/api/usuario/**", "/usuarios/**", "/usuario/**")
                        .hasAnyAuthority("USUARIO", "INVESTIGADOR", "ADMIN", "ROLE_USUARIO", "ROLE_INVESTIGADOR", "ROLE_ADMIN")

                        // 5. Otras rutas específicas por Rol
                        .requestMatchers("/investigador/aplicaciones/**").authenticated()
                        .requestMatchers("/investigador/**").hasAnyAuthority("INVESTIGADOR", "ROLE_INVESTIGADOR")
                        .requestMatchers("/admin/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        .anyRequest().authenticated()
                )
                .oauth2Login(AbstractAuthenticationFilterConfigurer::permitAll)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}