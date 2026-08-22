package com.portfolio.repository;

import com.portfolio.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    long countByIpAddressAndCreatedAtAfter(String ipAddress, OffsetDateTime after);
    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
    java.util.List<ContactMessage> findByCreatedAtAfterOrderByCreatedAtDesc(OffsetDateTime after);
}
