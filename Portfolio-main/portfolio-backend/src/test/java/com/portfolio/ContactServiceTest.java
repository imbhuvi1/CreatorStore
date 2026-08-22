package com.portfolio;

import com.portfolio.dto.ContactRequestDto;
import com.portfolio.entity.ContactMessage;
import com.portfolio.exception.RateLimitExceededException;
import com.portfolio.mapper.PortfolioMapper;
import com.portfolio.repository.ContactMessageRepository;
import com.portfolio.service.ContactService;
import com.portfolio.service.EmailService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.OffsetDateTime;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock ContactMessageRepository repo;
    @Mock EmailService emailService;
    @Spy  PortfolioMapper mapper = new PortfolioMapper();

    @InjectMocks ContactService service;

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(service, "maxPerHour", 5);
    }

    @Test
    void submitPersistsMessageAndTriggersEmails() {
        when(repo.countByIpAddressAndCreatedAtAfter(anyString(), any(OffsetDateTime.class))).thenReturn(0L);
        when(repo.save(any(ContactMessage.class))).thenAnswer(inv -> {
            ContactMessage c = inv.getArgument(0);
            c.setId(1L);
            c.setCreatedAt(OffsetDateTime.now());
            return c;
        });

        ContactRequestDto req = ContactRequestDto.builder()
                .name("Jane").email("jane@example.com").subject("Hi")
                .message("Hello there, this is a valid message body.").build();

        var dto = service.submit(req, "127.0.0.1");
        assertThat(dto.getId()).isEqualTo(1L);
        verify(emailService).notifyOwner(any());
        verify(emailService).sendAcknowledgement(any());
    }

    @Test
    void submitRateLimits() {
        when(repo.countByIpAddressAndCreatedAtAfter(anyString(), any(OffsetDateTime.class))).thenReturn(5L);
        ContactRequestDto req = ContactRequestDto.builder()
                .name("Jane").email("jane@example.com").subject("Hi")
                .message("Hello there, valid content here.").build();
        assertThatThrownBy(() -> service.submit(req, "1.1.1.1"))
                .isInstanceOf(RateLimitExceededException.class);
        verify(repo, never()).save(any());
    }
}
