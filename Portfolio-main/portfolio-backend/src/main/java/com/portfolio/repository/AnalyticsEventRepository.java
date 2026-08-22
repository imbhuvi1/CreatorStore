package com.portfolio.repository;

import com.portfolio.entity.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, Long> {

    long countByEventType(String eventType);

    long countByEventTypeAndCreatedAtAfter(String eventType, java.time.OffsetDateTime after);

    @Query("SELECT a.resourceId as id, COUNT(a) as count FROM AnalyticsEvent a " +
           "WHERE a.eventType = 'project_view' AND a.resourceId IS NOT NULL " +
           "GROUP BY a.resourceId ORDER BY COUNT(a) DESC")
    List<Object[]> projectViewCounts();

    @Query("SELECT a.resourceId as id, COUNT(a) as count FROM AnalyticsEvent a " +
           "WHERE a.eventType = 'project_view' AND a.resourceId IS NOT NULL " +
           "AND a.createdAt >= :since " +
           "GROUP BY a.resourceId ORDER BY COUNT(a) DESC")
    List<Object[]> projectViewCountsSince(@org.springframework.data.repository.query.Param("since") java.time.OffsetDateTime since);
}
