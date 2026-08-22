package com.portfolio.service;

import com.portfolio.entity.ContactMessage;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${portfolio.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${portfolio.mail.from:no-reply@portfolio.local}")
    private String from;

    @Value("${portfolio.owner.email:[YOUR_EMAIL]}")
    private String ownerEmail;

    @Value("${portfolio.owner.name:[YOUR_NAME]}")
    private String ownerName;

    @Async
    public void notifyOwner(ContactMessage msg) {
        if (!mailEnabled) {
            log.info("Mail disabled. Would notify owner of message id={}", msg.getId());
            return;
        }
        try {
            Context ctx = new Context();
            ctx.setVariables(Map.of(
                    "name", msg.getName(),
                    "email", msg.getEmail(),
                    "phone", msg.getPhone() != null ? msg.getPhone() : "-",
                    "subject", msg.getSubject(),
                    "message", msg.getMessage()
            ));
            String html = templateEngine.process("owner-notification", ctx);
            send(ownerEmail, "New portfolio message: " + msg.getSubject(), html);
        } catch (Exception e) {
            log.error("Failed to notify owner for message id={}: {}", msg.getId(), e.getMessage());
        }
    }

    @Async
    public void sendAcknowledgement(ContactMessage msg) {
        if (!mailEnabled) {
            log.info("Mail disabled. Would acknowledge {} for message id={}", msg.getEmail(), msg.getId());
            return;
        }
        try {
            Context ctx = new Context();
            ctx.setVariables(Map.of(
                    "visitorName", msg.getName(),
                    "ownerName", ownerName
            ));
            String html = templateEngine.process("acknowledgement", ctx);
            send(msg.getEmail(), "Thank you for contacting me", html);
        } catch (Exception e) {
            log.error("Failed to send acknowledgement for message id={}: {}", msg.getId(), e.getMessage());
        }
    }

    private void send(String to, String subject, String htmlBody) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }
}
