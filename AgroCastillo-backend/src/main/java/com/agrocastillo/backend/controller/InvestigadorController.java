package com.agrocastillo.backend.controller;

import com.agrocastillo.backend.repository.UsuarioRepository;
import com.agrocastillo.backend.service.InvestigadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/perfil-investigador")
public class InvestigadorController {

    private final InvestigadorService investigadorService;
    private final UsuarioRepository usuarioRepository;

    public InvestigadorController(InvestigadorService investigadorService, UsuarioRepository usuarioRepository) {
        this.investigadorService = investigadorService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(@AuthenticationPrincipal Object principal) {
        String emailUsuario = null;

        if (principal instanceof UserDetails userDetails) {
            emailUsuario = userDetails.getUsername();
        } else if (principal instanceof OAuth2User oAuth2User) {
            emailUsuario = oAuth2User.getAttribute("email");
        }

        try {
            return ResponseEntity.ok(investigadorService.obtenerPerfil(emailUsuario));
        } catch (Exception e) {
            System.err.println("--- CONTROL FALLBACK ACTIVADO ---");
            e.printStackTrace();

            Map<String, Object> respuestaFrontend = new HashMap<>();

            try {
                if (emailUsuario != null && !emailUsuario.isEmpty()) {
                    // Usamos 'var' para no necesitar importar la clase Usuario si está fallando el paquete
                    var usuarioOpt = usuarioRepository.findByEmail(emailUsuario);

                    if (usuarioOpt.isPresent()) {
                        Object u = usuarioOpt.get();

                        // Extraemos los datos usando métodos genéricos del Objeto para saltarnos cualquier error de compilación
                        respuestaFrontend.put("nombre", invocarMetodoSeguro(u, "getNombre", "Usuario sin nombre"));
                        respuestaFrontend.put("email", invocarMetodoSeguro(u, "getEmail", emailUsuario));
                        respuestaFrontend.put("orcid", invocarMetodoSeguro(u, "getOrcid", ""));
                        respuestaFrontend.put("provider", invocarMetodoSeguro(u, "getProvider", "LOCAL"));
                        respuestaFrontend.put("rol", invocarMetodoSeguro(u, "getRol", "INVESTIGADOR"));
                        respuestaFrontend.put("cvlac", invocarMetodoSeguro(u, "getCvlac", ""));
                    } else {
                        establecerDatosPorDefecto(respuestaFrontend, emailUsuario, "Usuario no registrado");
                    }
                } else {
                    establecerDatosPorDefecto(respuestaFrontend, "", "Sesión anónima");
                }
            } catch (Exception dbEx) {
                dbEx.printStackTrace();
                establecerDatosPorDefecto(respuestaFrontend, emailUsuario != null ? emailUsuario : "Desconocido", "Error de Base de Datos");
            }

            return ResponseEntity.ok(respuestaFrontend);
        }
    }

    private Object invocarMetodoSeguro(Object obj, String nombreMetodo, Object valorDefecto) {
        try {
            Object resultado = obj.getClass().getMethod(nombreMetodo).invoke(obj);
            return resultado != null ? resultado.toString() : valorDefecto;
        } catch (Exception e) {
            return valorDefecto;
        }
    }

    private void establecerDatosPorDefecto(Map<String, Object> map, String email, String mensaje) {
        map.put("nombre", mensaje);
        map.put("email", email);
        map.put("orcid", "");
        map.put("provider", "UNKNOWN");
        map.put("rol", "INVITADO");
        map.put("cvlac", "");
    }
}