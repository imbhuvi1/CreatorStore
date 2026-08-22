package com.portfolio.repository;

import com.portfolio.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);
    Page<BlogPost> findByPublishedTrueOrderByPublishedAtDesc(Pageable pageable);
    boolean existsBySlug(String slug);

    @Query("""
        SELECT p FROM BlogPost p
        WHERE p.published = true
          AND (:search IS NULL OR :search = ''
               OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(p.excerpt) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:tag IS NULL OR :tag = ''
               OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :tag, '%')))
        ORDER BY p.publishedAt DESC
    """)
    Page<BlogPost> search(@org.springframework.data.repository.query.Param("search") String search,
                          @org.springframework.data.repository.query.Param("tag") String tag,
                          Pageable pageable);
}
