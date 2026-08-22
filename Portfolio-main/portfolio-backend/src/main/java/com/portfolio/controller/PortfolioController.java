package com.portfolio.controller;

import com.portfolio.dto.*;
import com.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService service;

    @GetMapping("/projects")
    public ApiResponse<Page<ProjectDto>> projects(@RequestParam(required = false) String category,
                                                   Pageable pageable) {
        return ApiResponse.ok(service.getProjects(category, pageable));
    }

    @GetMapping("/projects/{id}")
    public ApiResponse<ProjectDto> project(@PathVariable Long id) {
        return ApiResponse.ok(service.getProject(id));
    }

    @GetMapping("/skills")
    public ApiResponse<List<SkillDto>> skills() { return ApiResponse.ok(service.getSkills()); }

    @GetMapping("/achievements")
    public ApiResponse<List<AchievementDto>> achievements() { return ApiResponse.ok(service.getAchievements()); }

    @GetMapping("/education")
    public ApiResponse<List<EducationDto>> education() { return ApiResponse.ok(service.getEducation()); }

    @GetMapping("/experience")
    public ApiResponse<List<ExperienceDto>> experience() { return ApiResponse.ok(service.getExperience()); }

    @GetMapping("/activities")
    public ApiResponse<List<ExtracurricularActivityDto>> activities() { return ApiResponse.ok(service.getActivities()); }

    @GetMapping("/services")
    public ApiResponse<List<ServiceOfferingDto>> services() { return ApiResponse.ok(service.getServices()); }

    @GetMapping("/social-links")
    public ApiResponse<List<SocialLinkDto>> socialLinks() { return ApiResponse.ok(service.getSocialLinks()); }
}
