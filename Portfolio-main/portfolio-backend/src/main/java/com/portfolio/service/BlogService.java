package com.portfolio.service;

import com.portfolio.dto.BlogPostDto;
import com.portfolio.entity.BlogPost;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.OffsetDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BlogService {

    private final BlogPostRepository repo;

    public Page<BlogPostDto> listPublished(Pageable pageable) {
        return repo.findByPublishedTrueOrderByPublishedAtDesc(pageable).map(this::toDto);
    }

    public Page<BlogPostDto> search(String search, String tag, Pageable pageable) {
        String s = search == null ? null : search.trim();
        String t = tag == null ? null : tag.trim();
        return repo.search(s, t, pageable).map(this::toDto);
    }

    /** Distinct set of tags across all published posts, alphabetically sorted. */
    public java.util.List<String> allTags() {
        return repo.findByPublishedTrueOrderByPublishedAtDesc(
                    org.springframework.data.domain.PageRequest.of(0, 500))
                .stream()
                .map(BlogPost::getTags)
                .filter(java.util.Objects::nonNull)
                .flatMap(t -> java.util.Arrays.stream(t.split(",")))
                .map(String::trim)
                .filter(x -> !x.isEmpty())
                .distinct()
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList();
    }

    public BlogPostDto getBySlug(String slug) {
        BlogPost p = repo.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + slug));
        if (!Boolean.TRUE.equals(p.getPublished())) {
            throw new ResourceNotFoundException("Post not found: " + slug);
        }
        return toDto(p);
    }

    @Transactional
    public BlogPostDto create(BlogPost body) {
        body.setId(null);
        ensureSlug(body);
        if (Boolean.TRUE.equals(body.getPublished()) && body.getPublishedAt() == null) {
            body.setPublishedAt(OffsetDateTime.now());
        }
        return toDto(repo.save(body));
    }

    @Transactional
    public BlogPostDto update(Long id, BlogPost body) {
        BlogPost existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        existing.setTitle(body.getTitle());
        existing.setExcerpt(body.getExcerpt());
        existing.setContent(body.getContent());
        existing.setCoverImage(body.getCoverImage());
        existing.setTags(body.getTags());
        existing.setReadMinutes(body.getReadMinutes() == null ? 3 : body.getReadMinutes());
        boolean wasPublished = Boolean.TRUE.equals(existing.getPublished());
        existing.setPublished(body.getPublished());
        if (!wasPublished && Boolean.TRUE.equals(body.getPublished()) && existing.getPublishedAt() == null) {
            existing.setPublishedAt(OffsetDateTime.now());
        }
        // Allow slug edit but keep unique
        if (body.getSlug() != null && !body.getSlug().isBlank() && !body.getSlug().equals(existing.getSlug())) {
            existing.setSlug(uniqueSlug(body.getSlug()));
        }
        return toDto(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }

    private void ensureSlug(BlogPost body) {
        String slug = body.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = slugify(body.getTitle());
        }
        body.setSlug(uniqueSlug(slug));
        if (body.getReadMinutes() == null) body.setReadMinutes(3);
        if (body.getPublished() == null) body.setPublished(false);
    }

    private String uniqueSlug(String base) {
        String s = slugify(base);
        String candidate = s;
        int i = 2;
        while (repo.existsBySlug(candidate)) {
            candidate = s + "-" + i++;
        }
        return candidate;
    }

    private String slugify(String v) {
        if (v == null) return "post";
        String n = Normalizer.normalize(v, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return n.isBlank() ? "post" : n;
    }

    private BlogPostDto toDto(BlogPost p) {
        return BlogPostDto.builder()
                .id(p.getId()).slug(p.getSlug()).title(p.getTitle())
                .excerpt(p.getExcerpt()).content(p.getContent())
                .coverImage(p.getCoverImage()).tags(p.getTags())
                .readMinutes(p.getReadMinutes())
                .published(p.getPublished()).publishedAt(p.getPublishedAt())
                .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt())
                .build();
    }
}
