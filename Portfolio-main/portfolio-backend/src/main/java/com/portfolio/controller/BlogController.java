package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.BlogPostDto;
import com.portfolio.entity.BlogPost;
import com.portfolio.repository.BlogPostRepository;
import com.portfolio.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BlogController {

    private final BlogService service;
    private final BlogPostRepository repo;

    /* ===== Public ===== */
    @GetMapping("/api/blog")
    public ApiResponse<Page<BlogPostDto>> list(@RequestParam(required = false) String search,
                                                @RequestParam(required = false) String tag,
                                                Pageable pageable) {
        return ApiResponse.ok(service.search(search, tag, pageable));
    }

    @GetMapping("/api/blog/tags")
    public ApiResponse<java.util.List<String>> tags() {
        return ApiResponse.ok(service.allTags());
    }

    @GetMapping("/api/blog/{slug}")
    public ApiResponse<BlogPostDto> bySlug(@PathVariable String slug) {
        return ApiResponse.ok(service.getBySlug(slug));
    }

    /* ===== Admin ===== */
    @GetMapping("/api/admin/blog")
    public ApiResponse<List<BlogPost>> adminList() {
        return ApiResponse.ok(repo.findAll());
    }

    @PostMapping("/api/admin/blog")
    public ApiResponse<BlogPostDto> create(@RequestBody BlogPost body) {
        return ApiResponse.ok(service.create(body));
    }

    @PutMapping("/api/admin/blog/{id}")
    public ApiResponse<BlogPostDto> update(@PathVariable Long id, @RequestBody BlogPost body) {
        return ApiResponse.ok(service.update(id, body));
    }

    @DeleteMapping("/api/admin/blog/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.ok(null, "deleted");
    }
}
