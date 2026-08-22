package com.portfolio.service;

import com.portfolio.entity.ContactMessage;
import com.portfolio.entity.Project;
import com.portfolio.repository.AnalyticsEventRepository;
import com.portfolio.repository.ContactMessageRepository;
import com.portfolio.repository.ProjectRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.OffsetDateTime;
import java.util.*;

/**
 * Weekly digest: aggregates last 7 days of contact messages + top project views
 * and mails a summary to the owner. Toggle via `portfolio.digest.enabled`.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DigestService {

    private final ContactMessageRepository contactRepo;
    private final AnalyticsEventRepository analyticsRepo;
    private final ProjectRepository projectRepo;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${portfolio.digest.enabled:false}")
    private boolean digestEnabled;

    @Value("${portfolio.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${portfolio.mail.from:no-reply@portfolio.local}")
    private String from;

    @Value("${portfolio.owner.email:}")
    private String ownerEmail;

    @Value("${portfolio.owner.name:}")
    private String ownerName;

    @Scheduled(cron = "${portfolio.digest.cron:0 30 8 * * MON}")
    public void sendWeeklyDigest() {
        if (!digestEnabled) { log.debug("Digest disabled — skipping"); return; }
        if (!mailEnabled)  { log.warn("Digest enabled but MAIL_ENABLED=false — skipping"); return; }
        if (ownerEmail == null || ownerEmail.isBlank()) { log.warn("OWNER_EMAIL missing — skipping digest"); return; }

        try {
            sendNow();
        } catch (Exception e) {
            log.error("Digest send failed: {}", e.getMessage(), e);
        }
    }

    /**
     * Public method for manual trigger (unit tests / admin action).
     * Composes the email using the last 7 days of data and sends it.
     */
    public void sendNow() throws Exception {
        OffsetDateTime since = OffsetDateTime.now().minusDays(7);

        List<ContactMessage> messages = contactRepo.findByCreatedAtAfterOrderByCreatedAtDesc(since);
        long pageViews = analyticsRepo.countByEventTypeAndCreatedAtAfter("page_view", since);
        long resumeDownloads = analyticsRepo.countByEventTypeAndCreatedAtAfter("resume_download", since);
        long projectViews = analyticsRepo.countByEventTypeAndCreatedAtAfter("project_view", since);

        List<Map<String, Object>> topProjects = new ArrayList<>();
        List<Object[]> rows = analyticsRepo.projectViewCountsSince(since);
        int limit = Math.min(5, rows.size());
        for (int i = 0; i < limit; i++) {
            Object[] row = rows.get(i);
            Long pid = ((Number) row[0]).longValue();
            long views = ((Number) row[1]).longValue();
            String title = projectRepo.findById(pid).map(Project::getTitle).orElse("Project #" + pid);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("title", title);
            item.put("views", views);
            topProjects.add(item);
        }

        boolean isQuietWeek = messages.isEmpty() && pageViews == 0 && projectViews == 0;

        Context ctx = new Context();
        ctx.setVariable("ownerName", ownerName == null || ownerName.isBlank() ? "there" : ownerName);
        ctx.setVariable("messages", messages);
        ctx.setVariable("messageCount", messages.size());
        ctx.setVariable("pageViews", pageViews);
        ctx.setVariable("resumeDownloads", resumeDownloads);
        ctx.setVariable("projectViews", projectViews);
        ctx.setVariable("topProjects", topProjects);
        ctx.setVariable("quiet", isQuietWeek);
        ctx.setVariable("since", since);

        String html = templateEngine.process("digest", ctx);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
        helper.setFrom(from);
        helper.setTo(ownerEmail);
        helper.setSubject("Your portfolio · weekly digest (" + messages.size() + " new message"
                + (messages.size() == 1 ? "" : "s") + ")");
        helper.setText(html, true);
        mailSender.send(message);
        log.info("Weekly digest sent to {} ({} messages, {} project views).", ownerEmail, messages.size(), projectViews);
    }
}
