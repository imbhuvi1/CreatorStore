package com.portfolio.service;

import com.portfolio.entity.AdminUser;
import com.portfolio.repository.AdminUserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder {

    private final AdminUserRepository repo;
    private final PasswordEncoder encoder;

    @Value("${portfolio.admin.username:admin}")
    private String username;

    @Value("${portfolio.admin.email:}")
    private String email;

    @Value("${portfolio.admin.password:}")
    private String password;

    @PostConstruct
    @Transactional
    public void seed() {
        if (password == null || password.isBlank()) {
            log.warn("ADMIN_PASSWORD not set. Admin user seeding skipped.");
            return;
        }
        repo.findByUsername(username).ifPresentOrElse(existing -> {
            if (!encoder.matches(password, existing.getPasswordHash())) {
                existing.setPasswordHash(encoder.encode(password));
                existing.setEmail(email);
                repo.save(existing);
                log.info("Admin '{}' password updated from env.", username);
            }
        }, () -> {
            AdminUser u = AdminUser.builder()
                    .username(username).email(email)
                    .passwordHash(encoder.encode(password))
                    .build();
            repo.save(u);
            log.info("Admin '{}' seeded.", username);
        });
    }
}
