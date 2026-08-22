package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.LoginRequest;
import com.portfolio.dto.LoginResponse;
import com.portfolio.repository.AdminUserRepository;
import com.portfolio.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminUserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    @Value("${portfolio.jwt.expires-minutes:120}")
    private long expiresMinutes;

    // Simple in-memory brute-force lockout: 5 tries / 15 minutes / IP+username.
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_MS = 15 * 60 * 1000L;
    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    private record Attempt(int count, long lockedUntil) {}

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest req,
                                                             jakarta.servlet.http.HttpServletRequest http) {
        String key = ip(http) + ":" + req.getUsername();
        Attempt current = attempts.get(key);
        long now = System.currentTimeMillis();
        if (current != null && current.lockedUntil() > now) {
            return ResponseEntity.status(429).body(ApiResponse.error(
                    "Too many failed attempts. Try again in a few minutes."));
        }
        var user = repo.findByUsername(req.getUsername()).orElse(null);
        if (user == null || !encoder.matches(req.getPassword(), user.getPasswordHash())) {
            int c = current == null ? 1 : current.count() + 1;
            long lockUntil = c >= MAX_ATTEMPTS ? now + LOCK_MS : 0L;
            attempts.put(key, new Attempt(c, lockUntil));
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid credentials"));
        }
        attempts.remove(key);
        String token = jwt.generate(user.getId(), user.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(
                LoginResponse.builder().token(token).username(user.getUsername())
                        .expiresInMinutes(expiresMinutes).build(),
                "Login successful"));
    }

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(org.springframework.security.core.Authentication authn) {
        return ApiResponse.ok(Map.of(
                "username", authn.getName(),
                "authorities", authn.getAuthorities().toString()
        ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody com.portfolio.dto.ChangePasswordRequest req,
            org.springframework.security.core.Authentication authn) {
        var user = repo.findByUsername(authn.getName())
                .orElseThrow(() -> new com.portfolio.exception.ResourceNotFoundException("Admin not found"));
        if (!encoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body(ApiResponse.error("Current password is incorrect"));
        }
        if (encoder.matches(req.getNewPassword(), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("New password must differ from current"));
        }
        user.setPasswordHash(encoder.encode(req.getNewPassword()));
        repo.save(user);
        return ResponseEntity.ok(ApiResponse.ok(null, "Password updated"));
    }

    private String ip(jakarta.servlet.http.HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}
