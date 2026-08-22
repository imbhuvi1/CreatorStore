package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.entity.AnalyticsEvent;
import com.portfolio.repository.AnalyticsEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private static final Set<String> ALLOWED = Set.of("page_view", "resume_download", "project_view");

    private final AnalyticsEventRepository repo;

    /**
     * Public: record one analytics event. Kept intentionally minimal — no PII beyond IP + UA truncation.
     */
    @PostMapping("/{type}")
    public ApiResponse<Void> track(@PathVariable("type") String type,
                                   @RequestParam(required = false) Long resourceId,
                                   @RequestHeader(value = "Referer", required = false) String referrer,
                                   @RequestHeader(value = "User-Agent", required = false) String userAgent,
                                   HttpServletRequest req) {
        if (!ALLOWED.contains(type)) return ApiResponse.error("unknown event type");
        AnalyticsEvent e = AnalyticsEvent.builder()
                .eventType(type)
                .resourceId(resourceId)
                .referrer(truncate(referrer, 500))
                .userAgent(truncate(userAgent, 500))
                .ipAddress(clientIp(req))
                .build();
        repo.save(e);
        return ApiResponse.ok(null, "recorded");
    }

    /**
     * Admin: aggregated counts (page views, resume downloads, top projects).
     */
    @GetMapping("/summary")
    public ApiResponse<Map<String, Object>> summary() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("pageViews", repo.countByEventType("page_view"));
        out.put("resumeDownloads", repo.countByEventType("resume_download"));
        out.put("projectViews", repo.countByEventType("project_view"));
        List<Map<String, Object>> perProject = new ArrayList<>();
        for (Object[] row : repo.projectViewCounts()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("projectId", row[0]);
            item.put("views", row[1]);
            perProject.add(item);
        }
        out.put("perProject", perProject);
        return ApiResponse.ok(out);
    }

    private static String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() > max ? s.substring(0, max) : s;
    }
    private static String clientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}
