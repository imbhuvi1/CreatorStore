package com.portfolio.service;

import com.portfolio.dto.ContactMessageDto;
import com.portfolio.dto.ContactRequestDto;
import com.portfolio.entity.ContactMessage;
import com.portfolio.exception.RateLimitExceededException;
import com.portfolio.mapper.PortfolioMapper;
import com.portfolio.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactMessageRepository repo;
    private final EmailService emailService;
    private final PortfolioMapper mapper;

    @Value("${portfolio.rate-limit.contact-per-hour:5}")
    private int maxPerHour;

    @Transactional
    public ContactMessageDto submit(ContactRequestDto req, String ipAddress) {
        // rate limiting: N messages per IP per hour
        OffsetDateTime oneHourAgo = OffsetDateTime.now().minusHours(1);
        if (ipAddress != null) {
            long recent = repo.countByIpAddressAndCreatedAtAfter(ipAddress, oneHourAgo);
            if (recent >= maxPerHour) {
                throw new RateLimitExceededException("Too many messages from this IP. Try again later.");
            }
        }

        ContactMessage entity = ContactMessage.builder()
                .name(sanitize(req.getName()))
                .email(sanitize(req.getEmail()))
                .phone(sanitize(req.getPhone()))
                .subject(sanitize(req.getSubject()))
                .message(sanitize(req.getMessage()))
                .ipAddress(ipAddress)
                .isRead(false)
                .build();

        ContactMessage saved = repo.save(entity);
        log.info("Contact message saved id={} from={}", saved.getId(), saved.getEmail());

        // async - do not block response
        emailService.notifyOwner(saved);
        emailService.sendAcknowledgement(saved);

        return mapper.toDto(saved);
    }

    private String sanitize(String v) {
        if (v == null) return null;
        // basic sanitisation - strip control chars and trim; JPA parameterisation handles SQLi.
        return v.replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", "").trim();
    }
}
