package com.portfolio.service;

import com.portfolio.dto.*;
import com.portfolio.mapper.PortfolioMapper;
import com.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioService {

    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final AchievementRepository achievementRepo;
    private final EducationRepository educationRepo;
    private final ExperienceRepository experienceRepo;
    private final ExtracurricularActivityRepository activityRepo;
    private final ServiceOfferingRepository serviceRepo;
    private final SocialLinkRepository socialRepo;
    private final PortfolioMapper mapper;

    public Page<ProjectDto> getProjects(String category, Pageable pageable) {
        Pageable sorted = pageable.getSort().isSorted() ? pageable
                : org.springframework.data.domain.PageRequest.of(
                    pageable.getPageNumber(), pageable.getPageSize(),
                    Sort.by("displayOrder").ascending());
        if (category == null || category.isBlank() || "all".equalsIgnoreCase(category)) {
            return projectRepo.findAll(sorted).map(mapper::toDto);
        }
        return projectRepo.findByCategoryIgnoreCase(category, sorted).map(mapper::toDto);
    }

    public ProjectDto getProject(Long id) {
        return projectRepo.findById(id).map(mapper::toDto)
                .orElseThrow(() -> new com.portfolio.exception.ResourceNotFoundException("Project not found: " + id));
    }

    public List<SkillDto> getSkills() {
        return skillRepo.findAll(Sort.by("category").ascending().and(Sort.by("displayOrder")))
                .stream().map(mapper::toDto).toList();
    }

    public List<AchievementDto> getAchievements() {
        return achievementRepo.findAll(Sort.by("displayOrder").ascending())
                .stream().map(mapper::toDto).toList();
    }

    public List<EducationDto> getEducation() {
        return educationRepo.findAll(Sort.by("displayOrder").ascending())
                .stream().map(mapper::toDto).toList();
    }

    public List<ExperienceDto> getExperience() {
        return experienceRepo.findAll(Sort.by("displayOrder").ascending())
                .stream().map(mapper::toDto).toList();
    }

    public List<ExtracurricularActivityDto> getActivities() {
        return activityRepo.findAll(Sort.by("displayOrder").ascending())
                .stream().map(mapper::toDto).toList();
    }

    public List<ServiceOfferingDto> getServices() {
        return serviceRepo.findAll(Sort.by("displayOrder").ascending())
                .stream().map(mapper::toDto).toList();
    }

    public List<SocialLinkDto> getSocialLinks() {
        return socialRepo.findAll(Sort.by("displayOrder").ascending())
                .stream().map(mapper::toDto).toList();
    }
}
